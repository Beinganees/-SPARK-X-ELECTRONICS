// --- INTERFACES & TYPES ---
interface Variant {
  id: number;
  name: string;
  price?: number;
  salePrice?: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  description: string;
  image?: string; // Base64 string
  variants: Variant[];
}

interface Promotion {
    isActive: boolean;
    headline: string;
    description: string;
    endDate: string;
    primaryOffer: {
        text: string;
        discountPercent: number;
        category: string;
    }
}

// --- DATABASE SERVICE (localStorage wrapper) ---
const DB = {
    init: () => {
        if (!localStorage.getItem('sparkxProducts')) {
            localStorage.setItem('sparkxProducts', JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem('sparkxPromotionConfig')) {
            localStorage.setItem('sparkxPromotionConfig', JSON.stringify(DEFAULT_PROMOTION));
        }
        if (!localStorage.getItem('sparkxOrders')) {
            localStorage.setItem('sparkxOrders', JSON.stringify([]));
        }
        if (!localStorage.getItem('sparkxOrdCounter')) {
            localStorage.setItem('sparkxOrdCounter', '1000');
        }
        if (!localStorage.getItem('productRatings')) {
            localStorage.setItem('productRatings', JSON.stringify({}));
        }
        if (!localStorage.getItem('sparkxCompareList')) {
            localStorage.setItem('sparkxCompareList', JSON.stringify([]));
        }
    },
    getProducts: (): Product[] => JSON.parse(localStorage.getItem('sparkxProducts') || '[]'),
    saveProducts: (products: Product[]) => localStorage.setItem('sparkxProducts', JSON.stringify(products)),
    getPromotion: (): Promotion => JSON.parse(localStorage.getItem('sparkxPromotionConfig')!),
    savePromotion: (promo: Promotion) => localStorage.setItem('sparkxPromotionConfig', JSON.stringify(promo)),
    getOrders: () => JSON.parse(localStorage.getItem('sparkxOrders') || '[]'),
    saveOrders: (orders: any[]) => localStorage.setItem('sparkxOrders', JSON.stringify(orders)),
    getRatings: () => JSON.parse(localStorage.getItem('productRatings') || '{}'),
    saveRatings: (ratings: any) => localStorage.setItem('productRatings', JSON.stringify(ratings)),
    getCompareList: (): number[] => JSON.parse(localStorage.getItem('sparkxCompareList') || '[]'),
    saveCompareList: (list: number[]) => localStorage.setItem('sparkxCompareList', JSON.stringify(list)),
};


// --- INITIAL DATABASE STATE ---
const DEFAULT_PRODUCTS: Product[] = [
    { id: 1, name: "High-Speed Ceiling Fan", category: "Fan", price: 1199, description: "A high-performance ceiling fan for maximum airflow.", image: "https://images.pexels.com/photos/8581005/pexels-photo-8581005.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 2, name: "Portable Table Fan", category: "Fan", price: 799, description: "Compact and powerful fan, perfect for personal cooling.", image: "https://images.pexels.com/photos/7772633/pexels-photo-7772633.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 3, name: "Personal Air Cooler", category: "Cooler", price: 3499, description: "Efficient air cooler with honeycomb pads for quick cooling.", image: "https://images.pexels.com/photos/8472911/pexels-photo-8472911.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 4, name: "9W LED Bulb (Pack of 4)", category: "Lighting", price: 299, description: "Energy-saving bright white LED bulbs for your home.", image: "https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 5, name: "1.5mm Copper Wire (90m)", category: "Wiring", price: 1299, description: "High-quality, insulated copper wire for safe electrical wiring.", image: "https://images.pexels.com/photos/8346033/pexels-photo-8346033.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
    { id: 6, name: "Digital Multimeter", category: "Tools", price: 499, description: "A must-have tool for any electronics enthusiast or professional.", image: "https://images.pexels.com/photos/5638153/pexels-photo-5638153.jpeg?auto=compress&cs=tinysrgb&w=600", variants: [] },
];

const DEFAULT_PROMOTION: Promotion = {
    isActive: false,
    headline: "Limited Time Offer!",
    description: "Get huge discounts on selected items for a short time.",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    primaryOffer: {
        text: "10% off all Fans this week!",
        discountPercent: 10,
        category: "Fan",
    }
};

// --- GLOBAL STATE ---
let state = {
    products: [] as Product[],
    promotion: {} as Promotion,
    orders: [] as any[],
    ratings: {} as any,
    compareList: [] as number[],
    currentTransaction: {} as any,
    currentEditingVariants: [] as Variant[],
    WEBHOOK_SECRET: '',
    qrTimerInterval: null as number | null,
    countdownInterval: null as number | null,
};


// --- DOM Element Selectors ---
const getElement = <T extends HTMLElement>(selector: string): T => document.querySelector(selector) as T;

const productGrid = getElement('.product-grid');
const adminProductList = getElement<HTMLTableSectionElement>('#admin-product-list');
const adminOrderList = getElement<HTMLTableSectionElement>('#admin-order-list');

// --- RENDER FUNCTIONS ---
function renderAllProducts() {
    productGrid.innerHTML = '';
    state.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id.toString();
        card.innerHTML = `
            <div class="sale-badge" style="display: none;">Sale</div>
            <div class="img-container">${product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` : 'No Image'}</div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-price" data-original-price="${product.price}"></p>
                <div class="star-rating"></div>
                <div class="product-variants"></div>
                <p class="product-description">${product.description}</p>
                <p class="product-offer-highlight"></p>
            </div>
            <div class="product-actions">
                <div class="main-actions">
                    <button class="quick-view-btn">Quick View</button>
                    <button class="buy-now-btn">Buy Now</button>
                </div>
                <button class="compare-btn">Compare</button>
            </div>
        `;
        productGrid.appendChild(card);
        renderFrontendVariants(card, product);
        renderStarRating(card.querySelector('.star-rating')!, product.id.toString());
    });
    updateCompareButtonsUI();
}

function renderFrontendVariants(card: HTMLElement, product: Product) {
    const variantsContainer = card.querySelector('.product-variants');
    if (!variantsContainer) return;
    
    variantsContainer.innerHTML = '';
    
    if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
            const btn = document.createElement('button');
            btn.className = 'variant-btn';
            btn.dataset.variantId = variant.id.toString();
            btn.textContent = variant.name;
            btn.onclick = () => updateProductDisplay(card, product, variant.id);
            variantsContainer.appendChild(btn);
        });
        updateProductDisplay(card, product, product.variants[0].id); // Select first variant
    } else {
        updateProductDisplay(card, product, null); // Render with no variants
    }
}

function updateProductDisplay(card: HTMLElement, product: Product, selectedVariantId: number | null) {
    const promotionConfig = state.promotion;
    const priceEl = card.querySelector('.product-price')!;
    const saleBadge = card.querySelector<HTMLElement>('.sale-badge')!;

    let selectedVariant = selectedVariantId ? product.variants.find(v => v.id === selectedVariantId) : null;
    
    if (selectedVariantId) {
        card.querySelectorAll('.variant-btn').forEach(btn => {
            btn.classList.toggle('active', (btn as HTMLElement).dataset.variantId === selectedVariantId.toString());
        });
    }

    let originalPrice = selectedVariant?.price ?? product.price;
    let salePrice = selectedVariant?.salePrice ?? product.salePrice;

    let finalPrice = originalPrice;
    let discountApplied = false;
    
    if (salePrice && salePrice < originalPrice) {
        finalPrice = salePrice;
        discountApplied = true;
    } else if (promotionConfig.isActive && product.category === promotionConfig.primaryOffer.category) {
        finalPrice = Math.round(originalPrice * (1 - promotionConfig.primaryOffer.discountPercent / 100));
        discountApplied = true;
    }

    if (discountApplied) {
        priceEl.innerHTML = `<del>₹${originalPrice}</del> <ins>₹${finalPrice}</ins>`;
        if (saleBadge) {
            const discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
            saleBadge.textContent = `${discountPercent}% OFF`;
            saleBadge.style.display = 'block';
        }
    } else {
        priceEl.innerHTML = `₹${originalPrice}`;
        if (saleBadge) saleBadge.style.display = 'none';
    }
}

function renderAdminProducts() {
    adminProductList.innerHTML = ''; 
    state.products.forEach(product => {
        const priceHTML = product.salePrice ? `<del>₹${product.price}</del> <ins>₹${product.salePrice}</ins>` : `₹${product.price}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Image">${product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` : 'No Image'}</td>
            <td data-label="Name">${product.name}</td>
            <td data-label="Description" class="product-description-cell" title="${product.description}">${product.description}</td>
            <td data-label="Price">${priceHTML}</td>
            <td data-label="Actions">
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </td>
        `;
        adminProductList.appendChild(row);
    });
}

function renderAdminOrders() {
    const getStatusBadge = (status: string) => {
        const statusClass = `status-${status.toLowerCase().replace(' ', '_')}`;
        return `<span class="status-badge ${statusClass}">${status.replace('_', ' ')}</span>`;
    };

    if (state.orders.length === 0) {
        adminOrderList.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #aaa;">No orders have been placed yet.</td></tr>`;
        return;
    }
    
    adminOrderList.innerHTML = '';
    [...state.orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Order ID">${order.orderId}</td>
            <td data-label="Customer">${order.customer.name}</td>
            <td data-label="Product">${order.product.name}</td>
            <td data-label="Price">₹${order.product.price}</td>
            <td data-label="Date">${order.date}</td>
            <td data-label="Status">${getStatusBadge(order.status)}</td>
        `;
        adminOrderList.appendChild(row);
    });
}


// --- Admin Panel Logic ---
function setupAdminPanel() {
    const productForm = getElement<HTMLFormElement>('#product-form');
    const formTitle = getElement<HTMLHeadingElement>('#form-title');
    const formSubmitBtn = getElement<HTMLButtonElement>('#form-submit-btn');
    const formCancelBtn = getElement<HTMLButtonElement>('#form-cancel-btn');

    const productIdInput = getElement<HTMLInputElement>('#product-id');
    const productNameInput = getElement<HTMLInputElement>('#product-name');
    const productCategoryInput = getElement<HTMLInputElement>('#product-category');
    const productPriceInput = getElement<HTMLInputElement>('#product-price');
    const productSalePriceInput = getElement<HTMLInputElement>('#product-sale-price');
    const productDescriptionInput = getElement<HTMLTextAreaElement>('#product-description-input');
    const productImageInput = getElement<HTMLInputElement>('#product-image');
    const imagePreview = getElement<HTMLImageElement>('#image-preview');
    const removeImageBtn = getElement<HTMLButtonElement>('#remove-image-btn');
    const removeImageFlag = getElement<HTMLInputElement>('#remove-image-flag');

    const resetAdminForm = () => {
        productForm.reset();
        productIdInput.value = '';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        removeImageBtn.style.display = 'none';
        removeImageFlag.value = 'false';
        getElement<HTMLLabelElement>('label[for="product-image"]').textContent = 'Product Image (Optional)';
        formTitle.textContent = 'Add New Product';
        formSubmitBtn.textContent = 'Add Product';
        formCancelBtn.style.display = 'none';
        state.currentEditingVariants = [];
        renderAdminVariantList();
    };

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = productIdInput.value ? parseInt(productIdInput.value) : null;
        const name = productNameInput.value;
        const category = productCategoryInput.value;
        const price = parseFloat(productPriceInput.value);
        const salePrice = productSalePriceInput.value ? parseFloat(productSalePriceInput.value) : undefined;
        const description = productDescriptionInput.value;
        const imageFile = productImageInput.files?.[0];

        const processProductUpdate = (imgSrc: string | null | undefined = undefined) => {
             if (id) { // Editing
                const productIndex = state.products.findIndex(p => p.id === id);
                if (productIndex > -1) {
                    const existingProduct = state.products[productIndex];
                    existingProduct.name = name;
                    existingProduct.category = category;
                    existingProduct.price = price;
                    existingProduct.salePrice = salePrice;
                    existingProduct.description = description;
                    existingProduct.variants = state.currentEditingVariants;
                    if (removeImageFlag.value === 'true') {
                        existingProduct.image = undefined;
                    } else if (imgSrc !== undefined) {
                        existingProduct.image = imgSrc ?? undefined;
                    }
                }
            } else { // Adding
                const newId = Math.max(0, ...state.products.map(p => p.id)) + 1;
                const newProduct: Product = {
                    id: newId, name, category, price, salePrice, description,
                    image: imgSrc ?? undefined,
                    variants: state.currentEditingVariants
                };
                state.products.push(newProduct);
            }
            
            DB.saveProducts(state.products);
            renderAllProducts();
            renderAdminProducts();
            resetAdminForm();
        };

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => { processProductUpdate(event.target?.result as string); };
            reader.readAsDataURL(imageFile);
        } else {
             const existingProduct = id ? state.products.find(p => p.id === id) : null;
             processProductUpdate(existingProduct?.image);
        }
    });

    adminProductList.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const id = parseInt(target.dataset.id || '');
        if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this product?')) {
                state.products = state.products.filter(p => p.id !== id);
                DB.saveProducts(state.products);
                renderAllProducts();
                renderAdminProducts();
            }
        }
        if (target.classList.contains('edit-btn')) {
            const product = state.products.find(p => p.id === id);
            if (product) {
                productIdInput.value = product.id.toString();
                productNameInput.value = product.name;
                productCategoryInput.value = product.category;
                productPriceInput.value = product.price.toString();
                productSalePriceInput.value = product.salePrice?.toString() || '';
                productDescriptionInput.value = product.description;
                
                state.currentEditingVariants = product.variants ? [...product.variants] : [];
                renderAdminVariantList();
                
                const imageLabel = getElement<HTMLLabelElement>('label[for="product-image"]');
                if (product.image) {
                    imagePreview.src = product.image;
                    imagePreview.style.display = 'block';
                    removeImageBtn.style.display = 'inline-block';
                    imageLabel.textContent = 'Replace Current Image (Optional)';
                } else {
                     imagePreview.style.display = 'none';
                     removeImageBtn.style.display = 'none';
                     imageLabel.textContent = 'Add Product Image (Optional)';
                }
                removeImageFlag.value = 'false';

                formTitle.textContent = 'Edit Product';
                formSubmitBtn.textContent = 'Save Changes';
                formCancelBtn.style.display = 'inline-block';
                getElement('.admin-main-content').scrollTop = getElement('.admin-main-content').scrollHeight;
            }
        }
    });
    
    formCancelBtn.onclick = () => resetAdminForm();

    productImageInput.addEventListener('change', () => {
        if (productImageInput.files && productImageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target?.result as string;
                imagePreview.style.display = 'block';
                removeImageBtn.style.display = 'inline-block';
                removeImageFlag.value = 'false';
            };
            reader.readAsDataURL(productImageInput.files[0]);
        }
    });
    
    removeImageBtn.onclick = () => {
        productImageInput.value = '';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        removeImageBtn.style.display = 'none';
        removeImageFlag.value = 'true';
    };
}


// --- Admin Panel Variant Management ---
const variantModal = getElement('#variant-modal');
const variantForm = getElement<HTMLFormElement>('#variant-form');
const variantIdInput = getElement<HTMLInputElement>('#variant-id-input');
const variantNameInput = getElement<HTMLInputElement>('#variant-name-input');
const variantPriceInput = getElement<HTMLInputElement>('#variant-price-input');
const variantSalePriceInput = getElement<HTMLInputElement>('#variant-sale-price-input');

function renderAdminVariantList() {
    const listEl = getElement('#variant-list');
    listEl.innerHTML = '';
    state.currentEditingVariants.forEach(variant => {
        const item = document.createElement('div');
        item.className = 'variant-item';
        const priceText = (variant.price) 
            ? (variant.salePrice ? `<del>₹${variant.price}</del> <ins>₹${variant.salePrice}</ins>` : `₹${variant.price}`)
            : 'Uses main price';

        item.innerHTML = `
            <span>${variant.name}</span>
            <span>${priceText}</span>
            <div>
                <button type="button" class="edit-variant-btn" data-id="${variant.id}">Edit</button>
                <button type="button" class="delete-variant-btn" data-id="${variant.id}" style="background:#dc3545; border-color:#dc3545; color:white;">Del</button>
            </div>
        `;
        listEl.appendChild(item);
    });
};

function setupVariantManagement() {
    getElement('#add-variant-btn').onclick = () => {
        variantForm.reset();
        variantIdInput.value = '';
        variantModal.querySelector('h2')!.textContent = 'Add Variant';
        openModal(variantModal);
    };

    variantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const variantId = variantIdInput.value ? parseInt(variantIdInput.value) : null;
        const newVariant: Variant = {
            id: variantId || Date.now(),
            name: variantNameInput.value,
            price: variantPriceInput.value ? parseFloat(variantPriceInput.value) : undefined,
            salePrice: variantSalePriceInput.value ? parseFloat(variantSalePriceInput.value) : undefined,
        };
        
        if (variantId) { // Editing
            const index = state.currentEditingVariants.findIndex(v => v.id === variantId);
            if (index > -1) state.currentEditingVariants[index] = newVariant;
        } else { // Adding
            state.currentEditingVariants.push(newVariant);
        }
        renderAdminVariantList();
        closeModal(variantModal);
    });

    getElement('#variant-list').addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const variantId = parseInt(target.dataset.id || '');
        if (!variantId) return;
        
        if (target.classList.contains('edit-variant-btn')) {
            const variant = state.currentEditingVariants.find(v => v.id === variantId);
            if (variant) {
                variantForm.reset();
                variantIdInput.value = variant.id.toString();
                variantNameInput.value = variant.name;
                variantPriceInput.value = variant.price?.toString() || '';
                variantSalePriceInput.value = variant.salePrice?.toString() || '';
                variantModal.querySelector('h2')!.textContent = 'Edit Variant';
                openModal(variantModal);
            }
        }
        
        if (target.classList.contains('delete-variant-btn')) {
            if (confirm('Delete this variant?')) {
                state.currentEditingVariants = state.currentEditingVariants.filter(v => v.id !== variantId);
                renderAdminVariantList();
            }
        }
    });
}


// --- Promotion & Countdown Logic ---
function startCountdown(endDate: string) {
  const countdownDate = new Date(endDate).getTime();
  const topTimerEl = getElement('#offer-countdown-timer-top');
  const mainTimerEl = getElement('#offer-countdown-timer-main');
  
  if (state.countdownInterval) clearInterval(state.countdownInterval);

  state.countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
      clearInterval(state.countdownInterval!);
      if (topTimerEl) topTimerEl.innerHTML = "<span>Offer Expired</span>";
      if (mainTimerEl) mainTimerEl.innerHTML = "Offer Expired";
      getElement('#top-offer-banner')?.classList.add('hidden');
      document.body.classList.remove('banner-visible');
      (getElement('#promotion-banner') as HTMLElement).style.display = 'none';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const format = (num: number) => num.toString().padStart(2, '0');

    const topTimerHTML = `<span>${format(days)}d</span>:<span>${format(hours)}h</span>:<span>${format(minutes)}m</span>:<span>${format(seconds)}s</span>`;
    const mainTimerHTML = `${format(days)}d : ${format(hours)}h : ${format(minutes)}m : ${format(seconds)}s`;
    
    if (topTimerEl) topTimerEl.innerHTML = topTimerHTML;
    if (mainTimerEl) mainTimerEl.innerHTML = mainTimerHTML;
  }, 1000);
}

function applyPromotions() {
    const promotionConfig = state.promotion;
    const topBanner = getElement<HTMLElement>('#top-offer-banner');
    const mainBanner = getElement<HTMLElement>('#promotion-banner');

    if (!promotionConfig.isActive) {
        if(topBanner) topBanner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        if(mainBanner) mainBanner.style.display = 'none';
        if (state.countdownInterval) clearInterval(state.countdownInterval);
        renderAllProducts();
        return;
    }

    if (topBanner && sessionStorage.getItem('topBannerDismissed') !== 'true') {
        getElement('#offer-text-top').textContent = promotionConfig.headline;
        topBanner.classList.remove('hidden');
        document.body.classList.add('banner-visible');
    }

    mainBanner.innerHTML = `
        <h2>${promotionConfig.headline}</h2>
        <div id="offer-countdown-timer-main"></div>
        <p>${promotionConfig.description}</p>`;
    mainBanner.style.display = 'block';

    startCountdown(promotionConfig.endDate);
    renderAllProducts(); // Re-render products to apply discounts
}

// --- Compare Products Logic ---

function toggleCompareItem(productId: number) {
    const isInCompare = state.compareList.includes(productId);

    if (isInCompare) {
        state.compareList = state.compareList.filter(id => id !== productId);
    } else {
        if (state.compareList.length >= 4) {
            alert('You can only compare up to 4 items at a time.');
            return;
        }
        state.compareList.push(productId);
    }

    DB.saveCompareList(state.compareList);
    renderCompareTray();
    updateCompareButtonsUI();
}

function updateCompareButtonsUI() {
    document.querySelectorAll('.compare-btn').forEach(btn => {
        const card = btn.closest('.product-card') as HTMLElement;
        if (!card) return;
        const productId = parseInt(card.dataset.id!);
        const isInCompare = state.compareList.includes(productId);
        
        btn.textContent = isInCompare ? 'Added to Compare' : 'Compare';
        btn.classList.toggle('added', isInCompare);
    });
}

function renderCompareTray() {
    const tray = getElement<HTMLElement>('#compare-tray');
    const itemsContainer = getElement<HTMLElement>('#compare-tray-items');
    const compareNowBtn = getElement<HTMLButtonElement>('#compare-now-btn');

    if (state.compareList.length === 0) {
        tray.classList.remove('visible');
        return;
    }

    tray.classList.add('visible');
    itemsContainer.innerHTML = '';

    state.compareList.forEach(productId => {
        const product = state.products.find(p => p.id === productId);
        if (product) {
            const itemEl = document.createElement('div');
            itemEl.className = 'compare-item';
            itemEl.innerHTML = `
                <img src="${product.image || ''}" alt="${product.name}">
                <button class="remove-compare-item" data-id="${product.id}" aria-label="Remove ${product.name} from comparison">&times;</button>
            `;
            itemsContainer.appendChild(itemEl);
        }
    });

    compareNowBtn.disabled = state.compareList.length < 2;
}

function renderCompareModal() {
    const contentEl = getElement('#compare-modal-content');
    const productsToCompare = state.compareList.map(id => state.products.find(p => p.id === id)).filter(Boolean) as Product[];

    if (productsToCompare.length < 2) {
        contentEl.innerHTML = '<p>Please select at least two products to compare.</p>';
        return;
    }
    
    let tableHTML = '<table class="compare-table">';
    
    // Table Header (Product Images and Names)
    tableHTML += '<thead><tr><th>Feature</th>';
    productsToCompare.forEach(p => {
        tableHTML += `<th>
            <div class="compare-product-header">
                ${p.image ? `<img src="${p.image}" alt="${p.name}">` : 'No Image'}
                <div>${p.name}</div>
            </div>
        </th>`;
    });
    tableHTML += '</tr></thead>';

    // Table Body
    tableHTML += '<tbody>';
    const attributes: (keyof Product | 'rating')[] = ['price', 'category', 'rating', 'description'];
    const attributeLabels: Record<string, string> = {
        price: 'Price',
        category: 'Category',
        rating: 'Customer Rating',
        description: 'Description'
    };

    attributes.forEach(attr => {
        tableHTML += `<tr><td>${attributeLabels[attr]}</td>`;
        productsToCompare.forEach(p => {
            if (attr === 'price') {
                const priceHTML = p.salePrice ? `<del>₹${p.price}</del> <ins>₹${p.salePrice}</ins>` : `₹${p.price}`;
                tableHTML += `<td>${priceHTML}</td>`;
            } else if (attr === 'rating') {
                tableHTML += `<td><div class="star-rating" data-product-id-for-render="${p.id}"></div></td>`;
            } else {
                tableHTML += `<td>${p[attr as keyof Product]}</td>`;
            }
        });
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    contentEl.innerHTML = tableHTML;
    
    // Render star ratings after table is in DOM
    contentEl.querySelectorAll<HTMLElement>('.star-rating[data-product-id-for-render]').forEach(container => {
        const productId = container.dataset.productIdForRender;
        if(productId) {
            renderStarRating(container, productId);
        }
    });
}

function setupCompareFeature() {
    const tray = getElement('#compare-tray');
    const compareModal = getElement('#compare-modal');

    tray.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.id === 'clear-compare-btn') {
            state.compareList = [];
            DB.saveCompareList(state.compareList);
            renderCompareTray();
            updateCompareButtonsUI();
        }
        if (target.id === 'compare-now-btn' && state.compareList.length >= 2) {
            renderCompareModal();
            openModal(compareModal);
        }
        if (target.classList.contains('remove-compare-item')) {
            const productId = parseInt(target.dataset.id!);
            toggleCompareItem(productId);
        }
    });
}


// --- GENERAL UI & EVENT LISTENERS ---
// --- Modal Logic ---
const allModals = document.querySelectorAll('.modal');
let lastFocusedElement: HTMLElement;
let currentModal: HTMLElement | null = null;

const trapFocus = (e: KeyboardEvent) => {
    if (!currentModal || e.key !== 'Tab') return;
    const focusableElements = Array.from(currentModal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
        }
    } else { // Tab
        if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
        }
    }
};

function openModal(modal: HTMLElement) {
    lastFocusedElement = document.activeElement as HTMLElement;
    currentModal = modal;
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', trapFocus);
    
    const firstFocusable = modal.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }
}

function closeModal(modal: HTMLElement) {
    modal.style.display = 'none';
    document.removeEventListener('keydown', trapFocus);
    
    if (currentModal === modal) {
         currentModal = null;
    }

    const isAnyModalOpen = Array.from(allModals).some(m => (m as HTMLElement).style.display === 'flex');
    if (!isAnyModalOpen) {
         document.body.classList.remove('modal-open');
    }
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

// --- Star Rating Logic ---
function addRating(productId: string, rating: number) {
    const ratings = DB.getRatings();
    if (!ratings[productId]) ratings[productId] = [];
    ratings[productId].push(rating);
    DB.saveRatings(ratings);
    state.ratings = ratings;
};

function renderStarRating(container: HTMLElement, productId: string) {
    if (!container) return;
    const productRatings = state.ratings[productId] || [];
    const count = productRatings.length;
    const average = count > 0 ? (productRatings.reduce((a: number, b: number) => a + b, 0) / count) : 0;

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star${i <= average ? ' filled' : ''}">★</span>`;
    }
    
    const countText = count > 0 ? `(${count} ${count > 1 ? 'ratings' : 'rating'})` : '(No ratings yet)';
    container.innerHTML = `${starsHtml} <span class="rating-count">${countText}</span>`;
};


