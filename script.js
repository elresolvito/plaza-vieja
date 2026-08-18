// ================================================================
// PLAZA VIEJA - SCRIPT COMPLETO
// Catálogo Premium de Embutidos, Beicones y Quesos
// ================================================================

// ================================================================
// 1. CONFIGURACIÓN DE ENVÍOS
// ================================================================

const MIN_ORDER_THRESHOLD = 500;
const TRAMO_1_MAX = 3000;
const SHIPPING_COST_TRAMO_1 = 150;
const SHIPPING_COST_TRAMO_2_BASE = 100;
const WEIGHT_SURCHARGE_PER_10KG = 100;
const WEIGHT_THRESHOLD_KG = 10;
const SERVICE_FEE = 50;

// ================================================================
// 2. FUNCIONES PARA EXTRAER DATOS DEL NOMBRE DEL ARCHIVO
// ================================================================

function extractPriceFromFilename(filename) {
    const match = filename.match(/(\d+)(?=\.\w+$)/);
    return match ? parseInt(match[1]) : 0;
}

function extractWeightFromFilename(filename) {
    // Busca "X kilos" o "X,XX kilos"
    let match = filename.match(/(\d+[,.]?\d*)\s*kilos?/i);
    if (match) {
        return parseFloat(match[1].replace(',', '.'));
    }
    // Busca "X libras" o "X a X.X libras"
    match = filename.match(/(\d+[,.]?\d*)\s*libras?/i);
    if (match) {
        return parseFloat(match[1].replace(',', '.')) * 0.453592;
    }
    // Busca "X a X.X" (ej: "5 a 5.5 libras")
    match = filename.match(/(\d+)\s*a\s*(\d+[,.]?\d*)\s*libras?/i);
    if (match) {
        const min = parseFloat(match[1]);
        const max = parseFloat(match[2].replace(',', '.'));
        return ((min + max) / 2) * 0.453592;
    }
    return null;
}

function formatWeight(weight) {
    if (weight === null) return '';
    return weight.toFixed(1).replace('.', ',') + ' kg';
}

// ================================================================
// 3. CATÁLOGO DE PRODUCTOS (TODOS LOS DE TUS IMÁGENES)
// ================================================================

var products = [
    // === BEICONES ===
    { 
        id: 201, 
        name: "Beicon Laminado 1kg", 
        image: "productos/Beicon laminado 1 kilo 9000.png",
        description: "Beicon laminado en finas lonchas, perfecto para tus desayunos y recetas.", 
        category: "Beicones", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 202, 
        name: "Beicon Laminado 2kg", 
        image: "productos/Beicon laminado de 2 kilos 17000.png",
        description: "Beicon laminado en lonchas, formato económico ideal para la familia.", 
        category: "Beicones", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 203, 
        name: "Beicon Troceado Lasqueado", 
        image: "productos/Beicon troceado Lasqueado 3 kilos 17000.png",
        description: "Beicon troceado y lasqueado, perfecto para guisos, potajes y cocina diaria.", 
        category: "Beicones", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 204, 
        name: "Beicon Molde Natural", 
        image: "productos/Beicon molde natural de 5 kilos 29000.png",
        description: "Beicon en molde natural, sabor auténtico y artesanal.", 
        category: "Beicones", 
        status: "available", 
        hasBoxOption: false
    },

    // === CHORIZOS Y EMBUTIDOS ===
    { 
        id: 101, 
        name: "Chorizo Extra Vela", 
        image: "productos/Chorizo extra vela 1.6 kilos 17000.png",
        description: "Chorizo extra vela de alta calidad, sabor intenso y ahumado tradicional.", 
        category: "Embutidos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 102, 
        name: "Jamón Serrano Deshuesado", 
        image: "productos/Jamón Serrano deshuesado 5 a 5.5 libras 49000.png",
        description: "Jamón serrano deshuesado, corte fino y sabor tradicional español.", 
        category: "Embutidos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 103, 
        name: "Jamón Rápido", 
        image: "productos/Jamón rápido 2 kilos 9000.png",
        description: "Jamón rápido, práctico y versátil para el consumo diario.", 
        category: "Embutidos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 104, 
        name: "Jamón Barra", 
        image: "productos/Jamón barra 2 kilos 9000.png",
        description: "Jamón en barra, ideal para lonchear y preparar sándwiches.", 
        category: "Embutidos", 
        status: "available", 
        hasBoxOption: false
    },

    // === QUESOS ===
    { 
        id: 301, 
        name: "Queso Gouda Alemán", 
        image: "productos/Gouda alemán 3,1 kilos 20500.png",
        description: "Queso Gouda alemán, cremoso y con sabor intenso característico.", 
        category: "Quesos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 302, 
        name: "Queso Gouda Holandés", 
        image: "productos/Gouda holandés 3,1 kilos 21500.png",
        description: "Queso Gouda holandés, aroma y sabor inconfundibles de la tradición holandesa.", 
        category: "Quesos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 303, 
        name: "Queso Azul", 
        image: "productos/Queso azul 3 kilos 31000.png",
        description: "Queso azul de sabor fuerte, intenso y con carácter, para paladares exigentes.", 
        category: "Quesos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 304, 
        name: "Queso de Cabra con Miel", 
        image: "productos/Queso de cabra valle de San Juan con crema de miel 3.5 kilos 25000.png",
        description: "Exquisito queso de cabra del Valle de San Juan con crema de miel, equilibrio perfecto.", 
        category: "Quesos", 
        status: "available", 
        hasBoxOption: false
    }
];

