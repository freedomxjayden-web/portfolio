"""Generate the nine static pages. Run with Python 3; no packages required."""
from pathlib import Path
import html
import json
import urllib.parse

ROOT = Path(__file__).resolve().parent.parent
site = json.loads((ROOT / 'data/site.json').read_text())
projects = site['projects']
copy = site['copy']
zh, en = copy['zh'], copy['en']
VERSION = site['version']
BASE = site['base_url']
categories = {'all': ('categoryAll', 'index.html'), 'games': ('categoryGames', 'categories/games.html'), 'websites': ('categoryWebsites', 'categories/websites.html'), 'programs': ('categoryPrograms', 'categories/programs.html')}

def t(key, tag='span', attrs=''):
    return f'<{tag} data-i18n="{key}" {attrs}>{html.escape(zh[key])}</{tag}>'

def icon(id, cls='project-icon'):
    return f'<img class="{cls}" src="{{prefix}}assets/{id}-icon.svg" width="48" height="48" alt="" aria-hidden="true">'

def ext(url, key, cls='text-link'):
    return f'<a class="{cls}" href="{html.escape(url, quote=True)}" target="_blank" rel="noopener noreferrer">{t(key)}<span aria-hidden="true">↗</span>{t("newTab",attrs="class=\"sr-only\"")}</a>'

def count(category):
    return sum(category == 'all' or p['category'] == category for p in projects)

def category_nav(active='all'):
    return '<nav class="category-nav" data-i18n-label="categoryNavLabel" aria-label="'+zh['categoryNavLabel']+'">'+''.join(f'<a href="{{prefix}}{path}" '+('aria-current="page"' if key == active else '')+'>'+t(label)+f'<span class="category-count">{count(key)}</span></a>' for key,(label,path) in categories.items() if key != 'programs' or active == 'programs')+'</nav>'

def primary_links(page, cls='header-nav'):
    links = [('home','index.html#work','navWork'),('lab','lab.html','navLab'),('study','study.html','navStudy')]
    return '<nav class="'+cls+'" aria-label="'+zh['navLabel']+'">'+''.join('<a href="{prefix}'+url+'" '+('aria-current="page"' if page==id else '')+'>'+t(key)+'</a>' for id,url,key in links)+'</nav>'

def header(page):
    grouped = ''
    for cat in ['games','websites']:
        label, path = categories[cat]
        grouped += '<section class="nav-category"><h3><a class="nav-category-link" href="{prefix}'+path+'" '+('aria-current="page"' if page == cat else '')+'>'+t(label)+f'<span class="category-count">{count(cat)}</span></a></h3>'
        grouped += ''.join(f'<a class="nav-project" href="{{prefix}}projects/{p["id"]}.html" '+('aria-current="page"' if p['id'] == page else '')+'>'+icon(p['id'],'nav-icon')+'<span>'+t(p['id']+'-title','strong')+t(p['id']+'-menu')+'</span></a>' for p in projects if p['category']==cat)
        if not count(cat): grouped += t('noPrograms','p','class="empty-category"')
        grouped += '</section>'
    return f'''<a class="skip-link" href="#main">{t('skip')}</a><div class="page-shell"><header class="site-header"><a class="brand" href="{{prefix}}index.html#home">{t('portfolio')}</a>{primary_links(page)}<div class="header-tools"><div class="language-switch" role="group" data-i18n-label="language" aria-label="{zh['language']}"><button type="button" data-lang="zh" lang="zh-HK" aria-pressed="true">繁中</button><span aria-hidden="true">/</span><button type="button" data-lang="en" lang="en" aria-pressed="false">EN</button></div><button class="menu-button" type="button" aria-expanded="false" aria-controls="navigation-panel" data-i18n-label="menuOpen" aria-label="{zh['menuOpen']}"><span class="menu-icon" aria-hidden="true"><i></i><i></i><i></i></span></button></div></header><dialog id="navigation-panel" class="navigation-dialog" aria-labelledby="navigation-title"><div class="drawer-header">{t('menuTitle','h2','id="navigation-title"')}<button class="close-navigation" type="button" data-i18n-label="menuClose" aria-label="{zh['menuClose']}"><span aria-hidden="true">×</span></button></div>{t('menuIntro','p','class="navigation-intro"')}<nav id="primary-nav" class="main-nav" data-i18n-label="navLabel" aria-label="{zh['navLabel']}">{primary_links(page,"drawer-primary")}<a class="directory-link" href="{{prefix}}index.html#work">{t('directoryTitle')}<span class="category-count">{len(projects)}</span></a>{grouped}<div class="drawer-contacts">{ext('https://www.instagram.com/freedomgunvdbeb/','instagram')}{ext('https://github.com/freedomxjayden-web','github')}</div></nav></dialog><noscript><nav class="static-navigation" aria-label="作品分類">{primary_links(page,"drawer-primary")}<a class="directory-link" href="{{prefix}}index.html#work">{zh['directoryTitle']}</a>{grouped}</nav></noscript>'''

