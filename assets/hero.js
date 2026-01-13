(function(){
      const hero = document.getElementById('hero');
      const canvas = document.getElementById('net');
      const ctx = canvas.getContext('2d');
      const mouseLight = document.getElementById('mouseLight');
      const dpr = Math.min(window.devicePixelRatio || 1, 1.3);
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      const CONFIG = {
        baseCount: 140,   // was 110
        maxV: 1,
        linkDist: 120,    // was 120
        mouseRadius: 120,
        fadeInFrames: 90,
        noiseAlpha: 0 // 0.02
      };

      const state = {
        parts: [],
        mouse: { x: 0, y: 0, active: false },
        raf: 0,
      };

      let lastTime = 0;
      let noiseFrame = 0;

      function resize(){
        const rect = hero.getBoundingClientRect();
        const w = rect.width, h = rect.height;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
        drawOnce();
      }

      // Jittered grid seed: prevents single huge clumps near center
      function seed(){
        const w = canvas.width / dpr, h = canvas.height / dpr;
        const area = w * h;
        const scale = Math.max(80, Math.min(280, Math.round(CONFIG.baseCount * area / (1200*800))));
        const count = reduced ? Math.round(scale * 0.6) : scale;

        const cols = Math.ceil(Math.sqrt(count * (w/h)));
        const rows = Math.ceil(count / cols);
        const cellW = w / cols, cellH = h / rows;

        const parts = [];
        for(let r=0;r<rows;r++){
          for(let c=0;c<cols;c++){
            if (parts.length >= count) break;
            const jx = (Math.random()-0.5)*cellW*0.6; // jitter
            const jy = (Math.random()-0.5)*cellH*0.6;
            const x = c*cellW + cellW/2 + jx;
            const y = r*cellH + cellH/2 + jy;
            parts.push({
              x, y,
              vx: (Math.random()-0.5)*CONFIG.maxV,
              vy: (Math.random()-0.5)*CONFIG.maxV,
              r: 1 + Math.random()*1.2,
              a: 0
            });
          }
        }
        state.parts = parts;
      }

      function drawNoise(w,h,alpha){
        const rows=50, cols=80, cw=w/cols, ch=h/rows; ctx.save(); ctx.globalAlpha=alpha;
        for(let y=0;y<rows;y++){
          for(let x=0;x<cols;x++){
            const n = (Math.sin(x*12.9898 + y*78.233)*43758.5453)%1; const v=Math.abs(n-0.5)*2;
            ctx.fillStyle = 'rgb('+(12+v*20)+','+(18+v*22)+','+(28+v*28)+')';
            ctx.fillRect(x*cw, y*ch, cw+1, ch+1);
          }
        }
        ctx.restore();
      }

      function drawLinks(parts, w, h, maxDist, mouse){
        const maxD2 = maxDist*maxDist;
        for(let i=0;i<parts.length;i++){
          const p = parts[i];
          for(let j=i+1;j<parts.length;j++){
            const q = parts[j];
            const dx = p.x-q.x, dy = p.y-q.y; const d2 = dx*dx + dy*dy;
            if(d2 < maxD2){
              const alpha = Math.max(0.2, (1 - d2/maxD2)*1.1);
              ctx.globalAlpha = alpha;
              const hue = 210 + (((p.x+q.x)*0.03) % 30);
              ctx.strokeStyle = `hsl(${hue} 100% 50%)`;
              ctx.lineWidth = window.innerWidth < 768 ? 0.6 : 1.2;
              ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      function step(timestamp){
        const w = canvas.width/dpr, h = canvas.height/dpr;

        if (lastTime && timestamp - lastTime < 22) { // ~45 fps cap
          state.raf = requestAnimationFrame(step);
          return;
        }
        lastTime = timestamp;

        ctx.clearRect(0,0,w,h);
        
        if(!reduced && CONFIG.noiseAlpha > 0){
          noiseFrame++;
          if (noiseFrame % 3 === 0) {
            drawNoise(w,h,CONFIG.noiseAlpha);
          }
        }

        const parts = state.parts;

        for(let i=0;i<parts.length;i++){
          const p = parts[i];
          if(p.a<1) p.a = Math.min(1, p.a + 1/CONFIG.fadeInFrames);
          if(state.mouse.active){
            const dx = state.mouse.x - p.x;
            const dy = state.mouse.y - p.y;
            const dist2 = dx*dx + dy*dy, rad2 = CONFIG.mouseRadius*CONFIG.mouseRadius;
            if(dist2 < rad2){ const f = (rad2 - dist2)/rad2 * 0.015; p.vx += dx * f; p.vy += dy * f; }
          }
          const scrollY = window.scrollY || 0; const par = Math.sin((p.x + scrollY*0.25)*0.002) * 0.05;
          p.x += p.vx + par; p.y += p.vy + par*0.3;
          if(p.x < -10) p.x = w+10; if(p.x > w+10) p.x=-10; if(p.y<-10) p.y=h+10; if(p.y>h+10) p.y=-10;
          p.vx *= 0.985; p.vy *= 0.985;
          ctx.globalAlpha = 0.45 * p.a; ctx.fillStyle = '#7dd3fc';
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        }
        drawLinks(parts,w,h,CONFIG.linkDist,state.mouse);
        state.raf = requestAnimationFrame(step);
      }

      function drawOnce(){
        const w = canvas.width/dpr, h = canvas.height/dpr;
        ctx.clearRect(0,0,w,h);
      }

      const ro = new ResizeObserver(resize); ro.observe(hero);
      resize();
      if(!reduced){ state.raf = requestAnimationFrame(step); }

      // Interactivity on the WHOLE hero (works even over .content)
      let mx = 0, my = 0, tx = 0, ty = 0, raf2 = 0;
      function pointerMove(e){
        const rect = hero.getBoundingClientRect();
        state.mouse.x = e.clientX - rect.left;
        state.mouse.y = e.clientY - rect.top;
        state.mouse.active = true;
        tx = state.mouse.x; ty = state.mouse.y;
        if(!raf2) raf2 = requestAnimationFrame(follow);
      }
      function follow(){
        mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
        mouseLight.style.setProperty('--ml-x', mx + 'px');
        mouseLight.style.setProperty('--ml-y', my + 'px');
        raf2 = requestAnimationFrame(follow);
      }
      function pointerLeave(){ state.mouse.active = false; cancelAnimationFrame(raf2); raf2 = 0; }

      hero.addEventListener('pointermove', pointerMove);
      hero.addEventListener('pointerleave', pointerLeave);
      hero.addEventListener('pointerdown', pointerMove);
      hero.addEventListener('pointerup', pointerLeave);
      hero.addEventListener('pointercancel', pointerLeave);

      window.addEventListener('pagehide', () => cancelAnimationFrame(state.raf));
    })();