// ================================================================
// 4. PROCESAR PRODUCTOS (Extraer precio, peso y detalles)
// ================================================================

products = products.map(function(product) {
    product.price = extractPriceFromFilename(product.image);
    const weight = extractWeightFromFilename(product.image);
    if (weight !== null) {
        product.weight = weight;
        if (!product.specificDetails) {
            product.specificDetails = formatWeight(weight);
        }
    } else {
        product.weight = 1.0;
        if (!product.specificDetails) {
            product.specificDetails = '1 kg';
        }
    }
    return product;
});

products.sort(function(a, b) {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
});

// ================================================================
// 5. CARRO DE COMPRAS (Persistente en localStorage)
// ================================================================

var cart = JSON.parse(localStorage.getItem('plazaViejaCart')) || [];

function saveCart() {
    localStorage.setItem('plazaViejaCart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);
}

function getCartCount() {
    return cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);
}

function updateCartUI() {
    var count = getCartCount();
    var total = getCartTotal();
    
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartTotal').textContent = '$' + total.toLocaleString();
    document.getElementById('floatingCartTotal').textContent = '$' + total.toLocaleString();
    
    // Actualizar lista del carrito
    var cartItems = document.getElementById('cartItems');
    var sendBtn = document.getElementById('sendWhatsAppOrder');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-[var(--text-medium)] text-fixed-base">Tu carrito está vacío</p>';
        sendBtn.disabled = true;
        return;
    }
    
    cartItems.innerHTML = cart.map(function(item, index) {
        return '<div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">' +
            '<div class="flex-1">' +
                '<h4 class="text-fixed-base font-semibold text-[var(--text-dark)]">' + item.name + '</h4>' +
                '<p class="text-fixed-sm text-[var(--text-medium)]">$' + item.price.toLocaleString() + ' c/u</p>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
                '<button onclick="updateCartQuantity(' + index + ', ' + (item.quantity - 1) + ')" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-fixed-sm font-bold hover:bg-gray-300 transition-colors">-</button>' +
                '<span class="text-fixed-base font-semibold w-8 text-center">' + item.quantity + '</span>' +
                '<button onclick="updateCartQuantity(' + index + ', ' + (item.quantity + 1) + ')" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-fixed-sm font-bold hover:bg-gray-300 transition-colors">+</button>' +
                '<button onclick="removeFromCart(' + index + ')" class="ml-2 text-red-500 hover:text-red-700 transition-colors">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>' +
                '</button>' +
            '</div>' +
        '</div>';
    }).join('');
    
    sendBtn.disabled = false;
    updateDeliveryPromoBanner();
}

