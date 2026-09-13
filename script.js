// ===== CART SYSTEM =====
const WHATSAPP_NUMBER = '919875647399';

let cart = JSON.parse(localStorage.getItem('ps_cart') || '[]');

function saveCart(){ localStorage.setItem('ps_cart', JSON.stringify(cart)); }

function addToCart(id, name, price){
  const existing = cart.find(i => i.id === id);
  if(existing){ existing.qty++; }
  else { cart.push({id, name, price, qty:1}); }
  saveCart();
  updateCartUI();
  // Button feedback
  const btn = document.querySelector('[data-pid="'+id+'"]');
  if(btn){
    btn.classList.add('added');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:15px;height:15px"><polyline points="20 6 9 17 4 12"/></svg> Added!';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg> Add to Cart';
    }, 1200);
  }
  // Open cart drawer briefly
  openCart();
}

function changeQty(id, delta){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ cart = cart.filter(i => i.id !== id); }
  saveCart();
  updateCartUI();
}

function removeItem(id){
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function getTotal(){
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getItemCount(){
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function formatPrice(n){
  return '₹' + n.toLocaleString('en-IN');
}

function updateCartUI(){
  const badge = document.getElementById('cartBadge');
  const count = getItemCount();
  if(count > 0){ badge.textContent = count; badge.classList.remove('hidden'); }
  else { badge.classList.add('hidden'); }

  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const orderBtn = document.getElementById('orderBtn');

  if(cart.length === 0){
    itemsEl.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><p>Your cart is empty.<br>Add products to place an order.</p></div>';
    totalEl.textContent = formatPrice(0);
    orderBtn.style.opacity = '.5';
    orderBtn.style.pointerEvents = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="ci-name">${i.name}</div>
      <div class="qty">
        <button onclick="changeQty('${i.id}', -1)">−</button>
        <span>${i.qty}</span>
        <button onclick="changeQty('${i.id}', 1)">+</button>
      </div>
      <div class="ci-price">${formatPrice(i.price * i.qty)}</div>
    </div>
  `).join('');

  totalEl.textContent = formatPrice(getTotal());
  orderBtn.style.opacity = '1';
  orderBtn.style.pointerEvents = 'auto';
}

function openCart(){
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart(){
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

function sendWhatsAppOrder(){
  if(cart.length === 0) return;
  let msg = '*🛒 Order from Prince Sports Website*\n\n';
  cart.forEach(i => {
    msg += `• ${i.name} x${i.qty} = ${formatPrice(i.price * i.qty)}\n`;
  });
  msg += `\n*Total: ${formatPrice(getTotal())}*\n\nPlease confirm my order. Thank you!`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ===== NAV / MOBILE MENU =====
const ham = document.getElementById('hamburger');
const mm = document.getElementById('mobileMenu');
if(ham){
  ham.addEventListener('click', () => {
    const open = mm.classList.toggle('open');
    ham.setAttribute('aria-expanded', open);
  });
  mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mm.classList.remove('open');
    ham.setAttribute('aria-expanded','false');
  }));
}

// ===== YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== OPEN/CLOSED STATUS (IST) =====
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function kolkataNow(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); }
function setStatus(){
  const now = kolkataNow();
  const d = now.getDay();
  const mins = now.getHours()*60 + now.getMinutes();
  const OPEN = 10*60, CLOSE = 19*60 + 30;
  const isOpen = d !== 0 && mins >= OPEN && mins < CLOSE;
  let msg, cls;
  if(isOpen){ msg = 'Open now · closes 7:30 pm'; cls = 'open'; }
  else if(d === 0){ msg = 'Closed · opens Mon 10 am'; cls = 'closed'; }
  else if(mins < OPEN){ msg = 'Closed · opens 10 am today'; cls = 'closed'; }
  else { msg = (d === 6 ? 'Closed · opens Mon 10 am' : 'Closed · opens 10 am tomorrow'); cls = 'closed'; }
  const html = `<span class="dot"></span>${msg}`;
  [['status'],['status2']].forEach(([id]) => {
    const el = document.getElementById(id);
    if(el){ el.className = 'status '+cls; el.innerHTML = html; }
  });
  document.querySelectorAll('#hoursTable tr').forEach(tr => tr.classList.remove('today'));
  const row = document.querySelector('#hoursTable tr[data-day="'+days[d]+'"]');
  if(row) row.classList.add('today');
}
setStatus();
setInterval(setStatus, 60000);

// ===== REVEAL ON SCROLL =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if(e.isIntersecting){
      e.target.style.transitionDelay = (i % 4 * 60) + 'ms';
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== INIT =====
updateCartUI();
