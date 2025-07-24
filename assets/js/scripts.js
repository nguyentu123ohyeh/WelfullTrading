/*!
* Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
*/
// Highlights current date on contact page
// ==================== CẤU HÌNH ====================
const PAGE_SIZE = 9;
let currentPage = 1;

// ==================== GIỚI HẠN CHỮ ====================
function limitText(str, maxLength) {
    if (!str) return '';
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

// ==================== DANH SÁCH SẢN PHẨM ====================
function renderProducts(page) {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const products = PRODUCTS.slice(start, end);

    const productList = document.getElementById("product-list");
    productList.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4 d-flex">
            <div class="card h-100 shadow-sm w-100 bg-faded">
                <img src="${product.img}" class="product-img-fixed" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${limitText(product.name, 40)}</h5>
                    <p class="card-text flex-grow-1">${limitText(product.desc, 90)}</p>
                    <div class="card-buttons mt-auto d-flex gap-2">
                        <a href="product-details.html?id=${product.id}" class="product-detail-btn flex-fill">Detail</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
function renderPagination() {
    const totalPages = Math.ceil(PRODUCTS.length / PAGE_SIZE);
    const pagination = document.getElementById("pagination");
    let html = '';

    // Previous
    html += `<li class="product-page-item${currentPage === 1 ? ' disabled' : ''}">
        <a class="product-page-link" href="#" aria-label="Previous" onclick="goToPage(${currentPage - 1});return false;">
            &laquo;
        </a>
    </li>`;

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="product-page-item${i === currentPage ? ' active' : ''}">
            <a class="product-page-link" href="#" onclick="goToPage(${i});return false;">${i}</a>
        </li>`;
    }

    // Next
    html += `<li class="product-page-item${currentPage === totalPages ? ' disabled' : ''}">
        <a class="product-page-link" href="#" aria-label="Next" onclick="goToPage(${currentPage + 1});return false;">
            &raquo;
        </a>
    </li>`;

    pagination.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(PRODUCTS.length / PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderProducts(currentPage);
    renderPagination();
    window.scrollTo(0, 0);
}

// ==================== ADD TO CART ====================
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return alert('Product not found!');
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (cart[productId]) {
        cart[productId].qty += 1;
    } else {
        cart[productId] = {
            id: productId,
            name: product.name,
            img: product.img,
            qty: 1
        };
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// ==================== CHI TIẾT SẢN PHẨM ====================
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'), 10);
}

function renderProductDetail() {
    const id = getProductIdFromUrl();
    const product = PRODUCTS.find(p => p.id === id);

    const detailDiv = document.getElementById('product-detail');
    if (!detailDiv) return;

    if (!product) {
        detailDiv.innerHTML = `
            <a href="../../product.html" class="product-btn btn-back mb-3">&larr; Back to Products</a>
            <h2>Product not found</h2>
        `;
        return;
    }

    // Nếu không có imgs, dùng mảng có 1 phần tử là img chính
    const imgs = product.imgs && product.imgs.length ? product.imgs : [product.img];

    detailDiv.innerHTML = `
        <a href="../../product.html" class="product-btn btn-back mb-3">&larr; Back to Products</a>
        <div class="text-center mb-3">
            <img src="${imgs[0]}" class="product-img-detail" id="main-product-img" alt="${product.name}">
        </div>
        <div class="product-thumbs mt-2 mb-2 text-center">
            ${imgs.map((img, idx) => `
                <img src="${img}" class="product-thumb${idx === 0 ? ' active' : ''}" data-idx="${idx}" alt="thumb" style="width:48px;height:48px;object-fit:cover;cursor:pointer;margin:2px;">
            `).join('')}
        </div>
        <h2 class="mt-3 mb-2">${product.name}</h2>
        <p class="mb-4">${product.desc}</p>
    `;

    // Bắt sự kiện đổi ảnh chính khi click vào ảnh phụ
    const mainImg = document.getElementById('main-product-img');
    const thumbs = detailDiv.querySelectorAll('.product-thumb');
    thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', function() {
            mainImg.src = imgs[idx];
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ==================== GIỎ HÀNG ====================
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart'));
        if (cart && typeof cart === 'object' && !Array.isArray(cart)) {
            return Object.values(cart);
        }
        if (Array.isArray(cart)) return cart;
    } catch(e) {}
    return [];
}

function renderCart() {
    const cart = getCart();
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (!cart.length) {
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <h4>Your cart is empty</h4>
                <a href="product.html" class="btn btn-primary mt-4">Go to Products</a>
            </div>
        `;
        return;
    }

    let rows = '';
    cart.forEach(item => {
        rows += `
            <tr>
                <td class="fw-semibold">${limitText(item.name, 40)}</td>
                <td>
                    <div class="bg-light rounded-3 d-inline-block p-1">
                        <img src="${item.img}" class="rounded-3 shadow-sm" alt="${item.name}" style="width:48px;height:48px;object-fit:cover;">
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center justify-content-center">
                        <button class="btn btn-light border btn-sm rounded-circle px-2" onclick="changeCartQty(${item.id}, -1)" title="Decrease">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="mx-2 fw-semibold">${item.qty}</span>
                        <button class="btn btn-light border btn-sm rounded-circle px-2" onclick="changeCartQty(${item.id}, 1)" title="Increase">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </td>
                <td class="text-center align-middle">
                    <button class="btn btn-outline-danger btn-sm rounded-circle align-items-center justify-content-center" onclick="removeFromCart(${item.id})" title="Remove" style="width:40px; height:40px;">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    cartContent.innerHTML = `
        <div class="table-responsive rounded-4 shadow-sm bg-white p-3">
            <table class="table align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Product</th>
                        <th>Image</th>
                        <th class="text-center">Quantity</th>
                        <th class="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
        <div class="text-end mt-3">
            <a href="checkout.html" class="btn btn-primary px-4">Checkout</a>
        </div>
    `;
}


function changeCartQty(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (!cart[productId]) return;
    cart[productId].qty += delta;
    if (cart[productId].qty < 1) cart[productId].qty = 1; // Không cho nhỏ hơn 1
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (!cart[productId]) return;
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}


// ==================== KHỞI TẠO ====================
document.addEventListener('DOMContentLoaded', function() {
    // Nếu có danh sách sản phẩm thì render
    if (document.getElementById('product-list')) {
        renderProducts(currentPage);
        renderPagination();
    }
    // Nếu có chi tiết sản phẩm thì render
    if (document.getElementById('product-detail')) {
        renderProductDetail();
    }
    // Nếu có giỏ hàng thì render
    if (document.getElementById('cart-content')) {
        renderCart();
    }
});
