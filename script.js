const defaultProducts = [
  {id:1,name:"رژ لب مات",brand:"LUMI",cat:"آرایش",price:250000,old:310000,rating:"★★★★★",reviews:24,tag:"20٪ تخفیف",type:"v-lip",desc:"رژ لب مات با بافت نرم، رنگدانه بالا و ماندگاری مناسب استفاده روزانه."},
  {id:2,name:"سرم آبرسان Glow",brand:"LUMI",cat:"پوست",price:520000,old:610000,rating:"★★★★★",reviews:42,tag:"پرفروش",type:"v-serum",desc:"سرم سبک و آبرسان برای کمک به حفظ رطوبت و شادابی ظاهر پوست."},
  {id:3,name:"کرم آبرسان Daily",brand:"LUMI",cat:"پوست",price:410000,old:0,rating:"★★★★★",reviews:18,tag:"جدید",type:"v-cream",desc:"کرم آبرسان سبک با حس راحت و مناسب روتین روزانه."},
  {id:4,name:"شامپو تقویت‌کننده",brand:"LUMI",cat:"مو",price:280000,old:0,rating:"★★★★☆",reviews:16,tag:"",type:"v-shampoo",desc:"شامپو مناسب استفاده روزانه با تمرکز روی ظاهر سالم و تمیز مو."},
  {id:5,name:"عطر زنانه Lumi",brand:"LUMI",cat:"عطر",price:850000,old:950000,rating:"★★★★★",reviews:39,tag:"10٪ تخفیف",type:"v-perfume",desc:"رایحه‌ای لطیف و ماندگار برای استفاده روزانه و موقعیت‌های خاص."},
  {id:6,name:"پنکیک طبیعی",brand:"LUMI",cat:"آرایش",price:390000,old:0,rating:"★★★★☆",reviews:22,tag:"",type:"v-powder",desc:"پوشش سبک و طبیعی برای یکدست‌تر شدن ظاهر پوست."},
  {id:7,name:"ماسک مو Silk",brand:"LUMI",cat:"مو",price:350000,old:420000,rating:"★★★★★",reviews:27,tag:"16٪ تخفیف",type:"v-cream",desc:"ماسک مو برای کمک به نرمی، لطافت و ظاهر درخشان مو."},
  {id:8,name:"شوینده ملایم صورت",brand:"LUMI",cat:"پوست",price:330000,old:0,rating:"★★★★★",reviews:31,tag:"",type:"v-cream",desc:"شوینده ملایم برای روتین پاکسازی روزانه."}
];

let products = JSON.parse(localStorage.getItem("lumi_products") || "null") || defaultProducts;
let cart = JSON.parse(localStorage.getItem("lumi_cart") || "{}");
let favorites = JSON.parse(localStorage.getItem("lumi_fav") || "[]");
let user = JSON.parse(localStorage.getItem("lumi_user") || "null");
let currentFilter = "همه";

const $ = id => document.getElementById(id);
const money = n => n.toLocaleString("fa-IR") + " تومان";

function save(){
  localStorage.setItem("lumi_products", JSON.stringify(products));
  localStorage.setItem("lumi_cart", JSON.stringify(cart));
  localStorage.setItem("lumi_fav", JSON.stringify(favorites));
  if(user) localStorage.setItem("lumi_user", JSON.stringify(user));
}
function toast(msg){
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  setTimeout(()=> $("toast").classList.remove("show"), 2200);
}
function updateCounts(){
  $("cartCount").textContent = Object.values(cart).reduce((a,b)=>a+b,0).toLocaleString("fa-IR");
  $("favCount").textContent = favorites.length.toLocaleString("fa-IR");
}
function openModal(id){$(id).classList.add("show")}
function closeModal(id){$(id).classList.remove("show")}
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));

