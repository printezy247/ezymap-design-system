const $ = id => document.getElementById(id);
const samples = [
  ['BTC/USD','Crypto','64,120.00',2.14,'Live · 14:30','The sample price crossed above its prior session high.','0,79 50,65 100,70 150,39 200,48 250,19 300,10'],
  ['EUR/USD','Forex','1.0842',-0.36,'Delayed · 14:26','The last available quote fell below the previous session low. The feed is four minutes behind the sample clock.','0,15 50,27 100,21 150,47 200,42 250,72 300,81'],
  ['XAU/USD','Metals','2,351.80',0.62,'Live · 14:30','Gold recovered its opening range after a mid-session dip.','0,62 50,48 100,71 150,66 200,40 250,32 300,19'],
];
const dialog = document.querySelector('dialog');
const signed = n => `${n>0?'+':'−'}${Math.abs(n).toFixed(2)}%`;
function render() {
  const matches = samples.filter(([,asset,,n]) => ($('asset').selectedIndex===0 || $('asset').value===asset) && ($('signal').selectedIndex===0 || $('signal').value===(n>0?'Rising':'Declining')));
  if ($('order').selectedIndex) matches.sort((a,b)=>Math.abs(b[3])-Math.abs(a[3]));
  $('rows').replaceChildren();
  for (const [symbol,asset,price,n,feed,why,points] of matches) {
    const row=$('rows').insertRow(), action=document.createElement('button');
    row.insertCell().append(action); action.textContent=symbol; action.setAttribute('aria-haspopup','dialog');
    row.insertCell().textContent=price; const delta=row.insertCell(); delta.textContent=signed(n); delta.className=n>0?'up':'down'; row.insertCell().textContent=feed;
    action.onclick=()=>{ $('title').textContent=symbol; $('reading').textContent=`${price} USD · ${signed(n)} over 24 hours`; $('why').textContent=why; $('source').textContent=`Source: EzyMap sample session · ${asset} · ${feed} UTC`; dialog.querySelector('polyline').setAttribute('points',points); dialog.showModal(); };
  }
  $('count').textContent=matches.length?`${matches.length} instrument${matches.length===1?'':'s'} · Snapshot 14:30 UTC`:'No instruments match these filters.';
  $('clear').hidden=matches.length!==0;
}
for(const id of ['asset','signal','order']) $(id).onchange=render;
$('clear').onclick=()=>{ $('asset').selectedIndex=$('signal').selectedIndex=0; render(); $('asset').focus(); };
const theme=$('theme'); theme.setAttribute('aria-pressed',document.documentElement.dataset.theme==='dark');
theme.onclick=()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;theme.setAttribute('aria-pressed',next==='dark');try{localStorage.setItem('ezymap-desk-theme',next)}catch{}};
render();
