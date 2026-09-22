/* ============================================================
   RAM KOREA — site.js
   공통 스크립트 : 헤더 / 모바일메뉴 / 스크롤효과 / 슬라이더 /
                   목록 렌더링 / 문의 폼 검증
   외부 라이브러리 없음 (Vanilla JS)
   ============================================================ */
(function () {
  "use strict";

  /* 하위 폴더 페이지에서도 경로가 맞도록 기준 경로를 읽는다.
     (root: data-base=""  /  하위폴더: data-base="../") */
  var BASE = (document.body && document.body.dataset.base) || "";
  window.RAM = window.RAM || {};
  RAM.base = BASE;
  RAM.path = function (p) {
    if (!p) return "";
    if (/^(https?:|data:|#|mailto:|tel:)/.test(p)) return p;
    return BASE + p;
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  RAM.$ = $; RAM.$$ = $$;

  /* HTML 이스케이프 — 데이터 파일 내용을 안전하게 출력 */
  RAM.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  /* [확인 필요] 표시를 시각적 자리표시자로 변환 */
  RAM.ph = function (s) {
    var v = RAM.esc(s);
    return v.replace(/\[확인 필요[^\]]*\]/g, function (m) {
      return '<span class="placeholder">' + m + "</span>";
    });
  };

  /* ---------- 1. 헤더 : 스크롤 상태 ---------- */
  (function header() {
    var header = $(".site-header");
    if (!header) return;
    var startsTransparent = header.classList.contains("is-transparent");

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle("is-scrolled", y > 20);
      if (startsTransparent) header.classList.toggle("is-transparent", y <= 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ---------- 2. 모바일 메뉴 ---------- */
  (function mobileNav() {
    var toggle = $(".nav-toggle");
    var nav = $(".mobile-nav");
    if (!toggle || !nav) return;

    function close() {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("is-nav-open");
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("is-nav-open", !open);
    });

    /* 2depth 아코디언 */
    $$(".mobile-nav__head", nav).forEach(function (btn) {
      var panel = btn.nextElementSibling;
      if (!panel) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        $$(".mobile-nav__head", nav).forEach(function (other) {
          if (other !== btn) {
            other.setAttribute("aria-expanded", "false");
            if (other.nextElementSibling) other.nextElementSibling.style.maxHeight = null;
          }
        });
        btn.setAttribute("aria-expanded", String(!open));
        panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { close(); toggle.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) close();
    });
  })();

  /* ---------- 3. 현재 메뉴 자동 표시 ---------- */
  (function currentMenu() {
    function norm(p) { return p.replace(/index\.html$/, "").replace(/\/$/, "/"); }
    var here = norm(location.pathname);

    $$(".gnb a, .mobile-nav a, .tabs__link").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      var target;
      try { target = norm(new URL(a.href).pathname); } catch (e) { return; }
      if (target !== here) return;

      a.classList.add("is-current");
      if (a.classList.contains("tabs__link")) a.setAttribute("aria-current", "page");
      var item = a.closest(".gnb__item");
      if (item) item.classList.add("is-active");
      var mItem = a.closest(".mobile-nav__item");
      if (mItem) {
        var head = $(".mobile-nav__head", mItem);
        if (head && head.nextElementSibling) {
          head.setAttribute("aria-expanded", "true");
          head.nextElementSibling.style.maxHeight = head.nextElementSibling.scrollHeight + "px";
        }
      }
    });

    /* 1depth 자체가 활성인 경우 (예: /about/ 하위 어디든) */
    $$(".gnb__item").forEach(function (item) {
      var link = $(".gnb__link", item);
      if (!link) return;
      var seg = link.getAttribute("data-section");
      if (seg && location.pathname.indexOf("/" + seg + "/") !== -1) item.classList.add("is-active");
    });
  })();

  /* ---------- 4. 스크롤 등장 효과 ---------- */
  (function reveal() {
    var items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 5. 맨 위로 ---------- */
  (function toTop() {
    var btn = $(".to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("is-visible", (window.pageYOffset || 0) > 500);
    }, { passive: true });
    btn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  })();

  /* ---------- 6. 숫자 카운트업 ---------- */
  RAM.initCounters = function () {
    var nums = $$("[data-count]");
    if (!nums.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count"));
        if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          el.textContent = target ? target.toLocaleString("ko-KR") : el.textContent;
          return;
        }
        var start = performance.now(), dur = 1400;
        (function step(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("ko-KR");
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  };

  /* ---------- 7. 슬라이더 ---------- */
  RAM.initSlider = function (root) {
    if (!root) return;
    var track = $(".slider__track", root);
    if (!track) return;
    var prev = $("[data-slider-prev]", root);
    var next = $("[data-slider-next]", root);
    var dotsWrap = $(".slider__dots", root);
    var index = 0;

    function slides() { return $$(".slider__slide", track); }
    function perView() {
      if (window.innerWidth <= 680) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }
    function maxIndex() { return Math.max(0, slides().length - perView()); }

    function render() {
      var list = slides();
      if (!list.length) return;
      index = Math.min(index, maxIndex());
      var gap = parseFloat(getComputedStyle(track).gap) || 24;
      var step = list[0].getBoundingClientRect().width + gap;
      track.style.transform = "translateX(" + (-index * step) + "px)";
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex();
      if (dotsWrap) {
        $$(".slider__dot", dotsWrap).forEach(function (d, i) {
          d.setAttribute("aria-current", String(i === index));
        });
      }
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides().forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "slider__dot";
        b.setAttribute("aria-label", (i + 1) + "번째 실적 보기");
        b.addEventListener("click", function () { index = i; render(); });
        dotsWrap.appendChild(b);
      });
    }

    if (prev) prev.addEventListener("click", function () { index = Math.max(0, index - 1); render(); });
    if (next) next.addEventListener("click", function () { index = Math.min(maxIndex(), index + 1); render(); });

    /* 터치 스와이프 */
    var x0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) {
        index = dx < 0 ? Math.min(maxIndex(), index + 1) : Math.max(0, index - 1);
        render();
      }
      x0 = null;
    });

    window.addEventListener("resize", render);
    root._ramRefresh = function () { buildDots(); render(); };
    buildDots();
    render();
  };

  /* ---------- 8. 실적 카드 마크업 ---------- */
  RAM.workCard = function (item) {
    var href = RAM.path("projects/detail.html?id=" + encodeURIComponent(item.id));
    var cat = RAM.esc(item.category) + (item.stage ? " · " + RAM.esc(item.stage) : "");
    var meta = [item.location || item.client, item.households]
      .filter(function (v) { return v; }).join(" · ");
    return '' +
      '<a class="work-card" href="' + href + '">' +
        '<div class="work-card__thumb">' +
          '<img src="' + RAM.path(item.thumb) + '" alt="' + RAM.esc(item.title) + '" loading="lazy" width="800" height="600">' +
        '</div>' +
        '<div class="work-card__body">' +
          '<span class="work-card__cat">' + cat + "</span>" +
          '<h3 class="work-card__title">' + RAM.ph(item.title) + "</h3>" +
          '<p class="work-card__meta">' + RAM.ph(meta) + "</p>" +
        "</div>" +
      "</a>";
  };

  /* ---------- 9. 목록 렌더링 (메인) ---------- */
  RAM.renderFeaturedWorks = function (sel) {
    var track = $(sel);
    if (!track || !window.RAM_PROJECTS) return;
    var list = RAM_PROJECTS.filter(function (p) { return p.featured; }).slice(0, 8);
    track.innerHTML = list.map(function (item) {
      return '<div class="slider__slide">' + RAM.workCard(item) + "</div>";
    }).join("");
  };

  RAM.renderNewsList = function (sel, data, linkBase, limit) {
    var wrap = $(sel);
    if (!wrap) return;
    var list = (data || []).slice(0, limit || 4);
    if (!list.length) {
      wrap.innerHTML = '<li class="news__item"><p class="news__link text-muted">등록된 글이 없습니다.</p></li>';
      return;
    }
    wrap.innerHTML = list.map(function (item) {
      var href = RAM.path(linkBase + "?id=" + encodeURIComponent(item.id));
      return '' +
        '<li class="news__item">' +
          '<a class="news__link" href="' + href + '">' +
            '<span class="news__title">' + RAM.ph(item.title) + "</span>" +
            '<span class="news__date">' + RAM.esc(String(item.date).replace(/^\[확인 필요[^\]]*\]$/, "—")) + "</span>" +
          "</a>" +
        "</li>";
    }).join("");
  };

  /* ---------- 10. 문의 폼 검증 ---------- */
  RAM.initContactForm = function (form) {
    if (!form) return;
    var status = $("[data-form-status]", form);

    function setError(field, msg) {
      var box = field.closest(".form__field") || field.parentElement;
      var el = $(".form__error", box);
      if (!el) {
        el = document.createElement("p");
        el.className = "form__error";
        box.appendChild(el);
      }
      el.textContent = msg || "";
      field.setAttribute("aria-invalid", msg ? "true" : "false");
    }

    form.addEventListener("submit", function (e) {
      var ok = true, first = null;

      $$("[required]", form).forEach(function (field) {
        var val = field.type === "checkbox" ? field.checked : field.value.trim();
        var msg = "";
        if (!val) {
          msg = field.type === "checkbox" ? "개인정보 수집·이용에 동의해 주세요." : "필수 항목입니다.";
        } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          msg = "이메일 형식을 확인해 주세요.";
        } else if (field.name === "phone" && !/^[0-9\-+\s()]{8,20}$/.test(field.value)) {
          msg = "연락처를 숫자로 입력해 주세요.";
        }
        setError(field, msg);
        if (msg) { ok = false; if (!first) first = field; }
      });

      if (!ok) {
        e.preventDefault();
        if (status) status.textContent = "입력 내용을 확인해 주세요.";
        if (first) first.focus();
        return;
      }

      /* action 이 설정되지 않았으면 전송을 막고 안내 (배포 전 상태) */
      var action = form.getAttribute("action") || "";
      if (!action || action.indexOf("FORM_ENDPOINT") !== -1) {
        e.preventDefault();
        if (status) {
          status.textContent =
            "폼 전송 주소가 아직 연결되지 않았습니다. contact/index.html 의 form action 값을 설정해 주세요.";
        }
      }
    });
  };

  /* ---------- 11. 공통 초기화 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    RAM.initCounters();
    $$("[data-slider]").forEach(RAM.initSlider);
    RAM.initContactForm($("[data-contact-form]"));
    var y = $("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
