# (주)람코리아 (RAM KOREA) 홈페이지

> RAM은 사람을 가장 소중히 생각합니다.

재건축·재개발·리모델링·도시정비 전문 기업 (주)람코리아의 반응형 기업 홈페이지입니다.
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
├─ favicon.svg             파비콘
├─ robots.txt              검색로봇 수집 규칙
├─ sitemap.xml             검색엔진 제출용 사이트맵
│
├─ about/                  회사소개 (5)
│   ├─ ceo.html            CEO 인사말
│   ├─ philosophy.html     기업이념
│   ├─ history.html        연혁
│   ├─ organization.html   조직도
│   └─ location.html       오시는 길
├─ business/               사업영역 (4)
│   ├─ reconstruction.html 재건축
│   ├─ redevelopment.html  재개발
│   ├─ remodeling.html     리모델링
│   └─ urban-renewal.html  도시정비·도시재생
├─ projects/               사업실적 (2)
│   ├─ index.html          실적 목록 (진행 중/완료 필터)
│   └─ detail.html         실적 상세
├─ pr/                     홍보센터 (2)
│   ├─ notice.html         공지사항
│   └─ press.html          보도자료·갤러리
├─ contact/                고객문의 (1)
│   └─ index.html          문의하기 폼
│
├─ assets/
│   ├─ css/
│   │   ├─ base.css        색상·글꼴 등 디자인 토큰, 공통 스타일
│   │   ├─ layout.css      헤더 / 모바일 메뉴 / 푸터
│   │   ├─ components.css  버튼·카드·탭·슬라이더·폼·게시판
│   │   ├─ home.css        메인 페이지 전용
│   │   └─ sub.css         서브페이지 전용 (CEO·연혁·조직도·지도·절차)
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
  id: "jayang-1",                     // 영문·숫자·하이픈 (중복 불가)
  title: "자양동 ○○아파트 재건축",
  category: "재건축",                  // 재건축 | 재개발 | 리모델링 | 도시정비
  status: "ongoing",                  // ongoing(진행 중) | done(완료)
  featured: true,                     // 메인 슬라이더 노출 여부
  location: "서울시 광진구 ...",
  scale: "지하 3층 ~ 지상 29층, 1,234세대",
  period: "2024.03 ~ 2027.12",
  client: "○○구역 주택재건축정비사업조합",
  role: "정비사업 관리",
  summary: "사업 개요를 2~3문장으로 적습니다.",
  thumb: "assets/img/work/jayang-1.jpg",
  images: ["assets/img/work/jayang-1.jpg", "assets/img/work/jayang-2.jpg"]
}
```

> ⚠️ 항목 사이의 쉼표(`,`)를 빠뜨리지 않도록 주의해 주세요. 마지막 항목 뒤에는 쉼표를 붙이지 않습니다.

### 3-2. 상세 페이지가 열리는 방식

실적·공지·보도자료의 상세 화면은 별도 파일을 만들지 않고 주소 뒤의 `?id=` 값으로 열립니다.
`data/` 파일에 적은 `id` 가 그대로 주소가 되므로, 글을 추가하면 상세 페이지도 자동으로 생깁니다.

```
projects/detail.html?id=jayang-1      실적 상세
pr/notice.html?id=notice-001          공지 상세
pr/press.html?id=press-001            보도자료 상세
```

### 3-3. 회사 정보 (주소·전화번호 등)

각 HTML 파일의 **푸터(맨 아래) 영역**에 들어 있습니다.
전화번호를 바꿀 때는 `02-455-7773` 텍스트와 `tel:0245577773` 링크를 함께 고쳐 주세요.

### 3-4. 색상·글꼴

`assets/css/base.css` 맨 위의 `:root` 부분에 모든 색상이 모여 있습니다.
이 값만 바꾸면 사이트 전체 색이 한 번에 바뀝니다.

---

## 4. 이미지 교체

현재 이미지는 모두 **저작권 걱정 없는 임시 SVG**입니다. 실제 사진으로 교체해 주세요.

| 위치 | 임시 파일 | 교체할 파일 (권장 규격) |
|---|---|---|
| 메인 상단 | `assets/img/hero-crane-dusk.svg` | `hero-crane-dusk.jpg` (1920×1080 이상, 가로형) |
| 서브 상단 | 위와 동일한 파일 사용 | 교체 시 `assets/css/sub.css` 맨 아래 경로도 함께 수정 |
| 기업이념 | `assets/img/about-people.svg` | `about-people.jpg` (1200×900) |
| 실적 사진 | `assets/img/work/work-01~06.svg` | `work-01.jpg` … (1200×900, 4:3) |
| 심볼·로고 | `assets/img/logo-mark.svg`, `favicon.svg` | 회사 공식 로고 파일 |
| 공유 썸네일 | (없음) | `assets/img/og-image.jpg` (1200×630) |

교체 후 HTML 안의 파일 경로에서 확장자를 `.svg` → `.jpg` 로 바꿔 주세요.
사진은 **1MB 이하**로 줄여서 올리면 로딩이 빨라집니다. (가능하면 WebP 권장)

---

## 5. 문의 폼 연결

`contact/index.html` 의 `<form action="...">` 값이 비어 있으면 전송되지 않고 안내 문구만 표시됩니다.
외부 폼 서비스(예: Formspree)에 가입한 뒤 발급받은 주소를 넣으면 바로 동작합니다.

```html
<form data-contact-form method="post" action="https://formspree.io/f/발급받은코드">
```

> 문의 내용은 개인정보에 해당합니다. 폼 서비스 가입 시 수신 이메일을 회사 담당자 주소로 지정하고,
> 개인정보처리방침(제5조 위탁 현황)에 해당 서비스명을 기재해 주세요.

---

## 6. 배포 (ram-korea.net 연결)

빌드가 필요 없으므로 **폴더 안의 모든 파일을 그대로 웹서버에 올리면** 됩니다.

1. 호스팅 업체(카페24·가비아 등)의 FTP 정보로 접속합니다.
2. 웹 루트 폴더(`/public_html`, `/www` 등)에 이 폴더의 **내용물 전체**를 업로드합니다.
   - `index.html` 이 웹 루트 바로 아래에 오도록 합니다.
3. 도메인 관리 화면에서 `ram-korea.net` 의 네임서버(또는 A 레코드)를 호스팅 서버로 지정합니다.
4. `https://ram-korea.net` 접속을 확인하고, 호스팅 관리자에서 **SSL 인증서(무료 Let's Encrypt)** 를 설정합니다.
5. 검색등록
   - 네이버 서치어드바이저 / 구글 서치콘솔에 사이트를 등록합니다.
   - 발급받은 인증 코드를 `index.html` `<head>` 안의 주석 처리된 `naver-site-verification`,
     `google-site-verification` 태그에 넣고 주석을 해제합니다.
   - `sitemap.xml` 주소(`https://ram-korea.net/sitemap.xml`)를 제출합니다.

