// HEADER INTERFACE FUNCTIONS
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];


function updateIndicators() {
    const cartDot = document.getElementById("cart-dot");
    const favDot = document.getElementById("fav-dot");

    cartDot.style.display = cart.length > 0 ? "block" : "none";
    favDot.style.display = wishlist.length > 0 ? "block" : "none";
};

// CART AND FAVOURITES MANAGEMENT FUNCTIONS

function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity += 1;
    }

    else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateIndicators();
};

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateIndicators();
}

function toggleFavourite(product) {
    const index = wishlist.findIndex(item => item.name === product.name);

    if (index !== -1) {
        // Remove
        wishlist.splice(index, 1);
    } else {
        // Add with quantity
        wishlist.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateIndicators();
}


// SHOP INTERFACE FUNCTIONS

const container = document.getElementById("shop-container");
let currentProducts = [];

// RENDER PRODUCTS FUNCTION

function renderProducts(productArray) {
    container.innerHTML = "";
    currentProducts = [...productArray];

    if (productArray.length === 0) {
        container.innerHTML = "<p class='no-results'>No results found.</p>";
        return;
    }

    const group = document.createElement("div");
    group.classList.add("card-group");

    productArray.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            
            <span class="fav-icon">
                <h3>${product.name}</h3>
                <i class="fa-regular fa-heart"></i>
            </span>

            <span class="price">
                <span class="amount">R${product.price.toFixed(2)}</span>
                <span class="stock ${product.stock < 4 ? 'low-stock' : ''}">
                    ${product.stock} left
                </span>
            </span>

            <button class="add-btn">Add to Cart</button>
        `;

        // Add to cart
        card.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(product);
        });

        // Add to wishlist
        const favIcon = card.querySelector(".fav-icon i");

        if (wishlist.some(item => item.name === product.name)) {
            favIcon.classList.replace("fa-regular", "fa-solid");
        }

        favIcon.addEventListener("click", () => {
            toggleFavourite(product);

            const isFav = wishlist.some(item => item.name === product.name);
            favIcon.classList.toggle("fa-solid", isFav);
            favIcon.classList.toggle("fa-regular", !isFav);
        });

        group.appendChild(card);
    });

    container.appendChild(group);
}; 

// SORT FUNCTIONALITY

function sortProducts() {
    const sortValue = document.getElementById("sort-products").value;
    let sortedProducts = [...currentProducts];

    switch (sortValue) {
        case "price-low-high": 
            sortedProducts.sort((a, b) => a.price - b.price);
            break;

        case "price-high-low": 
            sortedProducts.sort((a, b) => b.price - a.price);
            break;

        case "name-az": 
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;

        default:
            // Reset to original order
            sortedProducts = [...products];
            break; 
    };

    renderProducts(sortedProducts);
};


// RENDER BY TYPE

function renderProductsByType(type) {
    const filtered = products.filter(product =>
        product.type.toLowerCase() === type.toLowerCase()
    );

    renderProducts(filtered);
};


// SEARCH FUNCTIONALITY

function searchProducts() {
    const query = document
        .getElementById("search-bar")
        .value
        .trim()
        .toLowerCase();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query)
    );

    renderProducts(filtered);
};

// FILTER BY CATEGORY

function filterByCategory() {
    const checkedBoxes = document.querySelectorAll(".category-filter:checked");
    const selectedCategories = Array.from(checkedBoxes).map(
        checkbox => checkbox.value.toLowerCase()
    );

    // If no categories selected, show all current type products

        if (selectedCategories.length === 0) {
        renderProductsByType("Bags");
        return;
    }

    const filtered = products.filter(product =>
        selectedCategories.includes(product.category.toLowerCase())
    );

    renderProducts(filtered);
};

// INITIAL LOAD

window.addEventListener("DOMContentLoaded", () => {
    renderProductsByType("Bags"); // default category
    updateIndicators();
});

document.querySelectorAll(".category-filter").forEach(checkbox => {
    checkbox.addEventListener("change", filterByCategory);
});

