// Prüfen, ob Chart existiert und erstellen
const chartContainer = document.querySelector('.chart-container');

if (chartContainer) {

  // Daten laden
  async function loadData() {
    const baseurl = window.BASEURL || "";
    const response = await fetch(`${baseurl}/public/data/data.json`);
    const data = await response.json();
    return data;
  }

  // Funktion um braune Farbvarianten zu generieren
  function generateBrownColors(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
    const hue = 33; // braun
    const saturation = 80 + Math.random() * 20;
    const lightness = 35 + Math.random() * 25;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }

  async function createCharts() {
  const data = await loadData();

  // Unternehmen
  const companyLabels = data.map(d => d.company);
  const companyPercentages = data.map(d => d.percentage);

  // Rest der Welt hinzufügen
  const sumCompany = companyPercentages.reduce((a,b) => a+b, 0);
  companyLabels.push("Rest der Welt");
  companyPercentages.push(100 - sumCompany);

  const companyColors = [...generateBrownColors(companyLabels.length - 1), 'lightgray'];

  // Diagramm erstellen
  const ctx1 = document.getElementById('companyChart').getContext('2d');
  new Chart(ctx1, {
  type: 'doughnut',
  data: {
      labels: companyLabels,
      datasets: [{
      label: 'Anteil an globalen CO₂-Emissionen',
      data: companyPercentages,
      backgroundColor: companyColors
      }]
  },
  options: {
      responsive: true,
      plugins: { 
      legend: { display: false },
      }
  }
  });

  // Länder
  const countryData = {};
  data.forEach(d => {
  if (!countryData[d.country]) countryData[d.country] = 0;
  countryData[d.country] += d.percentage;
  });

  const countryLabels = Object.keys(countryData);
  const countryPercentages = Object.values(countryData);

  // Rest der Welt hinzufügen
  const sumCountry = countryPercentages.reduce((a,b) => a+b, 0);
  countryLabels.push("Rest der Welt");
  countryPercentages.push(100 - sumCountry);

  const countryColors = [...generateBrownColors(countryLabels.length - 1), 'lightgray'];

  // Diagramm erstellen
  const ctx2 = document.getElementById('countryChart').getContext('2d');
  new Chart(ctx2, {
  type: 'doughnut',
      data: {
        labels: countryLabels,
        datasets: [{
          label: 'Anteil an globalen CO₂-Emissionen nach Land',
          data: countryPercentages,
          backgroundColor: countryColors
        }]
      },
      options: {
        responsive: true,
        plugins: { 
          legend: { display: false },
          }
      }
    });
  }

  createCharts(); 
};
    
// Prüfen, ob Swiper existiert und erstellen
const swiperContainer = document.querySelector('.mySwiper');

if (swiperContainer) {

  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 3.1,
    spaceBetween: 20,
    autoHeight: false,
    loop: false,
    navigation: {
      nextEl: ".swiper-next",
      prevEl: ".swiper-prev",
    },
    breakpoints: {
      992: { slidesPerView: 3.1 },
      768: { slidesPerView: 2.2 },
      576: { slidesPerView: 1.2 },
      0:   { slidesPerView: 1.1 }
    },
  });

  // Swiper Navigation ermitteln und erstellen
  function updateNavClasses(swiperInstance) {
    const prevBtn = document.querySelector('.swiper-prev');
    const nextBtn = document.querySelector('.swiper-next');

    if (!prevBtn || !nextBtn) return;

    if (swiperInstance.isBeginning) {
      prevBtn.classList.add('disabled');
    } else {
      prevBtn.classList.remove('disabled');
    }

    if (swiperInstance.isEnd) {
      nextBtn.classList.add('disabled'); 
    } else {
      nextBtn.classList.remove('disabled');
    }
  }

  swiper.on('slideChange', () => updateNavClasses(swiper));
  updateNavClasses(swiper);

}

// Footer-Abstand ermitteln und erstellen
function marginFooter() {
  document.getElementById("footer").style.marginBottom = document.getElementById('footer-notice').offsetHeight + "px";
};
window.addEventListener("resize", marginFooter);
marginFooter();

// Prüfen, ob das Chart-Element existiert und erstellen
const circleContainer = document.getElementById('circle-container');
const scrollCircle = document.getElementById('scrollCircle');
const colorSwitchEl = document.getElementById('color-switch');

let scrollChart = null;

if (scrollCircle) {
  const ctx = scrollCircle.getContext('2d');

  scrollChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [100, 0],
        backgroundColor: ['#d8d8d8', '#ce7a00'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '60%',
      animation: false,
      rotation: 35,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}

let ticking = false;

function updateChart(progress) {
  if (!scrollChart) return;

  let percent;
  let color = '#ce7a00';

  if (progress <= 0.3) {
    percent = (progress / 0.3) * 30;
    colorSwitchEl?.classList.remove("text-primary");
  } else {
    const relative = (progress - 0.3) / 0.7;
    percent = 30 * (1 - relative * 0.5);
    color = '#1b834b';
    colorSwitchEl?.classList.add("text-primary");
  }

  percent = Math.max(0, Math.min(100, percent));

  scrollChart.data.datasets[0].data = [percent, 100 - percent];

  if (scrollChart.data.datasets[0].backgroundColor[1] !== color) {
    scrollChart.data.datasets[0].backgroundColor[1] = color;
  }

  scrollChart.update();
}

// Scroll-Effekt beim Diagramm
function onScroll() {
  if (!circleContainer) return;

  const rect = circleContainer.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const start = windowHeight;
  const end = -rect.height;

  let progress = (start - rect.top) / (start - end);
  progress = Math.min(Math.max(progress, 0), 1);

  if (!ticking) {
    requestAnimationFrame(() => {
      updateChart(progress);
      ticking = false;
    });
    ticking = true;
  }
}

if (circleContainer) {
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  onScroll();
}

// Fade-In Effekt
const fadeIns = document.querySelectorAll(".primary-on-fade");

function handleScrollFade() {
  const viewportHeight = window.innerHeight;

  fadeIns.forEach(el => {
    const rect = el.getBoundingClientRect();
    const triggerPoint = viewportHeight / 5;

    if (rect.top < viewportHeight - triggerPoint && rect.bottom > triggerPoint) {
      el.classList.add("text-primary", "has-icon");
    } else {
      el.classList.remove("text-primary", "has-icon");
    }
  });
}

if (fadeIns.length) {
  window.addEventListener("scroll", handleScrollFade);
  window.addEventListener("resize", handleScrollFade);
  handleScrollFade();
}

const halfActiveEls = document.querySelectorAll(".active-on-half");

function handleScrollHalfActive() {
  const viewportHeight = window.innerHeight;
  const midpoint = viewportHeight / 2;

  halfActiveEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    const elementMid = rect.top + rect.height / 2;

    if (elementMid >= 0 && elementMid <= viewportHeight) {
      if (Math.abs(elementMid - midpoint) < rect.height / 2) {
        el.classList.add("is-active");
      } else {
        el.classList.remove("is-active");
      }
    } else {
      el.classList.remove("is-active");
    }
  });
}

if (halfActiveEls.length) {
  window.addEventListener("scroll", handleScrollHalfActive);
  window.addEventListener("resize", handleScrollHalfActive);
  handleScrollHalfActive();
}

// Counter-Effekt
const counters = document.querySelectorAll(".counter");

if (counters.length > 0) {
  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.number, 10) || 0;
    let current = 0;

    const duration = Math.max(200, 1000 - Math.log10(target + 1) * 150);

    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      current = Math.floor(progress * target);
      el.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.33 }
  );

  counters.forEach((counter) => observer.observe(counter));
}