def visual(p, shot=None, large=False, priority=False):
    shot = shot or p['screenshots'][0]
    display = shot if large else p['cover']
    name, full = display['image'], shot['image']
    stem = name.removesuffix('.png')
    image = f'<picture><source type="image/webp" srcset="{{prefix}}assets/{stem}.webp"><img class="site-preview" src="{{prefix}}assets/{name}" data-full="{{prefix}}assets/{full}" data-full-alt-key="{shot["alt"]}" data-full-width="{shot["size"][0]}" data-full-height="{shot["size"][1]}" width="{display["size"][0]}" height="{display["size"][1]}" data-i18n-alt="{display["alt"]}" alt="{html.escape(zh[display["alt"]], quote=True)}" '+('fetchpriority="high"' if priority else 'loading="lazy"')+'></picture>'
    return f'<div class="project-visual {p["kind"]}-visual"><a class="image-link" href="{{prefix}}assets/{full}" target="_blank" rel="noopener noreferrer" data-preview="{p["id"]}" aria-label="{zh["previewPrefix"]+p["title"][0]}">{image}</a></div>'


def rows(category):
    ordered = [next(p for p in projects if p['id'] == id) for id in site['home_order']]
    selected = ordered if category == 'all' else [p for p in ordered if p['category'] == category]
    result = ''
    for index, p in enumerate(selected):
        id = p['id']
        # Copy precedes the image in the DOM, preserving the mobile reading order.
        copy = f'<div class="project-copy"><p class="project-category">{t(id+"-category")}</p><h3 id="{id}-title"><a href="{{prefix}}projects/{id}.html" data-project-title data-i18n="{id}-title">{zh[id+"-title"]}</a></h3>{t(id+"-lede","p","class=\"project-lede\"")}{t('statusExternal' if p['status']=='external' else 'statusAvailable','p','class=\"project-status\"')}<div class="project-actions">{ext("{prefix}study.html" if id=="cloud-drive" else p["url"],id+"-cta","primary-button")}<a class="case-link" href="{{prefix}}projects/{id}.html">{t("caseLink")}</a></div></div>'
        figure = f'<figure class="project-image">{visual(p,priority=index==0)}<figcaption>{t("actualPreview")}</figcaption></figure>'
        handle = '<button class="paper-handle" type="button" data-i18n-label="dragPaper" aria-label="'+zh['dragPaper']+'"><span aria-hidden="true">⠿</span></button>' if category=='all' else ''
        note_key = {'game':'gameNote','study':'cloudNote','stock':'stockNote'}[p['kind']]
        note = t(note_key,'p','class="paper-note"')
        result += f'<article id="{id}" class="project-card {p["kind"]}-project" aria-labelledby="{id}-title">{handle}{copy}{figure}{note}</article>'
    return result


