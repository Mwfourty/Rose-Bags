// ===== STORAGE =====
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== DOM ELEMENTS =====
const wishlistContainer = document.getElementById("wishlist-items");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total");
const addAllBtn = document.getElementById("add-all-btn");
const logo = document.getElementById("rb-logo");
const textLogo = document.getElementById("rb-text-logo");

const DELIVERY_FEE = 0;

// ===== RENDER WISHLIST =====
function renderWishlist() {
    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="wishlist-empty">
                <i class="fa-solid fa-circle-xmark"></i>
                <p>Your wishlist is currently empty.</p>
                <a href="../index.html" class="btn"><i class="fa-solid fa-arrow-left"></i>Continue Shopping?</a>
            </div>
        `;

        logo.style.display = "none";
        textLogo.style.display = "none";

        updateSummary();
        return;
    }

    wishlist.forEach((product, index) => {
        const item = document.createElement("div");
        item.classList.add("wishlist-item");

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            
            <div class="wishlist-details">
                <h3>${product.name}</h3>
                <p>
                    R${product.price.toFixed(2)}
                    <span class="stock-count">${product.stock} left</span>
                </p>
            </div>

            <div class="quantity-control">
                <button onclick="decreaseQty(${index})">−</button>
                <span>${product.quantity}</span>
                <button onclick="increaseQty(${index})">+</button>
            </div>

            <div class="wishlist-actions">
                <button onclick="removeItem(${index})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;

        wishlistContainer.appendChild(item);
    });

    updateSummary();
}

// ===== QUANTITY CONTROLS =====
function increaseQty(index) {
    if (wishlist[index].quantity < wishlist[index].stock) {
        wishlist[index].quantity++;
        saveWishlist();
    }
}

function decreaseQty(index) {
    if (wishlist[index].quantity > 1) {
        wishlist[index].quantity--;
        saveWishlist();
    }
}

// ===== REMOVE ITEM =====
function removeItem(index) {
    wishlist.splice(index, 1);
    saveWishlist();
}

// ===== SUMMARY =====
function updateSummary() {
    const subtotal = wishlist.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
    deliveryEl.textContent = `R${DELIVERY_FEE.toFixed(2)}`;
    totalEl.textContent = `R${(subtotal + DELIVERY_FEE).toFixed(2)}`;
}

// ===== ADD ALL TO CART =====
addAllBtn.addEventListener("click", () => {
    wishlist.forEach(wishItem => {
        const existing = cart.find(item => item.name === wishItem.name);

        if (existing) {
            existing.quantity += wishItem.quantity;
        } else {
            cart.push({ ...wishItem });
        }
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    // Optional: clear wishlist after adding
    wishlist = [];
    saveWishlist();
});

// ===== SAVE =====
function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
}

// ===== INIT =====
renderWishlist();
