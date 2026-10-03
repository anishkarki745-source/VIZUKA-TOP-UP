const c=window.VIZUKA_CONFIG;
const sb=supabase.createClient(c.SUPABASE_URL,c.SUPABASE_PUBLISHABLE_KEY);
let products=[],selected=null;
const fallback=[
  ["level-all","Level Up Pass — All Levels",650],["level-6","Level 6",75],["level-10","Level 10",130],["level-15","Level 15",130],["level-20","Level 20",130],["level-25","Level 25",130],["level-30","Level 30",170],["weekly-lite","Weekly Lite",100],["weekly","Weekly",230],["monthly","Monthly",1150],["weekly-monthly","Weekly + Monthly",1350],["weekly-monthly-lite","Weekly + Monthly + Weekly Lite",1450],["d50","50 Diamonds",70],["d115","115 Diamonds",120],["d240","240 Diamonds",250],["d610","610 Diamonds",550]
];
const money=n=>"Rs. "+Number(n).toLocaleString("en-IN");
async function load(){
  const r=await sb.from("products").select("*").order("sort_order");
  if(r.error){console.error(r.error);products=fallback.map((x,i)=>({id:x[0],name:x[1],price:x[2],available:true,sort_order:i}));}
  else products=r.data?.length?r.data:fallback.map((x,i)=>({id:x[0],name:x[1],price:x[2],available:true,sort_order:i}));
  render();
}
function render(){
  const box=document.getElementById("products");
  if(!box)return;
  box.innerHTML="";
  products.filter(p=>p.available).forEach(p=>{
    const b=document.createElement("button");
    b.type="button";b.className="product";
    b.innerHTML=`<strong>${p.name}</strong><span>${money(p.price)}</span>`;
    b.onclick=()=>{selected=p;document.querySelectorAll(".product").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");};
    box.appendChild(b);
  });
}
document.getElementById("orderForm").onsubmit=async e=>{
  e.preventDefault();
  const m=document.getElementById("msg"),file=document.getElementById("screenshot").files[0];
  if(!selected){m.textContent="Select a package first.";return;}
  if(!file){m.textContent="Please upload your payment screenshot.";return;}
  const uid=document.getElementById("uid").value.trim(),name=document.getElementById("name").value.trim(),payment=document.getElementById("payment").value;
  const id="VZ-"+Date.now().toString().slice(-6);
  const r=await sb.from("orders").insert({order_id:id,product_id:selected.id,player_uid:uid,player_name:name||null,payment_method:payment,status:"pending"});
  if(r.error){m.textContent=r.error.message;console.error(r.error);return;}
  const text=`*VIZUKA TOPUP ORDER*\n\nOrder ID: ${id}\nPackage: ${selected.name}\nPrice: ${money(selected.price)}\nPlayer UID: ${uid}\nName: ${name||"Not provided"}\nPayment: ${payment}\n\nPayment screenshot is ready. Please attach it to this WhatsApp chat.`;
  window.open(`https://wa.me/${c.WHATSAPP}?text=${encodeURIComponent(text)}`,"_blank");
  m.textContent="Order saved. Please attach the payment screenshot in WhatsApp.";
  e.target.reset();selected=null;document.querySelectorAll(".product").forEach(x=>x.classList.remove("selected"));
};
load();
