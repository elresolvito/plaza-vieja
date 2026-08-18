// ============================================================
// PLAZA VIEJA - CATÁLOGO PREMIUM (SOLO PRODUCTOS ACTUALES)
// ============================================================

// Función para extraer el precio del nombre del archivo
function extractPriceFromFilename(filename) {
    const match = filename.match(/(\d+)(?=\.\w+$)/);
    return match ? parseInt(match[1]) : 0;
}

// Función para extraer el peso del nombre del archivo
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
        return ((min + max) / 2) * 0.453592; // Promedio
    }
    return null;
}

// Función para extraer descripción del nombre
function extractDetailsFromFilename(filename) {
    let details = '';
    // Extraer peso
    let weight = extractWeightFromFilename(filename);
    if (weight !== null) {
        details = weight.toFixed(1).replace('.', ',') + ' kg';
    }
    return details;
}

// ============================================================
// CATÁLOGO DE PRODUCTOS - TODOS LOS QUE ESTÁN EN TUS IMÁGENES
// ============================================================

var products = [
    // === BEICONES ===
    { 
        id: 201, 
        name: "Beicon Laminado 1kg", 
        image: "Beicon laminado 1 kilo 9000.png",
        description: "Beicon laminado en finas lonchas, perfecto para tus desayunos y recetas.", 
        category: "Beicones", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 202, 
        name: "Beicon Laminado 2kg", 
        image: "Beicon laminado de 2 kilos 17000.png",
        description: "Beicon laminado en lonchas, formato económico ideal para la familia.", 
        category: "Beicones", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 203, 
        name: "Beicon Troceado Lasqueado", 
        image: "Beicon troceado Lasqueado 3 kilos 17000.png",
        description: "Beicon troceado y lasqueado, perfecto para guisos, potajes y cocina diaria.", 
        category: "Beicones", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 204, 
        name: "Beicon Molde Natural", 
        image: "Beicon molde natural de 5 kilos 29000.png",
        description: "Beicon en molde natural, sabor auténtico y artesanal.", 
        category: "Beicones", 
        status: "available", 
        hasBoxOption: false
    },

    // === CHORIZOS Y EMBUTIDOS ===
    { 
        id: 101, 
        name: "Chorizo Extra Vela", 
        image: "Chorizo extra vela 1.6 kilos 17000.png",
        description: "Chorizo extra vela de alta calidad, sabor intenso y ahumado tradicional.", 
        category: "Embutidos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 102, 
        name: "Jamón Serrano Deshuesado", 
        image: "Jamón Serrano deshuesado 5 a 5.5 libras 49000.png",
        description: "Jamón serrano deshuesado, corte fino y sabor tradicional español.", 
        category: "Embutidos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 103, 
        name: "Jamón Rápido", 
        image: "Jamón rápido 2 kilos 9000.png",
        description: "Jamón rápido, práctico y versátil para el consumo diario.", 
        category: "Embutidos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 104, 
        name: "Jamón Barra", 
        image: "Jamón barra 2 kilos 9000.png",
        description: "Jamón en barra, ideal para lonchear y preparar sándwiches.", 
        category: "Embutidos", 
        status: "available", 
        hasBoxOption: false
    },

    // === QUESOS ===
    { 
        id: 301, 
        name: "Queso Gouda Alemán", 
        image: "Gouda alemán 3,1 kilos 20500.png",
        description: "Queso Gouda alemán, cremoso y con sabor intenso característico.", 
        category: "Quesos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 302, 
        name: "Queso Gouda Holandés", 
        image: "Gouda holandés 3,1 kilos 21500.png",
        description: "Queso Gouda holandés, aroma y sabor inconfundibles de la tradición holandesa.", 
        category: "Quesos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 303, 
        name: "Queso Azul", 
        image: "Queso azul 3 kilos 31000.png",
        description: "Queso azul de sabor fuerte, intenso y con carácter, para paladares exigentes.", 
        category: "Quesos", 
        status: "available", 
        hasBoxOption: false
    },
    { 
        id: 304, 
        name: "Queso de Cabra con Miel", 
        image: "Queso de cabra valle de San Juan con crema de miel 3.5 kilos 25000.png",
        description: "Exquisito queso de cabra del Valle de San Juan con crema de miel, equilibrio perfecto.", 
        category: "Quesos", 
        status: "available", 
        hasBoxOption: false
    }
];

// ============================================================
// PROCESAR PRODUCTOS: Extraer precio, peso y detalles
// ============================================================

products = products.map(function(product) {
    // Extraer precio del nombre del archivo
    product.price = extractPriceFromFilename(product.image);
    
    // Extraer peso del nombre del archivo
    const weight = extractWeightFromFilename(product.image);
    if (weight !== null) {
        product.weight = weight;
        // Formatear peso para mostrar
        if (!product.specificDetails) {
            product.specificDetails = weight.toFixed(1).replace('.', ',') + ' kg';
        }
    } else {
        product.weight = 1.0;
        if (!product.specificDetails) {
            product.specificDetails = '1 kg';
        }
    }
    
    return product;
});

