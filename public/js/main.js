/* ========================================================
   BANDARA TARDAMU - Main JavaScript
   ======================================================== */

function initPublicPage() {
  initHeader();
  initMobileNav();
  setActiveNavigation();
  initScrollReveal();
  initBottomNavHighlight();
  updateWeather();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPublicPage);
} else {
  initPublicPage();
}

function initHeader() {
  const header = document.getElementById("header");

  if (!header) return;

  const updateHeaderState = () => {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeaderState();

  window.addEventListener(
    "scroll",
    updateHeaderState,
    { passive: true }
  );
}

function initMobileNav() {
  const burger = document.getElementById("burgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  const navOverlay = document.getElementById("navOverlay");
  const body = document.body;

  if (!burger || !mobileNav || !navOverlay) return;

  function setMenuState(isOpen) {
    mobileNav.classList.toggle("open", isOpen);
    mobileNav.classList.toggle("active", isOpen);
    burger.classList.toggle("active", isOpen);
    navOverlay.classList.toggle("active", isOpen);
    body.style.overflow = isOpen ? "hidden" : "";
  }

  burger.addEventListener("click", () => {
    const isOpen =
      mobileNav.classList.contains("open") || mobileNav.classList.contains("active");
    setMenuState(!isOpen);
  });

  mobileNav.querySelectorAll(".mobile-nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  navOverlay.addEventListener("click", () => {
    setMenuState(false);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node)) return;

    const isOpen =
      mobileNav.classList.contains("open") || mobileNav.classList.contains("active");

    if (isOpen && !mobileNav.contains(target) && !burger.contains(target)) {
      setMenuState(false);
    }
  });
}

function initScrollReveal() {
  const sections = document.querySelectorAll(
    ".flight-card, .weather-card, .quick-action, .tourism-card"
  );

  sections.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${index * 80}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  sections.forEach((element) => observer.observe(element));
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

function setActiveNavigation() {
  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll(
    ".header__nav-link, .mobile-nav__link, .bottom-nav__item"
  );

  navLinks.forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;

    const linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
    const isNewsDetail = currentPath.startsWith("/berita/") && linkPath === "/berita";
    link.classList.toggle("active", linkPath === currentPath || isNewsDetail);
  });
}

function initBottomNavHighlight() {
  if (normalizePath(window.location.pathname) !== "/") return;

  const sections = [{ id: "hero", navSelector: ".bottom-nav__item--home" }];

  const bottomNavItems = document.querySelectorAll(".bottom-nav__item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;

          bottomNavItems.forEach((item) => item.classList.remove("active"));

          const match = sections.find((section) => section.id === activeId);
          if (match) {
            if (match.navSelector) {
              document.querySelector(match.navSelector)?.classList.add("active");
            } else if (match.navHref) {
              document
                .querySelector(`.bottom-nav__item[href="${match.navHref}"]`)
                ?.classList.add("active");
            }
          }
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-80px 0px -40% 0px",
    }
  );

  sections.forEach((section) => {
    const element = document.getElementById(section.id);
    if (element) observer.observe(element);
  });
}


async function updateWeather() {
  const API_KEY = "aa07b71965ab3146888655b0c207ad6d";
  const LAT = "-10.48";
  const LON = "121.84";
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=id`
    );

    if (!response.ok) throw new Error("Gagal mengambil data");

    const data = await response.json();

    const tempElement = document.querySelector(".weather-card__degrees");
    if (tempElement) tempElement.innerText = `${Math.round(data.main.temp)}\u00B0C`;

    const descElement = document.querySelector(".weather-card__desc");
    if (descElement) descElement.innerText = data.weather[0].description;

    const windElement = document
      .querySelector(".fa-wind")
      ?.parentElement?.querySelector("strong");
    if (windElement) windElement.innerText = `${data.wind.speed} km/jam`;

    const humidElement = document
      .querySelector(".fa-droplet")
      ?.parentElement?.querySelector("strong");
    if (humidElement) humidElement.innerText = `${data.main.humidity}%`;
  } catch (error) {
    console.error("Error:", error);
  }
}
