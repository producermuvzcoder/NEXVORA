'use strict';

// 1. PROFESSIONAL CURSOR
if(window.matchMedia('(hover:hover)').matches){
  const cur=document.getElementById('cursor'), ring=document.getElementById('cursor-ring');
  if(cur&&ring){
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=`${mx}px`;cur.style.top=`${my}px`;},{passive:true});
    const moveRing = () => { rx+=(mx-rx)*.15; ry+=(my-ry)*.15; ring.style.left=`${rx}px`; ring.style.top=`${ry}px`; requestAnimationFrame(moveRing); };
    moveRing();
  }
}

// 2. SCROLL REVEAL & COUNTERS
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); 
    if(e.target.dataset.count){ animateCount(e.target); }
  }});
},{threshold:.1});
document.querySelectorAll('.reveal, .stat-number').forEach(el=>revealObs.observe(el));

function animateCount(el){
  const target=+el.dataset.count, suffix=el.dataset.suffix||'', dur=2000;
  let start=null;
  function step(ts){ if(!start)start=ts; const p=Math.min((ts-start)/dur,1); el.textContent=Math.floor(p*target)+suffix; if(p<1)requestAnimationFrame(step); }
  requestAnimationFrame(step);
}

// 3. TYPING EFFECT
const typeEl=document.getElementById('typeText');
if(typeEl){
  const texts=['Web Applications','E-Commerce Stores','Business Websites'];
  let ti=0,ci=0,del=false;
  function tick(){
    const t=texts[ti]; typeEl.textContent=del?t.slice(0,--ci):t.slice(0,++ci);
    if(!del&&ci===t.length){setTimeout(()=>del=true,2000);return;}
    if(del&&ci===0){del=false;ti=(ti+1)%texts.length;setTimeout(tick,350);return;}
    setTimeout(tick,del?40:80);
  }
  tick();
}

// 4. ADMIN DB
window.NexvoraDB = {
  KEY: 'nexvora_leads_v1',
  save(record) {
    const all = this.getAll();
    record.id = record.id || ('NX-' + Date.now());
    record.timestamp = record.timestamp || new Date().toLocaleString();
    record.read = (typeof record.read === 'boolean') ? record.read : false;
    all.unshift(record);
    localStorage.setItem(this.KEY, JSON.stringify(all));
    return true;
  },
  getAll() { try { return JSON.parse(localStorage.getItem(this.KEY)||'[]'); } catch { return []; } }
};

async function maybeSendTelegramLead(record){
  const token = (localStorage.getItem('nxv_tg')||'').trim();
  const chatId = (localStorage.getItem('nxv_chat')||'').trim();
  if(!token || !chatId) return;
  try{
    const lines = [
      '📩 New NEXVORA Lead',
      '',
      `Type: ${record.type || 'Contact Form'}`,
      `Name: ${record.name || '—'}`,
      `Email: ${record.email || '—'}`,
      `Service: ${record.service || '—'}`,
      '',
      (record.message || '').trim() ? `Message: ${record.message}` : ''
    ].filter(Boolean);
    const text = lines.join('\n');
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:chatId,text})
    });
  }catch{
    // ignore telegram failures (site should still submit)
  }
}

// 5. NETLIFY FORM HANDLING
const cForm = document.getElementById('contactForm');
if(cForm){
  cForm.addEventListener('submit', function(e){
    e.preventDefault();
    const btn = document.getElementById('contactBtn');
    const formData = new FormData(cForm);

    btn.innerHTML = '<span class="loader"></span> Sending...';
    btn.disabled = true;

    const record = {
      type: 'Contact Form',
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      service: formData.get('service'),
      budget: formData.get('budget') || '',
      message: formData.get('message')
    };

    // Save Local (for admin.html dashboard on THIS device/browser)
    let savedOk = false;
    try{ savedOk = NexvoraDB.save(record); }catch{ savedOk = false; }

    // Optional Telegram notification (configured in admin.html Setup)
    maybeSendTelegramLead(record);

    // Send Netlify
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
    .then(() => {
      cForm.style.display='none';
      document.getElementById('contactSuccess').style.display='block';
    })
    .catch(() => {
      btn.innerHTML = savedOk ? 'Sent locally. Network error.' : 'Error. Try again.';
      btn.disabled=false;
    });
  });
}