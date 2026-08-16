const $=id=>document.getElementById(id);
const money=n=>Number(n).toLocaleString("fa-IR")+" تومان";
let defaultProducts=[
{id:1,name:"رژ لب مات",brand:"LUMI",cat:"آرایش",price:250000,stock:34,type:"lip"},
{id:2,name:"سرم آبرسان Glow",brand:"LUMI",cat:"پوست",price:520000,stock:18,type:"serum"},
{id:3,name:"کرم آبرسان Daily",brand:"LUMI",cat:"پوست",price:410000,stock:42,type:"cream"},
{id:4,name:"شامپو تقویت‌کننده",brand:"LUMI",cat:"مو",price:280000,stock:27,type:"cream"},
{id:5,name:"عطر زنانه Lumi",brand:"LUMI",cat:"عطر",price:850000,stock:9,type:"perfume"},
{id:6,name:"پنکیک طبیعی",brand:"LUMI",cat:"آرایش",price:390000,stock:21,type:"cream"},
{id:7,name:"ماسک مو Silk",brand:"LUMI",cat:"مو",price:350000,stock:15,type:"cream"},
{id:8,name:"شوینده ملایم صورت",brand:"LUMI",cat:"پوست",price:330000,stock:31,type:"cream"}];
let products=JSON.parse(localStorage.getItem("lumi_products")||"null") || defaultProducts;
let orders=JSON.parse(localStorage.getItem("lumi_orders")||"null") || [
{id:"#1024",name:"سارا احمدی",phone:"09121234567",amount:850000,status:"در حال آماده‌سازی",cls:"s-orange",date:"امروز، 14:32"},
{id:"#1023",name:"مریم رضایی",phone:"09129876543",amount:1240000,status:"ارسال شده",cls:"s-blue",date:"امروز، 12:18"},
{id:"#1022",name:"نازنین محمدی",phone:"09351234567",amount:520000,status:"تحویل داده شد",cls:"s-green",date:"دیروز، 18:40"},
{id:"#1021",name:"الهام کریمی",phone:"09901234567",amount:690000,status:"پرداخت شده",cls:"s-blue",date:"دیروز، 16:12"},
{id:"#1020",name:"مهسا اکبری",phone:"09105555555",amount:430000,status:"لغو شده",cls:"s-red",date:"12 مرداد، 10:04"},
{id:"#1019",name:"نگار حسینی",phone:"09112223344",amount:990000,status:"تحویل داده شد",cls:"s-green",date:"11 مرداد، 20:22"}];
function saveShared(){localStorage.setItem("lumi_products",JSON.stringify(products));localStorage.setItem("lumi_orders",JSON.stringify(orders));}
function refreshShared(){orders=JSON.parse(localStorage.getItem("lumi_orders")||"[]");products=JSON.parse(localStorage.getItem("lumi_products")||"null")||products;}

if(!localStorage.getItem("lumi_products")) localStorage.setItem("lumi_products",JSON.stringify(defaultProducts));
if(!localStorage.getItem("lumi_orders")) localStorage.setItem("lumi_orders",JSON.stringify(orders));

const customers=[
["سارا احمدی","09121234567","18 سفارش","۸۵۰,۰۰۰"],
["مریم رضایی","09129876543","11 سفارش","۱,۲۴۰,۰۰۰"],
["نازنین محمدی","09351234567","9 سفارش","۵۲۰,۰۰۰"],
["الهام کریمی","09901234567","7 سفارش","۶۹۰,۰۰۰"],
["مهسا اکبری","09105555555","6 سفارش","۴۳۰,۰۰۰"]];

