const c=window.VIZUKA_CONFIG;
const sb=supabase.createClient(c.SUPABASE_URL,c.SUPABASE_PUBLISHABLE_KEY);
const $=id=>document.getElementById(id);

async function refreshProducts(){
  const r=await sb.from("products").select("*").order("sort_order");
  if(r.error){$("adminProducts").textContent=r.error.message;return}
  $("adminProducts").innerHTML="";
  (r.data||[]).forEach(p=>{
    const row=document.createElement("div");row.className="admin-row";
    row.innerHTML=`<div><b>${p.name}</b><div style="color:#888b99;font-size:12px">${p.available?"Available":"Unavailable"} · Rs. ${Number(p.price).toLocaleString("en-IN")}</div></div><div style="display:flex;gap:6px"><button class="buy" data-toggle="${p.id}">${p.available?"ON":"OFF"}</button></div>`;
    row.querySelector("[data-toggle]").onclick=async()=>{
      const u=await sb.from("products").update({available:!p.available}).eq("id",p.id);
      if(u.error) alert(u.error.message); else refreshProducts();
    };
    $("adminProducts").appendChild(row);
  });
}
async function refreshOrders(){
  const pr=await sb.from("products").select("id,name,price");
  const map=Object.fromEntries((pr.data||[]).map(p=>[p.id,p]));
  const r=await sb.from("orders").select("*").order("created_at",{ascending:false});
  if(r.error){$("orders").innerHTML=`<tr><td colspan="5">${r.error.message}</td></tr>`;return}
  $("orders").innerHTML=(r.data||[]).map(o=>{
    const p=map[o.product_id]||{};
    return `<tr><td>${o.order_id||o.id}</td><td>${p.name||"Unknown"}<br><small>Rs. ${p.price??""}</small></td><td>${o.player_uid||""}</td><td>${o.payment_method||""}</td><td><select data-status="${o.id}"><option ${o.status==="pending"?"selected":""}>pending</option><option ${o.status==="completed"?"selected":""}>completed</option><option ${o.status==="cancelled"?"selected":""}>cancelled</option></select></td></tr>`;
  }).join("");
  document.querySelectorAll("[data-status]").forEach(x=>x.onchange=async()=>{const u=await sb.from("orders").update({status:x.value}).eq("id",x.dataset.status);if(u.error)alert(u.error.message)});
}
async function showDashboard(){
  $("loginPanel").hidden=true;$("dashboard").hidden=false;$("logout").hidden=false;
  await refreshProducts();await refreshOrders();
}
$("loginForm").onsubmit=async e=>{e.preventDefault();const r=await sb.auth.signInWithPassword({email:$("email").value,password:$("password").value});if(r.error)$("loginMsg").textContent=r.error.message;else showDashboard()};
$("logout").onclick=async()=>{await sb.auth.signOut();location.reload()};
sb.auth.getSession().then(({data})=>{if(data.session)showDashboard()});
