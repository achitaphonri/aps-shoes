
(function forceAdminPassword141(){
  try{
    localStorage.setItem('account', JSON.stringify({username:'admin', password:'141'}));
    const profile = JSON.parse(localStorage.getItem('profile') || 'null') || {};
    localStorage.setItem('profile', JSON.stringify({name: profile.name || 'Admin', email: profile.email || 'admin@apsshoes.com'}));
  }catch(e){}
})();



function money(n){return new Intl.NumberFormat('th-TH',{style:'currency',currency:'THB',maximumFractionDigits:0}).format(n)}
function getCart(){return JSON.parse(localStorage.getItem('cart')||'[]')}
function saveCart(c){localStorage.setItem('cart',JSON.stringify(c)); updateCartCount()}
function updateCartCount(){let n=getCart().reduce((s,x)=>s+x.qty,0);document.querySelectorAll('.cart-count').forEach(e=>e.textContent=n)}
function addToCart(id,qty=1){let c=getCart(),p=PRODUCTS.find(x=>x.id==id),x=c.find(x=>x.id==id);if(x)x.qty+=qty;else c.push({id,qty});saveCart(c);toast('เพิ่ม '+p.name+' ลงตะกร้าแล้ว')}
function removeCart(id){saveCart(getCart().filter(x=>x.id!=id));renderCart()}
function setQty(id,qty){let c=getCart(),x=c.find(x=>x.id==id);if(x)x.qty=Math.max(1,+qty||1);saveCart(c);renderCart()}
function toast(t){let e=document.getElementById('toast');if(!e)return;e.textContent=t;e.style.display='block';setTimeout(()=>e.style.display='none',1800)}
function productCard(p){return `<div class="card"><a href="product.html?id=${p.id}"><img class="card-img" src="${p.image}" onerror="this.src='img/profilePic.jpg'"></a><div class="card-body"><h3>${p.name}</h3><div class="muted">${p.desc}</div><div class="price">${money(p.price)}</div><div class="actions"><a class="btn btn-outline" href="product.html?id=${p.id}">รายละเอียด</a><button class="btn btn-primary" onclick="addToCart(${p.id})">ใส่ตะกร้า</button></div></div></div>`}
function renderProducts(list,el){if(el)el.innerHTML=list.map(productCard).join('')}
function getParam(k){return new URLSearchParams(location.search).get(k)}
function initProducts(){let el=document.getElementById('productGrid');if(!el)return;let cat=getParam('cat'),q=(getParam('search')||'').toLowerCase();let list=PRODUCTS.filter(p=>(!cat||p.cat==cat)&&(!q||(p.name+' '+p.desc).toLowerCase().includes(q)));renderProducts(list,el);let title=document.getElementById('pageTitle');if(title)title.textContent=cat?(CATEGORIES.find(c=>c.id==cat)?.name||'สินค้า'):(q?'ผลการค้นหา: '+q:'สินค้าทั้งหมด')}
function renderCart(){let el=document.getElementById('cartBody'),summary=document.getElementById('cartSummary');if(!el)return;let c=getCart();if(!c.length){el.innerHTML='<div class="empty"><h2>ตะกร้ายังว่าง</h2><p class="muted">เลือกสินค้าที่ต้องการแล้วกลับมาที่หน้านี้ได้เลย</p><a class="btn btn-primary" href="products.html">เลือกซื้อสินค้า</a></div>';if(summary)summary.innerHTML='';return}let total=0;el.innerHTML=`<div class="table-wrap"><table class="cart-table"><thead><tr><th>สินค้า</th><th>ราคา</th><th>จำนวน</th><th>รวม</th><th></th></tr></thead><tbody>${c.map(x=>{let p=PRODUCTS.find(p=>p.id==x.id),t=p.price*x.qty;total+=t;return `<tr><td><img class="cart-img" src="${p.image}"> ${p.name}</td><td>${money(p.price)}</td><td><input class="qty" type="number" min="1" value="${x.qty}" onchange="setQty(${p.id},this.value)"></td><td>${money(t)}</td><td><button class="btn btn-outline" onclick="removeCart(${p.id})">ลบ</button></td></tr>`}).join('')}</tbody></table></div>`;summary.innerHTML=`<div class="total">ยอดรวม ${money(total)}</div><button class="btn btn-primary" style="float:right" onclick="checkout()">สั่งซื้อ</button><div style="clear:both"></div>`}
function checkout(){if(!isLoggedIn()){const m=document.getElementById('loginModal');if(m)m.classList.add('show');toast('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ');return;}if(!getCart().length)return;let orders=JSON.parse(localStorage.getItem('orders')||'[]'),total=getCart().reduce((s,x)=>{let p=PRODUCTS.find(p=>p.id==x.id);return s+p.price*x.qty},0);orders.unshift({id:Date.now(),date:new Date().toLocaleString('th-TH'),total,status:'รอรับออเดอร์',items:getCart(),username:getUser().username});localStorage.setItem('orders',JSON.stringify(orders));localStorage.removeItem('cart');updateCartCount();alert('สั่งซื้อสำเร็จ');location.href='orders.html'}
function initProduct(){let el=document.getElementById('detail'),id=+getParam('id'),p=PRODUCTS.find(x=>x.id==id);if(!el||!p)return;el.innerHTML=`<div><img src="${p.image}" onerror="this.src='img/profilePic.jpg'"></div><div><span class="badge">${CATEGORIES.find(c=>c.id==p.cat)?.name||''}</span><h1>${p.name}</h1><p class="muted">${p.desc}</p><h2 class="price">${money(p.price)}</h2><div class="qty"><label>จำนวน</label><input id="detailQty" type="number" min="1" value="1"></div><button class="btn btn-primary" style="margin-top:18px" onclick="addToCart(${p.id},+document.getElementById('detailQty').value)">เพิ่มลงตะกร้า</button></div>`}
function initHome(){let p=document.getElementById('homeProducts');if(p)renderProducts(PRODUCTS.slice(0,8),p);let c=document.getElementById('categories');if(c)c.innerHTML=CATEGORIES.map(x=>`<a class="card cat-card" href="products.html?cat=${x.id}"><img class="card-img" src="${x.image}"><div class="card-body"><h3>${x.name}</h3><p class="muted">${x.desc}</p></div></a>`).join('')}
function initOrders(){let el=document.getElementById('orders');if(!el)return;let notice=document.getElementById('loginNotice');if(!isLoggedIn()){if(notice)notice.textContent='กรุณาเข้าสู่ระบบเพื่อดูรายการสั่งซื้อ';el.innerHTML='<div class="empty"><h2>กรุณาเข้าสู่ระบบ</h2><button class="btn btn-primary" onclick="document.getElementById(\'loginModal\').classList.add(\'show\')">เข้าสู่ระบบ</button></div>';return;}let o=JSON.parse(localStorage.getItem('orders')||'[]');el.innerHTML=o.length?o.map(x=>`<div class="order"><b>Order #${x.id}</b><span class="badge" style="float:right">${x.status}</span><p>${x.date}</p><strong>${money(x.total)}</strong></div>`).join(''):'<div class="empty"><h2>ยังไม่มีรายการสั่งซื้อ</h2><a class="btn btn-primary" href="products.html">เริ่มเลือกซื้อ</a></div>'}
function initSearch(){let f=document.getElementById('searchForm');if(f)f.onsubmit=e=>{e.preventDefault();let q=document.getElementById('searchInput').value.trim();location.href='products.html'+(q?'?search='+encodeURIComponent(q):'')}}
function getUser(){
  try{return JSON.parse(localStorage.getItem('user')||'null')}catch(e){return null}
}
function saveUser(user){
  localStorage.setItem('user',JSON.stringify(user));
}
function isLoggedIn(){return !!getUser()}
function requireLogin(){
  if(!isLoggedIn()){
    const m=document.getElementById('loginModal');
    if(m)m.classList.add('show');
    return false;
  }
  return true;
}
function updateAuthUI(){
  const u=getUser();
  document.querySelectorAll('.auth-button').forEach(btn=>{
    btn.textContent=u ? 'ออกจากระบบ' : 'เข้าสู่ระบบ';
    btn.onclick=()=>{
      if(u){
        localStorage.removeItem('user');
        toast('ออกจากระบบแล้ว');
        setTimeout(()=>location.reload(),500);
      }else{
        const m=document.getElementById('loginModal');
        if(m)m.classList.add('show');
      }
    };
  });
  document.querySelectorAll('.profile-link').forEach(a=>{
    a.onclick=(e)=>{
      if(!isLoggedIn()){
        e.preventDefault();
        const m=document.getElementById('loginModal');
        if(m)m.classList.add('show');
      }
    };
  });
}
function initAuth(){
  const f=document.getElementById('loginForm');
  if(!f)return;
  const pw=document.getElementById('loginPassword');
  const name=document.getElementById('loginName');
  f.onsubmit=e=>{
    e.preventDefault();
    const username=name.value.trim();
    const password=pw.value;
    if(!username || !password)return;
    // บัญชีหลักของโปรเจกต์: admin / 141
    if(username !== 'admin' || password !== '141'){
      toast('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      return;
    }
    localStorage.setItem('account',JSON.stringify({username:'admin',password:'141'}));
    if(!localStorage.getItem('profile')){
      localStorage.setItem('profile',JSON.stringify({name:'Admin',email:'admin@apsshoes.com'}));
    }
    const profile=JSON.parse(localStorage.getItem('profile')||'null')||{name:username,email:''};
    saveUser({username,name:profile.name||username});
    toast('เข้าสู่ระบบสำเร็จ');
    setTimeout(()=>location.reload(),500);
  };
}
function initProfile(){
  const form=document.getElementById('profileForm');
  const nameEl=document.getElementById('profileName');
  const nameInput=document.getElementById('profileFullName');
  const emailInput=document.getElementById('profileEmail');
  const usernameEl=document.getElementById('profileUsername');
  const u=getUser();
  if(!u){
    if(nameEl)nameEl.textContent='Guest';
    return;
  }
  const p=JSON.parse(localStorage.getItem('profile')||'null')||{name:u.name||u.username,email:''};
  if(nameEl)nameEl.textContent=p.name||u.username;
  if(nameInput)nameInput.value=p.name||u.username;
  if(emailInput)emailInput.value=p.email||'';
  if(usernameEl)usernameEl.textContent=u.username;
  if(form){
    form.onsubmit=e=>{
      e.preventDefault();
      const profile={name:nameInput.value.trim()||u.username,email:emailInput.value.trim()};
      localStorage.setItem('profile',JSON.stringify(profile));
      saveUser({...u,name:profile.name});
      if(nameEl)nameEl.textContent=profile.name;
      toast('บันทึกข้อมูลเรียบร้อยแล้ว');
    };
  }
}

function clearCart(){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (!cart.length) {
    toast('ตะกร้าว่างอยู่แล้ว');
    return;
  }
  if (confirm('ต้องการล้างสินค้าทั้งหมดในตะกร้าหรือไม่?')) {
    localStorage.removeItem('cart');
    renderCart();
    updateCartCount();
    toast('ล้างตะกร้าเรียบร้อยแล้ว');
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  updateCartCount();initProducts();renderCart();initProduct();initHome();initOrders();initSearch();initAuth();initProfile();updateAuthUI();
})
