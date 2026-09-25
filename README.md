# (주)람코리아 (RAM KOREA) 홈페이지

> RAM은 사람을 가장 소중히 생각합니다.

건설사업관리(CM)·정비사업전문관리·리모델링·도시계획·도시빅데이터 전문 기업
(주)람코리아의 반응형 기업 홈페이지입니다.
**순수 HTML · CSS · JavaScript**로 제작되어 별도의 빌드 과정 없이 그대로 서버에 올리면 동작합니다.

---

## 1. 빠르게 확인하기

### 방법 A — 파일 열기 (가장 간단)

`index.html` 파일을 더블클릭하면 브라우저에서 바로 열립니다.

### 방법 B — 로컬 서버 (권장)

파이썬이 설치되어 있다면 프로젝트 폴더에서 아래 명령을 실행한 뒤
브라우저에서 `http://localhost:5173` 으로 접속하세요.

```bash
python -m http.server 5173
```

---

## 2. 폴더 구조

```
Ram/
├─ index.html              메인 페이지
├─ privacy.html            개인정보처리방침
├─ 404.html                없는 주소 안내 페이지
├─ favicon.svg             파비콘
├─ robots.txt              검색로봇 수집 규칙
├─ sitemap.xml             검색엔진 제출용 사이트맵
├─ _headers                Cloudflare Pages 응답 헤더 (보안·캐시)
├─ _redirects              Cloudflare Pages 주소 리다이렉트
│
├─ about/                  회사소개 (5)
│   ├─ ceo.html            CEO 인사말
│   ├─ philosophy.html     기업이념
│   ├─ history.html        연혁
│   ├─ organization.html   조직도
│   └─ location.html       오시는 길
├─ business/               사업영역 (5)
│   ├─ cm.html             건설사업관리 CM
│   ├─ maintenance.html    정비사업전문관리
│   ├─ remodeling.html     리모델링
│   ├─ urban-planning.html 도시계획사업
│   └─ bigdata.html        도시빅데이터
├─ projects/               사업실적 (2)
│   ├─ index.html          실적 목록 (분야별 필터)
│   └─ detail.html         실적 상세
├─ pr/                     홍보센터 (2)
│   ├─ notice.html         공지사항
│   └─ press.html          보도자료·갤러리
│
├─ assets/
│   ├─ css/
│   │   ├─ base.css        색상·글꼴 등 디자인 토큰, 공통 스타일
│   │   ├─ layout.css      헤더 / 모바일 메뉴 / 푸터
│   │   ├─ components.css  버튼·카드·탭·슬라이더·게시판
│   │   ├─ home.css        메인 페이지 전용
│   │   ├─ sub.css         서브페이지 전용 (CEO·연혁·조직도·지도·절차)
│   │   └─ mobile.css      ★ 휴대폰 전용 UI (하단 전화 버튼, 터치 영역 등)
│   ├─ js/
│   │   ├─ site.js         공통 스크립트 (외부 라이브러리 없음)
│   │   └─ pages.js        목록/상세 렌더링 (실적·공지·보도자료)
│   └─ img/                이미지
│       ├─ hero-crane-dusk.svg   메인 대형 이미지 (임시)
│       ├─ about-people.svg      기업이념 이미지 (임시)
│       ├─ logo-mark.svg         심볼 (임시)
│       └─ work/                 실적 사진 (임시)
│
└─ data/                   ★ 내용만 고치면 되는 파일
    ├─ projects.js         사업실적
    ├─ notices.js          공지사항
    └─ press.js            보도자료·갤러리
```

---

## 3. 내용 수정하는 법

### 3-1. 사업실적 · 공지사항 · 보도자료

HTML을 건드릴 필요 없이 **`data/` 폴더의 파일만** 수정하면 됩니다.
각 파일 맨 위에 작성 방법이 주석으로 적혀 있습니다.

