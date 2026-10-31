"""The two additional pages, generated from the same bilingual source."""
import html


def intro(t, name):
    return '<section class="directory-intro utility-intro">'+t(name+'Title','h1')+t(name+'Intro','p')+'</section>'


def make_study(site,t,ext,resources):
    filters=''.join('<button type="button" data-subject="'+id+'" aria-pressed="'+str(id=='all').lower()+'">'+t(key)+'</button>' for id,key in [('all','studyAll'),('history','studyHistory'),('physics','studyPhysics'),('english','studyEnglish')])
    body=resources()
    for id in ['history','physics','english']:
        body=body.replace('<article class="resource-card">','<article class="resource-card subject-sheet" data-study-subject="'+id+'">',1)
        body=body.replace(t(id+'Description','p'),t(id+'Description','p')+t(id+'File','p','class="file-name"'))
    # Format labels remain meaningful when read outside their visual groups.
    body=body.replace('>PDF<span','>'+t('studyRead')+'<span').replace('>Word<span','>'+t('studyEdit')+'<span')
    return '<main id="main" tabindex="-1">'+intro(t,'study')+'<div class="study-margin">'+t('studyFormats','p','class="hand-note"')+'<span aria-hidden="true">↙</span></div><div class="subject-filters enhanced-only" role="group" data-i18n-label="studyFilter" aria-label="'+site['copy']['zh']['studyFilter']+'">'+filters+'</div>'+body+t('studyEmpty','p','class="study-empty" hidden role="status"')+t('studySource','p','class="source-note"')+'</main>'


def make_lab(site,t,ext,resources):
    zh=site['copy']['zh']
    def slider(key,id,min,max,value,step,unit):
        return '<label class="science-control" for="'+id+'"><span>'+t(key)+'<output for="'+id+'" id="'+id+'-value">'+str(value)+' '+unit+'</output></span><input type="range" id="'+id+'" min="'+str(min)+'" max="'+str(max)+'" value="'+str(value)+'" step="'+str(step)+'"></label>'
    def choose(key,id,options,selected):
        return '<label class="science-control" for="'+id+'">'+t(key)+'<select id="'+id+'">'+''.join('<option value="'+value+'" '+('selected' if value==selected else '')+' data-i18n="'+label+'">'+html.escape(zh[label])+'</option>' for value,label in options)+'</select></label>'
    options=[('air','labAir'),('water','labWater'),('glass','labGlass')]
    controls={
      'wave':slider('labFrequency','science-frequency',.2,2,1,.1,'Hz')+slider('labAmplitude','science-amplitude',.1,1,.4,.05,'m'),
      'gravity':slider('labSpeed','science-speed',5,25,15,1,'m/s')+slider('labLaunchAngle','science-angle',15,75,45,1,'°')+choose('labPlanet','science-planet',[('earth','labEarth'),('moon','labMoon'),('mars','labMars')],'earth'),
      'optics':slider('labIncident','science-incidence',0,80,40,1,'°')+choose('labMedium1','science-medium1',options,'air')+choose('labMedium2','science-medium2',options,'glass')}
    measurements={'wave':[('labWavelength','wavelength','1.00 m'),('labPeriod','period','1.00 s')], 'gravity':[('labRange','range','22.94 m'),('labFlight','flight','2.16 s'),('labHeight','height','5.73 m')], 'optics':[('labRefracted','refracted','25.37°'),('labCritical','critical',zh['labNoCritical'])]}
    static={
      'wave':'<path d="M90 400H1110M90 140V650" class="static-axis"/><path d="M90 400Q132 230 175 400T260 400T345 400T430 400T515 400T600 400T685 400T770 400T855 400T940 400T1025 400T1110 400" class="static-curve"/>',
      'gravity':'<path d="M90 650H1110M90 140V650" class="static-axis"/><path d="M90 650Q600 -40 1110 650" class="static-curve"/><circle cx="600" cy="305" r="13" class="static-dot"/>',
      'optics':'<path d="M0 400H1200M600 80V720" class="static-axis"/><path d="M330 80L600 400L742 700" class="static-curve"/><path d="M600 400L870 80" class="static-reflection"/>'}
    tabs='<div class="science-switch enhanced-only" role="group" data-i18n-label="labChoose" aria-label="'+zh['labChoose']+'">'+''.join('<button type="button" data-experiment="'+id+'" aria-pressed="'+str(id=='wave').lower()+'" aria-controls="experiment-'+id+'"><span aria-hidden="true">0'+str(i+1)+'</span>'+t('lab'+name)+'</button>' for i,(id,name) in enumerate([('wave','Wave'),('gravity','Gravity'),('optics','Optics')]))+'</div>'
    panels=''
    for id,name in [('wave','Wave'),('gravity','Gravity'),('optics','Optics')]:
        results=''.join('<div><dt>'+t(key)+'</dt><dd id="science-'+result+'">'+html.escape(value)+'</dd></div>' for key,result,value in measurements[id])
        static_svg='<svg class="science-static" viewBox="0 0 1200 800" role="img" data-i18n-label="labCanvas'+name+'" aria-label="'+zh['labCanvas'+name]+'">'+static[id]+'</svg>'
        panels+='<section class="experiment-panel" id="experiment-'+id+'" data-experiment-panel="'+id+'" aria-labelledby="heading-'+id+'"><header class="experiment-heading"><span class="ink-number">'+t('lab'+name+'ID')+'</span>'+t('lab'+name+'Title','h2','id="heading-'+id+'"')+t('lab'+name+'Intro','p')+'</header><div class="experiment-layout"><div class="experiment-figure"><div class="science-plot">'+static_svg+'<canvas class="science-canvas" id="canvas-'+id+'" width="1200" height="800" role="img" data-i18n-label="labCanvas'+name+'" aria-label="'+zh['labCanvas'+name]+'"></canvas></div>'+t('labDefault'+name,'p','class="science-default"')+'<p class="science-equation">'+t('lab'+name+'Formula')+'</p></div><div class="experiment-sidebar"><div class="science-inputs enhanced-only"><h3>'+t('labParameters')+'</h3>'+controls[id]+'</div><h3>'+t('labResults')+'</h3><dl class="science-measurements">'+results+'</dl></div></div>'+t('lab'+name+'Limit','p','class="model-note"')+'<aside class="observation-task">'+t('labTaskTitle','h3')+t('lab'+name+'Task','p')+'</aside>'+'</section>'
    toolbar='<div class="science-toolbar enhanced-only"><div class="science-run"><button type="button" id="science-play">'+t('labPlay')+'</button><button type="button" id="science-reset">'+t('labReset')+'</button></div><label class="flight-progress" hidden for="science-progress">'+t('labScrub')+'<input type="range" id="science-progress" min="0" max="100" value="0" step="0.1"><output id="science-progress-value" for="science-progress">0%</output></label><button type="button" id="science-export">'+t('labExport')+' ↓</button></div><div class="science-feedback enhanced-only"><p id="science-save-status" role="status"></p><p id="science-export-status" role="status"></p></div>'
    return '<main id="main" tabindex="-1">'+intro(t,'lab')+tabs+'<noscript>'+t('labNoJS','p','class="source-note"')+'</noscript>'+panels+toolbar+t('labPrivacy','p','class="source-note"')+'</main>'
