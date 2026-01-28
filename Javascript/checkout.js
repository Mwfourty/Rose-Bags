const cart = JSON.parse(localStorage.getItem("cart")) || [];

const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total");

function updateCheckoutTotals() {
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

updateCheckoutTotals();

function createOrder() {
    return {
        customer: {
            name: document.getElementById("full-name").value,
            email: document.getElementById("email-address").value,
            phone: document.getElementById("phone-number").value,
            address: document.getElementById("delivery-address").value
        },
        items: cart,
        total: parseFloat(
            totalEl.textContent.replace("R", "")
        ),
        date: new Date().toISOString()
    };
};

document.getElementById("place-order-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    const name = document.getElementById("full-name").value;
    const email = document.getElementById("email-address").value;
    const address = document.getElementById("delivery-address").value;

    if (!name || !email || !address) {
        alert("Please complete all required fields");
        return;
    }

    const order = createOrder();
    localStorage.setItem("order", JSON.stringify(order));

    // Redirect to PayFast
    console.log("Order ready:", order);
    submitToPayFast(order);
});

// PayFast integration

function submitToPayFast(order) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://sandbox.payfast.co.za/eng/process";

    const fields = {
        merchant_id: "10000100",          // sandbox ID
        merchant_key: "46f0cd694581a",    // sandbox key

        amount: order.total.toFixed(2),
        item_name: "RoseBags Order",

        name_first: order.customer.name,
        email_address: order.customer.email,

        return_url: "http://localhost:5500/success.html",
        cancel_url: "http://localhost:5500/cancel.html"
    };

    for (let key in fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
};