def bottom():
    tech = ''.join(f'<a href="{url}">{label}</a>' for label,url in [('HTML','https://github.com/freedomxjayden-web/portfolio'),('CSS','https://github.com/freedomxjayden-web/portfolio'),('JavaScript','{prefix}projects/stock-atlas.html#implementation'),('GitHub Pages','https://github.com/freedomxjayden-web/portfolio'),('Cloudflare Workers','{prefix}projects/stock-atlas.html#implementation')])
    logs = ''
    for n,date,url in [(5,'2026-10-27','#work'),(4,'2026-10-27','https://github.com/freedomxjayden-web/portfolio/commit/8ca27b4'),(3,'2026-10-26','https://github.com/freedomxjayden-web/portfolio/commit/1abc831'),(2,'2026-10-26','https://github.com/freedomxjayden-web/portfolio/compare/5909746...095606d'),(1,'2026-10-25','https://github.com/freedomxjayden-web/portfolio/commit/5909746')]:
        logs += f'<li><time datetime="{date}">{date}</time><div>{t("log"+str(n)+"Title","h3")}{t("log"+str(n)+"Text","p")}<a class="text-link" href="{url}">{t("log"+str(n)+"Link")}<span aria-hidden="true">→</span></a></div></li>'
    return f'''<section id="technology" class="technology-line" aria-labelledby="tech-title">{t('techTitle','h2','id="tech-title"')}<div>{tech}</div></section><details id="journal" class="journal-disclosure"><summary>{t('journalTitle')}<span class="disclosure-icon" aria-hidden="true">+</span></summary><ol class="journal-list">{logs}</ol></details><div class="directory-bottom"><section id="about" aria-labelledby="about-title">{t('navAbout','h2','id="about-title"')}{t('aboutText','p')}</section><section id="contact" aria-labelledby="contact-title">{t('contactTitle','h2','id="contact-title"')}<div class="contact-options">{ext('https://www.instagram.com/freedomgunvdbeb/','instagram')}{ext('https://github.com/freedomxjayden-web','github')}</div></section></div>'''

def resources():
    cards = ''
    for id, stem in [('history','中國近代史學習資料'),('physics','初三物理重點溫習_20頁詳細版'),('english','英文學習資料_中英對照')]:
        links = ''.join(f'<a href="{html.escape(next(url for url in site["files"] if urllib.parse.unquote(url).endswith(stem+"."+extension)),quote=True)}" target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span>{t("newTab",attrs="class=\"sr-only\"")}</a>' for extension,label in [('pdf',t('studyRead')),('docx',t('studyEdit'))])
        docs = [d for d in site['study_documents'] if d['subject']==id]
        metadata = '<p class="file-metadata">'+t('filePages')+': '+str(next(d['pages'] for d in docs if d['format']=='pdf'))+' · '+t('fileSize')+': '+', '.join(('PDF' if d['format']=='pdf' else 'Word')+' '+(f"{d['bytes']/1048576:.1f} MiB" if d['bytes']>=1048576 else f"{d['bytes']/1024:.0f} KiB") for d in docs)+'</p>'
        cards += f'<article class="resource-card">{t(id+"Title","h3")}{t(id+"Description","p")}{t("studyUnknown","p","class=\"file-metadata\"")}<div class="resource-actions" role="group" data-i18n-label="{id}Formats" aria-label="{zh[id+"Formats"]}">{links}</div>{metadata}{t("studyFailure","p","class=\"file-help\"")}</article>'
    return f'<section id="resources" class="resources-section" aria-labelledby="resources-title"><div class="section-heading">{t("resourcesTitle","h2","id=\"resources-title\"")}{t("resourcesDescription","p","class=\"section-description\"")}{t("fileDownloadNote","p","class=\"file-help\"")}</div><div class="resources-grid">{cards}</div><div class="all-files">{t("allFilesDescription","p")}{ext("https://alist-free-drive.onrender.com/GoogleDrive/study","allFiles")}</div></section>'