예) 실적을 하나 추가하려면 `data/projects.js` 에서 `{ ... }` 블록 하나를 통째로 복사해
붙여넣고 내용만 바꾸면 됩니다. `id` 값은 실적마다 서로 달라야 합니다.

```js
{
  id: "jayang-4a",                    // 영문·숫자·하이픈 (중복 불가, 상세페이지 주소가 됨)
  title: "자양4동 A구역 주택정비형 재개발사업",
  category: "정비사업전문관리",        // 건설사업관리 | 정비사업전문관리 | 소규모주택정비 | 빅데이터 연구
  stage: "조합설립인가 준비",          // 진행 단계. 모르면 "" 로 비워 둡니다
  featured: true,                     // 메인 슬라이더 노출 여부
  location: "서울시 광진구 자양4동 57-90번지 일대",
  scale: "지하 3층 ~ 지상 49층",
  area: "139,130.0㎡",                // 사업 면적
  floorArea: "508,798.79㎡",          // 연면적
  households: "총 2,999세대",
  role: "서울시 공공지원 조합 직접설립",  // 수행업무
  summary: "",                        // 비워 두면 표시되지 않습니다
  thumb: "assets/img/work/work-01.svg",
  images: ["assets/img/work/work-01.svg"]
}
```
> ⚠️ 항목 사이의 쉼표(`,`)를 빠뜨리지 않도록 주의해 주세요. 마지막 항목 뒤에는 쉼표를 붙이지 않습니다.

### 3-2. 상세 페이지가 열리는 방식

실적·공지·보도자료의 상세 화면은 별도 파일을 만들지 않고 주소 뒤의 `?id=` 값으로 열립니다.
`data/` 파일에 적은 `id` 가 그대로 주소가 되므로, 글을 추가하면 상세 페이지도 자동으로 생깁니다.

```
projects/detail.html?id=jayang-4a     실적 상세
pr/notice.html?id=notice-001          공지 상세
pr/press.html?id=press-001            보도자료 상세
```

### 3-3. 회사 정보 (주소·전화번호 등)

각 HTML 파일의 **푸터(맨 아래) 영역**에 들어 있습니다.
전화번호를 바꿀 때는 `02-455-7773` 텍스트와 `tel:0245577773` 링크를 함께 고쳐 주세요.

> 전화번호는 푸터 외에 **헤더**, **모바일 메뉴 하단**, **모바일 하단 바**에도 들어 있습니다.
> 17개 HTML 을 한 번에 바꾸려면 터미널에서 (프로젝트 폴더에서 실행):
> ```bash
> grep -rl '0245577773' --include='*.html' . | xargs sed -i 's/0245577773/새번호숫자만/g'
> grep -rl '02-455-7773' --include='*.html' . | xargs sed -i 's/02-455-7773/새-번-호/g'
> ```

### 3-4. 색상·글꼴

`assets/css/base.css` 맨 위의 `:root` 부분에 모든 색상이 모여 있습니다.
이 값만 바꾸면 사이트 전체 색이 한 번에 바뀝니다.

---

## 4. 이미지 교체

현재 이미지는 모두 **직접 그린 추상 그래픽(SVG)** 입니다.
그대로 둬도 완성된 화면으로 보이지만, 실제 사진으로 바꾸면 훨씬 좋아집니다.

| 위치 | 임시 파일 | 교체할 파일 (권장 규격) |
|---|---|---|
| 메인 상단 | `assets/img/hero-crane-dusk.svg` | `hero-crane-dusk.jpg` (1920×1080 이상, 가로형) |
| 서브 상단 | 위와 동일한 파일 사용 | 교체 시 `assets/css/sub.css` 맨 아래 경로도 함께 수정 |
| 기업이념 | `assets/img/about-people.svg` | `about-people.jpg` (1200×900) |
| 실적 사진 | `assets/img/work/work-01~06.svg` | `work-01.jpg` … (1200×900, 4:3) |
| 심볼·로고 | ✅ 완료 — 회사소개서 PDF 벡터 원본에서 추출 | `logo.svg`(밝은 배경) / `logo-light.svg`(어두운 배경) / `logo-mark*.svg`(심볼) / `favicon.svg` |
| 공유 썸네일 | (없음) | `assets/img/og-image.jpg` (1200×630) |