function renderProducts(){
  const q = $("search").value.trim().toLowerCase();
  let list = products.filter(p => (currentFilter==="همه" || p.cat===currentFilter) && (p.name+" "+p.brand+" "+p.cat).toLowerCase().includes(q));
  const sort = $("sort").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="new") list.sort((a,b)=>b.id-a.id);
  $("products").innerHTML = list.map(p=>`
    <article class="product">
      <div class="product-media" data-open="${p.id}">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
        <button class="heart ${favorites.includes(p.id)?"active":""}" data-fav="${p.id}">${favorites.includes(p.id)?"♥":"♡"}</button>
        <div class="product-visual ${p.type}">${p.type==="v-lip"||p.type==="v-serum"||p.type==="v-shampoo"||p.type==="v-perfume"?"LUMI":"LUMI"}</div>
      </div>
      <div class="product-info">
        <span class="brand">${p.brand}</span><h3>${p.name}</h3><p>${p.desc}</p>
        <div class="rating">${p.rating} <span>(${p.reviews})</span></div>
        <div class="product-row"><div class="price">${money(p.price)}${p.old?`<del>${money(p.old)}</del>`:""}</div><button class="add" data-add="${p.id}">افزودن</button></div>
      </div>
    </article>`).join("");
  $("emptyProducts").classList.toggle("hidden", list.length!==0);
}
function toggleFav(id){
  id=Number(id);
  favorites = favorites.includes(id) ? favorites.filter(x=>x!==id) : [...favorites,id];
  save(); updateCounts(); renderProducts();
  toast(favorites.includes(id) ? "به علاقه‌مندی‌ها اضافه شد ♥" : "از علاقه‌مندی‌ها حذف شد");
}
function addCart(id){
  id=Number(id); cart[id]=(cart[id]||0)+1; save(); updateCounts(); toast("محصول به سبد خرید اضافه شد");
}
function renderCart(){
  const entries=Object.entries(cart);
  if(!entries.length){$("cartItems").innerHTML='<div class="empty">سبد خرید شما خالی است.</div>';$("cartTotal").textContent="۰ تومان";return}
  let total=0;
  $("cartItems").innerHTML=entries.map(([id,qty])=>{
    const p=products.find(x=>x.id===Number(id)); total+=p.price*qty;
    return `<div class="cart-line"><div><h4>${p.name}</h4><small>${money(p.price)}</small></div><div class="qty"><button data-qty="${id}" data-change="-1">−</button><b>${qty}</b><button data-qty="${id}" data-change="1">+</button></div><button class="remove" data-remove="${id}">حذف</button></div>`
  }).join("");
  $("cartTotal").textContent=money(total);
}
function openProduct(id){
  const p=products.find(x=>x.id===Number(id));
  $("productDetail").innerHTML=`<div class="detail-grid"><div class="detail-visual"><div class="product-visual ${p.type}">${p.type==="v-powder"||p.type==="v-cream"?"LUMI":"LUMI"}</div></div><div class="detail-info"><span class="eyebrow">${p.cat} · ${p.brand}</span><h2>${p.name}</h2><div class="rating">${p.rating} <span>(${p.reviews} نظر)</span></div><p>${p.desc}</p><div class="detail-price">${money(p.price)}</div><button class="btn primary full" data-detail-add="${p.id}">افزودن به سبد خرید</button><button class="btn ghost full" style="margin-top:9px" data-detail-fav="${p.id}">${favorites.includes(p.id)?"♥ حذف از علاقه‌مندی":"♡ افزودن به علاقه‌مندی"}</button></div></div>`;
  openModal("productModal");
}
function renderFavorites(){
  const list=products.filter(p=>favorites.includes(p.id));
  $("favoriteItems").innerHTML=list.length?list.map(p=>`<div class="cart-line"><div><h4>${p.name}</h4><small>${money(p.price)}</small></div><button class="add" data-add="${p.id}">افزودن</button><button class="remove" data-fav="${p.id}">حذف</button></div>`).join(""):'<div class="empty">هنوز محصولی ذخیره نکرده‌اید.</div>';
}
function account(){
  openModal("accountModal");
  if(user){
    $("accountContent").innerHTML=`<div class="modal-title"><span class="eyebrow">MY ACCOUNT</span><h2>سلام ${user.firstName || "دوست عزیز"} 👋</h2></div>
      <div class="demo-note">حساب شما در این Demo روی همین مرورگر ذخیره می‌شود.</div>
      <div class="field"><label>نام</label><input id="firstName" value="${user.firstName||""}"></div>
      <div class="field"><label>نام خانوادگی</label><input id="lastName" value="${user.lastName||""}"></div>
      <div class="field"><label>شماره موبایل</label><input value="${user.phone||"09120000000"}" disabled></div>
      <div class="field"><label>آدرس</label><textarea id="address">${user.address||""}</textarea></div>
      <div class="field"><label>کد پستی</label><input id="postal" value="${user.postal||""}" inputmode="numeric"></div>
      <button class="btn primary full" id="saveProfile">ذخیره اطلاعات</button>
      <button class="btn ghost full" id="logout" style="margin-top:9px">خروج از حساب</button>`;
    $("saveProfile").onclick=()=>{user={...user,firstName:$("firstName").value,lastName:$("lastName").value,address:$("address").value,postal:$("postal").value};save();toast("اطلاعات ذخیره شد");account()};
    $("logout").onclick=()=>{user=null;localStorage.removeItem("lumi_user");account()};
  } else {
    $("accountContent").innerHTML=`<div class="modal-title"><span class="eyebrow">ACCOUNT</span><h2>ورود / ثبت‌نام</h2></div>
      <div class="demo-note">برای نسخه نمونه‌کار، احراز هویت به‌صورت Demo شبیه‌سازی شده و پیامک واقعی ارسال نمی‌شود.</div>
      <div class="field"><label>شماره موبایل ایران</label><div style="display:flex;gap:7px"><input value="+98" disabled style="max-width:65px;text-align:center"><input id="phone" placeholder="9121234567" inputmode="numeric"></div></div>
      <button class="btn primary full" id="sendCode">دریافت کد تأیید</button>`;
    $("sendCode").onclick=()=>{
      const phone=$("phone").value.replace(/\D/g,"");
      if(!/^9\d{9}$/.test(phone)){toast("شماره موبایل را به شکل 9121234567 وارد کنید");return}
      $("accountContent").innerHTML=`<div class="modal-title"><span class="eyebrow">VERIFY</span><h2>تأیید شماره</h2></div><div class="demo-note">کد Demo: <b>1234</b></div><div class="field"><label>کد چهار رقمی</label><input id="code" maxlength="4" inputmode="numeric" placeholder="1234"></div><button class="btn primary full" id="verify">تأیید و ادامه</button>`;
      $("verify").onclick=()=>{if($("code").value!=="1234"){toast("کد وارد شده صحیح نیست");return} user={phone:"0"+phone};save();toast("شماره تأیید شد");account()};
    };
  }
}
function admin(){
  openModal("adminModal");
  $("adminContent").innerHTML=`<div class="admin-title"><div><span class="eyebrow">LUMI ADMIN · DEMO</span><h2>داشبورد مدیریت</h2></div><span class="status">Demo Mode</span></div>
    <div class="admin-grid"><div class="metric"><span>سفارش‌ها</span><b>۱۲۴</b></div><div class="metric"><span>مشتری‌ها</span><b>۵۳۲</b></div><div class="metric"><span>محصولات</span><b>${products.length}</b></div><div class="metric"><span>فروش ماه</span><b>۴۸.۵M</b></div></div>
    <h3 style="margin-bottom:10px;color:var(--navy)">آخرین سفارش‌ها</h3>
    <table class="admin-table"><thead><tr><th>سفارش</th><th>مشتری</th><th>مبلغ</th><th>وضعیت</th></tr></thead><tbody>
    <tr><td>#1024</td><td>سارا احمدی</td><td>۸۵۰,۰۰۰</td><td><span class="status">در حال آماده‌سازی</span></td></tr>
    <tr><td>#1023</td><td>مریم رضایی</td><td>۱,۲۴۰,۰۰۰</td><td><span class="status">ارسال شده</span></td></tr>
    <tr><td>#1022</td><td>نازنین محمدی</td><td>۵۲۰,۰۰۰</td><td><span class="status">تحویل داده شد</span></td></tr>
    <tr><td>#1021</td><td>الهام کریمی</td><td>۶۹۰,۰۰۰</td><td><span class="status">پرداخت شده</span></td></tr>
    </tbody></table>`;
}

