/* ============================================================
   RAM KOREA — home.js
   메인 페이지 전용 : 실적 슬라이더 · 최신 글 목록
   (CSP 적용을 위해 인라인 스크립트에서 분리)
   ============================================================ */
RAM.renderFeaturedWorks("#featuredWorks");

RAM.renderNewsList("#latestNotices", window.RAM_NOTICES, "pr/notice.html", 4);
RAM.renderNewsList("#latestPress", window.RAM_PRESS, "pr/press.html", 4);