function addToCart(product, quantity) {
    var existingItem = cart.find(function(item) {
        return item.id === product.id;
    });
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: quantity,
            weight: product.weight
        });
    }
    
    saveCart();
    updateCartUI();
    showCartToast('¡' + product.name + ' añadido al carrito!');
}

function updateCartQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    cart[index].quantity = newQuantity;
    saveCart();
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showCartToast('Producto eliminado del carrito');
}

// ================================================================
// 6. SISTEMA DE IMÁGENES CON FALLBACK
// ================================================================

function loadImageWithFallback(imgElement, src) {
    return new Promise(function(resolve) {
        var img = new Image();
        img.onload = function() {
            imgElement.src = this.src;
            resolve(true);
        };
        img.onerror = function() {
            // Placeholder con nombre y precio
            var productName = imgElement.alt || 'Producto';
            var price = imgElement.dataset.price || '0';
            var canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            var ctx = canvas.getContext('2d');
            
            var gradient = ctx.createLinearGradient(0, 0, 300, 300);
            gradient.addColorStop(0, '#0d3b33');
            gradient.addColorStop(1, '#1a5a4a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 300, 300);
            
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            var words = productName.split(' ');
            var lines = [];
            var line = '';
            for (var i = 0; i < words.length; i++) {
                if (line.length + words[i].length > 12) {
                    lines.push(line);
                    line = words[i];
                } else {
                    line += (line ? ' ' : '') + words[i];
                }
            }
            if (line) lines.push(line);
            
            var lineHeight = 35;
            var startY = 150 - (lines.length - 1) * lineHeight / 2;
            ctx.font = 'bold 20px Inter, sans-serif';
            for (var j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], 150, startY + j * lineHeight);
            }
            
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillStyle = '#f5a623';
            ctx.fillText('$' + price, 150, startY + lines.length * lineHeight + 30);
            
            imgElement.src = canvas.toDataURL('image/png');
            resolve(false);
        };
        img.src = src;
    });
}

function preloadAllImages() {
    var images = document.querySelectorAll('img[data-price]');
    images.forEach(function(img) {
        var src = img.src;
        if (src && !src.startsWith('data:')) {
            loadImageWithFallback(img, src);
        }
    });
}

// ================================================================
// 7. RENDERIZAR PRODUCTOS
// ================================================================

function renderProductCard(product, index) {
    var isUnavailable = product.status === 'unavailable';
    var onClickHandler = isUnavailable ? '' : 'onclick="showProductDetails(' + product.id + ')"';
    var cursorStyle = isUnavailable ? 'cursor-not-allowed' : 'cursor-pointer';
    var formattedPrice = product.price.toLocaleString();

    return '<div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ' + cursorStyle + ' flex flex-col ' + (isUnavailable ? 'unavailable-product-card' : '') + ' fade-in-up" style="transition-delay: ' + (index * 50) + 'ms" ' + onClickHandler + '>' +
        '<div class="w-full h-72 md:h-80 overflow-hidden bg-[#0d3b33] flex items-center justify-center p-3">' +
            '<img src="' + product.image + '" alt="' + product.name + ' - Plaza Vieja" class="w-full h-full object-contain transition-all duration-300" loading="lazy" data-price="' + product.price + '">' +
        '</div>' +
        '<div class="p-4 flex-grow flex flex-col">' +
            '<h3 class="text-fixed-lg font-bold text-[var(--text-dark)] mb-1">' + product.name + '</h3>' +
            (product.specificDetails ? '<p class="text-fixed-sm text-gray-500 mb-1">' + product.specificDetails + '</p>' : '') +
            '<p class="text-fixed-sm text-[var(--text-medium)] mb-2 flex-grow">' + product.description + '</p>' +
            '<p class="text-fixed-xl font-bold text-[var(--primary-color)] mb-4">$' + formattedPrice + '</p>' +
            (isUnavailable ?
                '<div class="mt-auto w-full bg-gray-400 text-white font-bold py-2 px-4 rounded-lg text-center cursor-not-allowed">No Disponible</div>' :
                '<button class="mt-auto w-full bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded-lg text-fixed-base hover:bg-opacity-90 transition-colors duration-300">Ver Detalles</button>') +
        '</div></div>';
}

