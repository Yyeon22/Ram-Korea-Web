/* ============================================================
   RAM KOREA — 사업실적 데이터
   ------------------------------------------------------------
   ▸ 실적을 추가하려면 아래 배열에 항목을 하나 복사해 붙여넣고
     내용만 수정하면 됩니다. (HTML 수정 불필요)
   ▸ id : 영문·숫자·하이픈만 사용. 상세페이지 주소가 됩니다.
            예) projects/detail.html?id=sample-01
   ▸ category : "재건축" | "재개발" | "리모델링" | "도시정비"
   ▸ status   : "ongoing"(진행 중) | "done"(완료)
   ▸ featured : true 로 두면 메인 페이지 슬라이더에 노출됩니다.
   ▸ thumb / images : assets/img/work/ 폴더에 사진을 넣고 경로를 적어주세요.
   ============================================================ */

window.RAM_PROJECTS = [
  {
    id: "sample-01",
    title: "[확인 필요: 사업명]",
    category: "재건축",
    status: "ongoing",
    featured: true,
    location: "[확인 필요: 위치]",
    scale: "[확인 필요: 규모 — 예) 지하 3층 ~ 지상 29층, 12개 동, 1,234세대]",
    period: "[확인 필요: 기간]",
    client: "[확인 필요: 발주처 / 조합]",
    role: "[확인 필요: 담당 업무]",
    summary: "[확인 필요: 사업 개요를 2~3문장으로 작성해 주세요.]",
    thumb: "assets/img/work/work-01.svg",
    images: ["assets/img/work/work-01.svg", "assets/img/work/work-02.svg"]
  },
  {
    id: "sample-02",
    title: "[확인 필요: 사업명]",
    category: "재개발",
    status: "ongoing",
    featured: true,
    location: "[확인 필요: 위치]",
    scale: "[확인 필요: 규모]",
    period: "[확인 필요: 기간]",
    client: "[확인 필요: 발주처 / 조합]",
    role: "[확인 필요: 담당 업무]",
    summary: "[확인 필요: 사업 개요]",
    thumb: "assets/img/work/work-02.svg",
    images: ["assets/img/work/work-02.svg"]
  },
  {
    id: "sample-03",
    title: "[확인 필요: 사업명]",
    category: "리모델링",
    status: "ongoing",
    featured: true,
    location: "[확인 필요: 위치]",
    scale: "[확인 필요: 규모]",
    period: "[확인 필요: 기간]",
    client: "[확인 필요: 발주처 / 조합]",
    role: "[확인 필요: 담당 업무]",
    summary: "[확인 필요: 사업 개요]",
    thumb: "assets/img/work/work-03.svg",
    images: ["assets/img/work/work-03.svg"]
  },
  {
    id: "sample-04",
    title: "[확인 필요: 사업명]",
    category: "도시정비",
    status: "done",
    featured: true,
    location: "[확인 필요: 위치]",
    scale: "[확인 필요: 규모]",
    period: "[확인 필요: 기간]",
    client: "[확인 필요: 발주처 / 조합]",
    role: "[확인 필요: 담당 업무]",
    summary: "[확인 필요: 사업 개요]",
    thumb: "assets/img/work/work-04.svg",
    images: ["assets/img/work/work-04.svg"]
  },
  {
    id: "sample-05",
    title: "[확인 필요: 사업명]",
    category: "재건축",
    status: "done",
    featured: true,
    location: "[확인 필요: 위치]",
    scale: "[확인 필요: 규모]",
    period: "[확인 필요: 기간]",
    client: "[확인 필요: 발주처 / 조합]",
    role: "[확인 필요: 담당 업무]",
    summary: "[확인 필요: 사업 개요]",
    thumb: "assets/img/work/work-05.svg",
    images: ["assets/img/work/work-05.svg"]
  },
  {
    id: "sample-06",
    title: "[확인 필요: 사업명]",
    category: "재개발",
    status: "done",
    featured: true,
    location: "[확인 필요: 위치]",
    scale: "[확인 필요: 규모]",
    period: "[확인 필요: 기간]",
    client: "[확인 필요: 발주처 / 조합]",
    role: "[확인 필요: 담당 업무]",
    summary: "[확인 필요: 사업 개요]",
    thumb: "assets/img/work/work-06.svg",
    images: ["assets/img/work/work-06.svg"]
  }
];
