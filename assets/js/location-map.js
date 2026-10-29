/* ============================================================
   RAM KOREA — location-map.js
   오시는 길 지도 (Leaflet + OpenStreetMap)
   (CSP 적용을 위해 인라인 스크립트에서 분리)
   ============================================================ */
(function () {
  var location = [37.539205683045, 127.08268274182];
  var map = L.map("companyMap").setView(location, 17);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap 기여자</a>'
  }).addTo(map);

  var companyIcon = L.divIcon({
    className: "company-map-marker",
    html: '<svg viewBox="0 0 32 42" aria-hidden="true"><path d="M16 1C7.7 1 1 7.7 1 16c0 11 15 25 15 25s15-14 15-25C31 7.7 24.3 1 16 1Z" fill="currentColor" stroke="#fff" stroke-width="2"/><circle cx="16" cy="16" r="5" fill="#fff"/></svg>',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -40]
  });

  L.marker(location, { icon: companyIcon, title: "(주)람코리아" })
    .addTo(map)
    .bindPopup("<strong>(주)람코리아</strong><br>서울시 광진구 자양로19길 8, 3층");
})();
