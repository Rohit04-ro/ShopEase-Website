
"use strict";

/* ===================================
   1. PRODUCT DATA
=================================== */

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        badge: "Popular",
        description: "Enjoy clear sound and wireless freedom.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2299,
        badge: "Trending",
        description: "A stylish companion for every day.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Fashion",
        price: 1899,
        badge: "Best Seller",
        description: "Comfortable footwear for active days.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Classic Backpack",
        category: "Accessories",
        price: 999,
        badge: "",
        description: "Carry your everyday essentials in style.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Classic Sunglasses",
        category: "Accessories",
        price: 699,
        badge: "Popular",
        description: "Complete your look with timeless style.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Cotton T-Shirt",
        category: "Fashion",
        price: 599,
        badge: "",
        description: "A comfortable essential for everyday wear.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Digital Camera",
        category: "Electronics",
        price: 4999,
        badge: "Featured",
        description: "Capture your favourite moments.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Classic Wristwatch",
        category: "Accessories",
        price: 1299,
        badge: "",
        description: "An elegant finishing touch to your outfit.",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80"
    }
];

/* ===================================
   2. APPLICATION STATE
=================================== */

let cart = [];
let selectedCategory = "All";
let toastTimeout = null;

/* ===================================
   3. HELPER FUNCTIONS
=================================== */

// Format prices using Indian Rupees.
function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Find a product using its ID.
function findProduct(productId) {
    return products.find(product => product.id === productId);
}

// Show a temporary notification.
function showToast(message) {
    const toast = document.getElementById("toast");

    clearTimeout(toastTimeout);

    toast.textContent = message;
    toast.hidden = false;

    toastTimeout = setTimeout(() => {
        toast.hidden = true;
    }, 2500);
}

/* ===================================
   4. DISPLAY PRODUCTS
=================================== */

function displayProducts() {
    const productGrid = document.getElementById("product-grid");
    const searchInput = document.getElementById("search-input");
    const resultsCount = document.getElementById("results-count");

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    productGrid.replaceChildren();

    resultsCount.textContent =
        `${filteredProducts.length} product(s) found`;

    if (filteredProducts.length === 0) {
        const message = document.createElement("p");
        message.className = "no-products";
        message.textContent =
            "No products found. Try a different search.";
        productGrid.appendChild(message);
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        // Product image
        const imageWrap = document.createElement("div");
        imageWrap.className = "product-image-wrap";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        // Hide a broken image instead of showing a broken icon.
        image.addEventListener("error", () => {
            image.style.display = "none";
        }, { once: true });

        imageWrap.appendChild(image);

        if (product.badge) {
            const badge = document.createElement("span");
            badge.className = "product-badge";
            badge.textContent = product.badge;
            imageWrap.appendChild(badge);
        }

        // Product information
        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const button = document.createElement("button");
        button.className = "add-button";
        button.type = "button";
        button.textContent = "Add to Cart";
        button.setAttribute(
            "aria-label",
            `Add ${product.name} to cart`
        );

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        bottom.append(price, button);
        info.append(category, name, description, bottom);
        card.append(imageWrap, info);

        productGrid.appendChild(card);
    });
}

/* ===================================
   5. CATEGORY FILTERING
=================================== */

