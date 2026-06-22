/* supabase-config.js — 連線到 Supabase(正式會員後端)
   ── 安全性：這裡放的是「publishable / anon 公開金鑰」,本來就可以放在前端,
      真正的權限由資料表的 Row Level Security(RLS）控管。請勿在此放 secret key。
   ── 載入順序：本檔需在 store.js 之前載入,且其前面要先載入 supabase-js CDN。
*/
const SUPABASE_URL = 'https://mdgzoosmahfclwtmyafa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_x17rE8RPdn1PfGwASSZEIA_2Vfj0G_J';

window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* 把 Supabase 的登入狀態同步成「顯示用快取」djl_user(讓各頁的導覽列即時顯示），
   並抓取 profiles 表的姓名／手機／加入日期。未登入時清掉快取。 */
window.djlSyncUser = async function (session) {
  if (session && session.user) {
    const user = session.user;
    let profile = {};
    try {
      const { data } = await window.sb
        .from('profiles')
        .select('name,phone,created_at')
        .eq('id', user.id)
        .single();
      if (data) profile = data;
    } catch (e) { /* profiles 可能尚未建立,忽略 */ }
    const meta = user.user_metadata || {};
    const u = {
      id: user.id,
      email: user.email,
      name: profile.name || meta.name || '',
      phone: profile.phone || meta.phone || '',
      since: profile.created_at
        ? new Date(profile.created_at).toLocaleDateString('zh-TW')
        : (user.created_at ? new Date(user.created_at).toLocaleDateString('zh-TW') : ''),
    };
    localStorage.setItem('djl_user', JSON.stringify(u));
  } else {
    localStorage.removeItem('djl_user');
  }
  if (typeof updateAuthUI === 'function') updateAuthUI();
  if (typeof window.onDjlAuthChange === 'function') window.onDjlAuthChange();
};

/* 頁面載入或登入狀態改變時(含初始 INITIAL_SESSION）自動同步 */
window.sb.auth.onAuthStateChange((_event, session) => { window.djlSyncUser(session); });
