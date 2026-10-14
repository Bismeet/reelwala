import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,textureCompress,weld,simplify,meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptSimplifier} from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs/promises';
await Promise.all([MeshoptEncoder.ready,MeshoptSimplifier.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder});
const root='art-source/polyhaven-assets';
for(const dir of await fs.readdir(root)){
 const src=`${root}/${dir}/${dir}.gltf`;
 try{await fs.access(src)}catch{continue}
 const doc=await io.read(src);
 await doc.transform(dedup(),weld(),simplify({simplifier:MeshoptSimplifier,ratio:.75,error:.0005}),prune(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[1024,1024],quality:86}),meshopt({encoder:MeshoptEncoder,level:'medium'}));
 await io.write(`public/scene-3d/models/reception/${dir}.glb`,doc);
 console.log(dir,(await fs.stat(`public/scene-3d/models/reception/${dir}.glb`)).size);
}

