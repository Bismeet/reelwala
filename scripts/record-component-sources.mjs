import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await mkdir('docs/licences',{recursive:true});
const licences=[['react-bits','https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md'],['shadcn-ui','https://raw.githubusercontent.com/shadcn-ui/ui/main/LICENSE.md'],['three','https://raw.githubusercontent.com/mrdoob/three.js/dev/LICENSE']];
for(const [name,url] of licences){const r=await fetch(url);if(!r.ok)throw new Error(`Could not read ${name} licence`);await writeFile(`docs/licences/${name}.txt`,await r.text());}
const sources=['https://reactbits.dev/r/TiltedCard-TS-CSS.json','https://ui.aceternity.com/registry/container-scroll-animation.json','https://ui.shadcn.com/r/styles/new-york/accordion.json'];
const entries=await Promise.all(sources.map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error('Component source unavailable');const text=await r.text();return {url,sha256:createHash('sha256').update(text).digest('hex'),retrieved:'2026-10-10'};}));
await writeFile('docs/licences/source-record.json',JSON.stringify(entries,null,2)+'\n');
// Aceternity source is adapted inside this end-product, not distributed as a template/component library.
await writeFile('docs/licences/aceternity.txt','Aceternity UI Container Scroll Animation\nAuthor: Manu Arora\nSource: https://ui.aceternity.com/components/container-scroll-animation\nLicence: https://ui.aceternity.com/licence\nRetrieved 2026-10-10. Used and modified as part of The Reel Wala website only.\nThe Aceternity License permits creating/modifying end products. It prohibits resale or redistribution of the Item as stock source, component products, or marketplace templates.\n');
