const c=window.VIZUKA_CONFIG;
const sb=supabase.createClient(c.SUPABASE_URL,c.SUPABASE_PUBLISHABLE_KEY);
let products=[],selected=null;

const money=n=>"Rs. "+Number(n).toLocaleString("en-IN");

function iconFor(p){
  const s=(p.name||"").toLowerCase();
  if(s.includes("diamond")) return "💎";
  if(s.includes("weekly")||s.includes("monthly")) return "👑";
  if(s.includes("level")) return "🎫";
  return "🎁";
}
function subtitleFor(p){
  const s=(p.name||"").toLowerCase();
  if(s.includes("diamond")) return "Diamond Pack";
  if(s.includes("weekly")&&s.includes("monthly")) return "Special Bundle";
  if(s.includes("weekly")) return "Membership";
  if(s.includes("level")) return "Free Fire";
  return p.category||"Top Up";
}
function render(){
  const el=document.getElementById("products");
  if(!el)return;
  el.innerHTML="";
  products.filter(p=>p.available).forEach((p,i)=>{
    const b=document.createElement("button");
    b.className="product";
    b.innerHTML=`<div class="product-art"><span class="badge">${i<4?"POPULAR":"TOP UP"}</span><span class="art-icon">${iconFor(p)}</span></div><div class="product-info"><strong>${p.name}</strong><small>${subtitleFor(p)}</small><span class="starting">Starting at</span><div class="price">${money(p.price)}</div><span class="buy">Buy Now</span></div>`;
    b.onclick=()=>{
      selected=p;
      document.querySelectorAll(".product").forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");
      const pill=document.getElementById("selectedPill");
      pill.textContent=`Selected: ${p.name} — ${money(p.price)}`;
      pill.classList.add("active");
      document.getElementById("orderSection").scrollIntoView({behavior:"smooth",block:"start"});
    };
    el.appendChild(b);
  });
}
async function load(){
  const r=await sb.from("products").select("*").order("sort_order");
  if(r.error){
    console.error(r.error);
    document.getElementById("products").innerHTML='<div style="grid-column:1/-1;color:#ff9abb;padding:15px">Could not load products. Please refresh.</div>';
    return;
  }
  products=r.data||[];
  render();
}
document.getElementById("orderForm").onsubmit=async e=>{
  e.preventDefault();
  const m=document.getElementById("msg");
  const file=document.getElementById("screenshot").files[0];
  if(!selected){m.textContent="Select a package first.";return}
  if(!file){m.textContent="Please upload your payment screenshot.";return}
  const id="VZ-"+Date.now().toString().slice(-6);
  const uid=document.getElementById("uid").value.trim();
  const name=document.getElementById("name").value.trim();
  const amount: selected.price,
  const payment=document.getElementById("payment").value;
  const r=await sb.from("orders").insert({order_id:id,product_id:selected.id,product_name:selected.name,player_uid:uid,payment_method:payment,status:"pending"});
  if(r.error){m.textContent=r.error.message;console.error(r.error);return}
  const text=`*VIZUKA TOPUP ORDER*\n\nOrder ID: ${id}\nProduct: ${selected.name}\nPrice: ${money(selected.price)}\nPlayer UID: ${uid}\nName: ${name||"Not provided"}\nPayment: ${payment}\n\nPayment screenshot is ready. Please attach it to this WhatsApp chat.`;
  window.open(`https://wa.me/${c.WHATSAPP}?text=${encodeURIComponent(text)}`,"_blank");
  m.textContent="Order saved. Please attach the payment screenshot in WhatsApp.";
  e.target.reset();selected=null;
  document.querySelectorAll(".product").forEach(x=>x.classList.remove("selected"));
  const pill=document.getElementById("selectedPill");pill.textContent="Select a package above";pill.classList.remove("active");
};
document.getElementById("menuBtn").onclick=()=>document.getElementById("drawer").classList.add("open");
document.getElementById("closeDrawer").onclick=()=>document.getElementById("drawer").classList.remove("open");
document.querySelectorAll(".drawer a").forEach(a=>a.onclick=()=>document.getElementById("drawer").classList.remove("open"));
load();
