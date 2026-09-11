/* =========================================================
   DRIVELUX
   Interactive Car Rental Website
   ========================================================= */


/* ================= CONFIGURATION ================= */

/*
    IMPORTANT :

    Remplace ce numéro par le vrai numéro WhatsApp.

    Exemple Maroc :

    0612345678

    devient :

    212612345678
*/

const WHATSAPP_NUMBER = "212600000000";


/* ================= VEHICLES ================= */

const cars = [

    {
        id: 1,
        name: "BMW X3",
        category: "suv",
        categoryName: "SUV",
        price: 850,
        fuel: "Diesel",
        transmission: "Automatique",
        seats: 5,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85"
    },

    {
        id: 2,
        name: "Mercedes C-Class",
        category: "berline",
        categoryName: "Berline",
        price: 900,
        fuel: "Diesel",
        transmission: "Automatique",
        seats: 5,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85"
    },

    {
        id: 3,
        name: "Range Rover Evoque",
        category: "luxe",
        categoryName: "Luxe",
        price: 1200,
        fuel: "Diesel",
        transmission: "Automatique",
        seats: 5,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85"
    },

    {
        id: 4,
        name: "Audi Q5",
        category: "suv",
        categoryName: "SUV",
        price: 950,
        fuel: "Diesel",
        transmission: "Automatique",
        seats: 5,
        image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=85"
    },

    {
        id: 5,
        name: "Peugeot 3008",
        category: "economique",
        categoryName: "Économique",
        price: 550,
        fuel: "Diesel",
        transmission: "Automatique",
        seats: 5,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85"
    },

    {
        id: 6,
        name: "Porsche 911",
        category: "sport",
        categoryName: "Sport",
        price: 1800,
        fuel: "Essence",
        transmission: "Automatique",
        seats: 2,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85"
    }

];


/* ================= VARIABLES ================= */

let selectedCategory = "all";
let favorites = JSON.parse(localStorage.getItem("driveluxFavorites")) || [];
let selectedCar = null;

const carsGrid = document.getElementById("carsGrid");
const resultCount = document.getElementById("resultCount");

const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const categorySelect = document.getElementById("category");
const locationSelect = document.getElementById("location");

const notification = document.getElementById("notification");
const notificationTitle = document.getElementById("notificationTitle");
const notificationText = document.getElementById("notificationText");


/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", () => {

    setDefaultDates();

    renderCars();

    updateFavoritesCount();

    setupRevealAnimations();

    setupHeader();

    setupCounters();

    setupEvents();

    setupWhatsApp();

});


/* ================= DATES ================= */

function setDefaultDates() {

    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const afterThreeDays = new Date(today);
    afterThreeDays.setDate(today.getDate() + 4);

    startDate.value = formatDate(tomorrow);
    endDate.value = formatDate(afterThreeDays);

    startDate.min = formatDate(today);
    endDate.min = formatDate(tomorrow);

}


/* ================= FORMAT DATE ================= */

