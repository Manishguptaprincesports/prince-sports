/* Prince Sports v3 — cart, search, filters, status */
var WA='919875647399';
var cart=[];
try{cart=JSON.parse(localStorage.getItem('ps_cart')||'[]')}catch(e){cart=[]}
function fmt(n){return '₹'+n.toLocaleString('en-IN')}
function saveCart(){localStorage.setItem('ps_cart',JSON.stringify(cart));renderCart();updateBadges()}
function cartCount(){return cart.reduce(function(a,i){return a+i.qty},0)}
function cartTotal(){return cart.reduce(function(a,i){return a+i.qty*i.price},0)}
function updateBadges(){var c=cartCount();var bs=document.querySelectorAll('.cart-badge');for(var j=0;j<bs.length;j++){bs[j].textContent=c;bs[j].classList.toggle('hidden',c===0)}}
function addToCart(pid,name,price){var f=null;for(var i=0;i<cart.length;i++){if(cart[i].pid===pid)f=cart[i]}
if(f){f.qty++}else{cart.push({pid:pid,name:name,price:price,qty:1})}
saveCart();toast(name+' added ✓')}
function changeQty(pid,d){var f=null;for(var i=0;i<cart.length;i++){if(cart[i].pid===pid)f=cart[i]}
if(!f)return;f.qty+=d;if(f.qty<1)cart=cart.filter(function(i){return i.pid!==pid});saveCart()}
function removeItem(pid){cart=cart.filter(function(i){return i.pid!==pid});saveCart()}
function renderCart(){var el=document.getElementById('cartItems');var tot=document.getElementById('cartTotal');if(!el)return;
if(!cart.length){el.innerHTML='<div class="cart-empty">🏀<br>Your cart is empty<br><span style="font-size:.85rem">Add some cricket gear!</span></div>';if(tot)tot.textContent=fmt(0);return}
var h='';for(var i=0;i<cart.length;i++){var it=cart[i];
h+='<div class="c-item"><div style="flex:1"><h4>'+it.name+'</h4><div class="cp">'+fmt(it.price)+' each</div><div class="qty"><button onclick="changeQty(\''+it.pid+'\',-1)">−</button><span>'+it.qty+'</span><button onclick="changeQty(\''+it.pid+'\',1)">+</button><button class="rm" onclick="removeItem(\''+it.pid+'\')">Remove</button></div></div><div style="font-weight:900">'+fmt(it.price*it.qty)+'</div></div>'}
el.innerHTML=h;if(tot)tot.textContent=fmt(cartTotal())}
function openCart(){document.getElementById('cartDrawer').classList.add('open');document.getElementById('cartOverlay').classList.add('open')}
function closeCart(){document.getElementById('cartDrawer').classList.remove('open');document.getElementById('cartOverlay').classList.remove('open')}
function sendWhatsAppOrder(){if(!cart.length){toast('Your cart is empty');return}
var lines=['*NEW ORDER — Prince Sports Website*',''];
for(var i=0;i<cart.length;i++){var it=cart[i];lines.push('• '+it.name+' x '+it.qty+' = '+fmt(it.price*it.qty))}
lines.push('');lines.push('*Total: '+fmt(cartTotal())+'*');lines.push('');lines.push('Please confirm availability. Thank you!');
window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank')}
var toastT=null;
function toast(m){var t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
t.textContent=m;t.classList.add('show');if(toastT)clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},2200)}
var activeCat='all';
function setFilter(c,btn){activeCat=c;var ch=document.querySelectorAll('.chip');for(var i=0;i<ch.length;i++)ch[i].classList.toggle('active',ch[i]===btn);applyFilters()}
function applyFilters(){var inp=document.getElementById('searchInput');var q=inp?inp.value.trim().toLowerCase():'';var n=0;
var cards=document.querySelectorAll('.card');
for(var i=0;i<cards.length;i++){var c=cards[i];
var ok=(activeCat==='all'||c.getAttribute('data-cat')===activeCat)&&(!q||(c.getAttribute('data-name')||'').toLowerCase().indexOf(q)>-1);
c.style.display=ok?'':'none';if(ok)n++}
var nr=document.getElementById('noResults');if(nr)nr.style.display=n?'none':'block'}
function setStatus(){var now=new Date();var d=now.getDay();var h=now.getHours()+now.getMinutes()/60;
var open=d>=1&&d<=6&&h>=10&&h<19.5;
var html=open?'<span class="open-tag">● OPEN NOW</span>':'<span class="closed-tag">● CLOSED NOW</span>';
var s1=document.getElementById('status');if(s1)s1.innerHTML=html;
var s2=document.getElementById('status2');if(s2)s2.innerHTML=html;
var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var trs=document.querySelectorAll('#hoursTable tr');
for(var i=0;i<trs.length;i++)trs[i].classList.toggle('today',trs[i].getAttribute('data-day')===days[d])}
document.addEventListener('DOMContentLoaded',function(){
renderCart();updateBadges();setStatus();setInterval(setStatus,60000);
var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
var hb=document.getElementById('hamburger');if(hb)hb.onclick=function(){document.getElementById('mobileMenu').classList.toggle('open')};
var mm=document.getElementById('mobileMenu');
if(mm){var links=mm.querySelectorAll('a');for(var i=0;i<links.length;i++)links[i].onclick=function(){mm.classList.remove('open')}}
var si=document.getElementById('searchInput');if(si)si.addEventListener('input',applyFilters);
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});var rv=document.querySelectorAll('.reveal');for(var k=0;k<rv.length;k++)io.observe(rv[k])}
else{var rv2=document.querySelectorAll('.reveal');for(var k2=0;k2<rv2.length;k2++)rv2[k2].classList.add('in')}
window.addEventListener('scroll',function(){var n=document.querySelector('.nav');if(n)n.classList.toggle('scrolled',window.scrollY>10)},{passive:true});
});