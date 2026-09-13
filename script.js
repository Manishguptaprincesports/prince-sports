const ham = document.getElementById('hamburger');
 const mm = document.getElementById('mobileMenu');
 ham.addEventListener('click', () => {
 const open = mm.classList.toggle('open');
 ham.setAttribute('aria-expanded', open);
 });
 mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
 mm.classList.remove('open'); ham.setAttribute('aria-expanded','false');
 }));
 document.getElementById('year').textContent = new Date().getFullYear();
 const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 function kolkataNow(){
 return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
 }
 function setStatus(){
 const now = kolkataNow();
 const d = now.getDay(); 
 const mins = now.getHours()*60 + now.getMinutes();
 const OPEN = 10*60, CLOSE = 19*60 + 30;
 const isOpen = d !== 0 && mins >= OPEN && mins < CLOSE;
 let msg, cls;
 if (isOpen){
 msg = 'Open now · closes 7:30 pm'; cls = 'open';
 } else if (d === 0){
 msg = 'Closed · opens Mon 10 am'; cls = 'closed';
 } else if (mins < OPEN){
 msg = 'Closed · opens 10 am today'; cls = 'closed';
 } else {
 msg = (d === 6 ? 'Closed · opens Mon 10 am' : 'Closed · opens 10 am tomorrow'); cls = 'closed';
 }
 const html = `<span class="dot"></span>${msg}`;
 [['status'],['status2']].forEach(([id]) => {
 const el = document.getElementById(id);
 if (el){ el.className = 'status '+cls; el.innerHTML = html; }
 });
 document.querySelectorAll('#hoursTable tr').forEach(tr => tr.classList.remove('today'));
 const row = document.querySelector('#hoursTable tr[data-day="'+days[d]+'"]');
 if (row) row.classList.add('today');
 }
 setStatus();
 setInterval(setStatus, 60000);
 const io = new IntersectionObserver((entries) => {
 entries.forEach((e, i) => {
 if (e.isIntersecting){
 e.target.style.transitionDelay = (i % 4 * 70) + 'ms';
 e.target.classList.add('visible');
 io.unobserve(e.target);
 }
 });
 }, {threshold:0.12});
 document.querySelectorAll('.reveal').forEach(el => io.observe(el));