function renderProducts(productsToRender, gridId, noResultsId) {
    var productGrid = document.getElementById(gridId);
    var noResultsMessage = document.getElementById(noResultsId);
    if (!productGrid || !noResultsMessage) return;
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '';
        noResultsMessage.classList.remove('hidden');
        return;
    }
    noResultsMessage.classList.add('hidden');
    
    var groupedProducts = {};
    productsToRender.forEach(function(product) {
        if (!groupedProducts[product.category]) {
            groupedProducts[product.category] = [];
        }
        groupedProducts[product.category].push(product);
    });

    var html = '';
    var sortedCategories = Object.keys(groupedProducts).sort();

    sortedCategories.forEach(function(category) {
        html += '<div class="col-span-full fade-in-up"><h3 class="text-2xl font-bold text-center text-[var(--primary-color)] my-8 border-b-2 border-gray-200 pb-2">— ' + category + ' —</h3></div>';
        html += groupedProducts[category].map(renderProductCard).join('');
    });
    
    productGrid.innerHTML = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">' + html + '</div>';
    
    setTimeout(preloadAllImages, 500);
    setupScrollAnimations();
}

// ================================================================
// 8. FUNCIONES DE CATEGORÍAS Y BÚSQUEDA
// ================================================================

function setupCategoryFiltersAndSearch(productsForSection, filtersId, searchId, gridId, noResultsId) {
    var uniqueCategories = [];
    productsForSection.forEach(function(product) {
        if (uniqueCategories.indexOf(product.category) === -1) {
            uniqueCategories.push(product.category);
        }
    });

    var filtersContainer = document.getElementById(filtersId);
    if (!filtersContainer) return;

    var buttonsHtml = '<button class="category-btn active" data-category="all">Todos</button>';
    uniqueCategories.forEach(function(category) {
        buttonsHtml += '<button class="category-btn" data-category="' + category + '">' + category + '</button>';
    });
    filtersContainer.innerHTML = buttonsHtml;

    var currentCategory = 'all';
    var categoryButtons = filtersContainer.querySelectorAll('.category-btn');
    var searchInput = document.getElementById(searchId);

    function filterAndRender() {
        var searchTerm = searchInput.value.toLowerCase();
        var filteredProducts = productsForSection.filter(function(product) {
            var categoryMatch = (currentCategory === 'all' || product.category === currentCategory);
            var searchMatch = (!searchTerm || 
                product.name.toLowerCase().indexOf(searchTerm) > -1 || 
                product.description.toLowerCase().indexOf(searchTerm) > -1);
            return categoryMatch && searchMatch;
        });
        renderProducts(filteredProducts, gridId, noResultsId);
    }

    categoryButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            categoryButtons.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            currentCategory = this.getAttribute('data-category');
            filterAndRender();
        });
    });
    
    searchInput.addEventListener('input', filterAndRender);
}

// ================================================================
// 9. DETALLES DEL PRODUCTO (MODAL)
// ================================================================

var currentProduct = null;
var currentQuantity = 1;

function showProductDetails(productId) {
    var product = products.find(function(p) { return p.id === productId; });
    if (!product || product.status === 'unavailable') return;
    
    currentProduct = JSON.parse(JSON.stringify(product));
    currentQuantity = 1;
    
    document.getElementById('productDetailsTitle').textContent = product.name;
    document.getElementById('productDetailsImage').src = product.image;
    document.getElementById('productDetailsDescription').textContent = product.description;
    document.getElementById('productQuantityDisplay').textContent = '1';
    document.getElementById('productDetailsPrice').textContent = '$' + product.price.toLocaleString() + ' / unidad';
    document.getElementById('modalTotalPrice').textContent = '$' + product.price.toLocaleString();
    
    var unitTypeSection = document.getElementById('unitTypeSection');
    if (product.hasBoxOption) {
        unitTypeSection.classList.remove('hidden');
    } else {
        unitTypeSection.classList.add('hidden');
    }
    
    showModal('productDetailsModal');
}

