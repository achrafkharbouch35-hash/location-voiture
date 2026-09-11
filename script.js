document.addEventListener("DOMContentLoaded", function () {
/* =========================================
 NAVBAR
 ========================================= */
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", function () {
if (window.scrollY > 40) {
navbar.classList.add("scrolled");
} else {
navbar.classList.remove("scrolled");
}
});
/* =========================================
 MOBILE MENU
 ========================================= */
const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const mobileMenu = document.getElementById("mobileMenu");
if (menuBtn && mobileMenu) {
menuBtn.addEventListener("click", function () {
mobileMenu.classList.add("active");
document.body.classList.add("no-scroll");
});
}
if (closeMenu && mobileMenu) {
closeMenu.addEventListener("click", function () {
mobileMenu.classList.remove("active");
document.body.classList.remove("no-scroll");
});
1
}
const mobileLinks = document.querySelectorAll(".mobile-menu a");
mobileLinks.forEach(function (link) {
link.addEventListener("click", function () {
mobileMenu.classList.remove("active");
document.body.classList.remove("no-scroll");
});
});
/* =========================================
 SCROLL REVEAL
 ========================================= */
const revealElements =
document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
const observer = new IntersectionObserver(
function (entries, observer) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add("visible");
observer.unobserve(entry.target);
}
});
},
{
threshold: 0.12
}
);
revealElements.forEach(function (element) {
2
observer.observe(element);
});
} else {
revealElements.forEach(function (element) {
element.classList.add("visible");
});
}
/* =========================================
 CAR FILTER
 ========================================= */
const filterButtons =
document.querySelectorAll(".filter");
const carCards =
document.querySelectorAll(".car-card");
filterButtons.forEach(function (button) {
button.addEventListener("click", function () {
const selectedCategory =
button.getAttribute("data-filter");
filterButtons.forEach(function (btn) {
btn.classList.remove("active");
});
button.classList.add("active");
carCards.forEach(function (card) {
const category =
card.getAttribute("data-category");
if (
3
selectedCategory === "all" ||
category === selectedCategory
) {
card.classList.remove("hidden");
card.style.opacity = "0";
setTimeout(function () {
card.style.opacity = "1";
}, 50);
} else {
card.classList.add("hidden");
}
});
});
});
/* =========================================
 FAVORITES
 ========================================= */
const favorites =
document.querySelectorAll(".favorite");
favorites.forEach(function (button) {
button.addEventListener("click", function () {
button.classList.toggle("liked");
if (button.classList.contains("liked")) {
button.textContent = "♥";
} else {
button.textContent = "♡";
}
4
});
});
/* =========================================
 DATE SYSTEM
 ========================================= */
const startDate =
document.getElementById("startDate");
const endDate =
document.getElementById("endDate");
function getToday() {
const date = new Date();
const year = date.getFullYear();
const month =
String(date.getMonth() + 1).padStart(2, "0");
const day =
String(date.getDate()).padStart(2, "0");
return `${year}-${month}-${day}`;
}
const today = getToday();
if (startDate && endDate) {
startDate.min = today;
endDate.min = today;
startDate.addEventListener("change", function () {
endDate.min = startDate.value;
if (
endDate.value &&
endDate.value < startDate.value
5
) {
endDate.value = startDate.value;
}
});
}
/* =========================================
 BOOKING SEARCH
 ========================================= */
const searchBtn =
document.getElementById("searchBtn");
const bookingMessage =
document.getElementById("bookingMessage");
if (searchBtn) {
searchBtn.addEventListener("click", function () {
const location =
document.getElementById("location").value;
const start =
startDate.value;
const end =
endDate.value;
if (!start || !end) {
bookingMessage.textContent =
"⚠ Veuillez sélectionner les dates de départ et de
retour.";
return;
}
const startTime =
new Date(start + "T00:00:00");
const endTime =
6
new Date(end + "T00:00:00");
const difference =
endTime.getTime() - startTime.getTime();
const days =
Math.ceil(
difference /
(1000 * 60 * 60 * 24)
);
if (days <= 0) {
bookingMessage.textContent =
"⚠ La date de retour doit être après la date de départ.";
return;
}
bookingMessage.textContent =
`✓ ${days} jour${days > 1 ? "s" : ""} de location à $
{location}. Voici nos véhicules disponibles.`;
document.getElementById("cars")
.scrollIntoView({
behavior: "smooth"
});
});
}
/* =========================================
 RESERVATION MODAL
 ========================================= */
