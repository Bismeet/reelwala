import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Clapperboard} from 'lucide-react';
import {writeFile} from 'node:fs/promises';
const icon=renderToStaticMarkup(createElement(Clapperboard,{size:40,stroke:'#f59e0b',strokeWidth:1.7,x:12,y:12}));
await writeFile('src/app/icon.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#102b27"/>${icon}</svg>`);
