/* version-check.js — 偵測到新版就自動更新（訪客不用手動清快取）
   機制：
   1) 每個 HTML 於 <head> 內以 window.APP_VER 標記「這次載入的版本」。
   2) 本檔定時抓 version.json（避開快取），拿到伺服器最新版本。
   3) 若伺服器版本 ≠ 目前載入版本 → 代表已有新版部署，
      以帶 _v 參數的網址重新載入（繞過 HTML 的 10 分鐘快取），
      新的 HTML 會帶新的 ?v= 資源網址，連 CSS/JS 一起抓新版。
   ── 每次部署只要 bump-version.sh 換一個版本號，全站自動更新。 */
(function () {
  var CURRENT = window.APP_VER ? String(window.APP_VER) : null;
  var CHECK_MS = 60000; // 每 60 秒檢查一次

  // 進站時若網址帶 _v（重載留下的），清掉讓網址乾淨（保留其他參數，如 ?id=）
  try {
    var u0 = new URL(location.href);
    if (u0.searchParams.has('_v')) {
      u0.searchParams.delete('_v');
      var q = u0.searchParams.toString();
      history.replaceState(null, '', u0.pathname + (q ? '?' + q : '') + u0.hash);
    }
  } catch (e) {}

  function reloadFresh(v) {
    try {
      var u = new URL(location.href);
      u.searchParams.set('_v', v); // 換一個沒被快取過的網址 → 抓到最新 HTML
      location.replace(u.toString());
    } catch (e) { location.reload(); }
  }

  function isTyping() {
    var el = document.activeElement;
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }

  function check() {
    fetch('version.json?_=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || d.v == null) return;
        var server = String(d.v);
        if (CURRENT == null) { CURRENT = server; return; } // 無 APP_VER 時以首次為基準
        if (server !== CURRENT && !isTyping()) reloadFresh(server);
      })
      .catch(function () {});
  }

  setInterval(check, CHECK_MS);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
  check(); // 進站立即查一次
})();
