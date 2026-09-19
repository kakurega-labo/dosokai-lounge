const STALL_MENU = [
  { name: "焼きそば", price: 350 },
  { name: "カレーライス", price: 350 },
  { name: "フランクフルト", price: 150 },
  { name: "かけそば・うどん", price: 250 },
  { name: "いそべ焼き(3個入)", price: 150 },
  { name: "焼き鳥(各1本)", price: 100 },
  { name: "ポップコーン", price: 100 },
  { name: "たこ焼き(3個入)", price: 50 },
  { name: "ドリンク(各1個)", price: 50 }
];

const stallModalHTML = `
  <div class="modal-overlay" id="stallCalcModal">
    <div class="modal-box" id="stall-calc-box">
      <h2>飲食物計算</h2>
      <div class="stall-row">
        <div class="stall-name">メニュー名</div>
        <div class="stall-price">価格</div>
        <div style="width: 105px;text-align: center;">数量（＋/－）</div>
      </div>
      <div id="stallCalcList"></div>
      <div class="total-price">合計金額：<span id="totalPrice">0</span>円</div>
    </div>
  </div>
`;

function openStallCalc() {

  const menu = document.getElementById("hamburgerMenu");
  if (menu && menu.classList.contains("show")) {
    menu.classList.remove("show");
    document.body.classList.remove("menu-opened");
  }

  if (document.getElementById("stallCalcModal")) return;
  document.body.insertAdjacentHTML("beforeend", stallModalHTML);
  document.body.style.overflow = "hidden";

  const modal = document.getElementById("stallCalcModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeStallCalc();
      }
    });
  }

  renderStallCalc();
}

function closeStallCalc() {
  const modal = document.getElementById("stallCalcModal");
  if (modal) modal.remove();
  document.body.style.overflow = "";
}

function renderStallCalc() {
  const list = document.getElementById("stallCalcList");
  list.innerHTML = STALL_MENU.map((item, i) => `
    <div class="stall-row">
      <div class="stall-name">${item.name}</div>
      <div class="stall-price">￥${item.price}</div>
      <div class="stall-counter">
        <button onclick="updateCount(${i}, -1)">−</button>
        <span id="count-${i}" class="counter-space">0</span>
        <button onclick="updateCount(${i}, 1)">＋</button>
      </div>
    </div>
  `).join("");
}

const stallCounts = Array(STALL_MENU.length).fill(0);

function updateCount(index, diff) {
  stallCounts[index] = Math.max(0, stallCounts[index] + diff);
  document.getElementById(`count-${index}`).textContent = stallCounts[index];
  calcTotal();
}

function calcTotal() {
  let total = 0;
  stallCounts.forEach((count, i) => {
    total += count * STALL_MENU[i].price;
  });
  document.getElementById("totalPrice").textContent = total;
}

const waitForMenu = setInterval(() => {
  const menu = document.querySelector(".hamburger-menu");
  if (!menu) return;

  if (!menu.innerHTML.includes("飲食物計算")) {
    const btn = document.createElement("button");
    btn.innerHTML = `飲食物計算`;
    btn.onclick = openStallCalc;

    const hr = document.createElement("hr");
    hr.style.cssText = "margin: 0.5rem 0; border: 0; border-top: 1px solid #999;";

    const statusBtn = document.createElement("button");
    statusBtn.innerHTML = `状況判断`;
    statusBtn.onclick = () => {
      window.location.href = "status.html";
    };

    const donateBtn = document.createElement("button");
    donateBtn.innerHTML = `維持会費`;
    donateBtn.onclick = () => {
      window.location.href = "donate.html";
    };

    const disclaimerBtn = document.createElement("button");
    disclaimerBtn.innerHTML = `免責事項`;
    disclaimerBtn.onclick = () => {
      window.location.href = "disclaimer.html";
    };

    menu.appendChild(btn);
    menu.appendChild(hr);
    menu.appendChild(statusBtn);
    menu.appendChild(donateBtn);
    menu.appendChild(disclaimerBtn);
  }

  clearInterval(waitForMenu);
}, 300);