def new_page_links():
    return '<section class="beyond-desk" aria-labelledby="beyond-title">'+t('moreTitle','h2','id="beyond-title"')+'<div class="beyond-links"><a href="{prefix}lab.html"><span class="ink-number" aria-hidden="true">01 /</span>'+t('labTitle','h3')+t('labTeaser','p')+t('openLab','span','class="text-link"')+'<span aria-hidden="true"> ↗</span></a><a href="{prefix}study.html"><span class="ink-number" aria-hidden="true">02 /</span>'+t('studyTitle','h3')+t('studyTeaser','p')+t('openStudy','span','class="text-link"')+'<span aria-hidden="true"> ↗</span></a></div></section>'

def dialogs():
    return f'''<dialog class="preview-dialog" aria-labelledby="preview-title"><div class="dialog-header"><div>{t('actualPreview','p','class="eyebrow"')}<h2 id="preview-title"></h2></div><button class="close-preview" type="button" autofocus>{t('closePreview')}<span aria-hidden="true">×</span></button></div><div class="dialog-image-wrap"><img id="preview-image" alt="" width="1280" height="800"></div><div class="dialog-bottom">{t('screenshotNote','p','class="dialog-note"')}<a class="primary-button preview-open-project" href="https://alist-free-drive.onrender.com/GoogleDrive/study" target="_blank" rel="noopener noreferrer">{t('openProject')}<span aria-hidden="true">↗</span>{t('newTab',attrs='class="sr-only"')}</a></div></dialog>'''

pages = {}
def write_page(path, page, main, titles, descriptions, share):
    prefix = '../' if '/' in path else ''
    pages[page] = {lang: {'pageTitle':titles[i], 'pageDescription':descriptions[i], 'pageImageAlt':titles[i]} for i,lang in enumerate(['zh','en'])}
    meta = pages[page]['zh']
    url = BASE + ('' if path=='index.html' else path)
    head = f'''<!doctype html><html lang="zh-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(meta['pageTitle'])}</title><meta name="description" content="{html.escape(meta['pageDescription'],quote=True)}"><meta name="theme-color" content="#f1f5f7"><link rel="canonical" href="{url}"><meta property="og:title" content="{html.escape(meta['pageTitle'],quote=True)}"><meta property="og:description" content="{html.escape(meta['pageDescription'],quote=True)}"><meta property="og:type" content="website"><meta property="og:url" content="{url}"><meta property="og:image" content="{BASE}assets/share-{share}.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{html.escape(meta['pageTitle'],quote=True)}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="{{prefix}}favicon.svg?v={VERSION}" type="image/svg+xml"><link rel="stylesheet" href="{{prefix}}styles.css?v={VERSION}"><script src="{{prefix}}content.js?v={VERSION}" defer></script><script src="{{prefix}}script.js?v={VERSION}" defer></script></head><body id="top" data-page="{page}">'''
    footer = f'<footer class="site-footer"><span>© <span id="year">2026</span></span>{t("footerLine",attrs="class=\"footer-line\"")}<a href="#top" class="back-top">{t("backTop")}<span aria-hidden="true">↑</span></a></footer></div></body></html>'
    module = 'desk.js' if page=='home' else 'lab.js' if page=='lab' else 'study.js' if page=='study' else None
    if module:
        head = head.replace('</head>',f'<script src="{{prefix}}{module}?v={VERSION}" defer></script></head>')
    document = (head + header(page) + main + dialogs() + footer).replace('{prefix}',prefix).replace('><','>\n<')+'\n'
    destination = ROOT/path
    destination.parent.mkdir(parents=True,exist_ok=True)
    destination.write_text(document)

