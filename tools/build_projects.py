"""
RAM KOREA — 사업실적 상세 페이지 생성기
------------------------------------------------------------
data/projects.js 를 읽어 실적마다 정적 HTML 페이지를 만든다.
  projects/<id>.html   ← 검색엔진(구글·네이버)이 실적별로 수집할 수 있다.
  sitemap.xml          ← 실적 상세 주소를 자동으로 갱신한다.

▸ 실적을 추가·수정·삭제한 뒤 프로젝트 폴더에서 한 번 실행하세요.
    python tools/build_projects.py
▸ 파이썬 기본 기능만 사용합니다. (설치할 것 없음)
▸ 생성된 페이지는 직접 고치지 말고 data/projects.js 를 고친 뒤 다시 실행하세요.
"""
import html
import json
import os
import re
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://ram-korea.com"
MARK = "<!-- 자동 생성: tools/build_projects.py — 직접 수정하지 마세요 -->"
RESERVED = {"index", "detail"}
PH = re.compile(r"\[확인 필요[^\]]*\]")


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def write(path, text):
    with open(os.path.join(ROOT, path), "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


# ---------- data/projects.js → 파이썬 리스트 ----------
def load_projects():
    src = read("data/projects.js")
    body = src[src.index("=", src.index("window.RAM_PROJECTS")) + 1:]
    body = body[:body.rindex("]") + 1]
    out, i, n = [], 0, len(body)
    while i < n:  # 문자열은 그대로 두고 주석만 걷어낸다
        c = body[i]
        if c == '"':
            j = i + 1
            while body[j] != '"':
                j += 2 if body[j] == "\\" else 1
            out.append(body[i:j + 1]); i = j + 1
        elif body.startswith("/*", i):
            i = body.index("*/", i) + 2
        elif body.startswith("//", i):
            i = body.find("\n", i) if body.find("\n", i) != -1 else n
        else:
            out.append(c); i += 1
    text = "".join(out)
    text = re.sub(r'([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', text)  # 키에 따옴표
    text = re.sub(r",(\s*[}\]])", r"\1", text)                       # 끝 쉼표 제거
    return json.loads(text)


# ---------- 출력 도우미 (site.js 의 RAM.esc / RAM.ph 와 같은 규칙) ----------
def esc(s):
    return html.escape("" if s is None else str(s), quote=True).replace("&#x27;", "&#39;")


def ph(s):
    return PH.sub(lambda m: '<span class="placeholder">' + m.group(0) + "</span>", esc(s))


def plain(s, fallback):
    return PH.sub(fallback, str(s or ""))


def page_name(item):
    return item["id"] + ".html"


def render_detail(item, prev, nxt):
    images = item.get("images") or [item.get("thumb")]
    gallery = "".join(
        '<figure class="gallery__item"><img src="../{src}" alt="{alt} 사진 {n}"{lazy} width="800" height="600"></figure>'
        .format(src=esc(src), alt=esc(item["title"]), n=i + 1,
                lazy="" if i == 0 else ' loading="lazy"')
        for i, src in enumerate(images) if src
    )

    def row(label, value):
        return '<tr><th scope="row">{}</th><td>{}</td></tr>'.format(label, ph(value)) if value else ""

    def nav(target, label, extra):
        if target:
            return ('<a class="detail-nav__item{}" href="{}"><span>{}</span><strong>{}</strong></a>'
                    .format(extra, esc(page_name(target)), label, ph(target["title"])))
        return ('<span class="detail-nav__item{} is-disabled"><span>{}</span><strong>없음</strong></span>'
                .format(extra, label))

    stage = '<span class="badge badge--ongoing">{}</span>'.format(esc(item["stage"])) if item.get("stage") else ""
    summary = '<p class="t-body" style="margin-bottom:36px">{}</p>'.format(ph(item["summary"])) if item.get("summary") else ""
    return (
        '<div class="gallery" style="margin-bottom:48px">' + gallery + "</div>\n"
        '      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px">'
        '<span class="t-caption" style="color:var(--red-500);font-weight:700">' + esc(item.get("category")) + "</span>"
        + stage + "</div>\n"
        '      <h2 class="t-h3" style="margin-bottom:24px">' + ph(item["title"]) + "</h2>\n"
        "      " + summary + "\n"
        '      <table class="table-info"><tbody>'
        + row("위치", item.get("location")) + row("사업 규모", item.get("scale"))
        + row("사업 면적", item.get("area")) + row("연면적", item.get("floorArea"))
        + row("세대수", item.get("households")) + row("발주기관", item.get("client"))
        + row("참여기관", item.get("partners")) + row("수행업무", item.get("role"))
        + "</tbody></table>\n"
        '      <div class="detail-nav">' + nav(prev, "이전 실적", "")
        + '<a class="btn btn--line" href="index.html">목록</a>'
        + nav(nxt, "다음 실적", " is-next") + "</div>"
    )


def build_page(template, item, prev, nxt):
    title = plain(item["title"], "사업실적")
    desc_src = item.get("summary") or "{} — (주)람코리아 {} 실적입니다.".format(title, item.get("category", ""))
    desc = esc(plain(desc_src, "").strip())
    url = "{}/projects/{}".format(SITE, page_name(item))
    full_title = esc(title + " | (주)람코리아")

    out = template
    subs = [
        (r"<title>.*?</title>", "<title>{}</title>".format(full_title)),
        (r'<meta name="description" content="[^"]*">', '<meta name="description" content="{}">'.format(desc)),
        (r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="{}">'.format(full_title)),
        (r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="{}">'.format(desc)),
        (r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="{}">'.format(url)),
        (r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="{}">'.format(url)),
        (r'<meta name="robots" content="[^"]*">\n', ""),
        (r"<span data-project-title>.*?</span>", "<span>{}</span>".format(ph(item["title"]))),
        (r"<span data-project-crumb>.*?</span>", "<span>{}</span>".format(esc(plain(item["title"], "실적 상세")))),
        (r'<div class="container container--narrow" data-project-detail>.*?</div>\n  </section>',
         '<div class="container container--narrow">\n      {}\n    </div>\n  </section>'.format(
             render_detail(item, prev, nxt))),
    ]
    for pattern, repl in subs:
        out, count = re.subn(pattern, lambda m, r=repl: r, out, count=1, flags=re.S)
        if count == 0 and "robots" not in pattern:
            sys.exit("템플릿에서 찾지 못함: " + pattern)
    return out.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n" + MARK, 1)


def update_sitemap(projects):
    sm = read("sitemap.xml")
    start, end = "  <!-- projects:start (자동 생성) -->", "  <!-- projects:end -->"
    today = date.today().isoformat()
    block = start + "\n" + "".join(
        "  <url>\n    <loc>{}/projects/{}</loc>\n    <lastmod>{}</lastmod>\n"
        "    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n"
        .format(SITE, esc(page_name(p)), today) for p in projects
    ) + end
    if start in sm:
        sm = re.sub(re.escape(start) + r".*?" + re.escape(end), lambda m: block, sm, flags=re.S)
    else:
        sm = sm.replace("</urlset>", block + "\n</urlset>")
    write("sitemap.xml", sm)


def main():
    projects = load_projects()
    ids = [p["id"] for p in projects]
    for p in projects:
        if not re.fullmatch(r"[a-z0-9-]+", p["id"]) or p["id"] in RESERVED:
            sys.exit("사용할 수 없는 id: {!r} (영문 소문자·숫자·하이픈만, index/detail 제외)".format(p["id"]))
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        sys.exit("id 가 중복되었습니다: " + ", ".join(sorted(dup)))

    template = read("projects/detail.html")
    for i, p in enumerate(projects):
        prev = projects[i - 1] if i > 0 else None
        nxt = projects[i + 1] if i + 1 < len(projects) else None
        write("projects/" + page_name(p), build_page(template, p, prev, nxt))

    # 데이터에서 지워진 실적의 페이지 정리
    removed = []
    for f in os.listdir(os.path.join(ROOT, "projects")):
        if f.endswith(".html") and f[:-5] not in ids and f[:-5] not in RESERVED:
            if MARK in read("projects/" + f):
                os.remove(os.path.join(ROOT, "projects", f)); removed.append(f)

    update_sitemap(projects)
    print("실적 페이지 {}개 생성, sitemap.xml 갱신".format(len(projects)))
    if removed:
        print("삭제된 실적 페이지: " + ", ".join(removed))


if __name__ == "__main__":
    main()