// ============================================================
// ORDENAR PRODUCTOS POR CATEGORÍA
// ============================================================

products.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
});

// ============================================================
// SISTEMA DE CARGA DE IMÁGENES CON FALLBACK
// ============================================================

function loadImageWithFallback(imgElement, src, fallbackColor = '#0d3b33') {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            imgElement.src = this.src;
            resolve(true);
        };
        img.onerror = function() {
            // Placeholder con el nombre del producto
            const productName = imgElement.alt || 'Producto';
            const price = imgElement.dataset.price || '0';
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            // Fondo con gradiente
            const gradient = ctx.createLinearGradient(0, 0, 300, 300);
            gradient.addColorStop(0, '#0d3b33');
            gradient.addColorStop(1, '#1a5a4a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 300, 300);
            // Texto
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Nombre del producto (wrap)
            const words = productName.split(' ');
            let lines = [];
            let line = '';
            for (let word of words) {
                if (line.length + word.length > 12) {
                    lines.push(line);
                    line = word;
                } else {
                    line += (line ? ' ' : '') + word;
                }
            }
            if (line) lines.push(line);
            const lineHeight = 35;
            const startY = 150 - (lines.length - 1) * lineHeight / 2;
            ctx.font = 'bold 20px Inter, sans-serif';
            lines.forEach((l, i) => {
                ctx.fillText(l, 150, startY + i * lineHeight);
            });
            // Precio
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
    const images = document.querySelectorAll('img[data-price]');
    images.forEach(img => {
        const src = img.src;
        if (src && !src.startsWith('data:')) {
            loadImageWithFallback(img, src, '#0d3b33');
        }
    });
}

// ============================================================
// RENDERIZAR PRODUCTOS
// ============================================================

function renderProductCard(product, index) {
    const isUnavailable = product.status === 'unavailable';
    const onClickHandler = isUnavailable ? '' : `onclick="showProductDetailsModal(${product.id})"`;
    const cursorStyle = isUnavailable ? 'cursor-not-allowed' : 'cursor-pointer';

    const formattedPrice = product.price.toLocaleString();
    const productName = product.name;
    const specificDetails = product.specificDetails || '';
    const description = product.description || '';

    return `<div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${cursorStyle} flex flex-col ${isUnavailable ? 'unavailable-product-card' : ''} fade-in-up" style="transition-delay: ${index * 50}ms" ${onClickHandler}>
        <div class="w-full h-72 md:h-80 overflow-hidden bg-[#0d3b33] flex items-center justify-center p-3">
            <img src="${product.image}" alt="${productName} - Plaza Vieja" class="w-full h-full object-contain transition-all duration-300" loading="lazy" data-price="${product.price}">
        </div>
        <div class="p-4 flex-grow flex flex-col">
            <h3 class="text-fixed-lg font-bold text-[var(--text-dark)] mb-1">${productName}</h3>
            ${specificDetails ? `<p class="text-fixed-sm text-gray-500 mb-1">${specificDetails}</p>` : ''}
            <p class="text-fixed-sm text-[var(--text-medium)] mb-2 flex-grow">${description}</p>
            <p class="text-fixed-xl font-bold text-[var(--primary-color)] mb-4">$${formattedPrice}</p>
            ${isUnavailable ? 
                '<div class="mt-auto w-full bg-gray-400 text-white font-bold py-2 px-4 rounded-lg text-center cursor-not-allowed">No Disponible</div>' : 
                '<button class="mt-auto w-full bg-[var(--primary-color)] text-white font-bold py-2 px-4 rounded-lg text-fixed-base hover:bg-opacity-90 transition-colors duration-300">Ver Detalles</button>'}
        </div>
    </div>`;
}

function renderProductsWithAutoPrice(productsToRender, gridId, noResultsId) {
    var productGrid = document.getElementById(gridId);
    var noResultsMessage = document.getElementById(noResultsId);
    if (!productGrid || !noResultsMessage) return;
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '';
        noResultsMessage.classList.remove('hidden');
        return;
    }
    noResultsMessage.classList.add('hidden');
    
    var groupedProducts = productsToRender.reduce(function(acc, product) {
        (acc[product.category] = acc[product.category] || []).push(product);
        return acc;
    }, {});

    var html = '';
    var sortedCategories = Object.keys(groupedProducts).sort();

    for (var i = 0; i < sortedCategories.length; i++) {
        var category = sortedCategories[i];
        if (groupedProducts.hasOwnProperty(category)) {
            html += `<div class="col-span-full fade-in-up"><h3 class="text-2xl font-bold text-center text-[var(--primary-color)] my-8 border-b-2 border-gray-200 pb-2">— ${category} —</h3></div>`;
            html += groupedProducts[category].map(renderProductCard).join('');
        }
    }
    productGrid.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">${html}</div>`;
    
    setTimeout(preloadAllImages, 500);
    setupScrollAnimations();
}