for category,(label,path) in categories.items():
    home = category=='all'
    title = 'heroTitle' if home else label
    description = 'heroDescription' if home else category+'Description'
    crumbs = '' if home else f'<nav class="breadcrumbs" data-i18n-label="navLabel" aria-label="{zh["navLabel"]}"><a href="{{prefix}}index.html">{t("directoryTitle")}</a><span aria-hidden="true">/</span>{t(label)}</nav>'
    intro = f'<section id="home" class="directory-intro {"home-intro" if home else "category-intro"}" aria-labelledby="intro-title">{t(title,"h1","id=\"intro-title\"")}{t(description,"p")}</section>'
    body = f'<main id="main" tabindex="-1">{crumbs}{intro}{category_nav(category)}<section id="work" class="work-section" aria-labelledby="work-title">{t("collectionTitle" if home else label,"h2","id=\"work-title\" class=\"sr-only\"")}<div class="{'projects-list desk-board' if home else 'projects-list index-list'}">{rows(category)}</div>'
    if home:
        controls = '<div class="desk-caption"><span class="ink-number">'+t('deskLabel')+'</span>'+t('deskHint','span','class="desk-hint"')+'<button class="desk-reset" type="button">'+t('deskReset')+' ↺</button></div>'
        body=body.replace('<div class="projects-list desk-board">',controls+'<div class="projects-list desk-board">')
    if category=='programs':
        body = body.replace('<div class="projects-list"></div>', '')
        body += f'<div class="empty-state"><span class="empty-symbol" aria-hidden="true">&#123; &#125;</span>{t("emptyTitle","h2")}{t("emptyText","p")}<a class="primary-button" href="{{prefix}}index.html#work">{t("browseAll")}<span aria-hidden="true">→</span></a></div>'
    else:
        study_link = '<a class="text-link" '+('id="resources" ' if home else '')+'href="{prefix}study.html">'+t('studyLink')+'<span aria-hidden="true">→</span></a>' if home or category=='websites' else ''
        body += f'<div class="work-footnote">{study_link}</div>'
    body += (new_page_links()+bottom() if home else '<div class="category-outro"><a class="text-link" href="{prefix}index.html#work">'+t('browseAll')+'<span aria-hidden="true">→</span></a></div>' if category!='programs' else '')+'</section></main>'
    titles = ['作品與實驗 | 作品中心','Projects & experiments | Project Collection'] if home else [zh[label]+' | 作品中心',en[label]+' | Project Collection']
    write_page(path,'home' if home else category,body,titles,[zh[description],en[description]],'home' if home else category)

