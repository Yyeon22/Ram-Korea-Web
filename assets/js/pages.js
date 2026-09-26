/* ============================================================
   RAM KOREA — pages.js
   목록/상세 페이지 전용 스크립트
   (사업실적 목록·상세, 공지사항, 보도자료·갤러리)
   site.js 다음에 불러옵니다.
   ============================================================ */
(function () {
  "use strict";
  if (!window.RAM) return;

  var $ = RAM.$, $$ = RAM.$$;
  var PER_PAGE = 10;

  /* 주소창 쿼리값 읽기 — 예) ?id=sample-01 */
  RAM.qs = function (name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  };

  /* 날짜 표기 — [확인 필요] 인 경우 — 로 대체 */
  function fmtDate(d) {
    var v = String(d || "");
    return /^\[확인 필요/.test(v) ? "—" : RAM.esc(v);
  }

  /* 줄바꿈 두 번을 문단으로 */
  function toParagraphs(text) {
    return String(text || "").split(/\n{2,}/).map(function (block) {
      return "<p>" + RAM.ph(block).replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }

  /* ============================================================
     1. 사업실적 — 목록
     ============================================================ */
  RAM.initNoticePage = function () {
    var wrap = $("[data-notice]");
    if (!wrap || !window.RAM_NOTICES) return;
    var id = RAM.qs("id");
    var page = 1;

    function detail() {
      var idx = -1;
      RAM_NOTICES.forEach(function (n, i) { if (n.id === id) idx = i; });
      if (idx === -1) {
        wrap.innerHTML = '<div class="board-empty">요청하신 글을 찾을 수 없습니다.</div>' +
          '<div style="text-align:center;margin-top:28px"><a class="btn btn--line" href="' +
          RAM.path("pr/notice.html") + '">목록으로</a></div>';
        return;
      }
      var item = RAM_NOTICES[idx];
      var prev = RAM_NOTICES[idx - 1], next = RAM_NOTICES[idx + 1];
      document.title = String(item.title).replace(/\[확인 필요[^\]]*\]/g, "공지사항") + " | (주)람코리아";

      var navHtml = '<div class="detail-nav">';
      navHtml += prev
        ? '<a class="detail-nav__item" href="' + RAM.path("pr/notice.html?id=" + encodeURIComponent(prev.id)) +
          '"><span>이전 글</span><strong>' + RAM.ph(prev.title) + "</strong></a>"
        : '<span class="detail-nav__item is-disabled"><span>이전 글</span><strong>없음</strong></span>';
      navHtml += '<a class="btn btn--line" href="' + RAM.path("pr/notice.html") + '">목록</a>';
      navHtml += next
        ? '<a class="detail-nav__item is-next" href="' + RAM.path("pr/notice.html?id=" + encodeURIComponent(next.id)) +
          '"><span>다음 글</span><strong>' + RAM.ph(next.title) + "</strong></a>"
        : '<span class="detail-nav__item is-next is-disabled"><span>다음 글</span><strong>없음</strong></span>';
      navHtml += "</div>";

      wrap.innerHTML = '' +
        '<article class="board-view">' +
          '<header class="board-view__head">' +
            '<h2 class="t-h3">' + RAM.ph(item.title) + "</h2>" +
            '<p class="t-caption">등록일 ' + fmtDate(item.date) + "</p>" +
          "</header>" +
          '<div class="board-view__body prose">' + toParagraphs(item.body) + "</div>" +
        "</article>" + navHtml;
    }

    function list() {
      var total = RAM_NOTICES.length;
      var pages = Math.max(1, Math.ceil(total / PER_PAGE));
      page = Math.min(page, pages);
      var rows = RAM_NOTICES.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(function (n, i) {
        var no = total - ((page - 1) * PER_PAGE + i);
        return "<tr>" +
          '<td class="is-hide-m">' + no + "</td>" +
          '<td class="is-title"><a href="' + RAM.path("pr/notice.html?id=" + encodeURIComponent(n.id)) + '">' +
            RAM.ph(n.title) + "</a></td>" +
          "<td>" + fmtDate(n.date) + "</td>" +
        "</tr>";
      }).join("");

      wrap.innerHTML = '' +
        '<p class="t-caption" style="margin-bottom:12px">전체 <strong>' + total + "</strong>건</p>" +
        '<table class="table-list">' +
          "<caption class=\"sr-only\">공지사항 목록</caption>" +
          '<thead><tr><th class="is-hide-m" scope="col" style="width:90px">번호</th>' +
          '<th scope="col">제목</th><th scope="col" style="width:130px">등록일</th></tr></thead>' +
          "<tbody>" + (rows || '<tr><td colspan="3" class="board-empty">등록된 글이 없습니다.</td></tr>') + "</tbody>" +
        "</table>" +
        pagination(pages);

      bindPagination(function (p) { page = p; list(); });
    }

    if (id) detail(); else list();
  };

  /* ============================================================
     4. 보도자료 · 갤러리 (목록 + 상세)
     ============================================================ */
  RAM.initPressPage = function () {
    var wrap = $("[data-press]");
    if (!wrap || !window.RAM_PRESS) return;
    var id = RAM.qs("id");

    function typeLabel(t) { return t === "press" ? "보도자료" : "갤러리"; }

    if (id) {
      var idx = -1;
      RAM_PRESS.forEach(function (p, i) { if (p.id === id) idx = i; });
      if (idx === -1) {
        wrap.innerHTML = '<div class="board-empty">요청하신 글을 찾을 수 없습니다.</div>' +
          '<div style="text-align:center;margin-top:28px"><a class="btn btn--line" href="' +
          RAM.path("pr/press.html") + '">목록으로</a></div>';
        return;
      }
      var item = RAM_PRESS[idx];
      document.title = String(item.title).replace(/\[확인 필요[^\]]*\]/g, "보도자료") + " | (주)람코리아";
      var link = item.link
        ? '<p style="margin-top:28px"><a class="btn btn--primary" href="' + RAM.esc(item.link) +
          '" target="_blank" rel="noopener">원문 기사 보기</a></p>'
        : "";
      wrap.innerHTML = '' +
        '<article class="board-view">' +
          '<header class="board-view__head">' +
            '<p class="t-caption" style="color:var(--red-500);font-weight:700">' + typeLabel(item.type) + "</p>" +
            '<h2 class="t-h3" style="margin-top:6px">' + RAM.ph(item.title) + "</h2>" +
            '<p class="t-caption">' + fmtDate(item.date) +
              (item.source ? " · " + RAM.ph(item.source) : "") + "</p>" +
          "</header>" +
          '<div class="board-view__body">' +
            '<img src="' + RAM.path(item.image) + '" alt="' + RAM.esc(item.title) +
              '" style="width:100%;border-radius:4px;margin-bottom:28px" loading="lazy">' +
            '<div class="prose">' + toParagraphs(item.summary) + "</div>" + link +
          "</div>" +
        "</article>" +
        '<div style="text-align:center;margin-top:44px"><a class="btn btn--line" href="' +
        RAM.path("pr/press.html") + '">목록으로</a></div>';
      return;
    }

    wrap.innerHTML = '<div class="grid grid--3">' + RAM_PRESS.map(function (p) {
      return '' +
        '<a class="card" href="' + RAM.path("pr/press.html?id=" + encodeURIComponent(p.id)) + '">' +
          '<div class="card__thumb"><img src="' + RAM.path(p.image) + '" alt="' + RAM.esc(p.title) +
            '" loading="lazy" width="800" height="600"></div>' +
          '<div class="card__body">' +
            '<span class="t-caption" style="color:var(--red-500);font-weight:700">' + typeLabel(p.type) + "</span>" +
            '<h3 class="card__title">' + RAM.ph(p.title) + "</h3>" +
            '<p class="card__meta">' + fmtDate(p.date) + (p.source ? " · " + RAM.ph(p.source) : "") + "</p>" +
          "</div>" +
        "</a>";
    }).join("") + "</div>";
  };

  /* ---------- 공용 페이지네이션 ---------- */
  function pagination(pages) {
    if (pages <= 1) return "";
    var html = '<div class="pagination">';
    for (var i = 1; i <= pages; i++) {
      html += '<button type="button" data-page="' + i + '">' + i + "</button>";
    }
    return html + "</div>";
  }
  function bindPagination(onSelect) {
    $$("[data-page]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        onSelect(parseInt(btn.getAttribute("data-page"), 10));
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  /* ---------- 자동 초기화 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    RAM.initNoticePage();
    RAM.initPressPage();
  });
})();
