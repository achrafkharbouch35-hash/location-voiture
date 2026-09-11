```javascript
/* ================================
   CUSTOM CURSOR
================================ */

const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", (e) => {

    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    follower.animate(
        {
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        },
        {
            duration: 500,
            fill: "forwards"
        }
    );
});


/* ================================
   SCROLL REVEAL
================================ */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


/* ================================
   CAR FILTER
================================ */

const filters = document.querySelectorAll(".filter");
const cars = document.querySelectorAll(".car-card");

filters.forEach((filter) => {

    filter.addEventListener("click", () => {

        filters.forEach((item) => {
            item.classList.remove("active");
        });

        filter.classList.add("active");

        const category = filter.dataset.filter;

        cars.forEach((car) => {

            const carCategory = car.dataset.category;

            if (category === "all" || category === carCategory) {

                car.style.display = "block";

                setTimeout(() => {
                    car.style.opacity = "1";
                    car.style.transform = "translateY(0)";
                }, 50);

            } else {

                car.style.opacity = "0";
                car.style.transform = "translateY(20px)";

                setTimeout(() => {
                    car.style.display = "none";
                }, 300);

            }

        });

    });

});


/* ================================
   FAVORITES
================================ */

const hearts = document.querySelectorAll(".heart");

hearts.forEach((heart) => {

    heart.addEventListener("click", () => {

        if (heart.textContent === "♡") {
            heart.textContent = "♥";
            heart.style.background = "#d9ff00";
            heart.style.color = "#000";
        } else {
            heart.textContent = "♡";
            heart.style.background = "rgba(0,0,0,.3)";
            heart.style.color = "white";
        }

    });

});


/* ================================
   DATE SYSTEM
================================ */

const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const today = new Date();

const todayString = today.toISOString().split("T")[0];

startDate.min = todayString;
endDate.min = todayString;

startDate.addEventListener("change", () => {

    endDate.min = startDate.value;

    if (endDate.value < startDate.value) {
        endDate.value = startDate.value;
    }

});


/* ================================
   SEARCH
================================ */

const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", () => {

    if (!startDate.value || !endDate.value) {

        alert("Veuillez sélectionner vos dates de location.");

        return;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    const difference = end - start;

    const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {

        alert("La date de retour doit être après la date de départ.");

        return;
    }

    document.getElementById("cars").scrollIntoView({
        behavior: "smooth"
    });

});


/* ================================
   RENT MODAL
================================ */

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalCar = document.getElementById("modalCar");
const modalPrice = document.getElementById("modalPrice");

const rentButtons = document.querySelectorAll(".rent-button");

rentButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const card = button.closest(".car-card");

        const brand = card.querySelector(".car-name small").textContent;
        const model = card.querySelector(".car-name h3").textContent;

        const price = Number(button.dataset.price);

        let days = 1;

        if (startDate.value && endDate.value) {

            const start = new Date(startDate.value);
            const end = new Date(endDate.value);

            days = Math.ceil(
                (end - start) /
                (1000 * 60 * 60 * 24)
            );

            if (days < 1) {
                days = 1;
            }
        }

        const total = price * days;

        modalCar.textContent =
            `${brand} ${model} — ${days} jour${days > 1 ? "s" : ""}`;

        modalPrice.textContent =
            `${total.toLocaleString("fr-FR")} DH`;

        modal.classList.add("active");

    });

});


modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
});


modal.addEventListener("click", (e) => {

    if (e.target === modal) {
        modal.classList.remove("active");
    }

});


/* ================================
   COUNTERS
================================ */

const counters = document.querySelectorAll("[data-count]");

const counterObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = Number(counter.dataset.count);

            let current = 0;

            const duration = 1500;
            const increment = target / (duration / 16);

            const updateCounter = () => {

                current += increment;

                if (current < target) {

                    counter.textContent =
                        Math.floor(current);

                    requestAnimationFrame(updateCounter);

                } else {

                    counter.textContent = target;
                }

            };

            updateCounter();

            observer.unobserve(counter);

        });

    },
    {
        threshold: 0.8
    }
);

counters.forEach((counter) => {
    counterObserver.observe(counter);
});


/* ================================
   PARALLAX HERO
================================ */

const heroCar = document.querySelector(".hero-car");

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;

    if (scroll < window.innerHeight) {

        heroCar.style.transform =
            `translateY(${scroll * 0.15}px) rotate(-2deg)`;

    }

});


/* ================================
   NAVBAR SCROLL
================================ */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.background =
            "rgba(7,7,7,.85)";

    } else {

        navbar.style.background =
            "rgba(7,7,7,.55)";

    }

});


/* ================================
   ESCAPE MODAL
================================ */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        modal.classList.remove("active");
    }

});

