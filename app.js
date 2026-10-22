const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
const progress=document.querySelector('.progress');function updateProgress(){if(!progress)return;let max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'}addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const menu=document.querySelector('.menu'),links=document.querySelector('.navlinks');if(menu&&links)menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕':'☰'});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const bars=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.width+'%';bars.unobserve(e.target)}}),{threshold:.3});document.querySelectorAll('.bar span').forEach(el=>bars.observe(el));
const counts=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=Number(el.dataset.count),duration=1300,start=performance.now();function tick(now){let t=Math.min(1,(now-start)/duration),n=Math.round(target*(1-Math.pow(1-t,3)));el.textContent=el.dataset.prefix==='₹'?'₹'+(n>=100000?(n/100000).toFixed(2).replace(/\.00$/,'')+'L':n.toLocaleString('en-IN')):n+(el.dataset.suffix||'');if(t<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);counts.unobserve(el)}),{threshold:.4});document.querySelectorAll('[data-count]').forEach(el=>counts.observe(el));
const glow=document.querySelector('.cursor-glow');if(glow&&matchMedia('(pointer:fine)').matches)addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

// V5 motion: gentle portrait parallax, magnetic buttons, active-page cues.
const portrait=document.querySelector('.photo-orbit');
if(portrait && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const visual=portrait.closest('.visual');
  visual?.addEventListener('pointermove',e=>{
    const r=visual.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    portrait.style.transform=`translate3d(${x*12}px,${y*10}px,0) rotateY(${x*5}deg) rotateX(${-y*4}deg)`;
  });
  visual?.addEventListener('pointerleave',()=>portrait.style.transform='');
}
if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.card,.persona,.job').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${-y*2.2}deg) rotateY(${x*2.2}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}
document.querySelectorAll('.navlinks a').forEach(a=>{
  if(a.getAttribute('href')===location.pathname.split('/').pop()) a.classList.add('active');
});


// V6 motion system: lightweight particle field, role rotation, page transitions.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('particle-field');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1,pts=[],raf=0;
    const resize=()=>{dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(68,Math.max(28,Math.floor(w/19)));pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.5+.5}));};
    const draw=()=>{ctx.clearRect(0,0,w,h);for(let i=0;i<pts.length;i++){const p=pts[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(125,231,255,.52)';ctx.fill();for(let j=i+1;j<pts.length;j++){const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<115){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(113,242,192,${(1-d/115)*.11})`;ctx.lineWidth=.7;ctx.stroke();}}}raf=requestAnimationFrame(draw);};
    resize();draw();addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw()},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!raf)draw()});
  }
  const role=document.querySelector('.role-cycle');
  if(role && !reduce){const words=(role.dataset.words||'').split('|').map(x=>x.replaceAll('&amp;','&'));let i=0;setInterval(()=>{i=(i+1)%words.length;role.classList.add('role-changing');setTimeout(()=>{role.textContent=words[i];role.classList.remove('role-changing')},180)},2600);}
  if(!reduce){document.querySelectorAll('a[href$=".html"]').forEach(a=>{if(a.target||a.origin!==location.origin)return;a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const dest=a.getAttribute('href');if(!dest||dest.startsWith('#'))return;e.preventDefault();document.body.classList.add('page-leaving');setTimeout(()=>location.href=dest,180);});});}
})();
