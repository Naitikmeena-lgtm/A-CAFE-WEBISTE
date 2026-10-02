const header = document.querySelector(".header-container");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Toggles the mobile menu and supports Escape and link-based dismissal.
if (menuToggle && navigation) {
    const setMenuOpen = (isOpen) => {
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
        navigation.classList.toggle("is-open", isOpen);
    };

    menuToggle.addEventListener("click", () => {
        setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });
}

// Adds a subtle shadow after the page scrolls past the header.
if (header) {
    const updateHeaderShadow = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    updateHeaderShadow();
    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
}

// Smoothly scrolls to valid in-page links while accounting for the sticky header.
document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href") === "#") {
        return;
    }

    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
        return;
    }

    event.preventDefault();
    const headerOffset = header ? header.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.history.pushState(null, "", link.getAttribute("href"));
    window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: reducedMotion.matches ? "auto" : "smooth"
    });
});

// Reveals marked sections as they enter the viewport without a third-party library.
if ("IntersectionObserver" in window && !reducedMotion.matches) {
    document.documentElement.classList.add("has-js");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal:not(.show)").forEach((element) => {
        revealObserver.observe(element);
    });
}

// Filters the menu list by the selected category.
const menuFilters = document.querySelectorAll(".menu-filter");
const menuItems = document.querySelectorAll(".menu-item[data-category]");

menuFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
        const selectedCategory = filter.dataset.filter;

        menuFilters.forEach((button) => {
            const isSelected = button === filter;
            button.classList.toggle("is-active", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });

        menuItems.forEach((item) => {
            item.hidden = selectedCategory !== "all" && item.dataset.category !== selectedCategory;
        });
    });
});
