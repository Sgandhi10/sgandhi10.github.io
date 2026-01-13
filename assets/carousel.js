(function(){
  const track = document.getElementById('track');
  const viewport = document.getElementById('carousel');

  let paused = false;
  let timer = null;
  const REST_DELAY = 250;  // 0.1s pause before each slide
  const SLIDE_MS = 1500;

  function getGap(){
    return parseFloat(getComputedStyle(track).gap || '0');
  }

  function step(){
    if (paused) return;
    const first = track.children[0];
    if(!first) return;
    const distance = first.getBoundingClientRect().width + getGap();

    track.style.transition = `transform ${SLIDE_MS}ms ease`;
    track.style.transform = `translateX(-${distance}px)`;

    const onEnd = () => {
      track.removeEventListener('transitionend', onEnd);
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
      track.appendChild(first);
      void track.offsetHeight;
      if(!paused) timer = setTimeout(step, REST_DELAY);
    };
    track.addEventListener('transitionend', onEnd, { once:true });
  }

  function start(){
    clearTimeout(timer);
    timer = setTimeout(step, REST_DELAY);
  }

  // function stop(){
  //   paused = true;
  //   clearTimeout(timer);
  // }

  // function resume(){
  //   paused = false;
  //   start();
  // }

  // viewport.addEventListener('mouseenter', stop);
  // viewport.addEventListener('mouseleave', resume);

  const imgs = Array.from(track.querySelectorAll('img'));
  Promise.all(imgs.map(img =>
    img.complete ? Promise.resolve() :
    new Promise(res => { img.addEventListener('load', res, {once:true}); img.addEventListener('error', res, {once:true}); })
  )).then(start);
})();