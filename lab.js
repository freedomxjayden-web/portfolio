/* Three local scientific models. Canvas is only a view; controls and readings are HTML. */
(() => {
  'use strict';
  const root=document.querySelector('[data-experiment-panel]');
  if(!root) return;
  const config=portfolioContent.lab,KEY=config.storage_key;
  const defaults=()=>({...config.defaults});
  const $=id=>document.getElementById(id);
  const t=key=>portfolioContent.common[document.documentElement.lang==='en'?'en':'zh'][key]||key;
  const G={earth:9.81,moon:1.62,mars:3.71},N={air:1,water:1.333,glass:1.5};
  const deg=Math.PI/180,clamp=(n,a,b)=>Math.max(a,Math.min(n,b));
  const names={wave:'Wave',gravity:'Gravity',optics:'Optics'};
  const ranges={frequency:[.2,2],amplitude:[.1,1],speed:[5,25],angle:[15,75],incidence:[0,80]};
  const enums={experiment:['wave','gravity','optics'],planet:Object.keys(G),medium1:Object.keys(N),medium2:Object.keys(N)};
  let state=defaults(),saveKey='labSaved',exportKey='',playing=false,time=0,previous=0,raf=0,busy=false;
  function validate(saved) {
    if(!saved||saved.version!==config.version||!saved.parameters) throw Error('version');
    const p=saved.parameters,next=defaults();
    for(const [key,[min,max]] of Object.entries(ranges)) {
      if(typeof p[key]!=='number'||!Number.isFinite(p[key])||p[key]<min||p[key]>max) throw Error('range');
      next[key]=p[key];
    }
    for(const [key,values] of Object.entries(enums)) {
      if(!values.includes(p[key])) throw Error('enum');next[key]=p[key];
    }
    return next;
  }
  try {const saved=localStorage.getItem(KEY);if(saved){try{state=validate(JSON.parse(saved));}catch{saveKey='labRecovered';}}}
  catch {saveKey='labUnsaved';}
  if(names[location.hash.slice(1)]) state.experiment=location.hash.slice(1);
  function persist() {
    try {localStorage.setItem(KEY,JSON.stringify({version:config.version,parameters:state}));saveKey='labSaved';}
    catch {saveKey='labUnsaved';}
    feedback();
  }
  function feedback() {$('science-save-status').textContent=t(saveKey);$('science-export-status').textContent=exportKey?t(exportKey):'';}
  function motion(p) {
    const vx=p.speed*Math.cos(p.angle*deg),vy=p.speed*Math.sin(p.angle*deg),g=G[p.planet];
    return {vx,vy,g,flight:2*vy/g,range:2*vx*vy/g,height:vy*vy/(2*g)};
  }
  function optics(p) {
    const n1=N[p.medium1],n2=N[p.medium2],ratio=n1*Math.sin(p.incidence*deg)/n2;
    return {n1,n2,tir:ratio>1+1e-12,angle:Math.asin(clamp(ratio,0,1))/deg,critical:n1>n2?Math.asin(n2/n1)/deg:null};
  }
  function reading(id,value,message=false) {$(id).textContent=value;$(id).classList.toggle('is-message',message);}
  function readings() {
    reading('science-wavelength',(1/state.frequency).toFixed(2)+' m');
    reading('science-period',(1/state.frequency).toFixed(2)+' s');
    const m=motion(state),o=optics(state);
    for(const key of ['range','flight','height']) reading('science-'+key,m[key].toFixed(2)+(key==='flight'?' s':' m'));
    reading('science-refracted',o.tir?t('labTIR'):o.angle.toFixed(2)+'°',o.tir);
    reading('science-critical',o.critical===null?t('labNoCritical'):o.critical.toFixed(2)+'°',o.critical===null);
  }
  function sync() {
    for(const key of [...Object.keys(ranges),'planet','medium1','medium2']) {
      $('science-'+key).value=state[key];
      const output=$('science-'+key+'-value');
      if(output) output.textContent=state[key]+({frequency:' Hz',amplitude:' m',speed:' m/s',angle:'°',incidence:'°'}[key]);
    }
    document.querySelectorAll('[data-experiment-panel]').forEach(e=>{e.hidden=e.dataset.experimentPanel!==state.experiment;});
    document.querySelectorAll('[data-experiment]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.experiment===state.experiment)));
    $('science-play').hidden=state.experiment==='optics';
    $('science-play').textContent=t(playing?'labPause':'labPlay');
    $('science-play').setAttribute('aria-pressed',String(playing));
    document.querySelector('.flight-progress').hidden=state.experiment!=='gravity';
    $('science-export').textContent=t(busy?'labExporting':'labExport')+(busy?'':' ↓');
    $('science-export').disabled=busy;
    readings();feedback();draw();
  }
  const C={paper:'#f1f5f7',background:'#f8fbfd',ink:'#19262e',muted:'#5e6c76',blue:'#285e91',axis:'#819bae',grid:'#dee8ef',secondary:'#6a899f'};
  function render(canvas,kind,p,elapsed) {
    const ctx=canvas.getContext('2d');ctx.clearRect(0,0,1200,800);ctx.fillStyle=C.background;ctx.fillRect(0,0,1200,800);
    function text(value,x,y,size=24,color=C.muted,align='left') {ctx.fillStyle=color;ctx.font=`${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;ctx.textAlign=align;ctx.fillText(value,x,y);}
    function line(x1,y1,x2,y2,color=C.axis,width=2,dash=[]) {ctx.beginPath();ctx.setLineDash(dash);ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();ctx.setLineDash([]);}
    function arrow(x1,y1,x2,y2,color=C.blue,width=4) {line(x1,y1,x2,y2,color,width);const a=Math.atan2(y2-y1,x2-x1);line(x2,y2,x2-16*Math.cos(a-.45),y2-16*Math.sin(a-.45),color,width);line(x2,y2,x2-16*Math.cos(a+.45),y2-16*Math.sin(a+.45),color,width);}
    function dot(x,y,r=9,color=C.blue) {ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
    function grid(left,top,right,bottom,cols=12,rows=6) {for(let i=0;i<=cols;i++){const x=left+(right-left)*i/cols;line(x,top,x,bottom,C.grid,1);}for(let i=0;i<=rows;i++){const y=top+(bottom-top)*i/rows;line(left,y,right,y,C.grid,1);}}
    text(t('lab'+names[kind]+'ID'),50,48,20,C.blue);
    text(t('lab'+names[kind]),1150,48,24,C.ink,'right');
    line(50,72,1150,72,C.grid,1);
    text(t('lab'+names[kind]+'Limit'),50,795,17,C.muted);
    if(kind==='wave') {
      const left=100,right=1100,mid=390,scaleY=195,lambda=1/p.frequency;
      grid(left,145,right,635,12,10);line(left,mid,right,mid);line(left,145,left,635);
      for(let i=0;i<=6;i++) text(String(i),left+(right-left)*i/6,680,22,C.muted,'center');
      for(const y of [-1,0,1]) text(String(y),78,mid-y*scaleY+8,22,C.muted,'right');
      ctx.beginPath();for(let i=0;i<=1000;i++) {const x=i/1000*6,y=p.amplitude*Math.sin(2*Math.PI*(x/lambda-p.frequency*elapsed));const px=left+i,py=mid-y*scaleY;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}
      ctx.strokeStyle=C.blue;ctx.lineWidth=5;ctx.stroke();
      const station=600,stationY=mid-p.amplitude*Math.sin(2*Math.PI*(3/lambda-p.frequency*elapsed))*scaleY;
      line(station,145,station,635,C.secondary,2,[7,8]);dot(station,stationY,10);
      text(t('labStation'),station+14,128,23,C.blue);
      text(t('labDisplacement'),100,115,25,C.ink);text(t('labDistance'),1100,725,25,C.ink,'right');
      text(`c = 1 m/s   f = ${p.frequency.toFixed(1)} Hz   A = ${p.amplitude.toFixed(2)} m   λ = ${lambda.toFixed(2)} m`,50,770,25,C.blue);
    } else if(kind==='gravity') {
      const m=motion(p),left=100,bottom=640,plotW=1000,plotH=480,plotRange=Math.max(10,m.range*1.12),plotHeight=Math.max(5,m.height*1.35);
      // Equal distances on both axes use the same pixel scale.
      const s=Math.min(plotW/plotRange,plotH/plotHeight),domainX=plotW/s,domainY=plotH/s;
      grid(left,160,1100,bottom,10,6);line(left,bottom,1100,bottom);line(left,160,left,bottom);
      for(let i=0;i<=5;i++) text((domainX*i/5).toFixed(domainX<50?1:0),left+plotW*i/5,682,22,C.muted,'center');
      for(let i=1;i<=3;i++) text((domainY*i/3).toFixed(1),78,bottom-plotH*i/3+8,22,C.muted,'right');
      ctx.beginPath();for(let i=0;i<=200;i++){const tt=m.flight*i/200,x=left+m.vx*tt*s,y=bottom-(m.vy*tt-.5*m.g*tt*tt)*s;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
      ctx.strokeStyle=C.secondary;ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.stroke();ctx.setLineDash([]);
      const now=clamp(elapsed,0,m.flight),x=left+m.vx*now*s,y=bottom-(m.vy*now-.5*m.g*now*now)*s;
      line(x,y,x,bottom,C.secondary,1,[6,6]);dot(x,y,12);dot(left,bottom,5,C.ink);dot(left+m.range*s,bottom,6,C.blue);
      text(t('labAltitude'),100,125,25,C.ink);text(t('labDistance'),1100,725,25,C.ink,'right');
      text(`v₀ = ${p.speed} m/s   θ = ${p.angle}°   g = ${m.g.toFixed(2)} m/s²   t = ${now.toFixed(2)} s`,50,770,25,C.blue);
    } else {
      const o=optics(p),cx=600,cy=405,length=275,a=p.incidence*deg;
      ctx.fillStyle='#e7f0f7';ctx.fillRect(50,cy,1100,285);grid(50,120,1150,690,11,6);
      line(50,cy,1150,cy,C.axis,2);line(cx,105,cx,690,C.secondary,2,[8,8]);
      text(t('labNormal'),cx+16,125,23,C.muted);
      text(`n₁ = ${o.n1.toFixed(3)}`,78,160,27,C.ink);text(`n₂ = ${o.n2.toFixed(3)}`,78,670,27,C.ink);
      arrow(cx-length*Math.sin(a),cy-length*Math.cos(a),cx,cy);
      arrow(cx,cy,cx+length*Math.sin(a),cy-length*Math.cos(a),o.tir?C.blue:C.secondary,o.tir?5:2);
      ctx.beginPath();ctx.arc(cx,cy,90,-Math.PI/2-a,-Math.PI/2);ctx.strokeStyle=C.blue;ctx.lineWidth=2;ctx.stroke();
      text(`θ₁ = ${p.incidence}°`,350,cy-40,24,C.blue,'right');
      if(!o.tir) {
        const b=o.angle*deg;
        arrow(cx,cy,cx+length*Math.sin(b),cy+length*Math.cos(b),C.blue,5);
        ctx.beginPath();ctx.arc(cx,cy,95,Math.PI/2-b,Math.PI/2);ctx.strokeStyle=C.blue;ctx.lineWidth=2;ctx.stroke();
        text(`θ₂ = ${o.angle.toFixed(2)}°`,820,cy+110,24,C.blue);
      } else text(t('labTIR'),880,cy+130,28,C.blue,'center');
      dot(cx,cy,6);
      text(t('labIncomingRay'),80,90,23,C.blue);text(t('labReflectedRay'),1120,90,23,C.secondary,'right');
      text(o.tir?t('labTotalNote'):'n₁ sinθ₁ = n₂ sinθ₂',50,770,25,C.blue);
    }
  }
  function draw() {
    const canvas=$('canvas-'+state.experiment);render(canvas,state.experiment,state,time);
    if(state.experiment==='gravity') {
      const percent=clamp(time/motion(state).flight*100,0,100);$('science-progress').value=percent;$('science-progress-value').textContent=percent.toFixed(0)+'%';
    }
  }
  function stop() {playing=false;cancelAnimationFrame(raf);previous=0;$('science-play').textContent=t('labPlay');$('science-play').setAttribute('aria-pressed','false');}
  function frame(stamp) {
    if(!playing) return;
    if(previous) time+=(stamp-previous)/1000;previous=stamp;
    if(state.experiment==='gravity'&&time>=motion(state).flight){time=motion(state).flight;stop();}
    draw();if(playing)raf=requestAnimationFrame(frame);
  }
  function choose(id) {if(!names[id])return;stop();time=0;state.experiment=id;exportKey='';sync();persist();}
  document.querySelectorAll('[data-experiment]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.experiment)));
  for(const key of Object.keys(ranges)) $('science-'+key).addEventListener('input',event=>{
    const value=Number(event.target.value);if(!Number.isFinite(value))return;state[key]=clamp(value,...ranges[key]);time=0;sync();persist();
  });
  for(const key of ['planet','medium1','medium2']) $('science-'+key).addEventListener('change',event=>{if(!enums[key].includes(event.target.value))return;state[key]=event.target.value;time=0;sync();persist();});
  $('science-play').addEventListener('click',()=>{
    if(playing){stop();return;}if(state.experiment==='optics')return;
    if(state.experiment==='gravity'&&time>=motion(state).flight)time=0;
    playing=true;previous=0;$('science-play').textContent=t('labPause');$('science-play').setAttribute('aria-pressed','true');raf=requestAnimationFrame(frame);
  });
  $('science-progress').addEventListener('input',event=>{stop();time=motion(state).flight*Number(event.target.value)/100;draw();});
  $('science-reset').addEventListener('click',()=>{const experiment=state.experiment;stop();state=defaults();state.experiment=experiment;time=0;exportKey='';sync();persist();});
  $('science-export').addEventListener('click',async()=>{
    if(busy)return;busy=true;exportKey='';sync();const p={...state},elapsed=time;
    try {
      await document.fonts.ready;
      const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;render(canvas,p.experiment,p,elapsed);
      const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG')),'image/png'));
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='science-'+p.experiment+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);exportKey='labExportDone';
    } catch {exportKey='labExportError';}
    finally {busy=false;sync();}
  });
  document.addEventListener('portfolio:language',sync);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  document.querySelectorAll('.experiment-panel').forEach(e=>e.classList.add('science-ready'));
  sync();document.fonts.ready.then(draw);
})();
