// ===== 週間出勤スケジュール =====
// キーは「今日から何日後か」(0=本日〜6)。
// 本日(0)は現サイトの実データ、それ以外はデモ用のサンプルです。
// 本番ではシステムの出勤データに置き換えてください。
const WEEKLY_SHIFTS = {
  0: [
    { id: 27, time: '14:00 - 翌2:00' },
    { id: 19, time: '19:30 - 翌2:00' },
  ],
  1: [
    { id: 20, time: '12:00 - 20:00' },
    { id: 17, time: '15:00 - 翌2:00' },
    { id: 9,  time: '18:00 - 24:00' },
  ],
  2: [
    { id: 23, time: '10:00 - 18:00' },
    { id: 25, time: '13:00 - 22:00' },
    { id: 27, time: '17:00 - 翌2:00' },
  ],
  3: [
    { id: 26, time: '12:00 - 21:00' },
    { id: 21, time: '16:00 - 翌1:00' },
  ],
  4: [
    { id: 22, time: '11:00 - 19:00' },
    { id: 11, time: '14:00 - 23:00' },
    { id: 19, time: '19:00 - 翌2:00' },
  ],
  5: [
    { id: 24, time: '13:00 - 20:00' },
    { id: 20, time: '15:00 - 24:00' },
    { id: 17, time: '18:00 - 翌2:00' },
  ],
  6: [
    { id: 27, time: '12:00 - 22:00' },
    { id: 9,  time: '14:00 - 翌1:00' },
    { id: 23, time: '17:00 - 翌2:00' },
  ],
};

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];
const WEEKDAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const tabsEl = document.getElementById('dayTabs');
const listEl = document.getElementById('dayList');
const headingEl = document.getElementById('dayHeading');

const today = new Date();
const days = [];
for (let i = 0; i < 7; i++) {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  days.push(d);
}

function renderTabs(activeIndex) {
  tabsEl.innerHTML = '';
  days.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'day-tab' + (i === activeIndex ? ' is-active' : '');
    btn.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
    btn.innerHTML =
      `<span class="dt-date">${d.getMonth() + 1}/${d.getDate()}</span>` +
      `<span class="dt-wd">${WEEKDAYS_JA[d.getDay()]} <small>${WEEKDAYS_EN[d.getDay()]}</small></span>` +
      (i === 0 ? '<span class="dt-today">本日</span>' : '');
    btn.addEventListener('click', () => {
      renderTabs(i);
      renderDay(i);
    });
    tabsEl.appendChild(btn);
  });
}

function renderDay(i) {
  const d = days[i];
  headingEl.textContent =
    `${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS_JA[d.getDay()]}）の出勤`;

  const shifts = WEEKLY_SHIFTS[i] || [];
  listEl.innerHTML = '';

  if (shifts.length === 0) {
    const p = document.createElement('p');
    p.className = 'day-empty';
    p.textContent = 'この日の出勤情報はまだ公開されていません。';
    listEl.appendChild(p);
    return;
  }

  shifts.forEach(({ id, time }) => {
    const t = THERAPISTS.find(p => p.id === id);
    if (!t) return;
    const card = document.createElement('a');
    card.className = 'schedule-card';
    card.href = `profile/${t.id}.html`;
    card.innerHTML =
      `<div class="schedule-photo"><span class="photo-placeholder">Photo</span></div>` +
      `<div class="schedule-body">` +
        `<p class="schedule-status">予約受付中</p>` +
        `<h3 class="schedule-name">${t.name} <small>(${t.age})</small></h3>` +
        `<p class="schedule-meta">身長 ${t.height}</p>` +
        `<p class="schedule-time">♪ ${time}</p>` +
        `<div class="tags">` +
          t.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') +
        `</div>` +
      `</div>`;
    listEl.appendChild(card);
  });
}

renderTabs(0);
renderDay(0);