function formatDate(date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ================= CALCULATE DAYS ================= */

function calculateDays() {

    if (!startDate.value || !endDate.value) {
        return 1;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    const difference = end - start;

    const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

    return Math.max(1, days);

}


/* ================= RENDER CARS ================= */

function renderCars() {

    let filteredCars = [...cars];

    /* CATEGORY */

    if (selectedCategory !== "all") {

        filteredCars = filteredCars.filter(
            car => car.category === selectedCategory
        );

    }


    /* SELECT CATEGORY */

    const selectCategory = categorySelect.value;

    if (selectCategory !== "all") {

        filteredCars = filteredCars.filter(
            car => car.category === selectCategory
        );

    }


    /* SORT */

    const sort = document.getElementById("sortSelect").value;

    if (sort === "low") {

        filteredCars.sort(
            (a, b) => a.price - b.price
        );

    }

    if (sort === "high") {

        filteredCars.sort(
            (a, b) => b.price - a.price
        );

    }


    resultCount.textContent = filteredCars.length;


    /* EMPTY */

    if (filteredCars.length === 0) {

        carsGrid.innerHTML = `
            <div class="empty-cars">
                <h3>Aucune voiture disponible</h3>
                <p>Essayez une autre catégorie.</p>
            </div>
        `;

        return;

    }


    /* HTML */

    carsGrid.innerHTML = filteredCars.map((car, index) => {

        const isFavorite = favorites.includes(car.id);

        return `

            <article
                class="car-card"
                style="animation-delay:${index * 80}ms"
            >

                <div class="car-image">

                    <img
                        src="${car.image}"
                        alt="${car.name}"
                        loading="lazy"
                    >

                    <span class="car-category">
                        ${car.categoryName}
                    </span>

                    <button
                        class="favorite ${isFavorite ? "active" : ""}"
                        data-favorite="${car.id}"
                        aria-label="Ajouter aux favoris"
                    >
                        ${isFavorite ? "♥" : "♡"}
                    </button>

                </div>


                <div class="car-info">

                    <div class="car-top">

                        <div>
                            <h3 class="car-name">
                                ${car.name}
                            </h3>
                        </div>

                        <div class="car-price">

                            <strong>
                                ${car.price} DH
                            </strong>

                            <span>
                                / jour
                            </span>

                        </div>

                    </div>


                    <div class="car-specs">

                        <span class="car-spec">
                            ⚙ ${car.transmission}
                        </span>

                        <span class="car-spec">
                            ◉ ${car.seats} places
                        </span>

                        <span class="car-spec">
                            ⛽ ${car.fuel}
                        </span>

                    </div>


                    <div class="car-bottom">

                        <button
                            class="book-btn"
                            data-book="${car.id}"
                        >
                            Réserver
                        </button>

                        <button
                            class="details-btn"
                            data-book="${car.id}"
                            title="Voir"
                        >
                            →
                        </button>

                    </div>

                </div>

            </article>

        `;

    }).join("");

}


/* ================= FAVORITES ================= */

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites = favorites.filter(
            item => item !== id
        );

        showNotification(
            "Retiré des favoris",
            "La voiture a été retirée."
        );

    } else {

        favorites.push(id);

        showNotification(
            "Ajouté aux favoris",
            "La voiture a été ajoutée."
        );

    }

    localStorage.setItem(
        "driveluxFavorites",
        JSON.stringify(favorites)
    );

    updateFavoritesCount();

    renderCars();

    renderFavorites();

}


/* ================= FAVORITES COUNT ================= */

function updateFavoritesCount() {

    document.getElementById(
        "favoritesCount"
    ).textContent = favorites.length;

}


/* ================= FAVORITES PANEL ================= */

function openFavorites() {

    document
        .getElementById("favoritesPanel")
        .classList.add("active");

    document
        .getElementById("panelOverlay")
        .classList.add("active");

    renderFavorites();

}


function closeFavorites() {

    document
        .getElementById("favoritesPanel")
        .classList.remove("active");

    document
        .getElementById("panelOverlay")
        .classList.remove("active");

}


/* ================= RENDER FAVORITES ================= */

function renderFavorites() {

    const content =
        document.getElementById("favoritesContent");


    const favoriteCars = cars.filter(
        car => favorites.includes(car.id)
    );


    if (favoriteCars.length === 0) {

        content.innerHTML = `

            <div class="empty-favorites">

                <div>♡</div>

                <p>
                    Aucun véhicule favori.
                </p>

                <span>
                    Cliquez sur ♡ sur une voiture
                    pour l'ajouter.
                </span>

            </div>

        `;

        return;

    }


    content.innerHTML = favoriteCars.map(car => `

        <div class="favorite-item">

            <img
                src="${car.image}"
                alt="${car.name}"
            >

            <div class="favorite-item-info">

                <strong>
                    ${car.name}
                </strong>

                <span>
                    ${car.price} DH / jour
                </span>

            </div>

            <button
                class="favorite-remove"
                data-remove-favorite="${car.id}"
            >
                ×
            </button>

        </div>

    `).join("");

}


