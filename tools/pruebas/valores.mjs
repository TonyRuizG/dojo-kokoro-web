import { chromium, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
// Los ocho valores: cursor, toque, teclado, Escape, ventanas dentro de la pantalla, reduced-motion y sin JavaScript.
// Uso: node build.mjs && node tools/pruebas/valores.mjs   (requiere: npm i --no-save playwright && npx playwright install chromium)
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SP = process.env.CAPTURAS || `${tmpdir()}/kokoro-capturas`;
mkdirSync(`${SP}/shots`, { recursive: true });
import { spawn } from 'node:child_process';
const PORT=8097;
const srv=spawn('node',['tools/servir.mjs','dist',String(PORT)],{cwd: ROOT,stdio:'ignore'});
await new Promise(r=>setTimeout(r,700));
const b=await chromium.launch(); const errs=[]; let fails=0;
const ck=(name,ok,extra='')=>{ console.log((ok?'OK  ':'FAIL'),name,extra); if(!ok) fails++; };
const URL=`http://localhost:${PORT}/nuestro-dojo/`;
const state=(pg)=>pg.evaluate(()=>[...document.querySelectorAll('[data-valor]')].map(li=>({open:li.classList.contains('is-open'),exp:li.querySelector('.valor__btn').getAttribute('aria-expanded'),vis:getComputedStyle(li.querySelector('.valor__pop')).visibility})));
const inView=(pg,i)=>pg.evaluate((i)=>{const p=document.querySelectorAll('.valor__pop')[i].getBoundingClientRect();const vw=document.documentElement.clientWidth;return {l:Math.round(p.left),r:Math.round(p.right),vw,ok:p.left>=0&&p.right<=vw}},i);
async function prep(pg){ await pg.goto(URL,{waitUntil:'load'}); await pg.addStyleTag({content:'html{scroll-behavior:auto!important} html.js body{animation:none!important}'}); await pg.evaluate(()=>document.querySelector('#valores').scrollIntoView({behavior:'instant'})); await pg.waitForTimeout(400); }

// ---------- ESCRITORIO con mouse ----------
{
 const ctx=await b.newContext({viewport:{width:1440,height:900}}); const pg=await ctx.newPage();
 pg.on('console',m=>{if(m.type()==='error'&&!/fonts\.(googleapis|gstatic)|ERR_|Failed to load resource/.test(m.text()))errs.push('desk: '+m.text())});
 pg.on('pageerror',e=>errs.push('desk pageerror: '+e.message));
 await prep(pg);
 const btns=pg.locator('.valor__btn');
 ck('hay 8 tarjetas',await btns.count()===8);
 await btns.nth(0).hover(); await pg.waitForTimeout(350);
 let s=await state(pg); ck('hover abre la 1',s[0].open&&s[0].exp==='true'&&s[0].vis==='visible');
 await pg.screenshot({path:`${SP}/shots/valores-hover-1440.png`});
 await btns.nth(1).hover(); await pg.waitForTimeout(350);
 s=await state(pg); ck('hover en la 2 cierra la 1 (solo una abierta)',!s[0].open&&s[1].open&&s.filter(x=>x.open).length===1);
 // mover al popover mantiene abierto
 const pb=await pg.locator('.valor__pop-in').nth(1).boundingBox();
 await pg.mouse.move(pb.x+pb.width/2,pb.y+pb.height/2); await pg.waitForTimeout(300);
 s=await state(pg); ck('mover el cursor al popover lo mantiene abierto',s[1].open);
 await pg.mouse.move(5,5); await pg.waitForTimeout(450);
 s=await state(pg); ck('al salir se cierra',s.every(x=>!x.open));
 // click fija
 await btns.nth(2).click(); await pg.mouse.move(5,5); await pg.waitForTimeout(450);
 s=await state(pg); ck('click fija abierta aunque salga el cursor',s[2].open);
 await pg.mouse.click(5,300); await pg.waitForTimeout(300);
 s=await state(pg); ck('click fuera cierra',s.every(x=>!x.open));
 // teclado
 await btns.nth(3).focus(); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
 s=await state(pg); ck('Enter abre',s[3].open&&s[3].exp==='true');
 await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
 s=await state(pg); const foc=await pg.evaluate(()=>document.activeElement.id);
 ck('Escape cierra y devuelve el foco',s.every(x=>!x.open)&&foc==='valor-4',foc);
 await pg.keyboard.press('Space'); await pg.waitForTimeout(300);
 s=await state(pg); ck('Espacio abre',s[3].open);
 await pg.keyboard.press('Space'); await pg.waitForTimeout(300);
 s=await state(pg); ck('Espacio otra vez cierra',!s[3].open);
 await pg.keyboard.press('Enter'); await pg.keyboard.press('Tab'); await pg.waitForTimeout(300);
 s=await state(pg); ck('Tab hacia otra tarjeta cierra la anterior',!s[3].open);
 // Todas dentro de la pantalla
 let allIn=true; for(let i=0;i<8;i++){ await pg.mouse.click(3,450); await pg.waitForTimeout(150); await btns.nth(i).click(); await pg.waitForTimeout(300); const v=await inView(pg,i); if(!v.ok){allIn=false;console.log('  fuera:',i,JSON.stringify(v));} }
 ck('las 8 ventanas quedan dentro del ancho (1440)',allIn);
 await pg.screenshot({path:`${SP}/shots/valores-pin-1440.png`});
 await ctx.close();
}
// ---------- TÁCTIL (iPhone / Android / tablet) ----------
for (const [label,opts] of [['iPhone 13',devices['iPhone 13']],['Pixel 5',devices['Pixel 5']],['iPad Mini',devices['iPad Mini']],['375x667',{viewport:{width:375,height:667},hasTouch:true,isMobile:true,deviceScaleFactor:2}]]) {
 const ctx=await b.newContext(opts); const pg=await ctx.newPage();
 pg.on('pageerror',e=>errs.push(label+' pageerror: '+e.message));
 pg.on('console',m=>{if(m.type()==='error'&&!/fonts\.(googleapis|gstatic)|ERR_|Failed to load resource/.test(m.text()))errs.push(label+': '+m.text())});
 await prep(pg);
 const btns=pg.locator('.valor__btn');
 await btns.nth(0).tap(); await pg.waitForTimeout(350);
 let s=await state(pg); ck(`[${label}] tocar abre`,s[0].open);
 await btns.nth(0).tap(); await pg.waitForTimeout(350);
 s=await state(pg); ck(`[${label}] tocar de nuevo cierra`,!s[0].open);
 await btns.nth(0).tap(); await pg.waitForTimeout(250); await btns.nth(1).tap(); await pg.waitForTimeout(350);
 s=await state(pg); ck(`[${label}] tocar otra cambia (una sola abierta)`,!s[0].open&&s[1].open&&s.filter(x=>x.open).length===1);
 const vh=await pg.evaluate(()=>window.innerHeight); await pg.touchscreen.tap(3,Math.round(vh/2)); await pg.waitForTimeout(300);
 s=await state(pg); ck(`[${label}] tocar fuera cierra`,s.every(x=>!x.open));
 let allIn=true,maxOver=0; for(let i=0;i<8;i++){ await pg.touchscreen.tap(3,Math.round(vh/2)); await pg.waitForTimeout(150); await pg.locator('.valor').nth(i).scrollIntoViewIfNeeded(); await btns.nth(i).tap(); await pg.waitForTimeout(300); const v=await inView(pg,i); if(!v.ok){allIn=false;console.log('  fuera:',i,JSON.stringify(v));} }
 ck(`[${label}] las 8 ventanas dentro del ancho`,allIn);
 const sc=await pg.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 ck(`[${label}] sin scroll horizontal`,sc<=0,String(sc));
 await pg.touchscreen.tap(3,Math.round(vh/2)); await pg.waitForTimeout(150); await btns.nth(7).tap(); await pg.waitForTimeout(350);
 await pg.screenshot({path:`${SP}/shots/valores-${label.replace(/\W/g,'')}.png`});
 await ctx.close();
}
// ---------- movimiento reducido ----------
{
 const ctx=await b.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'}); const pg=await ctx.newPage(); await prep(pg);
 const tr=await pg.evaluate(()=>{document.querySelector('.valor__btn').click();const p=document.querySelector('.valor__pop');const c=getComputedStyle(p);return {dur:c.transitionDuration,tf:c.transform}});
 ck('reduced-motion: sin transición ni desplazamiento',/^0s(, 0s)*$/.test(tr.dur)&&(tr.tf==='none'||tr.tf==='matrix(1, 0, 0, 1, 0, 0)'),JSON.stringify(tr));
 await ctx.close();
}
// ---------- sin JavaScript ----------
{
 const ctx=await b.newContext({viewport:{width:1280,height:800},javaScriptEnabled:false}); const pg=await ctx.newPage(); await pg.goto(URL,{waitUntil:'load'});
 const vis=await pg.evaluate(()=>[...document.querySelectorAll('.valor__pop')].map(p=>{const c=getComputedStyle(p);return c.visibility==='visible'&&c.position==='static'&&p.offsetHeight>0}).every(Boolean));
 ck('sin JS las descripciones quedan visibles',vis);
 await pg.screenshot({path:`${SP}/shots/valores-nojs.png`,fullPage:false});
 await ctx.close();
}
await b.close(); srv.kill(); console.log('errores de consola:',JSON.stringify(errs),'| fallos:',fails);
