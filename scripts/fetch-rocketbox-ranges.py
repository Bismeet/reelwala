import urllib.request,json,pathlib,concurrent.futures,time,os
root=pathlib.Path('art-source/rocketbox');items=[]
for a in json.load(open('art-source/rocketbox-tree.json'))['tree']:
 p=a['path']
 if p.startswith('Assets/Avatars/Professions/') and any('/'+n+'/' in p for n in ['Business_Male_03','Business_Female_01']) and (p.endswith('_color.tga') or p.endswith('_normal.tga')):items.append(a)
chunkroot=root/'chunks';chunkroot.mkdir(exist_ok=True);step=262144
jobs=[(a,i,min(i+step,a['size'])-1)for a in items for i in range(0,a['size'],step)]
def part(job):
 a,start,end=job;p=chunkroot/(a['sha']+'-'+str(start));length=end-start+1
 if p.exists() and p.stat().st_size==length:return
 for attempt in range(4):
  try:
   req=urllib.request.Request('https://cdn.jsdelivr.net/gh/microsoft/Microsoft-Rocketbox@master/'+a['path'],headers={'Range':f'bytes={start}-{end}'})
   with urllib.request.urlopen(req,timeout=20) as r:
    if r.status!=206 or r.headers.get('Content-Range')!=f'bytes {start}-{end}/{a["size"]}':raise RuntimeError('Incorrect range')
    d=r.read()
   if len(d)!=length:raise RuntimeError('Incomplete chunk')
   p.write_bytes(d);return
  except Exception:
   if attempt==3:raise
with concurrent.futures.ThreadPoolExecutor(16) as ex:
 for i,_ in enumerate(ex.map(part,jobs)):
  if i%50==0:print('Chunks',i,'/',len(jobs),flush=True)
for a in items:
 dst=root/a['path'];dst.write_bytes(b''.join((chunkroot/(a['sha']+'-'+str(i))).read_bytes()for i in range(0,a['size'],step)));print('Complete',dst.name,dst.stat().st_size,flush=True)