/* ================= BOOKING MODAL ================= */

function openBooking(id) {

    const car = cars.find(
        item => item.id === id
    );

    if (!car) return;

    selectedCar = car;


    document.getElementById(
        "modalCarImage"
    ).src = car.image;


    document.getElementById(
        "modalCarName"
    ).textContent = car.name;


    document.getElementById(
        "modalCarSpecs"
    ).textContent =
        `${car.transmission} · ${car.seats} places · ${car.fuel}`;


    updateBookingPrice();


    document
        .getElementById("bookingModal")
        .classList.add("active");

}


function closeBooking() {

    document
        .getElementById("bookingModal")
        .classList.remove("active");

}


/* ================= BOOKING PRICE ================= */

function updateBookingPrice() {

    if (!selectedCar) return;

    const days = calculateDays();

    const total = selectedCar.price * days;


    document.getElementById(
        "modalDays"
    ).textContent =
        `${days} ${days > 1 ? "jours" : "jour"}`;


    document.getElementById(
        "modalDailyPrice"
    ).textContent =
        `${selectedCar.price} DH`;


    document.getElementById(
        "modalTotal"
    ).textContent =
        `${total.toLocaleString("fr-FR")} DH`;

}


/* ================= WHATSAPP BOOKING ================= */

function bookOnWhatsApp() {

    if (!selectedCar) return;


    const days = calculateDays();

    const total =
        selectedCar.price * days;

    const location =
        locationSelect.value;


    const message = `

Bonjour DriveLux 👋

Je souhaite réserver une voiture.

🚘 Véhicule : ${selectedCar.name}
📍 Lieu : ${location}

📅 Départ : ${startDate.value}
📅 Retour : ${endDate.value}

⏱️ Durée : ${days} jour(s)

💰 Prix/jour : ${selectedCar.price} DH
💰 Total estimé : ${total} DH

Merci de me confirmer la disponibilité.

    `.trim();


    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    window.open(url, "_blank");

}


/* ================= NOTIFICATION ================= */

function showNotification(title, text) {

    notificationTitle.textContent = title;
    notificationText.textContent = text;

    notification.classList.add("show");

    clearTimeout(
        window.notificationTimer
    );

    window.notificationTimer =
        setTimeout(() => {

            notification.classList.remove("show");

        }, 3000);

}


/* ================= CATEGORY FILTER ================= */

function setCategory(category) {

    selectedCategory = category;

    document.querySelectorAll(".category")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === category
            );

        });


    categorySelect.value = category;

    renderCars();

}


/* ================= SEARCH ================= */

function searchCars() {

    const location =
        locationSelect.value;

    const days =
        calculateDays();


    if (
        startDate.value &&
        endDate.value &&
        new Date(endDate.value) <= new Date(startDate.value)
    ) {

        showNotification(
            "Dates incorrectes",
            "La date de retour doit être après le départ."
        );

        return;

    }


    showNotification(
        "Recherche terminée",
        `${location} · ${days} jour(s)`
    );


    document
        .getElementById("cars")
        .scrollIntoView({
            behavior: "smooth"
        });

    renderCars();

}


/* ================= HEADER ================= */

function setupHeader() {

    const header =
        document.getElementById("header");


    window.addEventListener("scroll", () => {

        header.classList.toggle(
            "scrolled",
            window.scrollY > 50
        );

    });

}


/* ================= MOBILE MENU ================= */

function setupMenu() {

    const menuBtn =
        document.getElementById("menuBtn");

    const nav =
        document.getElementById("nav");


    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("active");

        menuBtn.classList.toggle("active");

    });


    nav.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("active");

            });

        });

}


/* ================= REVEAL ANIMATIONS ================= */

function setupRevealAnimations() {

    const elements =
        document.querySelectorAll(".reveal");


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: .12
            }
        );


    elements.forEach(
        element => observer.observe(element)
    );

}


/* ================= COUNTERS ================= */

