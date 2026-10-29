import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
// Maquetación sin desbordes (scroll horizontal ni palabras cortadas) en anchos de 1920 a 360 px, en las tres páginas.
// Uso: node build.mjs && node tools/pruebas/layout.mjs   (requiere: npm i --no-save playwright && npx playwright install chromium)
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SP = process.env.CAPTURAS || `${tmpdir()}/kokoro-capturas`;
mkdirSync(`${SP}/shots`, { recursive: true });
import { spawn } from 'node:child_process';
const PORT=8096;
const srv=spawn('node',['tools/servir.mjs','dist',String(PORT)],{cwd: ROOT,stdio:'ignore'});
await new Promise(r=>setTimeout(r,700));
const b=await chromium.launch(); const errs=[]; let bad=0;
const widths=[[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[412,915],[390,844],[375,667],[360,740]];
const pages=['/','/nuestro-dojo/','/programa-educativo/'];
for (const path of pages) for (const [w,h] of widths) {
  const ctx=await b.newContext({viewport:{width:w,height:h}}); const pg=await ctx.newPage();
  pg.on('pageerror',e=>errs.push(path+' '+w+' pageerror: '+e.message));
  pg.on('console',m=>{if(m.type()==='error'&&!/fonts\.(googleapis|gstatic)|ERR_|Failed to load resource|waze/i.test(m.text()))errs.push(path+' '+w+': '+m.text())});
  await pg.goto(`http://localhost:${PORT}${path}`,{waitUntil:'load'});
  await pg.waitForTimeout(300);
  const r=await pg.evaluate(()=>{
    const vw=document.documentElement.clientWidth; const out={hscroll:document.documentElement.scrollWidth-vw, over:[], clip:[]};
    const clipAnc=(el)=>{ for(let a=el.parentElement;a;a=a.parentElement){const cs=getComputedStyle(a); if(/(hidden|clip|auto|scroll)/.test(cs.overflowX)) return a;} return null; };
    document.querySelectorAll('body *').forEach(el=>{
      const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden'||cs.position==='fixed') return;
      if(el.classList.contains('sr-only')||el.closest('.mapcard__bg,.hero__bg,.hero__kanji,.contact__ghost,.cta-band__ghost,.collab__ghost,svg,.valor__pop,iframe')) return;
      const r=el.getBoundingClientRect(); if(r.width===0||r.height===0) return;
      if(r.right>vw+1 || r.left<-1){ const ca=clipAnc(el); const car=ca?ca.getBoundingClientRect():null; if(!(car && car.right<=vw+1 && car.left>=-1)) out.over.push(el.tagName.toLowerCase()+'.'+String(el.className).split(' ')[0]+' '+Math.round(r.left)+'→'+Math.round(r.right)); }
      // texto cortado dentro de contenedores con overflow oculto
      if(/(hidden|clip)/.test(cs.overflowX) && el.scrollWidth>el.clientWidth+2 && /^(H1|H2|H3|H4|P|A|BUTTON|SPAN|LI)$/.test(el.tagName)) out.clip.push(el.tagName.toLowerCase()+'.'+String(el.className).split(' ')[0]+' '+el.scrollWidth+'>'+el.clientWidth);
    });
    out.over=[...new Set(out.over)].slice(0,6); out.clip=[...new Set(out.clip)].slice(0,6);
    return out;});
  const ok=r.hscroll<=0&&!r.over.length&&!r.clip.length; if(!ok) bad++;
  console.log((ok?'OK  ':'FAIL'),path.padEnd(22),String(w).padStart(4),ok?'':JSON.stringify(r));
  await ctx.close();
}
await b.close(); srv.kill(); console.log('errores consola/JS:',JSON.stringify(errs),'| páginas/anchos con problema:',bad);