function updateQuantity(change) {
    currentQuantity = Math.max(1, currentQuantity + change);
    document.getElementById('productQuantityDisplay').textContent = currentQuantity;
    if (currentProduct) {
        var total = currentProduct.price * currentQuantity;
        document.getElementById('modalTotalPrice').textContent = '$' + total.toLocaleString();
    }
}

function addFromModal() {
    if (!currentProduct) return;
    addToCart(currentProduct, currentQuantity);
    hideModal('productDetailsModal');
    currentProduct = null;
    currentQuantity = 1;
}

// ================================================================
// 10. MODALES
// ================================================================

function showModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ================================================================
// 11. NOTIFICACIONES Y ANIMACIONES
// ================================================================

var toastTimeout;

function showCartToast(message) {
    var toast = document.getElementById('cartToast');
    var toastMessage = document.getElementById('cartToastMessage');
    clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(function() {
        toast.classList.remove('show');
    }, 2500);
}

function showCartAnimation() {
    var btn = document.getElementById('floatingCartBtn');
    btn.classList.add('shake');
    setTimeout(function() {
        btn.classList.remove('shake');
    }, 600);
}

function setupScrollAnimations() {
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(function(el) {
            observer.observe(el);
        });
    } else {
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(function(el) {
            el.classList.add('is-visible');
        });
    }
}

// ================================================================
// 12. PROMOCIÓN DE ENVÍOS
// ================================================================

function updateDeliveryPromoBanner() {
    var subtotal = getCartTotal();
    var progressBar = document.getElementById('promoProgressBar');
    var progressText = document.getElementById('progressText');
    var level1 = document.getElementById('promoLevelTramo1');
    var level2 = document.getElementById('promoLevelTramo2');
    
    if (!progressBar || !progressText) return;
    
    var width = 0;
    var message = '';
    
    if (subtotal >= TRAMO_1_MAX) {
        var totalWeight = cart.reduce(function(sum, item) {
            return sum + (item.weight || 1) * item.quantity;
        }, 0);
        var surcharge = Math.ceil(totalWeight / WEIGHT_THRESHOLD_KG) * WEIGHT_SURCHARGE_PER_10KG;
        var totalShipping = SHIPPING_COST_TRAMO_2_BASE + surcharge;
        width = 100;
        message = '🎉 Tramo 2: Envío ~$' + totalShipping.toLocaleString() + ' CUP (' + totalWeight.toFixed(1) + 'kg)';
        if (level1) level1.classList.add('opacity-100');
        if (level2) level2.classList.add('opacity-100', 'ring-[var(--accent-color)]');
    } else if (subtotal >= MIN_ORDER_THRESHOLD) {
        width = (subtotal / TRAMO_1_MAX) * 100;
        var needed = TRAMO_1_MAX - subtotal + 1;
        message = '📦 Tramo 1: Envío $' + SHIPPING_COST_TRAMO_1 + ' CUP. Añade $' + needed.toLocaleString() + ' para Tramo 2';
        if (level1) level1.classList.add('opacity-100', 'ring-[var(--accent-color)]');
    } else if (subtotal > 0) {
        width = (subtotal / MIN_ORDER_THRESHOLD) * 15;
        var neededMin = MIN_ORDER_THRESHOLD - subtotal;
        message = '⚠️ Faltan $' + neededMin.toLocaleString() + ' para el pedido mínimo ($' + MIN_ORDER_THRESHOLD + ')';
    } else {
        message = '🛒 Añade productos a tu carrito';
    }
    
    progressBar.style.width = Math.min(width, 100) + '%';
    progressText.textContent = message;
    progressText.style.color = width > 50 ? 'white' : 'var(--primary-color)';
    progressText.style.textShadow = width > 50 ? '0 0 3px rgba(0,0,0,0.5)' : 'none';
}

