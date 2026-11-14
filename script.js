const products = [
  {
    id: 1,
    name: "সাদা মিষ্টি",
    category: "mishti",
    price: 260,
    oldPrice: 300,
    image: "images/4365.jpg",
    description: "সুস্বাদু ও মজাদার সাদা মিষ্টি।",
  },
  {
    id: 2,
    name: "লাল মিষ্টি",
    category: "mishti",
    price: 260,
    oldPrice: 300,
    image: "images/4366.jpg",
    description: "মজাদার লাল মিষ্টি।",
  },
  {
    id: 3,
    name: "খাজা",
    category: "khaja-goja",
    price: 160,
    oldPrice: 180,
    image: "images/4367.jpg",
    description: "মচমচে ও সুস্বাদু খাজা।",
  },
  {
    id: 4,
    name: "গজা",
    category: "khaja-goja",
    price: 160,
    oldPrice: 180,
    image: "images/4374.jpg",
    description: "ঐতিহ্যবাহী মজাদার গজা।",
  },
  {
    id: 5,
    name: "লাল মোরালি",
    category: "morali",
    price: 160,
    oldPrice: 180,
    image: "images/4371.jpg",
    description: "সুস্বাদু লাল মোরালি।",
  },
  {
    id: 6,
    name: "সাদা মোরালি",
    category: "morali",
    price: 160,
    oldPrice: 180,
    image: "images/4372.jpg",
    description: "মজাদার সাদা মোরালি।",
  },
  {
    id: 7,
    name: "নিমকি",
    category: "nasta",
    price: 200,
    oldPrice: 230,
    image: "images/4368.jpg",
    description: "মচমচে ও সুস্বাদু নিমকি।",
  },
  {
    id: 8,
    name: "জিলাপি",
    category: "nasta",
    price: 140,
    oldPrice: 160,
    image: "images/4369.jpg",
    description: "মিষ্টি ও মজাদার জিলাপি।",
  },
  {
    id: 9,
    name: "সিঙ্গারা",
    category: "nasta",
    price: 10,
    oldPrice: 12,
    image: "images/4370.jpg",
    description: "মজাদার সিঙ্গারা।",
  },
  {
    id: 10,
    name: "পুরি",
    category: "nasta",
    price: 10,
    oldPrice: 12,
    image: "images/4373.jpg",
    description: "সুস্বাদু পুরি।",
  },
];

const DELIVERY_CHARGE = 60;

let cart = [];
let wishlist = [];

try {
  const savedCart = JSON.parse(localStorage.getItem("maMishtannoCart") || "[]");
  if (Array.isArray(savedCart)) {
    cart = savedCart
      .filter((item) => products.some((p) => p.id === item.id))
      .map((item) => ({
        ...products.find((p) => p.id === item.id),
        quantity: Math.max(1, Number(item.quantity) || 1),
      }));
  }
  const savedWish = JSON.parse(
    localStorage.getItem("maMishtannoWishlist") || "[]",
  );
  if (Array.isArray(savedWish)) {
    wishlist = savedWish.filter((id) => products.some((p) => p.id === id));
  }
} catch (error) {
  cart = [];
  wishlist = [];
}

const $ = (id) => document.getElementById(id);

function money(amount) {
  return "৳" + Number(amount).toFixed(0);
}

function categoryName(value) {
  return (
    {
      mishti: "মিষ্টি",
      "khaja-goja": "খাজা ও গজা",
      morali: "মোরালি",
      nasta: "নাশতা",
    }[value] || value
  );
}

function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(
    () => $("toast").classList.remove("show"),
    2500,
  );
}

function saveCart() {
  localStorage.setItem("maMishtannoCart", JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem("maMishtannoWishlist", JSON.stringify(wishlist));
}

function productCard(product) {
  const isWish = wishlist.includes(product.id);
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100,
  );

  return `
<div class="product-card">
<div class="product-image">
<img src="${product.image}" alt="${product.name}"
onerror="this.style.display='none';this.parentElement.insertAdjacentText('beforeend','ছবি পাওয়া যায়নি')">
<span class="sale-badge">${discount}% OFF</span>
<button class="wish-btn" onclick="toggleWishlist(${product.id})">${isWish ? "♥" : "♡"}</button>
</div>
<div class="product-info">
<h3>${product.name}</h3>
<p class="category">${categoryName(product.category)}</p>
<p class="price">${money(product.price)} <span class="old-price">${money(product.oldPrice)}</span></p>
<div class="card-buttons">
<button class="add-cart" onclick="addToCart(${product.id})">Add To Cart</button>
<button class="quick-btn" onclick="quickView(${product.id})">View</button>
</div>
</div>
</div>`;
}

function displayProducts(list) {
  $("productsContainer").innerHTML = list.length
    ? list.map(productCard).join("")
    : '<p class="empty-message">কোনো খাবার পাওয়া যায়নি।</p>';
}

function filterProducts() {
  const searchText = $("search").value.toLowerCase().trim();
  const selectedCategory = $("category").value;
  const sort = $("sort").value;

  let filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText) &&
      (selectedCategory === "all" || product.category === selectedCategory),
  );

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name")
    filtered.sort((a, b) => a.name.localeCompare(b.name, "bn"));

  displayProducts(filtered);
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });

  saveCart();
  updateCart();
  toast(product.name + " কার্টে যোগ হয়েছে!");
}

