// Run once on your laptop:  node scripts/geocode.mjs   (Node 18+, ~4 min, resumable)
// Uses public Nominatim: 1 req/sec + identifying User-Agent, per OSM usage policy.
import fs from 'node:fs';
const CONTACT = process.env.CONTACT || 'bmc-safety-demo (your-email@example.com)';
const rows = fs.readFileSync('data/c1.psv','utf8').trim().split('\n').map((l,i)=>{const [ward,name,address]=l.split('|');return {id:'c'+(i+1),ward,name,address};});
const out = fs.existsSync('data/coords.json') ? JSON.parse(fs.readFileSync('data/coords.json','utf8')) : {};
const inMumbai=(lat,lon)=>lat>18.88&&lat<19.30&&lon>72.75&&lon<73.05;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function q(text){
  const u='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&viewbox=72.75,19.30,73.05,18.88&bounded=1&q='+encodeURIComponent(text);
  const r=await fetch(u,{headers:{'User-Agent':CONTACT}}); if(!r.ok) throw new Error(r.status);
  const j=await r.json(); return j[0]&&inMumbai(+j[0].lat,+j[0].lon)?[+j[0].lat,+j[0].lon]:null;
}
for(const b of rows){
  if(out[b.id]) continue;
  let hit=null,prec='building';
  try{ hit=await q(`${b.name}, ${b.address}, Mumbai`); await sleep(1100);
    if(!hit){ prec='street'; hit=await q(`${b.address}, Mumbai`); await sleep(1100); }
  }catch(e){ console.log('error',b.id,e.message); await sleep(3000); }
  if(hit){ out[b.id]=[hit[0],hit[1],prec]; } else { out[b.id]=null; }
  console.log(b.id,b.name,'->',out[b.id]);
  fs.writeFileSync('data/coords.json',JSON.stringify(out));
}
fs.writeFileSync('data/coords.js','window.COORDS='+JSON.stringify(out)+';');
const ok=Object.values(out).filter(Boolean); console.log(`Done. ${ok.length}/${rows.length} located; ${ok.filter(x=>x[2]==='building').length} at building level.`);