// ================================================================
// 13. CHECKOUT
// ================================================================

function openCheckout() {
    if (cart.length === 0) {
        showCartToast('Tu carrito está vacío');
        return;
    }
    showModal('checkoutModal');
    updateCheckout();
}

function updateCheckout() {
    var subtotal = getCartTotal();
    var serviceFee = SERVICE_FEE;
    var location = document.getElementById('deliveryLocation').value;
    var shipping = 0;
    var shippingText = '$0';
    var note = '';
    
    if (location === 'habana-vieja') {
        if (subtotal >= TRAMO_1_MAX) {
            var totalWeight = cart.reduce(function(sum, item) {
                return sum + (item.weight || 1) * item.quantity;
            }, 0);
            var surcharge = Math.ceil(totalWeight / WEIGHT_THRESHOLD_KG) * WEIGHT_SURCHARGE_PER_10KG;
            shipping = SHIPPING_COST_TRAMO_2_BASE + surcharge;
            shippingText = '$' + shipping.toLocaleString() + ' CUP';
        } else if (subtotal >= MIN_ORDER_THRESHOLD) {
            shipping = SHIPPING_COST_TRAMO_1;
            shippingText = '$' + shipping.toLocaleString() + ' CUP';
        } else {
            shipping = 0;
            shippingText = 'Mínimo $' + MIN_ORDER_THRESHOLD;
        }
    } else if (location === 'otros') {
        shipping = 0;
        shippingText = 'A confirmar';
        note = 'El costo se ajustará a la agencia de mensajería';
    }
    
    var total = subtotal + serviceFee + shipping;
    
    document.getElementById('checkoutSubtotal').textContent = '$' + subtotal.toLocaleString();
    document.getElementById('checkoutServiceFee').textContent = '$' + serviceFee.toLocaleString();
    document.getElementById('checkoutShipping').textContent = shippingText;
    document.getElementById('checkoutTotal').textContent = '$' + total.toLocaleString();
    document.getElementById('shippingNote').textContent = note;
    document.getElementById('shippingNote').classList.toggle('hidden', !note);
    
    var summary = document.getElementById('checkoutOrderSummary');
    summary.innerHTML = cart.map(function(item) {
        return '<div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">' +
            '<div>' +
                '<h5 class="text-fixed-base font-semibold text-[var(--text-dark)]">' + item.name + '</h5>' +
                '<p class="text-fixed-sm text-[var(--text-medium)]">$' + item.price.toLocaleString() + ' × ' + item.quantity + '</p>' +
            '</div>' +
            '<div class="text-fixed-base font-semibold">$' + (item.price * item.quantity).toLocaleString() + '</div>' +
        '</div>';
    }).join('');
}

function confirmOrder() {
    var name = document.getElementById('customerName').value.trim();
    var address = document.getElementById('customerAddress').value.trim();
    var phone = document.getElementById('customerPhone').value.trim();
    var location = document.getElementById('deliveryLocation').value;
    var payment = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!name || !address || !phone || !location) {
        showCartToast('Completa todos los campos obligatorios');
        return;
    }
    
    if (!payment) {
        showCartToast('Selecciona un método de pago');
        return;
    }
    
    var subtotal = getCartTotal();
    var total = subtotal + SERVICE_FEE;
    if (location === 'habana-vieja') {
        if (subtotal >= TRAMO_1_MAX) {
            var totalWeight = cart.reduce(function(sum, item) {
                return sum + (item.weight || 1) * item.quantity;
            }, 0);
            var surcharge = Math.ceil(totalWeight / WEIGHT_THRESHOLD_KG) * WEIGHT_SURCHARGE_PER_10KG;
            total += SHIPPING_COST_TRAMO_2_BASE + surcharge;
        } else if (subtotal >= MIN_ORDER_THRESHOLD) {
            total += SHIPPING_COST_TRAMO_1;
        }
    }
    
    var mensaje = '🛒 *Nuevo Pedido Plaza Vieja*%0A%0A';
    mensaje += '👤 *Cliente:* ' + name + '%0A';
    mensaje += '📍 *Dirección:* ' + address + '%0A';
    mensaje += '📱 *Teléfono:* ' + phone + '%0A';
    mensaje += '🏠 *Ubicación:* ' + (location === 'habana-vieja' ? 'Habana Vieja' : 'Otros municipios') + '%0A';
    mensaje += '💳 *Pago:* ' + (payment.value === 'efectivo' ? 'Efectivo' : 'Transferencia') + '%0A%0A';
    mensaje += '📦 *Productos:*%0A';
    cart.forEach(function(item) {
        mensaje += '- ' + item.name + ' × ' + item.quantity + ' = $' + (item.price * item.quantity).toLocaleString() + '%0A';
    });
    mensaje += '%0A💰 *Total: $' + total.toLocaleString() + ' CUP*%0A%0A';
    mensaje += '⏰ *Horario de entrega:* 9am - 8pm';
    
    var url = 'https://wa.me/5356382909?text=' + mensaje;
    window.open(url, '_blank');
    
    hideModal('checkoutModal');
    showModal('confirmationModal');
}

