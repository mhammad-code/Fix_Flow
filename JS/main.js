

function applyTheme(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  const icon = mode === "dark" ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
  const themeBtn = document.getElementById("themeToggle");
  const adminThemeBtn = document.getElementById("adminThemeToggle");
  if (themeBtn) themeBtn.innerHTML = icon;
  if (adminThemeBtn) adminThemeBtn.innerHTML = icon;
}

window.toggleTheme = function () {
  const next = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("fixflow-theme", next);
  applyTheme(next);
};

applyTheme(localStorage.getItem("fixflow-theme") || "light");

const mainThemeBtn = document.getElementById("themeToggle");
if (mainThemeBtn) {
  mainThemeBtn.addEventListener("click", window.toggleTheme);
}

 



if (window.AOS) AOS.init({ duration: 700, once: false, mirror: false });

 
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

 
function initPage() {
  showCity();    

   
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const step = Math.max(1, Math.ceil(target / 60));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
  });

   
  const scene = document.querySelector(".scene");
  if (scene && !reduceMotion) {
    const inner = scene.querySelector(".scene-inner");
    scene.addEventListener("mousemove", e => {
      const box = scene.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width - 0.5;
      const y = (e.clientY - box.top) / box.height - 0.5;
      inner.style.setProperty("--ry", (x * 20) + "deg");
      inner.style.setProperty("--rx", (-y * 20) + "deg");
    });
    scene.addEventListener("mouseleave", () => {
      inner.style.setProperty("--rx", "0deg");
      inner.style.setProperty("--ry", "0deg");
    });
  }

   
  if (!reduceMotion) {
    document.querySelectorAll(".tilt").forEach(card => {
      card.addEventListener("mousemove", e => {
        const box = card.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width - 0.5;
        const y = (e.clientY - box.top) / box.height - 0.5;
        card.style.setProperty("--ty", (x * 14) + "deg");
        card.style.setProperty("--tx", (-y * 14) + "deg");
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--tx", "0deg");
        card.style.setProperty("--ty", "0deg");
      });
    });
  }

   
  if (window.AOS) AOS.refreshHard();
}


 
const navbar = document.querySelector(".navbar-fix");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);    
});







function getCity() {
  return localStorage.getItem("fixflow-city") || "Lahore";
}

function showCity() {
  const city = getCity();
  const el = document.getElementById("cityName");
  if (el) el.textContent = city;
  document.querySelectorAll("[data-city]").forEach(item => item.textContent = city);
  document.querySelectorAll(".footer-city-pill").forEach(pill => {
    pill.classList.toggle("active", pill.textContent.trim() === city);
  });
}

window.changeFooterCity = function (city) {
  if (CITIES && CITIES[city]) {
    localStorage.setItem("fixflow-city", city);
    showCity();
    window.dispatchEvent(new Event("citychange"));
  }
};

const cityList = document.getElementById("cityList");
Object.keys(CITIES).forEach(city => {
  const li = document.createElement("li");
  li.innerHTML = '<button class="dropdown-item" type="button">' + city + '</button>';
  li.firstChild.addEventListener("click", () => {
    localStorage.setItem("fixflow-city", city);
    showCity();
    window.dispatchEvent(new Event("citychange"));
  });
  cityList.appendChild(li);
});







const IMG_EXT = ["jpg", "jfif", "jpeg", "png", "webp"];

function imgFallback(img) {
  const next = (+img.dataset.try || 0) + 1;           
  if (next >= IMG_EXT.length) { img.remove(); return; }
  img.dataset.try = next;
  img.src = img.src.replace(/\.[a-z]+$/i, "." + IMG_EXT[next]);
}
