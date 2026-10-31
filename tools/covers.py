"""Use real screenshot crops with no frames, backgrounds, shadows or collage.

Optional authoring dependency: Pillow. Originals are never modified.
Cover sizes and the share-card project order are declared in data/site.json.
"""
from pathlib import Path
import json
import math
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'assets'
site = json.loads((ROOT / 'data/site.json').read_text())
# Crop coordinates refer to the preserved, original captures.
crops = {
    'cat-outpost': ('cat-outpost-v14.png', (0, 55, 1280, 800)),
    'cloud-drive': ('cloud-drive-files.png', None),
    'stock-atlas': ('stock-atlas-v11.png', (242, 78, 1280, 800)),
}
for project in site['projects']:
    source, bounds = crops[project['id']]
    cover = Image.open(ASSETS / source).convert('RGB')
    if bounds:
        cover = cover.crop(bounds)
    if cover.size != tuple(project['cover']['size']):
        raise ValueError(project['id'] + ': cover dimensions differ from data/site.json')
    cover.save(ASSETS / project['cover']['image'], optimize=True)
    cover.save(ASSETS / (project['id'] + '-cover.webp'), quality=92, method=6)

HAND = next(Path('/System/Library/AssetsV2').glob('com_apple_MobileAsset_Font*/*/AssetData/LingWaiTC-Medium.otf'), None)
SERIF = '/System/Library/Fonts/Supplemental/Songti.ttc'
SANS = '/System/Library/Fonts/STHeiti Medium.ttc'


def font(size, serif=False):
    if serif and HAND:
        return ImageFont.truetype(str(HAND), size)
    return ImageFont.truetype(SERIF, size, index=7) if serif else ImageFont.truetype(SANS, size)


def social(title, description, ids, name):
    canvas = Image.new('RGB', (1200, 630), '#f1f5f7')
    draw = ImageDraw.Draw(canvas)
    draw.text((48, 28), '作品中心 / PROJECT COLLECTION', font=font(18), fill='#5e6c76')
    draw.line((48, 72, 1152, 72), fill='#19262e', width=1)
    draw.text((48, 104), title, font=font(60, serif=True), fill='#19262e')
    # Display the real featured screenshot; accompanying projects appear as text.
    line, y = '', 180
    for character in description:
        if draw.textlength(line + character, font=font(21)) > 1104:
            draw.text((48, y), line, font=font(21), fill='#5e6c76'); line, y = '', y + 28
        line += character
    draw.text((48, y), line, font=font(21), fill='#5e6c76')
    if ids:
        cover = Image.open(ASSETS / (ids[0] + '-cover.png'))
        cover.thumbnail((660 if len(ids) > 1 else 1104, 320), Image.Resampling.LANCZOS)
        canvas.paste(cover, (48, 240))
        if len(ids) > 1:
            draw.text((720, 264), site['copy']['zh'][ids[0] + '-title'], font=font(46, serif=True), fill='#19262e')
            lede = site['copy']['zh'][ids[0] + '-lede']
            line, y = '', 330
            for character in lede:
                if draw.textlength(line + character, font=font(21)) > 416:
                    draw.text((720, y), line, font=font(21), fill='#5e6c76')
                    line, y = '', y + 32
                line += character
            draw.text((720, y), line, font=font(21), fill='#5e6c76')
            names = [site['copy']['zh'][id + '-title'] for id in ids[1:]]
            draw.text((720, 478), ' / '.join(names), font=font(21), fill='#5e6c76')
    elif name == 'lab':
        draw.rectangle((48, 242, 1152, 558), fill='#f8fbfd', outline='#c5d5e0')
        for x in range(72, 1140, 36):
            draw.line((x, 260, x, 540), fill='#dee8ef')
        for y in range(260, 541, 35):
            draw.line((72, y, 1130, y), fill='#dee8ef')
        points=[(x, 402 - 80*math.sin((x-72)/180*math.tau)) for x in range(72, 1130)]
        draw.line(points, fill='#285e91', width=4)
        draw.text((80, 266), 'f = 1 Hz     c = 1 m/s     λ = 1 m', font=font(20), fill='#285e91')
    elif name == 'study':
        for i,key in enumerate(['historyTitle','physicsTitle','englishTitle']):
            y=260+i*94
            draw.line((48,y-12,1152,y-12),fill='#c5d5e0')
            draw.text((60,y),site['copy']['zh'][key],font=font(34,serif=True),fill='#19262e')
            draw.text((850,y+8),'PDF / Word  ↗',font=font(22),fill='#285e91')
    else:
        draw.text((48, 280), site['copy']['zh']['emptyTitle'], font=font(32, serif=True), fill='#5e6c76')
    draw.text((48, 588), 'freedomxjayden-web.github.io/portfolio', font=font(17), fill='#5e6c76')
    canvas.save(ASSETS / ('share-' + name + '.png'), optimize=True)


social(site['copy']['zh']['heroTitle'], site['copy']['zh']['heroDescription'], site['home_order'], 'home')
for category, label in [('games','categoryGames'), ('websites','categoryWebsites'), ('programs','categoryPrograms')]:
    ids = [id for id in site['home_order'] if next(p for p in site['projects'] if p['id'] == id)['category'] == category]
    social(site['copy']['zh'][label], site['copy']['zh'][category + 'Description'], ids, category)
for project in site['projects']:
    social(project['title'][0], site['copy']['zh'][project['id'] + '-lede'], [project['id']], project['id'])
social(site['copy']['zh']['labTitle'],site['copy']['zh']['labIntro'],[], 'lab')
social(site['copy']['zh']['studyTitle'],site['copy']['zh']['studyIntro'],[], 'study')
print('Created three screenshot covers and nine cool-toned share images.')
