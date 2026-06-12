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