function setupCounters() {

    const counters =
        document.querySelectorAll(
            "[data-number]"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;


                    const counter =
                        entry.target;

                    const target =
                        Number(
                            counter.dataset.number
                        );

                    let current = 0;

                    const increment =
                        Math.max(
                            1,
                            Math.ceil(target / 70)
                        );


                    const timer =
                        setInterval(() => {

                            current += increment;

                            if (current >= target) {

                                current = target;

                                clearInterval(timer);

                            }

                            counter.textContent =
                                current.toLocaleString("fr-FR");

                        }, 20);


                    observer.unobserve(counter);

                });

            },
            {
                threshold: .5
            }
        );


    counters.forEach(
        counter => observer.observe(counter)
    );

}


/* ================= THEME ================= */

function setupTheme() {

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    const savedTheme =
        localStorage.getItem(
            "driveluxTheme"
        );


    if (savedTheme === "light") {

        document.body.classList.add("light");

    }


    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light"
            );


            localStorage.setItem(
                "driveluxTheme",
                document.body.classList.contains("light")
                    ? "light"
                    : "dark"
            );

        }
    );

}


/* ================= WHATSAPP ================= */

function setupWhatsApp() {

    const floating =
        document.getElementById(
            "floatingWhatsapp"
        );


    floating.href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            "Bonjour DriveLux 👋 Je souhaite avoir des informations sur la location de voitures."
        )}`;

}


/* ================= EVENTS ================= */

function setupEvents() {

    setupMenu();

    setupTheme();


    /* SEARCH */

    document
        .getElementById("searchBtn")
        .addEventListener(
            "click",
            searchCars
        );


    /* SORT */

    document
        .getElementById("sortSelect")
        .addEventListener(
            "change",
            renderCars
        );


    /* CATEGORY BUTTONS */

    document
        .querySelectorAll(".category")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    setCategory(
                        button.dataset.category
                    );

                }
            );

        });


    /* SELECT CATEGORY */

    categorySelect.addEventListener(
        "change",
        () => {

            selectedCategory =
                categorySelect.value;

            document
                .querySelectorAll(".category")
                .forEach(button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.category === selectedCategory
                    );

                });

            renderCars();

        }
    );


    /* DATES */

    startDate.addEventListener(
        "change",
        () => {

            endDate.min =
                startDate.value;

            updateBookingPrice();

        }
    );


    endDate.addEventListener(
        "change",
        updateBookingPrice
    );


    /* CAR ACTIONS */

    carsGrid.addEventListener(
        "click",
        event => {

            const favoriteButton =
                event.target.closest(
                    "[data-favorite]"
                );


            if (favoriteButton) {

                toggleFavorite(
                    Number(
                        favoriteButton.dataset.favorite
                    )
                );

                return;

            }


            const bookButton =
                event.target.closest(
                    "[data-book]"
                );


            if (bookButton) {

                openBooking(
                    Number(
                        bookButton.dataset.book
                    )
                );

            }

        }
    );


    /* FAVORITES */

    document
        .getElementById("favoritesButton")
        .addEventListener(
            "click",
            openFavorites
        );


    document
        .getElementById("closeFavorites")
        .addEventListener(
            "click",
            closeFavorites
        );


    document
        .getElementById("panelOverlay")
        .addEventListener(
            "click",
            closeFavorites
        );


    document
        .getElementById("favoritesContent")
        .addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-remove-favorite]"
                    );

                if (!button) return;

                toggleFavorite(
                    Number(
                        button.dataset.removeFavorite
                    )
                );

            }
        );


    /* MODAL */

    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            closeBooking
        );


    document
        .getElementById("bookingModal")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "bookingModal"
                ) {

                    closeBooking();

                }

            }
        );


    document
        .getElementById("whatsappBtn")
        .addEventListener(
            "click",
            bookOnWhatsApp
        );


    /* ESC */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeBooking();
                closeFavorites();

            }

        }
    );

}


/* ================= LOADER ================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            document
                .getElementById("loader")
                .classList.add("hidden");

        }, 700);

    }
);
