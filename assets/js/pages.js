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
  RAM.initProjectList = function () {
    var grid = $("[data-project-grid]");
    if (!grid || !window.RAM_PROJECTS) return;
    var filterWrap = $("[data-project-filter]");
    var current = "all";

    function cardHtml(item) {
      var href = RAM.path("projects/detail.html?id=" + encodeURIComponent(item.id));
      var stage = item.stage
        ? '<span class="badge badge--ongoing">' + RAM.esc(item.stage) + "</span>"
        : "";
      var sub = [item.location || item.client, item.households]
        .filter(function (v) { return v; }).join(" · ");
      return '' +
        '<a class="card" href="' + href + '">' +
          '<div class="card__thumb">' +
            '<img src="' + RAM.path(item.thumb) + '" alt="' + RAM.esc(item.title) + '" loading="lazy" width="800" height="600">' +
          "</div>" +
          '<div class="card__body">' +
            '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
              '<span class="t-caption" style="color:var(--red-500);font-weight:700">' + RAM.esc(item.category) + "</span>" +
              stage +
            "</div>" +
            '<h3 class="card__title">' + RAM.ph(item.title) + "</h3>" +
            '<p class="card__desc">' + RAM.ph(sub) + "</p>" +
            '<p class="card__meta">' + RAM.ph(item.role) + "</p>" +
          "</div>" +
        "</a>";
    }

    /* 필터 버튼을 데이터의 category 에서 자동 생성 */
    function buildFilter() {
      if (!filterWrap) return;
      var cats = [];
      RAM_PROJECTS.forEach(function (p) {
        if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category);
      });
      var html = '<button class="filter__btn" type="button" data-filter="all" aria-pressed="true">전체</button>';
      cats.forEach(function (c) {
        html += '<button class="filter__btn" type="button" data-filter="' + RAM.esc(c) +
          '" aria-pressed="false">' + RAM.esc(c) + "</button>";
      });
      filterWrap.innerHTML = html;

      $$("[data-filter]", filterWrap).forEach(function (btn) {
        btn.addEventListener("click", function () {
          current = btn.getAttribute("data-filter");
          $$("[data-filter]", filterWrap).forEach(function (b) {
            b.setAttribute("aria-pressed", String(b === btn));
          });
          render();
        });
      });
    }

    function render() {
      var list = RAM_PROJECTS.filter(function (p) {
        return current === "all" || p.category === current;
      });
      grid.innerHTML = list.length
        ? list.map(cardHtml).join("")
        : '<p class="board-empty" style="grid-column:1/-1">해당하는 실적이 없습니다.</p>';
    }

    buildFilter();
    render();
  };

  /* ============================================================
     2. 사업실적 — 상세
     ============================================================ */
  RAM.initProjectDetail = function () {
    var wrap = $("[data-project-detail]");
    if (!wrap || !window.RAM_PROJECTS) return;

    var id = RAM.qs("id");
    var idx = -1;
    RAM_PROJECTS.forEach(function (p, i) { if (p.id === id) idx = i; });

    if (idx === -1) {
      wrap.innerHTML =
        '<div class="board-empty">' +
          "<p>요청하신 실적을 찾을 수 없습니다.</p>" +
          '<p style="margin-top:20px"><a class="btn btn--line" href="' + RAM.path("projects/index.html") + '">실적 목록으로</a></p>' +
        "</div>";
      return;
    }

    var item = RAM_PROJECTS[idx];
    var prev = RAM_PROJECTS[idx - 1];
    var next = RAM_PROJECTS[idx + 1];

    var titleEl = $("[data-project-title]");
    if (titleEl) titleEl.innerHTML = RAM.ph(item.title);
    var crumbEl = $("[data-project-crumb]");
    if (crumbEl) crumbEl.textContent = String(item.title).replace(/\[확인 필요[^\]]*\]/g, "실적 상세");
    document.title = String(item.title).replace(/\[확인 필요[^\]]*\]/g, "사업실적") + " | (주)람코리아";

    var images = (item.images && item.images.length ? item.images : [item.thumb]);
    var gallery = images.map(function (src, i) {
      return '<figure class="gallery__item"><img src="' + RAM.path(src) + '" alt="' +
        RAM.esc(item.title) + " 사진 " + (i + 1) + '" loading="lazy" width="800" height="600"></figure>';
    }).join("");

    /* 값이 비어 있는 항목은 표에서 아예 빼기 */
    function row(label, value) {
      if (!value) return "";
      return "<tr><th scope=\"row\">" + label + "</th><td>" + RAM.ph(value) + "</td></tr>";
    }

    var navHtml = '<div class="detail-nav">';
    navHtml += prev
      ? '<a class="detail-nav__item" href="' + RAM.path("projects/detail.html?id=" + encodeURIComponent(prev.id)) +
        '"><span>이전 실적</span><strong>' + RAM.ph(prev.title) + "</strong></a>"
      : '<span class="detail-nav__item is-disabled"><span>이전 실적</span><strong>없음</strong></span>';
    navHtml += '<a class="btn btn--line" href="' + RAM.path("projects/index.html") + '">목록</a>';
    navHtml += next
      ? '<a class="detail-nav__item is-next" href="' + RAM.path("projects/detail.html?id=" + encodeURIComponent(next.id)) +
        '"><span>다음 실적</span><strong>' + RAM.ph(next.title) + "</strong></a>"
      : '<span class="detail-nav__item is-next is-disabled"><span>다음 실적</span><strong>없음</strong></span>';
    navHtml += "</div>";

    wrap.innerHTML = '' +
      '<div class="gallery" style="margin-bottom:48px">' + gallery + "</div>" +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px">' +
        '<span class="t-caption" style="color:var(--red-500);font-weight:700">' + RAM.esc(item.category) + "</span>" +
        (item.stage ? '<span class="badge badge--ongoing">' + RAM.esc(item.stage) + "</span>" : "") +
      "</div>" +
      '<h2 class="t-h3" style="margin-bottom:24px">' + RAM.ph(item.title) + "</h2>" +
      (item.summary ? '<p class="t-body" style="margin-bottom:36px">' + RAM.ph(item.summary) + "</p>" : "") +
      '<table class="table-info"><tbody>' +
        row("위치", item.location) +
        row("사업 규모", item.scale) +
        row("사업 면적", item.area) +
        row("연면적", item.floorArea) +
        row("세대수", item.households) +
        row("발주기관", item.client) +
        row("참여기관", item.partners) +
        row("수행업무", item.role) +
      "</tbody></table>" +
      navHtml;
  };

  /* ============================================================
     3. 공지사항 (목록 + 상세)
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

    if (!RAM_PRESS.length) {
      wrap.innerHTML = '<p class="board-empty">등록된 보도자료가 없습니다.</p>';
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
    RAM.initProjectList();
    RAM.initProjectDetail();
    RAM.initNoticePage();
    RAM.initPressPage();
  });
})();