// ================================================================
// 14. EVENTOS Y FUNCIONES GLOBALES
// ================================================================

// Hacer funciones globales para usar en HTML
window.showProductDetails = showProductDetails;
window.updateQuantity = updateQuantity;
window.addFromModal = addFromModal;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.openCheckout = openCheckout;
window.confirmOrder = confirmOrder;
window.updateCheckout = updateCheckout;
window.showModal = showModal;
window.hideModal = hideModal;
window.showCartToast = showCartToast;
window.showCartAnimation = showCartAnimation;

// ================================================================
// 15. INICIALIZACIÓN
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Configurar el mercado
    setupCategoryFiltersAndSearch(products, 'mercadoCategoryFilters', 'mercadoSearchInput', 'mercadoProductGrid', 'mercadoNoResultsMessage');
    renderProducts(products, 'mercadoProductGrid', 'mercadoNoResultsMessage');
    
    // Actualizar carrito
    updateCartUI();
    
    // Eventos de modales
    document.getElementById('floatingCartBtn').addEventListener('click', function() {
        showModal('cartModal');
    });
    
    document.getElementById('closeCartModal').addEventListener('click', function() {
        hideModal('cartModal');
    });
    
    document.getElementById('closeProductDetailsModalBtn').addEventListener('click', function() {
        hideModal('productDetailsModal');
        currentProduct = null;
    });
    
    document.getElementById('closeCheckoutModal').addEventListener('click', function() {
        hideModal('checkoutModal');
    });
    
    document.getElementById('closeConfirmationModal').addEventListener('click', function() {
        hideModal('confirmationModal');
    });
    
    document.getElementById('sendWhatsAppOrder').addEventListener('click', openCheckout);
    
    document.getElementById('deliveryLocation').addEventListener('change', updateCheckout);
    
    document.querySelectorAll('input[name="paymentMethod"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            var cashField = document.getElementById('cashPaymentField');
            cashField.classList.toggle('hidden', this.value !== 'efectivo');
        });
    });
    
    // Cerrar modales haciendo clic fuera
    document.querySelectorAll('.modal-overlay').forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Menú móvil
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.add('open');
        document.getElementById('mobile-backdrop').classList.add('open');
    });
    
    document.getElementById('close-mobile-menu').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('mobile-backdrop').classList.remove('open');
    });
    
    document.getElementById('mobile-backdrop').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('mobile-backdrop').classList.remove('open');
    });
    
    // WhatsApp group
    document.getElementById('contactWhatsappBtn').addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://chat.whatsapp.com/H19dIofkINdHrVApA4jbvW', '_blank');
    });
    
    // Scroll header
    var header = document.getElementById('mainHeader');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                if (this.classList.contains('mobile-nav-link')) {
                    document.getElementById('mobile-menu').classList.remove('open');
                    document.getElementById('mobile-backdrop').classList.remove('open');
                }
                setTimeout(function() {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });
    
    setupScrollAnimations();
});
