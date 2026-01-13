(function(){
  const root  = document.getElementById('cursor');
  const dot   = document.getElementById('cDot');
  const rings = Array.from(root.querySelectorAll('.cursor__ring'));

  let x = innerWidth/2, y = innerHeight/2;

  // Trailing history
  const history = [];
  const HISTORY_SIZE = 20, GAP = 14;
  for(let i=0;i<HISTORY_SIZE;i++) history.push({x,y});
  const ringState = rings.map(()=>({tx:x,ty:y}));

  // Movement
  addEventListener('pointermove', e=>{
    x=e.clientX;y=e.clientY;
    if (!root.classList.contains('is-visible')) {
      root.classList.add('is-visible');
    }
  });

  // Link hover
  const linkSel='a,button,[role="button"],[data-cursor="link"],input,select,textarea,label';
  document.addEventListener('pointerover',e=>{if(e.target.closest(linkSel))root.classList.add('is-link');});
  document.addEventListener('pointerout', e=>{if(e.target.closest(linkSel))root.classList.remove('is-link');});

  // Mode state: 'invert' | 'white' | 'black'
  let lastMode = null;
  function setMode(mode){
    if(mode === lastMode) return;
    lastMode = mode;
    if(mode === 'invert'){
      root.style.mixBlendMode = 'difference';
      dot.style.background = '#fff';
      rings.forEach(r=>{ r.style.borderColor = '#fff'; });
    }else{
      root.style.mixBlendMode = 'normal';
      if(mode === 'white'){
        dot.style.background = '#fff';
        rings.forEach(r=>{ r.style.borderColor = '#fff'; });
      }else{ // black
        dot.style.background = '#111';
        rings.forEach(r=>{ r.style.borderColor = '#111'; });
      }
    }
  }

  // Update mode & size based on section classes under pointer
  function updateModeAndSize(){
    const under = document.elementFromPoint(x, y);

    if (under && under.closest('.invert-cursor')) {
      setMode('invert');
    } else if (under && under.closest('.white-cursor')) {
      setMode('white');
    } else if (under && under.closest('.black-cursor')) {
      setMode('black');
    } else {
      setMode('invert'); // default
    }

    // Big disk toggle (80px)
    root.classList.toggle('is-big', !!(under && under.closest('.big-cursor')));
  }

  // Ticker: movement + trailing + mode/size updates
  gsap.ticker.add(()=>{
    history.unshift({x,y});
    history.length = HISTORY_SIZE;

    gsap.set(dot,{x,y});
    rings.forEach((ring,i)=>{
      const idx=Math.min((i+1)*GAP,HISTORY_SIZE-1);
      const target=history[idx];
      const s=ringState[i];
      s.tx+=(target.x-s.tx)*(0.18-i*0.03);
      s.ty+=(target.y-s.ty)*(0.18-i*0.03);
      gsap.set(ring,{x:s.tx,y:s.ty});
    });

    updateModeAndSize();
  });

  // Click burst with adaptive color
  function currentColorForMode(){
    // For invert, white elements invert visually; white is ideal "ink"
    if (lastMode === 'black') return '#111';
    return '#fff'; // 'white' or 'invert'
  }

  function burst(x, y){
    const N=7;
    const color = currentColorForMode();
    for(let i=0;i<N;i++){
      const p=document.createElement('div');
      p.className='cursor__spark';
      p.style.background = color;
      root.appendChild(p);
      const angle=(Math.PI*2)*(i/N)+(Math.random()*0.6-0.3);
      const dist=28+Math.random()*22;
      gsap.set(p,{x,y,opacity:0.9});
      gsap.to(p,{
        duration:0.5+Math.random()*0.25,
        x:x+Math.cos(angle)*dist,
        y:y+Math.sin(angle)*dist,
        opacity:0,
        ease:'power2.out',
        onComplete:()=>p.remove()
      });
    }
  }

  // Click handler: ripple + burst + pulse (ripple color adapts too)
  addEventListener('pointerdown', e=>{
    const ripple=document.createElement('div');
    ripple.className='cursor__ring';
    ripple.style.width='8px';ripple.style.height='8px';
    const color = currentColorForMode();
    ripple.style.border = `2px solid ${color}`;
    ripple.style.borderRadius='999px';
    root.appendChild(ripple);
    gsap.set(ripple,{x:e.clientX,y:e.clientY,scale:1,opacity:.5});
    gsap.to(ripple,{duration:.6,scale:6,opacity:0,ease:'power2.out',onComplete:()=>ripple.remove()});

    burst(e.clientX,e.clientY);
    gsap.fromTo(dot,{scale:1},{duration:.2,scale:1.25,yoyo:true,repeat:1,ease:'power2.out'});
  });
})();