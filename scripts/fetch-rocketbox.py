import urllib.request,json,pathlib,concurrent.futures
x=json.load(open('art-source/rocketbox-tree.json'))['tree'];jobs=[]
for a in x:
 p=a['path']
 if p.startswith('Assets/Avatars/Professions/') and any('/'+n+'/' in p for n in ['Business_Male_03','Business_Female_01']) and (p.endswith('.fbx') and not p.endswith('_facial.fbx') or p.endswith('_color.tga') or p.endswith('_normal.tga')):jobs.append(p)
def get(p):
 dst=pathlib.Path('art-source/rocketbox')/p;dst.parent.mkdir(parents=True,exist_ok=True)
 if not dst.exists():dst.write_bytes(urllib.request.urlopen('https://cdn.jsdelivr.net/gh/microsoft/Microsoft-Rocketbox@master/'+p,timeout=90).read())
 print('Ready',dst.name,flush=True)
with concurrent.futures.ThreadPoolExecutor(5) as ex:list(ex.map(get,jobs))

