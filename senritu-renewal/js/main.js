// ===== ローディング =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('is-hidden');
  }, 900);
});

// ===== ヘッダーのスクロール影 =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
}, { passive: true });

// ===== モバイルメニュー =====
const menuBtn = document.getElementById('menuBtn');
const gnav = document.getElementById('gnav');
menuBtn.addEventListener('click', () => {
  const open = gnav.classList.toggle('is-open');
  menuBtn.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
});
gnav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    gnav.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
  });
});

// ===== スクロールフェードイン =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== セラピスト詳細プロフィールモーダル =====
const modal = document.getElementById('profileModal');

function openProfile(id, url) {
  const t = THERAPISTS.find(p => p.id === Number(id));
  if (!t) return;

  document.getElementById('modalCatch').textContent = t.catch;
  document.getElementById('modalName').innerHTML =
    `${t.name} <small>(${t.age})</small>`;
  document.getElementById('modalHeight').textContent = t.height ? `身長 ${t.height}` : '';

  const tags = document.getElementById('modalTags');
  tags.innerHTML = '';
  t.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tags.appendChild(span);
  });

  const qa = document.getElementById('modalQa');
  qa.innerHTML = '';
  t.qa.forEach(({ label, value }) => {
    const div = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value;
    div.append(dt, dd);
    qa.appendChild(div);
  });

  const comment = document.getElementById('modalComment');
  comment.innerHTML = '';
  t.comment.split('\n').forEach(line => {
    const p = document.createElement('p');
    p.textContent = line;
    comment.appendChild(p);
  });

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-scroll').scrollTop = 0;
  modal.querySelector('.modal-close').focus();

  // 個別ページのURLに書き換える（検索エンジン・シェア用のURLと表示を一致させる）
  // file:// で開いたときなど pushState が使えない環境では何もしない
  if (url) {
    try { history.pushState({ profile: id }, '', url); } catch (e) {}
  }
}

function closeProfile(fromPopstate) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (!fromPopstate && history.state && history.state.profile) {
    try { history.back(); } catch (e) {}
  }
}

// カードは個別ページへの本物のリンク。JSが動く環境ではモーダルで表示する
document.querySelectorAll('.t-card[data-id]').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    openProfile(card.dataset.id, card.getAttribute('href'));
  });
});
modal.querySelectorAll('[data-modal-close]').forEach(el => {
  el.addEventListener('click', () => closeProfile(false));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeProfile(false);
});
window.addEventListener('popstate', () => {
  if (modal.classList.contains('is-open')) closeProfile(true);
});

// ===== クラシックBGM =====
// audio/bgm.mp3 にライセンス上問題のないクラシック音源を配置してください。
// （著作権切れの楽曲でも「演奏・録音」には権利が残るため、
//   フリー音源サイトやライセンス購入音源のご利用をおすすめします）
const bgmToggle = document.getElementById('bgmToggle');
const bgmAudio = document.getElementById('bgmAudio');
bgmToggle.addEventListener('click', async () => {
  try {
    if (bgmAudio.paused) {
      bgmAudio.volume = 0.35;
      await bgmAudio.play();
      bgmToggle.classList.add('is-playing');
      bgmToggle.setAttribute('aria-label', 'BGMを停止');
    } else {
      bgmAudio.pause();
      bgmToggle.classList.remove('is-playing');
      bgmToggle.setAttribute('aria-label', 'クラシックBGMを再生');
    }
  } catch (e) {
    console.warn('BGMを再生できませんでした。audio/bgm.mp3 を配置してください。', e);
  }
});
