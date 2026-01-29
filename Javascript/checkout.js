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
    //submitToPayFast(order); // Uncomment when ready to integrate
});

// PayFast integration

function submitToPayFast(order) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.payfast.co.za/eng/process";

    const fields = {
        merchant_id: "23988601",          // Merchant ID
        merchant_key: "kqprcurp62n79",    // Merchant key

        amount: order.total.toFixed(2),
        item_name: "RoseBags Order",

        name_first: order.customer.name,
        email_address: order.customer.email,

        return_url: "http://rosebags.co.za/success.html",
        cancel_url: "http://rosebags.co.za/cancel.html"
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

// Temporary WhatsApp checkout until PayFast checkout is implemented

document.getElementById("place-order-btn").addEventListener("click", () => {
    alert("Checkout features are not yet implemented. You’ll be redirected to WhatsApp.");

    const name = document.getElementById("full-name").value;
    const email = document.getElementById("email-address").value;
    const phone = document.getElementById("phone-number").value;
    const address = document.getElementById("delivery-address").value;

    const total = document.getElementById("total").textContent;

    if (!name || !email || !phone || !address) {
        alert("Please fill in all fields before proceeding.");
        return;
    }

    const message = `
New Order Request 

Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Order Total: ${total}

Sent from RoseBags Website
    `;

    const whatsappNumber = "27774462588"; // RoseBags WhatsApp number

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
});


