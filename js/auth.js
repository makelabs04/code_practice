(function(){
  const API='/api';
  window.Auth={
    token:()=>localStorage.getItem('cc-auth-token'),
    user:()=>{try{return JSON.parse(localStorage.getItem('cc-auth-user'))}catch{return null}},
    headers:()=>({Authorization:`Bearer ${localStorage.getItem('cc-auth-token')||''}`}),
    storageKey:(base)=>{const u=window.Auth.user();return `${base}-${u?.id||'guest'}`},
    logout:()=>{localStorage.removeItem('cc-auth-token');localStorage.removeItem('cc-auth-user');location.reload()}
  };
  async function submit(type,form,msg){
    msg.textContent='';
    const body=Object.fromEntries(new FormData(form).entries());
    try{
      const r=await fetch(`${API}/auth/${type}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d=await r.json();
      if(!d.success) throw new Error(d.message||'Authentication failed');
      localStorage.setItem('cc-auth-token',d.token);localStorage.setItem('cc-auth-user',JSON.stringify(d.user));location.reload();
    }catch(e){msg.textContent=e.message}
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const screen=document.getElementById('auth-screen'); const user=window.Auth.user(); const token=window.Auth.token();
    if(token&&user){screen?.classList.add('hidden'); const n=document.getElementById('auth-user-name');if(n)n.textContent=user.name; return;}
    screen?.classList.remove('hidden');
    document.querySelectorAll('.auth-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.auth-tab,.auth-form').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(`${b.dataset.tab}-form`).classList.add('active')});
    const lf=document.getElementById('login-form'),rf=document.getElementById('register-form'),m=document.getElementById('auth-message');
    lf?.addEventListener('submit',e=>{e.preventDefault();submit('login',lf,m)});rf?.addEventListener('submit',e=>{e.preventDefault();submit('register',rf,m)});
    document.getElementById('auth-logout')?.addEventListener('click',window.Auth.logout);
  });
})();
