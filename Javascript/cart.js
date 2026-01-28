let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total");
const logo = document.getElementById("rb-logo");
const textLogo = document.getElementById("rb-text-logo");

function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-circle-xmark"></i>
                <p>Your cart is currently empty.</p>
                <a href="../index.html" class="btn"><i class="fa-solid fa-arrow-left"></i>Continue Shopping?</a>
            </div>
        
        `;

        logo.style.display = "none";
        textLogo.style.display = "none";

        updateTotals();
        return;
    }

    cart.forEach((product, index) => {
        const item = document.createElement("div");
        item.classList.add("cart-item");

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="cart-details">
                <h3>${product.name}</h3>
                <p>R${product.price.toFixed(2)}</p>
            </div>
            <div class="quantity-control">
                <button onclick="decreaseQty(${index})">−</button>
                <span>${product.quantity}</span>
                <button onclick="increaseQty(${index})">+</button>
            </div>
            <div class="cart-actions">
                <button onclick="removeItem(${index})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(item);
    });

    updateTotals();
};

function increaseQty(index) {
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};


function updateTotals() {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const delivery = subtotal > 0 ? 80 : 0;
    const total = subtotal + delivery;

    subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
    deliveryEl.textContent = `R${delivery.toFixed(2)}`;
    totalEl.textContent = `R${total.toFixed(2)}`;
};

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

// Initial render
renderCart();
