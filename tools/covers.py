"""Art-directed crops of the real screenshots. Optional authoring dependency: Pillow.

Run from any directory. Original screenshots are never overwritten.
No third-party reference imagery or invented interface/market data is used.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
import json

ROOT = Path(__file__).resolve().parent.parent
A = ROOT / 'assets'
W, H = 1200, 640

def stage(top, bottom):
    im = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(im)
    for y in range(H):
        c = tuple(round(a+(b-a)*y/H) for a,b in zip(top,bottom))
        d.line((0,y,W,y), fill=c)
    return im.convert('RGBA')

def panel(canvas, image, xy, angle=0, radius=18):
    image = image.convert('RGBA')
    mask = Image.new('L',image.size); ImageDraw.Draw(mask).rounded_rectangle((0,0,image.width-1,image.height-1),radius=radius,fill=255)
    image.putalpha(mask)
    pad = 70
    tile = Image.new('RGBA',(image.width+2*pad,image.height+2*pad))
    shadow = Image.new('RGBA',tile.size)
    shadow.paste((15,38,34,55),(pad,pad+18,pad+image.width,pad+18+image.height),mask)
    tile.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(25)))
    tile.alpha_composite(image,(pad,pad))
    tile = tile.rotate(angle,Image.Resampling.BICUBIC,expand=True)
    canvas.alpha_composite(tile,(xy[0]-pad,xy[1]-pad))

def save(im, id):
    im=im.convert('RGB')
    im.save(A/(id+'-cover.png'),optimize=True)
    im.save(A/(id+'-cover.webp'),quality=88,method=6)

# File library: a readable detail from the real list, with paper layers.
im=stage((223,237,239),(197,221,222));d=ImageDraw.Draw(im)
paper=Image.new('RGBA',(890,340),'#ecf6f3')
panel(im,paper,(100,105),angle=9)
paper=Image.new('RGBA',(950,350),'#f9fcfb')
panel(im,paper,(124,135),angle=2)
raw=Image.open(A/'cloud-drive-files.png')
detail=raw.crop((0,0,550,202)).resize((1018,374),Image.Resampling.LANCZOS)
framed=Image.new('RGB',(1082,438),'white');framed.paste(detail,(32,32))
panel(im,framed,(60,158),angle=-4)
save(im,'cloud-drive')

# Game: the actual battlefield plus an enlarged crop of its actual pixel character.
raw=Image.open(A/'cat-outpost-preview.png').convert('RGB')
im=ImageOps.fit(raw.crop((280,220,1040,610)),(W,H),method=Image.Resampling.LANCZOS).convert('RGBA')
shade=Image.new('RGBA',(W,H));d=ImageDraw.Draw(shade)
for x in range(W):
    opacity=round(210*max(0,1-x/950))
    d.line((x,0,x,H),fill=(16,31,40,opacity))
im.alpha_composite(shade)
portrait=raw.crop((58,638,137,695)).convert('RGBA')
mask=Image.new('L',portrait.size)
ImageDraw.Draw(mask).polygon([(0,0),(22,0),(22,8),(57,8),(57,0),(77,0),(77,28),(79,28),(79,44),(73,44),(73,57),(9,57),(9,51),(0,51)],fill=255)
portrait.putalpha(mask)
portrait=portrait.resize((474,342),Image.Resampling.NEAREST)
im.alpha_composite(portrait,(90,190))
save(im,'cat-outpost')

# Stock research: focus on the existing knowledge/search card, without tiny sidebar UI.
im=stage((225,235,215),(192,214,180))
raw=Image.open(A/'stock-atlas-preview.png')
detail=raw.crop((280,112,1240,550)).resize((1056,482),Image.Resampling.LANCZOS)
panel(im,detail,(84,74),angle=3,radius=16)
save(im,'stock-atlas')

source=json.loads((ROOT/'data/site.json').read_text())
for p in source['projects']:
    p['cover']={'image':p['id']+'-cover.png','size':[W,H],'alt':p['id']+'-coverAlt'}
for lang, values in {
    'zh': {
        'cloud-drive-coverAlt':'雲端檔案庫封面：紙張層次配上實際文件列表局部，顯示 PDF 同 Word 檔案。',
        'cat-outpost-coverAlt':'喵哨站封面：放大嘅實際貓咪角色及已部署炮塔嘅戰場局部。',
        'stock-atlas-coverAlt':'Stock Atlas 封面：實際術語資料庫嘅知識卡片與搜尋入口局部。',
    },
    'en': {
        'cloud-drive-coverAlt':'Cloud Drive cover: layered paper with a detail of the actual PDF and Word file list.',
        'cat-outpost-coverAlt':'Cat Outpost cover: an enlarged actual pixel character and a crop of the deployed battlefield.',
        'stock-atlas-coverAlt':'Stock Atlas cover: a crop of the actual glossary knowledge card and search field.',
    },
}.items():
    source['copy'][lang].update(values)
source['copy']['en']['previewPrefix']='View larger: '
(ROOT/'data/site.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')

# Social cards repeat the same visual system and real covers.
font='/System/Library/Fonts/STHeiti Medium.ttc'
def f(size):return ImageFont.truetype(font,size)
def social(title,sub,ids,name):
    canvas=Image.new('RGB',(1200,630),'#f6f5f1');d=ImageDraw.Draw(canvas)
    d.text((52,28),'x / 作品中心',fill='#172b3a',font=f(22))
    d.text((52,84),title,fill='#172b3a',font=f(43))
    d.text((52,150),sub,fill='#526466',font=f(23))
    for i,id in enumerate(ids):
        width=1096 if len(ids)==1 else (1096-22*(len(ids)-1))//len(ids)
        x=52+i*(width+22)
        shot=ImageOps.fit(Image.open(A/(id+'-cover.png')),(width,315),method=Image.Resampling.LANCZOS)
        mask=Image.new('L',shot.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,width,315),radius=12,fill=255)
        canvas.paste(shot,(x,220),mask)
    if not ids:
        d.rounded_rectangle((52,220,1148,535),radius=12,fill='#e9f3ef')
        d.text((100,320),'暫時未有作品',fill='#087f78',font=f(42))
    d.text((52,583),'freedomxjayden-web.github.io/portfolio',fill='#526466',font=f(18))
    canvas.save(A/('share-'+name+'.png'),optimize=True)

social('有用嘅工具，有趣嘅遊戲。','學習資料 · 塔防遊戲 · 股票工具',[p['id'] for p in source['projects']],'home')
for cat,title,sub in [('games','遊戲','部署、升級，喺瀏覽器玩一場塔防。'),('websites','網站','學習資料與股票知識工具。'),('programs','程式','探索現有網站同遊戲。')]:
    social(title,sub,[p['id'] for p in source['projects'] if p['category']==cat],cat)
for p in source['projects']:
    social(p['title'][0],source['copy']['zh'][p['id']+'-lede'],[p['id']],p['id'])
print('Created three art-directed covers and seven social images from actual screenshots.')
