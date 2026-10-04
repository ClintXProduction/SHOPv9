const state={products:[],lang:localStorage.getItem("cltx4_lang")||"en",theme:localStorage.getItem("cltx4_theme")||"dark",cart:JSON.parse(localStorage.getItem("cltx4_cart")||"[]")};
const $=s=>document.querySelector(s);
const money=n=>`₱${Number(n).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const t=(en,fil)=>state.lang==="fil"?(fil||en):en;
function save(){localStorage.setItem("cltx4_cart",JSON.stringify(state.cart));renderCart();updateCount()}
function updateCount(){$("#cartCount").textContent=state.cart.reduce((a,x)=>a+x.qty,0)}
function toast(msg){const e=$("#toast");e.textContent=msg;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1800)}
function setTheme(){document.body.classList.toggle("light",state.theme==="light");$("#themeBtn").textContent=state.theme==="light"?"☾":"☼";localStorage.setItem("cltx4_theme",state.theme)}
function setLang(){document.documentElement.lang=state.lang==="fil"?"fil":"en";$("#langBtn").textContent=state.lang==="fil"?"🇵🇭 FIL":"🇺🇸 EN";localStorage.setItem("cltx4_lang",state.lang);renderProducts();renderCategories();renderCart()}
function stockText(p){if(p.stock<=0)return [t("Out of stock","Out of stock"),"out"];if(p.stock<=5)return [t("Low Stock","Kaunti ang Stock"),"low"];return [t("In Stock","May Stock"),"ok"]}
function productName(p){return state.lang==="fil"?(p.filipinoName||p.name):p.name}
function productDesc(p){return state.lang==="fil"?(p.filipinoDescription||p.description):p.description}
function filtered(){
 let q=$("#search").value.trim().toLowerCase(), c=$("#category").value, arr=state.products.filter(p=>(c==="all"||p.category===c)&&(!q||[p.id,p.name,p.filipinoName,p.category,p.description,p.filipinoDescription].join(" ").toLowerCase().includes(q)));
 const s=$("#sort").value;
 if(s==="priceLow")arr.sort((a,b)=>a.price-b.price); else if(s==="priceHigh")arr.sort((a,b)=>b.price-a.price); else if(s==="name")arr.sort((a,b)=>productName(a).localeCompare(productName(b))); else if(s==="newest")arr.reverse(); else arr.sort((a,b)=>(b.badge==="FEATURED")-(a.badge==="FEATURED"));
 return arr;
}
function renderProducts(){
 const arr=filtered(), grid=$("#productGrid");$("#resultInfo").textContent=`${arr.length} product${arr.length===1?"":"s"} shown`;
 $("#empty").hidden=arr.length>0;grid.innerHTML=arr.map(p=>{
  const [st,cl]=stockText(p);
  return `<article class="product"><a href="#product=${encodeURIComponent(p.id)}"><img class="product-img" loading="lazy" src="${p.image}" alt="${productName(p)}" onerror="this.src='favicon.svg'"></a>${p.badge?`<span class="badge">${p.badge}</span>`:""}<div class="product-body"><span class="category-label">${p.category}</span><h3>${productName(p)}</h3><p class="muted small">${productDesc(p)}</p><div class="price">${money(p.price)}</div><div class="stock ${cl}">${st} • ${p.stock}</div><div class="product-actions"><button class="btn" onclick="openProduct('${p.id}')">${t("Details","Detalye")}</button><button class="btn primary" ${p.stock<=0?"disabled":""} onclick="addToCart('${p.id}')">${t("Add to Cart","Idagdag")}</button></div></div></article>`}).join("");
}
function renderCategories(){
 const cats=[...new Set(state.products.map(p=>p.category))].sort(), sel=$("#category"), old=sel.value;
 sel.innerHTML=`<option value="all">${t("All Categories","Lahat ng Categories")}</option>`+cats.map(c=>`<option value="${c}">${c}</option>`).join("");sel.value=cats.includes(old)?old:"all";
 $("#categoryGrid").innerHTML=cats.map(c=>`<button class="category" onclick="pickCategory('${c}')"><div class="symbol">◈</div><b>${c}</b></button>`).join("");
}
function pickCategory(c){$("#category").value=c;$("#search").value="";renderProducts();location.hash="products"}
function openProduct(id){
 const p=state.products.find(x=>x.id===id);if(!p)return;
 const [st,cl]=stockText(p);
 $("#modalContent").innerHTML=`<div class="modal-grid"><img src="${p.image}" alt="${productName(p)}" onerror="this.src='favicon.svg'"><div><span class="category-label">${p.category}</span><h2>${productName(p)}</h2><div class="modal-price">${money(p.price)}</div><p class="muted">${productDesc(p)}</p><p class="stock ${cl}">${st} • ${p.stock}</p><ul class="feature-list"><li>DIY Ready</li><li>CLTX4 Catalog</li><li>${p.category}</li></ul><button class="btn primary full" ${p.stock<=0?"disabled":""} onclick="addToCart('${p.id}');closeModal()">${t("Add to Cart","Idagdag sa Cart")}</button></div></div>`;
 $("#modal").hidden=false;history.replaceState(null,"",`#product=${encodeURIComponent(id)}`);
}
function closeModal(){$("#modal").hidden=true;$("#modalContent").innerHTML=""}
function addToCart(id){const p=state.products.find(x=>x.id===id);if(!p||p.stock<=0)return toast(t("Out of stock","Ubos ang stock"));let item=state.cart.find(x=>x.id===id);if(item)item.qty=Math.min(item.qty+1,p.stock);else state.cart.push({id,qty:1});save();toast(t("Added to cart","Naidagdag sa cart"))}
function removeCart(id){state.cart=state.cart.filter(x=>x.id!==id);save()}
function changeQty(id,d){const item=state.cart.find(x=>x.id===id),p=state.products.find(x=>x.id===id);if(!item||!p)return;item.qty=Math.max(0,Math.min(item.qty+d,p.stock));if(item.qty===0)removeCart(id);else save()}
function renderCart(){
 const box=$("#cartItems"),items=state.cart.map(x=>({...x,p:state.products.find(p=>p.id===x.id)})).filter(x=>x.p);
 if(!items.length){box.innerHTML=`<div class="empty">${t("Your cart is empty.","Walang laman ang cart.")}</div>`}
 else box.innerHTML=items.map(x=>`<div class="cart-item"><img src="${x.p.image}" alt=""><div><b>${productName(x.p)}</b><div class="muted small">${money(x.p.price)} × ${x.qty}</div></div><div><div class="qty"><button onclick="changeQty('${x.id}',-1)">−</button><b>${x.qty}</b><button onclick="changeQty('${x.id}',1)">+</button></div><button class="btn small" onclick="removeCart('${x.id}')">${t("Remove","Alisin")}</button></div></div>`).join("");
 let qty=items.reduce((a,x)=>a+x.qty,0),total=items.reduce((a,x)=>a+x.qty*x.p.price,0);$("#cartQty").textContent=qty;$("#cartTotal").textContent=money(total)
}
function checkout(){if(!state.cart.length)return toast(t("Cart is empty","Walang laman ang cart"));const lines=state.cart.map(x=>{let p=state.products.find(p=>p.id===x.id);return `${productName(p)} x${x.qty} = ${money(p.price*x.qty)}`}).join("%0A");const total=state.cart.reduce((a,x)=>{let p=state.products.find(p=>p.id===x.id);return a+p.price*x.qty},0);const subject=encodeURIComponent("CLTX4 MARKETPLACE Order Request");const body=encodeURIComponent(`Hello CLTX4,%0A%0AI would like to order:%0A${decodeURIComponent(lines)}%0A%0ATotal: ${money(total)}%0A%0AName:%0AContact:%0AAddress:%0A`);location.href=`mailto:?subject=${subject}&body=${body}`}
async function load(){
 closeModal();
 try{const r=await fetch("data/products.json");if(!r.ok)throw Error();state.products=await r.json();renderCategories();renderProducts();renderCart();updateCount();setTheme();setLang();
 }catch(e){$("#productGrid").innerHTML=`<div class="empty" style="grid-column:1/-1">Unable to load product catalog.<br>Check <b>data/products.json</b> and your GitHub Pages path.</div>`}
}
$("#search").addEventListener("input",renderProducts);$("#category").addEventListener("change",renderProducts);$("#sort").addEventListener("change",renderProducts);
$("#clear").addEventListener("click",()=>{$("#search").value="";$("#category").value="all";$("#sort").value="featured";renderProducts()});
$("#clearCart").addEventListener("click",()=>{state.cart=[];save()});$("#checkout").addEventListener("click",checkout);
$("#themeBtn").addEventListener("click",()=>{state.theme=state.theme==="dark"?"light":"dark";setTheme()});$("#langBtn").addEventListener("click",()=>{state.lang=state.lang==="en"?"fil":"en";setLang()});
$("#hamb").addEventListener("click",()=>{const n=$("#navLinks");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="72px";n.style.left="0";n.style.right="0";n.style.padding="10px";n.style.background="var(--surface)"});
$("#modalClose").addEventListener("click",closeModal);$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
window.addToCart=addToCart;window.openProduct=openProduct;window.closeModal=closeModal;window.changeQty=changeQty;window.removeCart=removeCart;window.pickCategory=pickCategory;
load();