function updateCart() {
  $("cartItems").innerHTML = "";
  let subtotal = 0,
    count = 0;

  if (cart.length === 0) {
    $("cartItems").innerHTML = '<p class="empty-message">আপনার কার্ট খালি।</p>';
  }

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
<div class="cart-item-info">
<strong>${item.name}</strong>
<div>${money(item.price)}</div>
<div class="quantity">
<button onclick="changeQuantity(${item.id},-1)">-</button>
<span>${item.quantity}</span>
<button onclick="changeQuantity(${item.id},1)">+</button>
</div>
</div>
<button class="remove" onclick="removeFromCart(${item.id})">বাদ দিন</button>`;
    $("cartItems").appendChild(div);
  });

  const total = subtotal + (cart.length ? DELIVERY_CHARGE : 0);
  $("cartCount").textContent = count;
  $("subtotal").textContent = subtotal;
  $("delivery").textContent = cart.length ? DELIVERY_CHARGE : 0;
  $("cartTotal").textContent = total;
}

function changeQuantity(id, amount) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart();
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  updateCart();
  toast("পণ্যটি কার্ট থেকে বাদ দেওয়া হয়েছে");
}

$("clearCart").addEventListener("click", () => {
  if (cart.length === 0) {
    toast("কার্ট আগে থেকেই খালি");
    return;
  }
  cart = [];
  saveCart();
  updateCart();
  toast("কার্ট খালি করা হয়েছে");
});

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((item) => item !== id);
    toast("Wishlist থেকে বাদ দেওয়া হয়েছে");
  } else {
    wishlist.push(id);
    toast("Wishlist-এ যোগ হয়েছে");
  }
  saveWishlist();
  updateWishlist();
  filterProducts();
}

function updateWishlist() {
  $("wishCount").textContent = wishlist.length;
  const items = products.filter((p) => wishlist.includes(p.id));
  $("wishlistContainer").innerHTML = items.length
    ? items.map(productCard).join("")
    : '<p class="empty-message">এখনো কোনো পছন্দের খাবার যোগ করা হয়নি।</p>';
}

function quickView(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  $("quickViewContent").innerHTML = `
<h2>${product.name}</h2>
<img src="${product.image}" alt="${product.name}">
<p>${product.description}</p>
<h3 class="price">${money(product.price)}</h3>
<button class="add-cart" onclick="addToCart(${product.id});closeQuickView()">Add To Cart</button>
`;
  $("quickViewModal").classList.add("active");
}

function closeQuickView() {
  $("quickViewModal").classList.remove("active");
}

$("closeQuickView").addEventListener("click", closeQuickView);

$("search").addEventListener("input", filterProducts);
$("category").addEventListener("change", filterProducts);
$("sort").addEventListener("change", filterProducts);

$("cartBtn").addEventListener("click", () => {
  $("cartPanel").classList.add("active");
  $("overlay").classList.add("active");
});

$("closeCart").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);

function closeCart() {
  $("cartPanel").classList.remove("active");
  $("overlay").classList.remove("active");
}

$("wishBtn").addEventListener("click", () => {
  $("wishlistSection").scrollIntoView({ behavior: "smooth" });
});

$("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    toast("আপনার কার্ট খালি!");
    return;
  }
  $("orderForm").classList.add("active");
});

$("cancelOrder").addEventListener("click", () => {
  $("orderForm").classList.remove("active");
});

$("sendOrder").addEventListener("click", () => {
  const name = $("customerName").value.trim();
  const phone = $("customerPhone").value.trim();
  const address = $("customerAddress").value.trim();
  const note = $("customerNote").value.trim();

  if (!name || !phone || !address) {
    alert("নাম, মোবাইল নম্বর ও ঠিকানা লিখুন।");
    return;
  }

  let message = "🛒 নতুন অর্ডার — মা মিষ্টান্ন ভান্ডার\n\n";
  message += "👤 ক্রেতার তথ্য\n";
  message += `নাম: ${name}\nমোবাইল: ${phone}\nঠিকানা: ${address}\n`;
  if (note) message += `অতিরিক্ত তথ্য: ${note}\n`;

  message += "\n📦 অর্ডারের বিবরণ\n\n";

  cart.forEach((item) => {
    message += `${item.name}\n`;
    message += `পরিমাণ: ${item.quantity}\n`;
    message += `দাম: ${money(item.price)}\n`;
    message += `মোট: ${money(item.price * item.quantity)}\n\n`;
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const delivery = DELIVERY_CHARGE;
  message += `Subtotal: ${money(subtotal)}\n`;
  message += `Delivery Charge: ${money(delivery)}\n`;
  message += `💰 সর্বমোট: ${money(subtotal + delivery)}\n`;
  message += "\nঅনুগ্রহ করে অর্ডারটি নিশ্চিত করুন।";

  // নিজের বা দোকানের অনুমোদিত WhatsApp নম্বর বসাবি।
  const whatsappNumber = "8801909864618";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");

  cart = [];
  saveCart();
  updateCart();
  $("orderForm").classList.remove("active");
  closeCart();

  ["customerName", "customerPhone", "customerAddress", "customerNote"].forEach(
    (id) => {
      $(id).value = "";
    },
  );
});

const darkBtn = $("darkBtn");

if (localStorage.getItem("maMishtannoDarkMode") === "true") {
  document.body.classList.add("dark");
  darkBtn.textContent = "☀️";
}

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  darkBtn.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("maMishtannoDarkMode", dark);
});

window.addEventListener("scroll", () => {
  $("backToTop").classList.toggle("show", window.scrollY > 300);
});

$("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

displayProducts(products);
updateCart();
updateWishlist();
