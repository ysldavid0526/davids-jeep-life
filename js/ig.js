/* ig.js — 點首頁 IG 縮圖，站內彈窗直接看該貼文／影片（不用離開網站） */
(function () {
  var cells = document.querySelectorAll('.ig-cell');
  if (!cells.length) return;

  var modal = document.createElement('div');
  modal.className = 'igm';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="igm-scrim"></div>' +
    '<div class="igm-card">' +
      '<button class="igm-x" aria-label="關閉">×</button>' +
      '<div class="igm-frame" id="igmFrame"></div>' +
      '<a class="igm-open" target="_blank" rel="noopener">在 Instagram 開啟 ↗</a>' +
    '</div>';
  document.body.appendChild(modal);

  var frame = modal.querySelector('#igmFrame');
  var openLink = modal.querySelector('.igm-open');

  function embedFrom(href) {
    var m = (href || '').match(/\/(p|reel|tv)\/([^\/?#]+)/);
    return m ? 'https://www.instagram.com/' + m[1] + '/' + m[2] + '/embed' : null;
  }
  function open(href) {
    var e = embedFrom(href); if (!e) { window.open(href, '_blank'); return; }
    frame.innerHTML = '<iframe src="' + e + '" allow="autoplay; encrypted-media; clipboard-write; picture-in-picture" allowfullscreen scrolling="no"></iframe>';
    openLink.href = href;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    frame.innerHTML = ''; document.body.style.overflow = '';
  }

  cells.forEach(function (a) {
    a.addEventListener('click', function (ev) { ev.preventDefault(); open(a.getAttribute('href')); });
  });
  modal.querySelector('.igm-scrim').addEventListener('click', close);
  modal.querySelector('.igm-x').addEventListener('click', close);
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();