for p in projects:
    id = p['id'];cat = p['category'];label,catpath = categories[cat]
    crumbs = f'<nav class="breadcrumbs" data-i18n-label="navLabel" aria-label="{zh["navLabel"]}"><a href="{{prefix}}index.html#work">{t("directoryTitle")}</a><span aria-hidden="true">/</span><a href="{{prefix}}{catpath}">{t(label)}</a><span aria-hidden="true">/</span>{t(id+"-title")}</nav>'
    switches = '<nav class="project-nav" data-i18n-label="projectNavLabel" aria-label="'+zh['projectNavLabel']+'">'+''.join(f'<a href="{other["id"]}.html" '+('aria-current="page"' if other['id']==id else '')+'>'+t(other['id']+'-title')+'</a>' for other in projects)+'</nav>'
    figure = f'<figure class="case-figure">{visual(p,large=True,priority=True)}<figcaption>{t("actualPreview")}<span>{t("screenshotDate")} <time datetime="{p["date"]}">{p["date"]}</time></span></figcaption></figure>'
    hero = f'<header class="project-hero"><div class="project-introduction"><div class="hero-heading"><div class="project-identity"><span data-project-title data-i18n="{id}-title">{zh[id+"-title"]}</span></div>{t(id+"-headline","h1","id=\"case-title\"")}</div><div class="hero-summary">{t(id+"-purpose","p","class=\"case-purpose\"")}<div class="case-hero-actions">{ext("{prefix}study.html" if id=="cloud-drive" else p["url"],id+"-cta","primary-button")}{ext(p["url"]+"#/analysis","stockAnalysis") if id=="stock-atlas" else ""}</div></div></div>{figure}</header>'
    guide = '<div class="project-guide"><section class="guide-block">'+t('featuresTitle','h2')+'<ul class="feature-list">'+''.join(t(id+'-features'+str(i),'li') for i in range(3))+'</ul></section><section class="guide-block">'+t('usageTitle','h2')+'<ol class="usage-list">'+''.join(t(id+'-use'+str(i),'li') for i in range(3))+'</ol></section></div>'
    extra = resources()+'<a class="text-link study-directory-link" href="{prefix}study.html">'+t('openStudy')+' ↗</a>' if id=='cloud-drive' else ''
    if id=='stock-atlas':
        shot = p['screenshots'][1]
        extra = f'<section class="analysis-section">{t("analysisView","h2")}<figure class="case-figure">{visual(p,shot=shot,large=True)}<figcaption>{t("actualPreview")}<time datetime="{shot["date"]}">{shot["date"]}</time></figcaption></figure></section>'
    details = '<details id="implementation" class="implementation-disclosure"><summary>'+t('detailsTitle')+'<span class="disclosure-icon" aria-hidden="true">+</span></summary><div class="implementation-content"><section class="case-block">'+t('buildTitle','h2')+''.join(t(id+'-build'+str(i),'p') for i in range(len(p['case']['build'])))+'</section><section class="case-block">'+t('proofTitle','h2')+''.join(t(id+'-proof'+str(i),'p') for i in range(len(p['case']['proof'])))+t('sourceLabel','h3','class="source-heading"')+'<div class="source-links">'+''.join(ext(src[2],id+'-source'+str(i)) for i,src in enumerate(p['case']['sources']))+'</div></section></div></details>'
    outro = f'<nav class="case-return"><a class="text-link" href="{{prefix}}{catpath}">{t("backCategory")}</a></nav>'
    evidence = '<section class="case-evidence">'+t('caseVersion','h2')+t(id+'-evidence','p')+'<p>'+t('statusDate')+' <time datetime="'+p['checked_at']+'">'+p['checked_at']+'</time> · '+t('caseLocal')+'</p>'+'</section>'
    body = f'<main id="main" tabindex="-1"><div class="project-page-top">{crumbs}{switches}</div><article id="{id}" class="project-page" aria-labelledby="case-title">{hero}{evidence}{guide}{extra}{details}{outro}</article></main>'
    write_page('projects/'+id+'.html',id,body,[p['title'][0]+' | 作品中心',p['title'][1]+' | Project Collection'],p['case']['purpose'],id)

from pages_v15 import make_lab, make_study
for id, factory in [('lab', make_lab), ('study', make_study)]:
    title_key, intro_key = id+'Title', id+'Intro'
    write_page(id+'.html',id,factory(site,t,ext,resources),[zh[title_key]+' | 作品中心',en[title_key]+' | Project Collection'],[zh[intro_key],en[intro_key]],id)

# Ship only strings referenced by generated HTML, keeping the browser payload small.
import re
keys = set()
for path in list(ROOT.glob('*.html')) + list((ROOT/'projects').glob('*.html')) + list((ROOT/'categories').glob('*.html')):
    keys.update(re.findall(r'data-i18n(?:-label|-alt)?="([^"]+)"',path.read_text()))
keys.add('previewPrefix')
keys.update(key for key in zh if key.startswith('lab'))
keys.update(shot['alt'] for p in projects for shot in p['screenshots'])
browser_copy = {lang:{key:copy[lang][key] for key in sorted(keys)} for lang in ['zh','en']}
(ROOT/'content.js').write_text('window.portfolioContent = '+json.dumps({'common':browser_copy,'pages':pages,'lab':site['lab']},ensure_ascii=False,separators=(',',':'))+';\n')
paths = ['index.html','lab.html','study.html']+[v[1] for k,v in categories.items() if k!='all']+['projects/'+p['id']+'.html' for p in projects]
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+BASE+('' if path=='index.html' else path)+'</loc><lastmod>'+site['updated']+'</lastmod></url>' for path in paths)+'</urlset>\n')
print('Built 9 static pages, shared translations and sitemap.')
