const buttons=[...document.querySelectorAll('.nav-link')];const technical=document.querySelector('#technical');const designing=document.querySelector('#designing');const eyebrow=document.querySelector('#eyebrow');const title=document.querySelector('#hero-title');const copy=document.querySelector('#hero-copy');const actions=document.querySelector('#hero-actions');
const tech={eyebrow:'TECHNICAL PROFILE',title:'Python, AI &<br><em>practical systems.</em>',copy:'Computer Science Engineering graduate with hands-on experience in Python development, AI-powered automation, web crawling, and technical problem solving.',actions:'<a class="button primary" href="https://github.com/MahiBalan2215" target="_blank" rel="noopener">GitHub ↗</a><a class="button secondary" href="https://www.linkedin.com/in/mahibalan-dev-ind" target="_blank" rel="noopener">LinkedIn ↗</a>'};
const design={eyebrow:'DESIGNING PROFILE',title:'Graphic design,<br><em>made with intent.</em>',copy:'Creative and detail-oriented Graphic Designer with hands-on experience in branding, print media, social media creatives, and digital marketing materials.',actions:'<a class="button primary" href="https://drive.google.com/drive/folders/196Y__ozQ0E2YM09bJdlGi2hDkuL4V2Xu?usp=sharing" target="_blank" rel="noopener">View Portfolio ↗</a><a class="button secondary" href="https://drive.google.com/drive/folders/1T9G5qevftHtCOeOOB5W3ALcjgqPYZPH?usp=drive_link" target="_blank" rel="noopener">View My Works ↗</a>'};
function switchProfile(name){const isTech=name==='technical';technical.classList.toggle('hidden',!isTech);designing.classList.toggle('hidden',isTech);buttons.forEach(b=>b.classList.toggle('active',b.dataset.profile===name));const d=isTech?tech:design;eyebrow.textContent=d.eyebrow;title.innerHTML=d.title;copy.textContent=d.copy;actions.innerHTML=d.actions;window.scrollTo({top:0,behavior:'smooth'})}buttons.forEach(b=>b.addEventListener('click',()=>switchProfile(b.dataset.profile)));

// Global portfolio page-view counter.
// Uses CountAPI's current no-auth endpoint so this static GitHub Pages site
// does not need to expose a CounterAPI authentication token.
(function initViewerCounter(){
  const badge=document.createElement('div');
  badge.className='viewer-counter';
  badge.setAttribute('aria-label','Portfolio page views');
  badge.innerHTML='<span class="viewer-dot"></span><span>VIEWS</span><strong id="viewer-count">—</strong>';
  document.body.appendChild(badge);

  const counterKey='mahibalan_my_page_portfolio_views';
  const counterUrl='https://countapi.mileshilliard.com/api/v1/hit/'+counterKey;

  fetch(counterUrl,{method:'GET',cache:'no-store'})
    .then(response=>{
      if(!response.ok) throw new Error('Counter request failed: '+response.status);
      return response.json();
    })
    .then(data=>{
      const value=Number(data?.value);
      if(!Number.isFinite(value)) throw new Error('Invalid counter response');
      document.getElementById('viewer-count').textContent=value.toLocaleString();
    })
    .catch(error=>{
      document.getElementById('viewer-count').textContent='—';
      console.warn('Viewer counter unavailable:',error);
    });
})();

// Visitor email notification (Google Apps Script backend).
(function initVisitorNotification(){
  // Paste your deployed Google Apps Script /exec URL here after deployment.
  // Keep this endpoint public; never put Gmail passwords or API secrets here.
  const endpoint='';

  if(!endpoint) return;

  try{
    const sessionKey='my_page_visitor_session';
    let sessionId=sessionStorage.getItem(sessionKey);
    if(!sessionId){
      sessionId=(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2));
      sessionStorage.setItem(sessionKey,sessionId);
    }

    const params=new URLSearchParams({
      page:location.href,
      path:location.pathname,
      referrer:document.referrer||'Direct',
      screen:window.screen.width+'x'+window.screen.height,
      viewport:window.innerWidth+'x'+window.innerHeight,
      session:sessionId,
      profile:document.querySelector('.nav-link.active')?.dataset.profile||'technical',
      timestamp:new Date().toISOString()
    });

    // GET beacon keeps this reliable on page load/unload without blocking the site.
    const beacon=new Image();
    beacon.referrerPolicy='no-referrer-when-downgrade';
    beacon.src=endpoint+'?'+params.toString();
  }catch(error){
    console.warn('Visitor notification unavailable:',error);
  }
})();
