(function(){
  function spec(el,label){ if(!el) return; var cs=getComputedStyle(el); if(cs.position==='static') el.style.position='relative';
    var s=document.createElement('span'); s.className='spec'; s.setAttribute('aria-hidden','true');
    s.innerHTML='<span class="spec-l">'+label+'</span>'; el.appendChild(s); }
  spec(document.querySelector('#app .phone'),'אפליקציית העובד <span class="num">· 22:41</span>');
  spec(document.querySelector('#send .desk'),'מסך המנהל <span class="num">· 22:43</span>');
  var r=document.querySelectorAll('#quiet .results li'); if(r[0]) r[0].dataset.k='נסיעות משותפות'; if(r[1]) r[1].dataset.k='הרשמות כפולות';
  var f=document.getElementById('lead-form'); if(f){ var h=document.createElement('div'); h.className='tk-head';
    h.innerHTML='<b>בקשת הדגמה</b><span><i></i>SMARTKAV</span>'; f.insertBefore(h,f.firstChild); }
})();