// --- INITIALIZATION ---
function init() {
    DB.init();
    state.products = DB.getProducts();
    state.promotion = DB.getPromotion();
    state.orders = DB.getOrders();
    state.ratings = DB.getRatings();
    state.compareList = DB.getCompareList();
    
    // Initial Render
    renderAllProducts();
    applyPromotions();
    renderCompareTray();

    // Setup Event Listeners
    setupAdminPanel();
    setupVariantManagement();
    setupCompareFeature();

    const hamburgerBtn = getElement('#hamburger-btn');
    const navLinks = getElement('#nav-links');
    
    hamburgerBtn.addEventListener('click', () => {
        const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
        hamburgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', (!isExpanded).toString());
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const nav = getElement('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    });

    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        if(anchor.id !== 'my-orders-btn') {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector((this as HTMLAnchorElement).getAttribute('href')!)?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    getElement('#close-top-banner').addEventListener('click', () => {
        getElement('#top-offer-banner').classList.add('hidden');
        document.body.classList.remove('banner-visible');
        sessionStorage.setItem('topBannerDismissed', 'true');
    });

    // Accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling as HTMLElement;
            const isActive = header.classList.contains('active');
            
            document.querySelectorAll('.accordion-header.active').forEach(activeHeader => {
                if (activeHeader !== header) {
                    activeHeader.classList.remove('active');
                    activeHeader.setAttribute('aria-expanded', 'false');
                    (activeHeader.nextElementSibling as HTMLElement).style.maxHeight = '';
                }
            });

            header.classList.toggle('active', !isActive);
            header.setAttribute('aria-expanded', String(!isActive));
            content.style.maxHeight = isActive ? '' : `${content.scrollHeight}px`;
        });
    });

    allModals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal as HTMLElement));
        modal.addEventListener('click', (e) => {
             if (e.target === modal) closeModal(modal as HTMLElement);
        });
    });

    // Dummy logic for features not fully refactored yet, to keep them functional
    const quickViewModal = getElement('#quick-view-modal');
    productGrid.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const card = target.closest('.product-card');
        if (!card) return;
        // FIX: Cast card to HTMLElement to access dataset property.
        const productId = (card as HTMLElement).dataset.id!;
        const product = state.products.find(p => p.id.toString() === productId);
        if (!product) return;

        if (target.classList.contains('quick-view-btn')) {
             const quickViewContent = getElement('#quick-view-content');
             const priceEl = card.querySelector('.product-price')!;
             quickViewContent.innerHTML = `
                ${product.image ? `<img src="${product.image}" id="quick-view-img" alt="${product.name}" loading="lazy">` : ''}
                <h3>${product.name}</h3>
                <div class="price">${priceEl.innerHTML}</div>
                <div class="product-variants"></div>
                <p class="description" style="margin-top:1rem">${product.description}</p>`;
            
            const qvModalContent = quickViewContent.closest('.modal-content') as HTMLElement;
            renderFrontendVariants(qvModalContent, product);
            
            const ratingInput = quickViewModal.querySelector('.rating-input') as HTMLElement;
            ratingInput.dataset.productId = productId;
            // resetRatingInput(); // This would need to be implemented
            openModal(quickViewModal);
        }
        
        if (target.classList.contains('buy-now-btn')) {
             openModal(getElement('#delivery-modal'));
        }

        if (target.classList.contains('compare-btn')) {
            toggleCompareItem(parseInt(productId));
        }
    });

    // Scroll Animations
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.services h2, .about-us h2, .products h2, .testimonials h2, .gallery h2').forEach(header => {
        header.classList.add('reveal-on-scroll');
        scrollObserver.observe(header);
    });

    document.querySelectorAll('.accordion-container, .about-us, .product-grid, .testimonial-grid, .gallery-grid').forEach(container => {
        const items = container.querySelectorAll('.accordion-item, .about-item, .product-card, .testimonial-card, .gallery-item');
        items.forEach((item, index) => {
            item.classList.add('reveal-on-scroll');
            (item as HTMLElement).style.transitionDelay = `${index * 100}ms`; 
            scrollObserver.observe(item);
        });
    });
    
    // Admin login
    const loginModal = getElement('#login-modal');
    getElement('#admin-btn').onclick = () => openModal(loginModal);
    getElement('#login-form').addEventListener('submit', e => {
        e.preventDefault();
        // Simplified auth check
        closeModal(loginModal);
        openModal(getElement('#admin-modal'));
        renderAdminProducts();
        renderAdminOrders();
    });

    getElement('.admin-sidebar').addEventListener('click', (e) => {
        const navButton = (e.target as HTMLElement).closest('.admin-nav-btn');
        if (navButton) {
            // FIX: Cast navButton to HTMLElement to access dataset property.
            const tabId = (navButton as HTMLElement).dataset.tab;
            document.querySelectorAll('.admin-sidebar .admin-nav-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(content => content.classList.remove('active'));
            
            navButton.classList.add('active');
            const activeContent = getElement(`#admin-section-${tabId}`);
            if (activeContent) {
               activeContent.classList.add('active');
               if (tabId === 'orders') renderAdminOrders();
            }
        }
    });

}

// Start the application
init();