document.addEventListener("click",e=>{
  const t=e.target;
  if(t.dataset.add){addCart(t.dataset.add);return}
  if(t.dataset.fav){toggleFav(t.dataset.fav);return}
  if(t.dataset.open && !t.dataset.fav){openProduct(t.dataset.open);return}
  if(t.dataset.qty){const id=t.dataset.qty;cart[id]=(cart[id]||0)+Number(t.dataset.change);if(cart[id]<=0)delete cart[id];save();updateCounts();renderCart();return}
  if(t.dataset.remove){delete cart[t.dataset.remove];save();updateCounts();renderCart();return}
  if(t.dataset.detailAdd){addCart(t.dataset.detailAdd);closeModal("productModal");return}
  if(t.dataset.detailFav){toggleFav(t.dataset.detailFav);openProduct(t.dataset.detailFav);return}
});
$("search").oninput=renderProducts;
$("sort").onchange=renderProducts;
document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.filter;renderProducts()});
document.querySelectorAll(".category-card").forEach(b=>b.onclick=()=>{currentFilter=b.dataset.category;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.filter===currentFilter));renderProducts();$("shop").scrollIntoView({behavior:"smooth"})});
$("showAll").onclick=()=>{currentFilter="همه";$("search").value="";document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.filter==="همه"));renderProducts()};
$("cartBtn").onclick=()=>{renderCart();openModal("cartModal")};
$("favoritesBtn").onclick=()=>{renderFavorites();openModal("favoritesModal")};
$("accountBtn").onclick=account;
$("adminLink").onclick=e=>{e.preventDefault();admin()};
$("checkoutBtn").onclick=()=>{
  if(!Object.keys(cart).length){toast("سبد خرید خالی است");return}
  if(!user){toast("ابتدا وارد حساب کاربری شوید");closeModal("cartModal");account();return}
  if(!user.address || !user.postal){toast("لطفاً آدرس و کد پستی را در حساب کاربری کامل کنید");closeModal("cartModal");account();return}
  let total=0; const items=Object.entries(cart).map(([id,qty])=>{const p=products.find(x=>x.id===Number(id)); total+=p.price*qty; return {id:Number(id),name:p.name,qty,price:p.price}});
  const orders=JSON.parse(localStorage.getItem("lumi_orders")||"[]");
  const order={id:"#"+(1025+orders.length),name:(user.firstName||"مشتری")+" "+(user.lastName||""),customer:(user.firstName||"مشتری")+" "+(user.lastName||""),phone:user.phone||"",amount:total,status:"پرداخت شده",date:new Date().toLocaleDateString("fa-IR"),items,address:user.address,postal:user.postal};
  orders.unshift(order); localStorage.setItem("lumi_orders",JSON.stringify(orders));
  cart={}; save(); updateCounts(); renderCart(); closeModal("cartModal"); toast("سفارش شما با موفقیت ثبت شد ✓");
};
$("mobileMenu").onclick=()=>$("mainNav").classList.toggle("open");
document.querySelectorAll("[data-demo]").forEach(a=>a.onclick=e=>{e.preventDefault(); if(a.dataset.demo==="account")account(); if(a.dataset.demo==="favorites"){$("favoritesBtn").click()} if(a.dataset.demo==="orders"){toast("صفحه پیگیری سفارش در نسخه Demo است")}});
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));
updateCounts();renderProducts();