function toast(m){$("toast").textContent=m;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
function status(s){let cls=s.includes("تحویل")?"s-green":s.includes("آماده")?"s-orange":s.includes("لغو")?"s-red":"s-blue";return `<span class="status ${cls}">${s}</span>`}
function dashboard(){refreshShared();
 $("crumb").innerHTML="داشبورد <span>/</span> نمای کلی";
 $("app").innerHTML=`<div class="page-head"><div><span class="eyebrow">OVERVIEW · AUGUST 2026</span><h1>سلام، مدیر 👋</h1></div><button class="btn primary" id="newProduct">+ افزودن محصول</button></div>
 <div class="metrics">
 ${metric("فروش این ماه","۴۸,۵۰۰,۰۰۰","+18.4%","↗")} ${metric("سفارش‌ها",orders.length.toLocaleString("fa-IR"),"سفارش ثبت‌شده","▣")} ${metric("مشتریان","۵۳۲","+8.2%","♙")} ${metric("محصولات",products.length.toLocaleString("fa-IR"),"موجودی فروشگاه","!")}
 </div>
 <div class="grid-2">
  <div class="panel"><div class="panel-head"><div><h3>گزارش فروش</h3><small style="font-size:8px;color:var(--muted)">میزان فروش در ۷ ماه اخیر</small></div><select class="filter"><option>۶ ماه اخیر</option><option>این ماه</option></select></div>
   <div class="chart">${[42,55,48,73,61,88,96].map((x,i)=>`<div class="bar ${i===6?"active":""}" style="height:${x}%"><b>${[12,18,15,25,20,31,38][i]}M</b><span>${["فر","ار","خ","ت","م","ش","ا"][i]}</span></div>`).join("")}</div>
  </div>
  <div class="panel"><div class="panel-head"><h3>دسترسی سریع</h3></div><div class="quick">
   <button data-action="orders"><span>▣</span><div><strong>مشاهده سفارش‌ها</strong><small>۱۲ سفارش منتظر بررسی</small></div></button>
   <button data-action="products"><span>◈</span><div><strong>مدیریت محصولات</strong><small>۳ محصول موجودی کم دارند</small></div></button>
   <button data-action="customers"><span>♙</span><div><strong>مشتریان</strong><small>۲۳ مشتری جدید این هفته</small></div></button>
  </div></div>
 </div>
 <div class="panel" style="margin-top:18px"><div class="panel-head"><h3>آخرین سفارش‌ها</h3><button data-action="orders">مشاهده همه ←</button></div>${ordersTable(orders.slice(0,5))}</div>`;
 $("newProduct").onclick=()=>productModal();
}
function metric(a,b,c,icon){return `<div class="metric"><div class="metric-head"><div><small>${a}</small><strong>${b}</strong><span class="${c.includes("موجودی")?"down":"up"}">${c}</span></div><div class="metric-icon">${icon}</div></div></div>`}
function ordersTable(list){
 return `<div class="table-wrap"><table class="table"><thead><tr><th>شماره</th><th>مشتری</th><th>مبلغ</th><th>تاریخ</th><th>وضعیت</th><th></th></tr></thead><tbody>${list.map(o=>`<tr><td><b>${o.id}</b></td><td><div class="customer"><div class="mini-avatar">${o.name[0]}</div><div><b>${o.name}</b><small>${o.phone}</small></div></div></td><td>${money(o.amount)}</td><td>${o.date}</td><td>${status(o.status)}</td><td><button class="btn ghost view-order" data-id="${o.id}">جزئیات</button></td></tr>`).join("")}</tbody></table></div>`
}
function ordersPage(){refreshShared();
 $("crumb").innerHTML="سفارش‌ها <span>/</span> مدیریت سفارش‌ها";
 $("app").innerHTML=`<div class="page-head"><div><span class="eyebrow">ORDER MANAGEMENT</span><h1>سفارش‌ها</h1></div><button class="btn ghost" id="exportOrders">خروجی سفارش‌ها</button></div>
 <div class="panel"><div class="searchbar"><input id="orderSearch" placeholder="جستجو با شماره سفارش یا نام مشتری..."><select class="filter" id="orderFilter"><option>همه وضعیت‌ها</option><option>پرداخت شده</option><option>در حال آماده‌سازی</option><option>ارسال شده</option><option>تحویل داده شد</option><option>لغو شده</option></select></div><div id="ordersTable">${ordersTable(orders)}</div></div>`;
 $("orderSearch").oninput=filterOrders;$("orderFilter").onchange=filterOrders;$("exportOrders").onclick=()=>toast("خروجی Demo آماده شد");
}
function filterOrders(){let q=$("orderSearch").value.toLowerCase(),f=$("orderFilter").value;let list=orders.filter(o=>(o.id+" "+o.name).toLowerCase().includes(q)&&(f==="همه وضعیت‌ها"||o.status===f));$("ordersTable").innerHTML=ordersTable(list)}
function productsPage(){refreshShared();
 $("crumb").innerHTML="محصولات <span>/</span> مدیریت محصولات";
 $("app").innerHTML=`<div class="page-head"><div><span class="eyebrow">CATALOG MANAGEMENT</span><h1>محصولات</h1></div><button class="btn primary" id="newProduct">+ محصول جدید</button></div>
 <div class="searchbar"><input id="productSearch" placeholder="جستجوی نام محصول..."><select class="filter" id="catFilter"><option>همه دسته‌ها</option><option>پوست</option><option>آرایش</option><option>مو</option><option>عطر</option></select></div><div class="product-grid" id="productGrid"></div>`;
 renderProductCards();$("productSearch").oninput=renderProductCards;$("catFilter").onchange=renderProductCards;$("newProduct").onclick=()=>productModal();
}
function renderProductCards(){let q=$("productSearch").value.toLowerCase(),c=$("catFilter").value;let list=products.filter(p=>p.name.toLowerCase().includes(q)&&(c==="همه دسته‌ها"||p.cat===c));$("productGrid").innerHTML=list.map(p=>`<div class="product-card"><div class="product-art"><div class="visual ${p.type}">${p.type==="lip"?"LUMI":"LUMI"}</div></div><div class="product-body"><small>${p.brand} · ${p.cat}</small><h3>${p.name}</h3><div class="product-meta"><b>${money(p.price)}</b><span class="${p.stock<15?"down":"stock"}">${p.stock} عدد موجود</span></div><div class="product-actions"><button class="edit" data-edit="${p.id}">ویرایش</button><button data-delete="${p.id}">حذف</button></div></div></div>`).join("")}
function customersPage(){
 $("crumb").innerHTML="مشتریان <span>/</span> مدیریت مشتریان";
 $("app").innerHTML=`<div class="page-head"><div><span class="eyebrow">CUSTOMER MANAGEMENT</span><h1>مشتریان</h1></div><button class="btn ghost" id="customerExport">خروجی مشتریان</button></div><div class="metrics">${metric("کل مشتریان","۵۳۲","+8.2%","♙")}${metric("مشتری جدید","۲۳","این هفته","＋")}${metric("مشتری فعال","۴۱۸","+5.1%","●")}${metric("میانگین خرید","۷۸۰K","+4.7%","↗")}</div><div class="panel">${customersTable()}</div>`;
 $("customerExport").onclick=()=>toast("فایل خروجی Demo ساخته شد");
}
function customersTable(){return `<div class="table-wrap"><table class="table"><thead><tr><th>مشتری</th><th>شماره موبایل</th><th>تعداد سفارش</th><th>مجموع خرید</th><th>وضعیت</th></tr></thead><tbody>${customers.map(c=>`<tr><td><div class="customer"><div class="mini-avatar">${c[0][0]}</div><b>${c[0]}</b></div></td><td>${c[1]}</td><td>${c[2]}</td><td>${c[3]}</td><td>${status("فعال")}</td></tr>`).join("")}</tbody></table></div>`}
function genericPage(type,title,eyebrow,body){
 $("crumb").innerHTML=`${title} <span>/</span> مدیریت`;
 $("app").innerHTML=`<div class="page-head"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1></div></div><div class="panel">${body}</div>`;
}
function productModal(id=null){
 $("pName").value=id?products.find(p=>p.id===id).name:"";$("pBrand").value=id?products.find(p=>p.id===id).brand:"LUMI";$("pCat").value=id?products.find(p=>p.id===id).cat:"پوست";$("pPrice").value=id?products.find(p=>p.id===id).price:"";$("pStock").value=id?products.find(p=>p.id===id).stock:"";$("pSku").value=id?"LUM-"+String(id).padStart(3,"0"):"";$("pDesc").value="";$("productModalTitle").textContent=id?"ویرایش محصول":"افزودن محصول";$("saveProduct").dataset.edit=id||""; $("productModal").classList.add("show");
}
function saveProduct(){let id=Number($("saveProduct").dataset.edit);let data={name:$("pName").value||"محصول جدید",brand:$("pBrand").value||"LUMI",cat:$("pCat").value,price:Number($("pPrice").value)||0,stock:Number($("pStock").value)||0,type:"cream"};if(id){products=products.map(p=>p.id===id?{...p,...data}:p);saveShared();toast("محصول ویرایش شد")}else{data.id=Math.max(...products.map(p=>p.id))+1;products.push(data);saveShared();toast("محصول جدید اضافه شد")}$("productModal").classList.remove("show");productsPage()}
function orderDetail(id){let o=orders.find(x=>x.id===id);$("orderTitle").textContent=`سفارش ${o.id}`;$("orderDetail").innerHTML=`<div class="panel" style="box-shadow:none;background:var(--soft);margin-top:15px"><div class="customer"><div class="mini-avatar">${o.name[0]}</div><div><b>${o.name}</b><small>${o.phone}</small></div></div><hr style="border:0;border-top:1px solid var(--line);margin:15px 0"><p style="font-size:11px;margin:7px 0">مبلغ سفارش: <b>${money(o.amount)}</b></p><p style="font-size:11px;margin:7px 0">تاریخ: ${o.date}</p><p style="font-size:11px;margin:7px 0">وضعیت فعلی: ${status(o.status)}</p><label style="display:block;font-size:9px;color:var(--muted);margin:15px 0 5px">تغییر وضعیت</label><select id="orderStatus" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px"><option>پرداخت شده</option><option>در حال آماده‌سازی</option><option>ارسال شده</option><option>تحویل داده شد</option><option>لغو شده</option></select><button class="btn primary full" style="margin-top:10px" id="updateOrder">ذخیره وضعیت</button></div>`;$("orderStatus").value=o.status;$("updateOrder").onclick=()=>{o.status=$("orderStatus").value;saveShared();$("orderModal").classList.remove("show");ordersPage();toast("وضعیت سفارش تغییر کرد")};$("orderModal").classList.add("show")}
function navigate(page){if(page==="dashboard")dashboard();if(page==="orders")ordersPage();if(page==="products")productsPage();if(page==="customers")customersPage();if(page==="categories")genericPage("categories","دسته‌بندی‌ها","CATEGORY MANAGEMENT",`<h3>دسته‌بندی‌های فروشگاه</h3><p style="font-size:11px;color:var(--muted);margin-top:8px">پوست · آرایش · مو · عطر</p><button class="btn primary" style="margin-top:18px" onclick="toast('دسته‌بندی جدید آماده افزودن است')">+ افزودن دسته‌بندی</button>`);if(page==="discounts")genericPage("discounts","تخفیف‌ها","DISCOUNT MANAGEMENT",`<h3>کدهای تخفیف</h3><table class="table" style="margin-top:15px"><tr><th>کد</th><th>تخفیف</th><th>وضعیت</th></tr><tr><td>LUMI30</td><td>۳۰٪</td><td>${status("فعال")}</td></tr><tr><td>WELCOME10</td><td>۱۰٪</td><td>${status("فعال")}</td></tr></table>`);if(page==="reports")genericPage("reports","گزارش فروش","SALES REPORTS",`<h3>خلاصه عملکرد</h3><div class="metrics" style="margin-top:18px">${metric("فروش امروز","۳,۸۲۰,۰۰۰","+14%","↗")}${metric("فروش هفته","۱۲,۴۰۰,۰۰۰","+9%","↗")}${metric("میانگین سفارش","۷۸۰,۰۰۰","+4%","↗")}${metric("نرخ بازگشت","۲.۱٪","-0.4%","↓")}</div>`);if(page==="settings")genericPage("settings","تنظیمات","STORE SETTINGS",`<div class="field"><label>نام فروشگاه</label><input value="LUMI Beauty"></div><div class="field"><label>شماره پشتیبانی</label><input value="021-12345678"></div><button class="btn primary" onclick="toast('تنظیمات ذخیره شد')">ذخیره تغییرات</button>`)}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");navigate(b.dataset.page);if(innerWidth<800)$("sidebar").classList.remove("open")});
document.addEventListener("click",e=>{if(e.target.dataset.action){document.querySelector(`[data-page="${e.target.dataset.action}"]`)?.click()}if(e.target.classList.contains("view-order"))orderDetail(e.target.dataset.id);if(e.target.dataset.edit)productModal(Number(e.target.dataset.edit));if(e.target.dataset.delete){products=products.filter(p=>p.id!==Number(e.target.dataset.delete));saveShared();productsPage();toast("محصول حذف شد")}});
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.remove("show"));
$("saveProduct").onclick=saveProduct;$("hamburger").onclick=()=>$("sidebar").classList.toggle("open");$("notif").onclick=()=>toast("۱۲ سفارش منتظر بررسی است");$("storeLink").onclick=()=>toast("در نسخه آنلاین به فروشگاه متصل می‌شود");
document.querySelectorAll(".modal").forEach(m=>m.onclick=e=>{if(e.target===m)m.classList.remove("show")});
dashboard();