const modal =
document.getElementById("modal");
const modalClose =
document.getElementById("modalClose");
const modalCar =
document.getElementById("modalCar");
7
const modalStart =
document.getElementById("modalStart");
const modalEnd =
document.getElementById("modalEnd");
const modalDays =
document.getElementById("modalDays");
const modalPrice =
document.getElementById("modalPrice");
const rentButtons =
document.querySelectorAll(".rent-btn");
rentButtons.forEach(function (button) {
button.addEventListener("click", function () {
const carName =
button.getAttribute("data-car");
const price =
Number(
button.getAttribute("data-price")
);
let days = 1;
if (
startDate.value &&
endDate.value
) {
const start =
new Date(
startDate.value + "T00:00:00"
);
const end =
new Date(
endDate.value + "T00:00:00"
);
const difference =
8
end.getTime() - start.getTime();
const calculatedDays =
Math.ceil(
difference /
(1000 * 60 * 60 * 24)
);
if (calculatedDays > 0) {
days = calculatedDays;
}
}
const total =
price * days;
modalCar.textContent =
carName;
modalStart.textContent =
startDate.value || "Aujourd'hui";
modalEnd.textContent =
endDate.value || "—";
modalDays.textContent =
`${days} jour${days > 1 ? "s" : ""}`;
modalPrice.textContent =
total.toLocaleString("fr-FR") + " DH";
modal.classList.add("active");
document.body.classList.add("no-scroll");
});
});
9
/* =========================================
 CLOSE MODAL
 ========================================= */
function closeModal() {
modal.classList.remove("active");
document.body.classList.remove("no-scroll");
}
if (modalClose) {
modalClose.addEventListener(
"click",
closeModal
);
}
modal.addEventListener("click", function (event) {
if (event.target === modal) {
closeModal();
}
});
document.addEventListener("keydown", function (event) {
if (event.key === "Escape") {
closeModal();
}
});
/* =========================================
 CONFIRM BUTTON
 ========================================= */
const confirmBtn =
10
document.getElementById("confirmBtn");
if (confirmBtn) {
confirmBtn.addEventListener("click", function () {
alert(
"Merci ! La prochaine étape sera de connecter cette
réservation à WhatsApp ou à votre système de réservation."
);
});
}
/* =========================================
 COUNTERS
 ========================================= */
const counters =
document.querySelectorAll("[data-target]");
function animateCounter(element) {
const target =
Number(
element.getAttribute("data-target")
);
let current = 0;
const duration = 1500;
const startTime =
performance.now();
function update(currentTime) {
const progress =
Math.min(
(currentTime - startTime) /
duration,
1
);
11
const eased =
1 - Math.pow(1 - progress, 3);
current =
Math.floor(
eased * target
);
element.textContent =
current;
if (progress < 1) {
requestAnimationFrame(update);
} else {
element.textContent =
target;
}
}
requestAnimationFrame(update);
}
if ("IntersectionObserver" in window) {
const counterObserver =
new IntersectionObserver(
function (entries, observer) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
animateCounter(
entry.target
);
observer.unobserve(
entry.target
);
12
}
});
},
{
threshold: 0.6
}
);
counters.forEach(function (counter) {
counterObserver.observe(counter);
});
} else {
counters.forEach(function (counter) {
counter.textContent =
counter.getAttribute("data-target");
});
}
/* =========================================
 HERO PARALLAX
 ========================================= */
const hero =
document.querySelector(".hero");
const heroCar =
document.querySelector(".hero-car");
window.addEventListener("scroll", function () {
if (!hero || !heroCar) {
return;
}
const scroll =
window.scrollY;
13
if (scroll < window.innerHeight) {
heroCar.style.transform =
`translateY(${scroll * 0.12}px) rotate(-2deg)`;
}
});
});
