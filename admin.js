const c=window.VIZUKA_CONFIG;
const sb=supabase.createClient(c.SUPABASE_URL,c.SUPABASE_PUBLISHABLE_KEY);
const $=id=>document.getElementById(id);

async function refreshProducts(){
  const r=await sb.from("products").select("id,name,price,available,sort_order").order("sort_order");
  if(r.error){$("adminProducts").innerHTML=`<p style="color:#ff8aaa">${r.error.message}</p>`;return}
  $("adminProducts").innerHTML="";
  (r.data||[]).forEach(p=>{
    const row=document.createElement("div");
    row.className="admin-row product-admin-row";
    row.innerHTML=`
      <div class="admin-product-info">
        <b>${escapeHtml(p.name)}</b>
        <small>ID: ${escapeHtml(String(p.id))}</small>
      </div>
      <div class="admin-controls">
        <label class="admin-price-label">Price
          <input data-price="${p.id}" type="number" min="0" step="1" value="${Number(p.price)||0}">
        </label>
        <button class="admin-save" data-save="${p.id}">Save</button>
        <button class="admin-toggle ${p.available?'on':'off'}" data-toggle="${p.id}">${p.available?'ON':'OFF'}</button>
      </div>`;

    row.querySelector("[data-save]").onclick=async()=>{
      const input=row.querySelector("[data-price]");
      const price=Number(input.value);
      if(!Number.isFinite(price)||price<0){alert("Enter a valid price.");return;}
      const u=await sb.from("products").update({price}).eq("id",p.id);
      if(u.error) alert(u.error.message); else refreshProducts();
    };

    row.querySelector("[data-toggle]").onclick=async()=>{
      const u=await sb.from("products").update({available:!p.available}).eq("id",p.id);
      if(u.error) alert(u.error.message); else refreshProducts();
    };
    $("adminProducts").appendChild(row);
  });
}

async function refreshOrders(){
  const pr=await sb.from("products").select("id,name,price");
  if(pr.error){$("orders").innerHTML=`<tr><td colspan="5">${pr.error.message}</td></tr>`;return;}
  const map=Object.fromEntries((pr.data||[]).map(p=>[p.id,p]));
  const r=await sb.from("orders").select("*").order("created_at",{ascending:false});
  if(r.error){$("orders").innerHTML=`<tr><td colspan="5">${r.error.message}</td></tr>`;return;}
  $("orders").innerHTML=(r.data||[]).map(o=>{
    const p=map[o.product_id]||{};
    return `<tr>
      <td>${escapeHtml(String(o.order_id||o.id||""))}</td>
      <td>${escapeHtml(String(p.name||"Unknown"))}<br><small>Rs. ${p.price==null?"":Number(p.price).toLocaleString("en-IN")}</small></td>
      <td>${escapeHtml(String(o.player_uid||""))}</td>
      <td>${escapeHtml(String(o.payment_method||""))}</td>
      <td><select data-status="${escapeHtml(String(o.id))}">
        <option value="pending" ${o.status==="pending"?"selected":""}>pending</option>
        <option value="completed" ${o.status==="completed"?"selected":""}>completed</option>
        <option value="cancelled" ${o.status==="cancelled"?"selected":""}>cancelled</option>
      </select></td>
    </tr>`;
  }).join("");
  document.querySelectorAll("[data-status]").forEach(x=>x.onchange=async()=>{
    const u=await sb.from("orders").update({status:x.value}).eq("id",x.dataset.status);
    if(u.error) alert(u.error.message);
  });
}

function escapeHtml(v){return v.replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}

async function showDashboard(){
  $("loginPanel").hidden=true;
  $("dashboard").hidden=false;
  $("logout").hidden=false;
  await refreshProducts();
  await refreshOrders();
}

$("loginForm").onsubmit=async e=>{
  e.preventDefault();
  $("loginMsg").textContent="Signing in…";
  const r=await sb.auth.signInWithPassword({email:$("email").value,password:$("password").value});
  if(r.error) $("loginMsg").textContent=r.error.message;
  else showDashboard();
};

$("logout").onclick=async()=>{await sb.auth.signOut();location.reload()};
sb.auth.getSession().then(({data})=>{if(data.session)showDashboard()});