function setCategory(category) {
    selectedCategory = category;

    document.querySelectorAll(".category-button").forEach(button => {
        const isActive = button.dataset.category === category;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    displayProducts();
}

/* ===================================
   6. ADD PRODUCTS TO CART
=================================== */

function addToCart(productId) {
    const product = findProduct(productId);

    if (!product) {
        showToast("Product could not be found.");
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    updateCart();
    showToast(`${product.name} added to your cart.`);
}

/* ===================================
   7. CHANGE PRODUCT QUANTITY
=================================== */

function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    updateCart();
}

/* ===================================
   8. REMOVE PRODUCTS FROM CART
=================================== */

function removeFromCart(productId) {
    const product = findProduct(productId);

    cart = cart.filter(item => item.id !== productId);

    updateCart();

    if (product) {
        showToast(`${product.name} removed from your cart.`);
    }
}

/* ===================================
   9. UPDATE SHOPPING CART
=================================== */

function updateCart() {
    const cartItems = document.getElementById("cart-items");

    const cartCount = document.getElementById("cart-count");
    const subtotalElement = document.getElementById("cart-subtotal");
    const deliveryElement = document.getElementById("delivery-cost");
    const totalElement = document.getElementById("cart-total");

    cartItems.replaceChildren();

    let itemCount = 0;
    let subtotal = 0;

    cart.forEach(item => {
        const product = findProduct(item.id);

        if (!product) {
            return;
        }

        itemCount += item.quantity;
        subtotal += product.price * item.quantity;

        const row = document.createElement("article");
        row.className = "cart-item";

        // Product details
        const details = document.createElement("div");

        const name = document.createElement("p");
        name.className = "cart-item-name";
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = `${formatPrice(product.price)} each`;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            removeFromCart(product.id);
        });

        details.append(name, price, removeButton);

        // Quantity controls
        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute(
            "aria-label",
            `Decrease quantity of ${product.name}`
        );
        decreaseButton.addEventListener("click", () => {
            changeQuantity(product.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.className = "quantity-value";
        quantity.textContent = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute(
            "aria-label",
            `Increase quantity of ${product.name}`
        );
        increaseButton.addEventListener("click", () => {
            changeQuantity(product.id, 1);
        });

        controls.append(
            decreaseButton,
            quantity,
            increaseButton
        );

        // Total for this product
        const lineTotal = document.createElement("p");
        lineTotal.className = "cart-line-total";
        lineTotal.textContent =
            formatPrice(product.price * item.quantity);

        row.append(details, controls, lineTotal);
        cartItems.appendChild(row);
    });

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-cart";
        emptyMessage.textContent =
            "Your cart is empty. Start shopping!";
        cartItems.appendChild(emptyMessage);
    }

    // Free demo delivery for orders of ₹2,000 or more.
    // Otherwise, delivery costs ₹49.
    const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 49;
    const total = subtotal + delivery;

    cartCount.textContent = itemCount;
    subtotalElement.textContent = formatPrice(subtotal);
    deliveryElement.textContent = formatPrice(delivery);
    totalElement.textContent = formatPrice(total);
}

/* ===================================
   10. CHECKOUT DEMONSTRATION
=================================== */

function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty. Add a product first.");
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        const product = findProduct(item.id);

        if (product) {
            subtotal += product.price * item.quantity;
        }
    });

    const delivery = subtotal >= 2000 ? 0 : 49;
    const total = subtotal + delivery;

    const confirmed = window.confirm(
        "DEMO CHECKOUT\n\n" +
        `Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n` +
        `Subtotal: ${formatPrice(subtotal)}\n` +
        `Delivery: ${formatPrice(delivery)}\n` +
        `Total: ${formatPrice(total)}\n\n` +
        "This is a demonstration only. No payment will be taken.\n\n" +
        "Would you like to simulate placing this order?"
    );

    if (!confirmed) {
        return;
    }

    cart = [];
    updateCart();

    showToast("Demo order completed! No real purchase was made.");
}

/* ===================================
   11. INITIALIZE WEBSITE EVENTS
=================================== */

function initializeStore() {
    // Live product search
    document.getElementById("search-input")
        .addEventListener("input", displayProducts);

    // Category buttons
    document.getElementById("category-list")
        .addEventListener("click", event => {
            const button = event.target.closest(
                "button[data-category]"
            );

            if (!button) {
                return;
            }

            setCategory(button.dataset.category);
        });

    // Cart navigation button
    document.getElementById("cart-toggle")
        .addEventListener("click", () => {
            document.getElementById("cart")
                .scrollIntoView({ behavior: "smooth" });
        });

    // Checkout button
    document.getElementById("checkout-button")
        .addEventListener("click", checkout);

    // Automatically update the copyright year
    document.getElementById("current-year").textContent =
        new Date().getFullYear();

    // Render the initial page and empty cart
    displayProducts();
    updateCart();
}

// Start the store after the HTML has loaded.
initializeStore();
