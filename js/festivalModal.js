const DEFAULT_STALL_IMAGE = "image/no_image_logo.png";

const festivalModalHTML = `
  <div class="modal-overlay" id="festivalModal">
    <div class="modal-box" id="festivalModalBox">
      <h2>模擬店一覧</h2>
      <div id="festivalContent">読み込み中...</div>
    </div>
  </div>
`;

let currentFestivalPage = 1;
const ITEMS_PER_PAGE = 12;

function openFestivalModal() {
  const existing = document.getElementById("festivalModal");
  if (existing) existing.remove();

  document.body.insertAdjacentHTML("beforeend", festivalModalHTML);
  document.body.style.overflow = "hidden";

  const modal = document.getElementById("festivalModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeFestivalModal();
      }
    });
  }

  if (typeof FES_DATA !== "undefined") {
    renderFestivalPage(FES_DATA, currentFestivalPage);
  }
}

function closeFestivalModal() {
  const modal = document.getElementById("festivalModal");
  if (modal) modal.remove();
  document.body.style.overflow = "";
}

function renderFestivalPage(data, page) {
  const container = document.getElementById("festivalContent");

  const flatItems = [];

  data.forEach(floor => {
    floor.stalls.forEach(stall => {
      flatItems.push({
        floor: floor.floor,
        name: stall.name,
        place: stall.place,
        group: stall.group
      });
    });
  });

  const totalPages = Math.ceil(flatItems.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = flatItems.slice(start, end);

  const grouped = {};
  pageItems.forEach(item => {
    if (!grouped[item.floor]) grouped[item.floor] = [];
    grouped[item.floor].push(item);
  });

  container.innerHTML = Object.entries(grouped).map(([floor, stalls]) => `
    <h3>${floor}</h3>
    <ul>
      ${stalls.map(stall => `
        <li onclick="showFestivalDetail('${(stall.name + " @ " + stall.place).replace(/'/g, "\\'")}')">
          <strong>${stall.name}</strong>
          <p>＠${stall.place}</p>
          <p class="stall-group">${stall.group}</p>
        </li>
      `).join("")}
    </ul>
  `).join("");

  const modalBox = document.getElementById("festivalModalBox");
  const oldPagination = modalBox.querySelector(".pagination-wrapper");
  if (oldPagination) oldPagination.remove(); 
  modalBox.insertAdjacentHTML("beforeend", createPaginationControls(page, totalPages));
}

function createPaginationControls(current, total) {
  return `
    <div class="pagination-wrapper">
      <button class="pagination-button" onclick="changeFestivalPage(-1)" ${current === 1 ? 'disabled' : ''}>← 前へ</button>
      <span class="pagination">${current} / ${total}ページ</span>
      <button class="pagination-button" onclick="changeFestivalPage(1)" ${current === total ? 'disabled' : ''}>次へ →</button>
    </div>
  `;
}

function changeFestivalPage(direction) {
  const flatItems = FES_DATA.flatMap(floor =>
    floor.stalls.map(stall => ({
      floor: floor.floor,
      name: stall.name,
      place: stall.place,
      group: stall.group
    }))
  );
  const totalPages = Math.ceil(flatItems.length / ITEMS_PER_PAGE);
  currentFestivalPage += direction;
  if (currentFestivalPage < 1) currentFestivalPage = 1;
  if (currentFestivalPage > totalPages) currentFestivalPage = totalPages;

  renderFestivalPage(FES_DATA, currentFestivalPage);
}

function showFestivalDetail(stallKey) {
  let found = null;
  for (const floor of FES_DATA) {
    const match = floor.stalls.find(s => (s.name + " @ " + s.place) === stallKey);
    if (match) {
      found = { ...match, floor: floor.floor };
      break;
    }
  }

  if (!found) return;

  const h2 = document.querySelector("#festivalModalBox h2");
  if (h2) h2.textContent = found.name;

  const container = document.getElementById("festivalContent");
  const imgSrc = found.image || DEFAULT_STALL_IMAGE;

  container.innerHTML = `
    <div class="stall-detail">
      <img src="${imgSrc}" alt="${found.name}" class="stall-thumbnail">
      <div class="stall-detail-text">
        <p><strong>場所：</strong>${found.place || "―"}</p>
        <p><strong>団体：</strong>${found.group || "―"}</p>
        <p><strong>フロア：</strong>${found.floor || "―"}</p>
        <p style="border: none;"><strong>説明文：</strong>${found.description || "―"}</p>
      </div>
        <button onclick="backToFestivalList()" class="back-button">一覧に戻る</button>
    </div>
  `;

  const paginationWrapper = document.querySelector(".pagination-wrapper");
  if (paginationWrapper) paginationWrapper.style.display = "none";
}

function backToFestivalList() {
  const h2 = document.querySelector("#festivalModalBox h2");
  if (h2) h2.textContent = "文化祭マップ・模擬店一覧";

  renderFestivalPage(FES_DATA, currentFestivalPage);

  const paginationWrapper = document.querySelector(".pagination-wrapper");
  if (paginationWrapper) paginationWrapper.style.display = "block";
}
