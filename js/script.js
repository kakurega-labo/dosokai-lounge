const statusText = {
  green: '混雑なし',
  yellow: 'やや混雑',
  red: '大変混雑'
};

const display = document.getElementById('status-display');

if (display) {
  if (location.protocol === 'file:') {
    const localStatus = 'green'; 
    display.textContent = statusText[localStatus] || '不明';
    display.classList.add(`status-${localStatus}`);
  } else {
    fetch('data/status.json')
      .then(res => res.json())
      .then(data => {
        display.textContent = statusText[data.status] || '不明';
        display.classList.add(`status-${data.status}`);
      })
      .catch(err => {
        if (display) display.textContent = '取得失敗';
      });
  }
}

let currentSlide = 0;
const slidesContainer = document.querySelector('.slides');
const originalSlides = slidesContainer ? Array.from(slidesContainer.querySelectorAll('img')) : [];
const totalOriginalSlides = originalSlides.length;

if (slidesContainer && totalOriginalSlides > 1) {
  const firstClone = originalSlides[0].cloneNode(true);
  slidesContainer.appendChild(firstClone);
}

function updateDots(index) {
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => dot.classList.remove('active'));
  const activeIndex = index % totalOriginalSlides;
  if (dots[activeIndex]) dots[activeIndex].classList.add('active');
}

function setSlide(index) {
  if (!slidesContainer) return;
  currentSlide = index;
  slidesContainer.style.transition = 'transform 0.5s ease-in-out';
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;
  updateDots(index);
}

function nextSlide() {
  if (!slidesContainer || totalOriginalSlides === 0) return;
  currentSlide++;
  slidesContainer.style.transition = 'transform 0.5s ease-in-out';
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots(currentSlide);

  if (currentSlide === totalOriginalSlides) {
    setTimeout(() => {
      slidesContainer.style.transition = 'none';
      currentSlide = 0;
      slidesContainer.style.transform = `translateX(0%)`;
    }, 500);
  }
}

function prevSlide() {
  if (!slidesContainer || totalOriginalSlides === 0) return;
  if (currentSlide === 0) {
    slidesContainer.style.transition = 'none';
    currentSlide = totalOriginalSlides;
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    void slidesContainer.offsetWidth;
    
    currentSlide--;
    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  } else {
    currentSlide--;
    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  updateDots(currentSlide);
}

setSlide(0);

setInterval(() => {
  nextSlide();
}, 5000);

let startX = 0;
const slider = document.querySelector('.slider');

if (slider) {
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 50) {
      prevSlide();
    } else if (diff < -50) {
      nextSlide();
    }
  });
}

const toTopBtn = document.getElementById("toTopBtn");

if (toTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      toTopBtn.style.display = "block";
    } else {
      toTopBtn.style.display = "none";
    }
  });

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function checkOpenNow() {
  const openNowMsg = document.getElementById("openNowMessage");
  if (!openNowMsg) return;

  const now = new Date();
  const openPeriods = [
    { date: "2026-09-14", start: "12:00", end: "15:00" },   
    { date: "2026-09-19", start: "10:00", end: "15:30" },
    { date: "2026-09-20", start: "10:00", end: "15:30" },
  ];

  const pad = n => n.toString().padStart(2, "0");
  const nowDateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const nowTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const period = openPeriods.find(p => p.date === nowDateStr &&
    nowTimeStr >= p.start && nowTimeStr <= p.end
  );

  openNowMsg.classList.remove('status-green', 'status-red');

  if (period) {
    openNowMsg.textContent = '開催中';
    openNowMsg.classList.add('status-green');
  } else {
    openNowMsg.textContent = '準備中';
    openNowMsg.classList.add('status-red');
  }
}

checkOpenNow();
setInterval(checkOpenNow, 10000);

function scrollToSection(id) {
  const target = document.querySelector(`.${id}`) || document.getElementById(id);
  if (target) {
    window.scrollTo({
      top: target.offsetTop - 85,
      behavior: 'smooth'
    });
  }
}

const hamburgerBtn = document.getElementById("hamburgerBtn");
const hamburgerMenu = document.getElementById("hamburgerMenu");

if (hamburgerBtn && hamburgerMenu) {
  hamburgerBtn.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("show");
    document.body.classList.toggle("menu-opened");
  });

  document.addEventListener("click", function (e) {
    const isMenu = hamburgerMenu.contains(e.target);
    const isButton = hamburgerBtn.contains(e.target);

    if (!isMenu && !isButton && hamburgerMenu.classList.contains("show")) {
      hamburgerMenu.classList.remove("show");
      document.body.classList.remove("menu-opened");
    }
  });
}

const closeMenuBtn = document.querySelector(".close-menu-btn");

if (closeMenuBtn && hamburgerMenu) {
  closeMenuBtn.addEventListener("click", () => {
    hamburgerMenu.classList.remove("show");
    document.body.classList.remove("menu-opened");
  });
}

document.querySelectorAll("#hamburgerMenu button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (hamburgerMenu) {
      hamburgerMenu.classList.remove("show");
      document.body.classList.remove("menu-opened");
    }
  });
});

document.addEventListener('input', function(e) {
  if (e.target && e.target.id === 'festivalSearch') {
    const keyword = e.target.value.trim().toLowerCase();
    const filtered = [];

    FES_DATA.forEach(floor => {
      const matchedStalls = floor.stalls.filter(stall =>
        stall.name.toLowerCase().includes(keyword) ||
        stall.place.toLowerCase().includes(keyword) ||
        stall.group.toLowerCase().includes(keyword)
      );
      if (matchedStalls.length > 0) {
        filtered.push({
          floor: floor.floor,
          stalls: matchedStalls
        });
      }
    });

    currentFestivalPage = 1;
    renderFestivalPage(filtered.length > 0 ? filtered : FES_DATA, currentFestivalPage);
  }
});
