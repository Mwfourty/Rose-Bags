// GLOBAL STATE (safe for all pages)
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// UPDATE DOTS (safe even if elements don't exist)
function updateIndicators() {
    const cartDot = document.getElementById("cart-dot");
    const favDot = document.getElementById("fav-dot");

    if (cartDot) {
        cartDot.style.display = cart.length > 0 ? "block" : "none";
    }

    if (favDot) {
        favDot.style.display = wishlist.length > 0 ? "block" : "none";
    }
}

// RUN ON EVERY PAGE LOAD
document.addEventListener("DOMContentLoaded", updateIndicators);
