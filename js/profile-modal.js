// ===== セラピスト詳細プロフィールモーダル（トップ・出勤情報ページ共通） =====
// data-id 付きのカード（セラピスト一覧・出勤情報）をクリックすると、
// 個別ページへ遷移する代わりにモーダルで詳細を表示する。
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

if (modal) {
  // 後から描画されるカード（週間スケジュール）にも効くよう、クリックを委譲で拾う
  document.addEventListener('click', e => {
    const card = e.target.closest('a[data-id]');
    if (!card) return;
    e.preventDefault();
    openProfile(card.dataset.id, card.getAttribute('href'));
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
}