---

## 7. 회사 확인이 필요한 자료 (체크리스트)

> 반영 완료 — 대표자명 **하승현**, 사업자등록번호 **669-87-01100**

화면에 <span>`[확인 필요: ...]`</span> 로 표시된 부분이 아래 목록입니다. 자료가 준비되면 채워 넣습니다.

| 구분 | 항목 | 반영 위치 |
|---|---|---|
| 기본 | 대표 이메일 / 팩스번호 | 푸터, 오시는 길 |
| 기본 | 설립연도 | 메인, 연혁 |
| 회사 | CEO 인사말 원고, 대표 사진 | 회사소개 |
| 회사 | 연혁 (연도별 주요 사건) | 회사소개 |
| 회사 | 조직도 (부서 구성, 인원) | 회사소개 |
| 회사 | 상세 주소 (건물명·층수), 주차 안내, 대중교통 안내 | 오시는 길 |
| 사업 | 사업영역별 상세 설명·강점 | 사업영역 4개 페이지 |
| 실적 | 사업명 / 위치 / 규모 / 기간 / 발주처 / 사진 | 사업실적 |
| 실적 | 숫자 4종 — 업력, 누적 수행 사업, 진행 중 사업, 전문 인력 | 메인 |
| 홍보 | 공지사항 · 보도자료 원문 | 홍보센터 |
| 문의 | 문의 접수용 이메일 주소 | 고객문의 |
| 법무 | 개인정보 보호책임자(성명·직책·이메일), 보유기간, 수탁업체 | 개인정보처리방침 |
| 검색 | 네이버·구글 사이트 인증 코드 | `<head>` |
| 디자인 | 회사 공식 로고 파일 (ai / svg / png) | 헤더·푸터·파비콘 |
| 사진 | 메인 대형 사진, 사업장 사진, 사무실·임직원 사진 | 전체 |

---

## 8. 브라우저 지원

Chrome · Edge · Safari · Firefox 최신 버전, iOS Safari, Android Chrome.
Internet Explorer는 지원하지 않습니다. (2022년 지원 종료)