교체 후 HTML 안의 파일 경로에서 확장자를 `.svg` → `.jpg` 로 바꿔 주세요.
사진은 **1MB 이하**로 줄여서 올리면 로딩이 빨라집니다. (가능하면 WebP 권장)

---

## 5. 문의 받는 방법

이 홈페이지에는 **온라인 문의 폼이 없습니다.** 문의는 전화·팩스로만 받습니다.

| 위치 | 내용 |
|---|---|
| 헤더 | 전화번호 버튼 (PC) |
| 모바일 하단 바 | 전화 문의 버튼 — 누르면 바로 전화가 걸립니다 |
| 메인 하단 CTA | 대표전화 + 오시는 길 |
| 사업영역 5개 페이지 | 각 분야 문의 안내 + 대표전화 버튼 |
| 오시는 길 | 주소·전화·팩스, 지도 길찾기 |

덕분에 개인정보를 홈페이지에서 직접 수집하지 않습니다.
외부 폼 서비스 가입, 국외 이전 고지, 동의 절차가 모두 필요 없습니다.

> **나중에 온라인 문의 폼을 다시 넣고 싶다면** — 폼용 CSS(`components.css` 6번)와
> 검증 스크립트(`site.js` 의 `RAM.initContactForm`)는 그대로 남겨 두었습니다.
> 폼이 있는 페이지를 만들고 `<form data-contact-form>` 으로 표시하면 다시 동작합니다.
> 이 경우 개인정보처리방침 제1·2·3·5조를 폼 기준으로 되돌려야 합니다.

---

## 6. 배포 — Cloudflare Pages

빌드 과정이 없으므로 **GitHub 저장소를 연결하면 그대로 배포**됩니다.
이후에는 `git push` 할 때마다 1~2분 안에 자동으로 다시 배포됩니다.

### 6-1. 도메인 먼저 등록

> ⚠️ **`ram-korea.net` 은 현재 등록되어 있지 않습니다.**
> .net 레지스트리(Verisign) 조회 결과 미등록 상태이며, 아무나 선점할 수 있습니다.
> 가비아·카페24·후이즈 등에서 **연 2만원 내외**로 먼저 등록해 주세요.

### 6-2. Cloudflare Pages 연결