// ============================================================
// FUNCIONES PARA EL MODAL DE DETALLES
// ============================================================

var currentProductForModal = null;
var currentUnitType = 'individual';

function showProductDetailsModal(productId) {
    var product = products.find(p => p.id === productId);
    if (!product || product.status === 'unavailable') return;
    
    currentProductForModal = JSON.parse(JSON.stringify(product));
    currentProductForModal.quantity = 1;
    currentUnitType = 'individual';
    
    document.getElementById('productDetailsTitle').textContent = product.name;
    document.getElementById('productDetailsImage').src = product.image;
    document.getElementById('productDetailsDescription').textContent = product.description;
    document.getElementById('productQuantityDisplay').textContent = '1';
    
    document.getElementById('productDetailsPrice').textContent = '$' + product.price.toLocaleString() + ' / unidad';
    document.getElementById('modalTotalPrice').textContent = '$' + product.price.toLocaleString();
    
    var unitTypeSection = document.getElementById('unitTypeSection');
    if (product.hasBoxOption) {
        unitTypeSection.classList.remove('hidden');
        updateUnitTypeButtons();
    } else {
        unitTypeSection.classList.add('hidden');
    }
    
    showModal(productDetailsModal);
}

function updateUnitTypeButtons() {
    var individualBtn = document.getElementById('unitTypeIndividual');
    var boxBtn = document.getElementById('unitTypeBox');
    if (currentUnitType === 'individual') {
        individualBtn.classList.add('active');
        boxBtn.classList.remove('active');
    } else {
        boxBtn.classList.add('active');
        individualBtn.classList.remove('active');
    }
}

function updateModalPricing() {
    if (!currentProductForModal) return;
    var unitPrice, unitDescription;
    if (currentProductForModal.hasBoxOption && currentUnitType === 'box') {
        unitPrice = currentProductForModal.boxPrice;
        unitDescription = 'Caja (' + currentProductForModal.boxQuantity + ' unidades)';
    } else {
        unitPrice = currentProductForModal.price;
        unitDescription = 'Unidad';
    }
    var totalPrice = unitPrice * currentProductForModal.quantity;
    document.getElementById('productDetailsPrice').textContent = '$' + unitPrice.toLocaleString() + ' / ' + unitDescription;
    document.getElementById('modalTotalPrice').textContent = '$' + totalPrice.toLocaleString();
}

function changeQuantity(valor) {
    if (!currentProductForModal) return;
    currentProductForModal.quantity = Math.max(1, currentProductForModal.quantity + valor);
    document.getElementById('productQuantityDisplay').textContent = currentProductForModal.quantity;
    updateModalPricing();
}

function addToCartFromModal() {
    if (!currentProductForModal) return;
    var cartItem = {
        id: currentProductForModal.id + (currentUnitType === 'box' ? '_box' : ''),
        name: currentProductForModal.name,
        image: currentProductForModal.image,
        quantity: currentProductForModal.quantity,
        unitType: currentUnitType,
        weight: currentProductForModal.weight
    };
    if (currentProductForModal.hasBoxOption && currentUnitType === 'box') {
        cartItem.price = currentProductForModal.boxPrice;
        cartItem.name += ' (Caja x' + currentProductForModal.boxQuantity + ')';
        cartItem.weight = currentProductForModal.weight * currentProductForModal.boxQuantity;
    } else {
        cartItem.price = currentProductForModal.price;
    }
    
    var existingItemIndex = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === cartItem.id) {
            existingItemIndex = i;
            break;
        }
    }
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
        cart.push(cartItem);
    }
    updateCartUI();
    localStorage.setItem('cart', JSON.stringify(cart));
    hideModal(productDetailsModal);
    currentProductForModal = null;
    showCartAnimation();
    showCartToast('Producto añadido al carrito');
}

// ============================================================
// ASIGNAR FUNCIONES GLOBALES
// ============================================================

const renderProducts = renderProductsWithAutoPrice;
const setupStoreSection = function(sectionPrefix, productsForSection) {
    var filtersId = sectionPrefix + 'CategoryFilters';
    var searchId = sectionPrefix + 'SearchInput';
    var gridId = sectionPrefix + 'ProductGrid';
    var noResultsId = sectionPrefix + 'NoResultsMessage';
    setupCategoryFiltersAndSearch(productsForSection, filtersId, searchId, gridId, noResultsId);
    renderProductsWithAutoPrice(productsForSection, gridId, noResultsId);
};

// ============================================================
// EL RESTO DEL CÓDIGO (Carrito, Checkout, etc.)
// ============================================================
// ... (aquí mantienes todo el código que ya tenías para el carrito)