1. [dash.cloudflare.com](https://dash.cloudflare.com) 가입 (무료)
2. **Workers & Pages → Create → Pages → Connect to Git**
3. GitHub 계정을 연동하고 `Yyeon22/Ram-Korea-Web` 선택 *(Private 저장소도 가능)*
4. 빌드 설정 — **아무것도 입력하지 않습니다**

   | 항목 | 값 |
   |---|---|
   | Framework preset | `None` |
   | Build command | *(비움)* |
   | Build output directory | `/` |

5. **Save and Deploy** → `ram-korea-web.pages.dev` 주소가 바로 발급됩니다

### 6-3. 도메인 연결

1. Pages 프로젝트 → **Custom domains → Set up a domain**
2. `ram-korea.net` 입력
3. 도메인의 네임서버를 Cloudflare 것으로 바꾸면 나머지는 자동입니다
   *(등록 대행사 관리 화면에서 네임서버 변경)*
4. `www.ram-korea.net` 도 같은 방식으로 추가하고 대표 주소로 리다이렉트 설정
5. **SSL 인증서는 자동 발급**됩니다 — 별도 설정 불필요

### 6-4. 검색엔진 등록

- 네이버 서치어드바이저 / 구글 서치콘솔에 사이트 등록
- 발급받은 인증 코드를 `index.html` `<head>` 의 주석 처리된
  `naver-site-verification`, `google-site-verification` 태그에 넣고 주석 해제
- `sitemap.xml` 주소(`https://ram-korea.net/sitemap.xml`) 제출

### 참고 — 설정 파일

| 파일 | 역할 |
|---|---|
| `_headers` | 보안 헤더와 캐시 시간. 이미지·CSS는 1일, `data/` 는 5분 캐시 |
| `_redirects` | 구 주소 → 새 주소 301 이동, `/about` 같은 짧은 주소 처리 |
| `404.html` | 없는 주소로 들어왔을 때 표시. 어느 경로에서나 뜨도록 링크가 절대경로입니다 |

> 다른 호스팅(카페24·가비아 등)으로 바꾸실 경우 `_headers` 와 `_redirects` 는
> 동작하지 않습니다. 해당 호스팅의 `.htaccess` 등으로 옮겨야 합니다.

## 7. 남은 작업

화면에 보이던 `[확인 필요]` 표시는 모두 정리했습니다. **남은 것은 1가지**입니다.

| 항목 | 필요한 이유 | 반영 위치 |
|---|---|---|
| **대표 이메일** | 개인정보 보호책임자 연락처는 법정 기재사항입니다 | 오시는 길 · 개인정보처리방침 제10조 |

### 배포 직전에 확인할 것

- **개인정보처리방침 시행일자** — 현재 `2026년 9월 23일`. 실제 공개일로 바꿔 주세요. (`privacy.html` 제12조)
- **공지사항 오픈일** — `data/notices.js` 의 `2026-09-23` 을 실제 오픈일로 수정
- **호스팅 업체명** — 개인정보처리방침 제5조(위탁)에 `Cloudflare, Inc.` 로 적어 두었습니다.
  다른 호스팅을 쓰시면 업체명과 국외 이전 문구를 맞춰 주세요.

### 있으면 더 좋은 것 (없어도 사이트는 완성)

실제 사진(메인 대형·사업장·대표이사·사무실) · 설립 이후 연혁 · 조직 현황(임직원 수, 등록면허) ·
업무시간 · 영남지사 정보 · 지도 임베드 · 보도자료 콘텐츠

> 위 항목들은 자리표시자를 남기지 않고 해당 영역을 아예 비워 두었습니다.
> 자료가 생기면 다시 넣으면 됩니다.

---

## 8. 모바일(휴대폰) 화면

휴대폰·태블릿 전용 스타일은 **`assets/css/mobile.css`** 한 파일에 모여 있습니다.
화면 폭 **1080px 이하**부터 모바일 화면으로 바뀝니다.

| 항목 | 내용 |
|---|---|
| 메뉴 | 헤더가 햄버거 버튼으로 바뀌고, 눌러서 펼치는 전체 메뉴가 열립니다 |
| 하단 바 | 화면 아래에 **전화 문의** 버튼이 항상 떠 있습니다 — 누르면 바로 전화 (`.m-actions`) |
| 터치 | 버튼·링크를 손가락 기준 최소 44px 로 키웠습니다 |
| 조직도 | 480px 이하에서 팀별로 묶어 표시합니다 |
| 아이폰 | 노치·홈바(safe-area)를 피해서 배치됩니다 |

**하단 바를 없애고 싶다면** `assets/css/mobile.css` 의 `.m-actions { display: grid; ... }` 를
`display: none;` 으로 바꾸면 17개 페이지에서 한 번에 사라집니다.

**버튼을 더 넣고 싶다면** 각 HTML 맨 아래 `<div class="m-actions">` 안에
`<a class="m-actions__btn" href="...">` 를 추가하면 됩니다. 칸은 개수만큼 자동으로 나뉩니다.
(17개 파일에 각각 들어 있습니다 — 3-3 의 `sed` 방식으로 일괄 수정 가능)

---

## 9. 브라우저 지원

Chrome · Edge · Safari · Firefox 최신 버전, iOS Safari, Android Chrome.
Internet Explorer는 지원하지 않습니다. (2022년 지원 종료)
