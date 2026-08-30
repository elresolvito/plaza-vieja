// ================================================================
// PLAZA VIEJA - SCRIPT COMPLETO
// ================================================================

// ================================================================
// 1. CATÁLOGO DE PRODUCTOS
// ================================================================

function extractPrice(filename) {
    var match = filename.match(/(\d+)(?=\.\w+$)/);
    return match ? parseInt(match[1]) : 0;
}

function extractWeight(filename) {
    var match = filename.match(/(\d+[,.]?\d*)\s*kilos?/i);
    if (match) return parseFloat(match[1].replace(',', '.'));
    match = filename.match(/(\d+)\s*ml/i);
    if (match) return parseFloat(match[1]) / 1000;
    match = filename.match(/(\d+)\s*g/i);
    if (match) return parseFloat(match[1]) / 1000;
    return null;
}

// ================================================================
// PRODUCTOS - CON LOS NOMBRES EXACTOS DE TUS ARCHIVOS
// ================================================================

var products = [
    // === EMBUTIDOS ===
    { 
        id: 101, 
        name: "Chorizo Extra Vela", 
        image: "productos/Chorizo extra vela 1.6 kilos 17000.png", 
        desc: "Chorizo extra vela de alta calidad, sabor intenso y ahumado.", 
        category: "Embutidos" 
    },
    { 
        id: 102, 
        name: "Jamón Serrano Deshuesado", 
        image: "productos/Jamón Serrano deshuesado 5 a 5.5 libras 49000.png", 
        desc: "Jamón serrano deshuesado, corte fino y sabor tradicional.", 
        category: "Embutidos", 
        tag: "nuevo" 
    },
    { 
        id: 103, 
        name: "Jamón Rápido", 
        image: "productos/jamon-rapido-2kg-10000.png", 
        desc: "Jamón rápido, práctico y versátil para el consumo diario.", 
        category: "Embutidos" 
    },
    { 
        id: 104, 
        name: "Jamón Barra", 
        image: "productos/Jamón barra 2 kilos 10000.png", 
        desc: "Jamón en barra, ideal para lonchear y preparar sándwiches.", 
        category: "Embutidos" 
    },
    { 
        id: 105, 
        name: "Chorizo Vela Bravo", 
        image: "productos/chorizo vela bravo 14500.png", 
        desc: "Chorizo vela bravo, sabor intenso y tradicional.", 
        category: "Embutidos" 
    },
    { 
        id: 106, 
        name: "Salchichón", 
        image: "productos/salchichon 2 kg 16000.jpg", 
        desc: "Salchichón curado, ideal para picar y compartir.", 
        category: "Embutidos" 
    },

    // === BEICONES ===
    { 
        id: 201, 
        name: "Beicon Laminado 1kg", 
        image: "productos/Beicon laminado 1 kilo 9000.png", 
        desc: "Beicon laminado en finas lonchas, perfecto para desayunos.", 
        category: "Beicones", 
        tag: "oferta" 
    },
    { 
        id: 202, 
        name: "Beicon Laminado 2kg", 
        image: "productos/Beicon laminado de 2 kilos 17000.png", 
        desc: "Beicon laminado en lonchas, formato económico.", 
        category: "Beicones" 
    },
    { 
        id: 203, 
        name: "Beicon Troceado Lasqueado", 
        image: "productos/Beicon troceado Lasqueado 3 kilos 17000.png", 
        desc: "Beicon troceado y lasqueado, ideal para guisos.", 
        category: "Beicones" 
    },
    { 
        id: 204, 
        name: "Beicon Molde Natural", 
        image: "productos/Beicon molde natural de 5 kilos 29000.png", 
        desc: "Beicon en molde natural, sabor auténtico.", 
        category: "Beicones" 
    },

    // === QUESOS ===
    { 
        id: 301, 
        name: "Queso Gouda Alemán", 
        image: "productos/gouda-aleman-3.1kg-20500.png", 
        desc: "Queso Gouda alemán, cremoso y con sabor intenso.", 
        category: "Quesos" 
    },
    { 
        id: 302, 
        name: "Queso Gouda Holandés", 
        image: "productos/gouda-holandes-3.1kg-21500.png", 
        desc: "Queso Gouda holandés, aroma y sabor inconfundibles.", 
        category: "Quesos" 
    },
    { 
        id: 303, 
        name: "Queso Azul", 
        image: "productos/Queso azul 3 kilos 31000.png", 
        desc: "Queso azul de sabor fuerte y con carácter.", 
        category: "Quesos", 
        tag: "nuevo" 
    },
    { 
        id: 304, 
        name: "Queso de Cabra con Miel", 
        image: "productos/Queso de cabra valle de San Juan con crema de miel 3.5 kilos 25000.png", 
        desc: "Exquisito queso de cabra del Valle de San Juan con miel.", 
        category: "Quesos", 
        tag: "oferta" 
    },

    // === PESCADOS ===
    { 
        id: 401, 
        name: "Salmón Ahumado", 
        image: "productos/Salmón ahumado 1 kilo 17000.png", 
        desc: "Salmón ahumado de alta calidad, ideal para entradas y platos gourmet.", 
        category: "Pescados", 
        tag: "nuevo" 
    }
];

// Procesar productos
products = products.map(function(p) {
    p.price = extractPrice(p.image);
    var w = extractWeight(p.image);
    p.weight = w || 0.5;
    p.detail = w ? (w >= 1 ? w.toFixed(1).replace('.', ',') + ' kg' : (w * 1000).toFixed(0) + ' g') : '';
    return p;
});

// Ordenar
products.sort(function(a, b) {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return a.name.localeCompare(b.name);
});

// ================================================================
// 2. CARRITO
// ================================================================

function loadCart() {
    var data = localStorage.getItem('plazaCart');
    if (data) {
        try {
            var parsed = JSON.parse(data);
            if (parsed.expires && parsed.expires > Date.now()) {
                return parsed.items || [];
            }
        } catch (e) {}
    }
    return [];
}

var cart = loadCart();

function saveCart() {
    localStorage.setItem('plazaCart', JSON.stringify({
        items: cart,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000
    }));
    updateUI();
}

function getTotal() {
    return cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
}

function getCount() {
    return cart.reduce(function(s, i) { return s + i.quantity; }, 0);
}

function addToCart(product, qty) {
    var existing = cart.find(function(i) { return i.id === product.id; });
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: qty, 
            weight: product.weight 
        });
    }
    saveCart();
    showToast('¡' + product.name + ' añadido!');
    shakeCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function updateQty(index, newQty) {
    if (newQty <= 0) { removeFromCart(index); return; }
    cart[index].quantity = newQty;
    saveCart();
}

function updateUI() {
    var count = getCount();
    var total = getTotal();
    
    var badge = document.getElementById('cartBadge');
    var floatTotal = document.getElementById('cartFloatTotal');
    if (badge) badge.textContent = count;
    if (floatTotal) floatTotal.textContent = '$' + total.toLocaleString();
    
    var container = document.getElementById('cartItems');
    var sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
    var sendSmsBtn = document.getElementById('sendSmsBtn');
    var totalDisplay = document.getElementById('cartTotalDisplay');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-medium);">Tu carrito está vacío</p>';
        if (sendWhatsAppBtn) sendWhatsAppBtn.disabled = true;
        if (sendSmsBtn) sendSmsBtn.disabled = true;
        if (totalDisplay) totalDisplay.textContent = 'Total: $0';
        return;
    }
    
    container.innerHTML = cart.map(function(item, i) {
        return '<div class="cart-item">' +
            '<div><strong>' + item.name + '</strong><br><span style="font-size:0.8125rem;color:var(--text-medium);">$' + item.price.toLocaleString() + ' c/u</span></div>' +
            '<div class="item-controls">' +
                '<button class="minus" onclick="updateQty(' + i + ', ' + (item.quantity - 1) + ')">−</button>' +
                '<span style="font-weight:700;min-width:24px;text-align:center;">' + item.quantity + '</span>' +
                '<button class="plus" onclick="updateQty(' + i + ', ' + (item.quantity + 1) + ')">+</button>' +
                '<button class="remove" onclick="removeFromCart(' + i + ')">✕</button>' +
            '</div>' +
        '</div>';
    }).join('');
    
    if (totalDisplay) totalDisplay.textContent = 'Total: $' + total.toLocaleString();
    if (sendWhatsAppBtn) sendWhatsAppBtn.disabled = false;
    if (sendSmsBtn) sendSmsBtn.disabled = false;
}

// ================================================================
// 3. RENDERIZAR PRODUCTOS
// ================================================================

var currentCategory = 'all';
var currentProduct = null;
var currentQty = 1;

function renderProducts() {
    var grid = document.getElementById('productGrid');
    var search = document.getElementById('searchInput');
    var searchTerm = search ? search.value.toLowerCase() : '';
    
    var spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
    
    var filtered = products.filter(function(p) {
        var catMatch = currentCategory === 'all' || p.category === currentCategory;
        var searchMatch = !searchTerm || p.name.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm);
        return catMatch && searchMatch;
    });
    
    var noResults = document.getElementById('noResults');
    if (!grid) return;
    
    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
        return;
    }
    if (noResults) noResults.classList.add('hidden');
    
    var grouped = {};
    filtered.forEach(function(p) {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
    });
    
    var html = '';
    var cats = Object.keys(grouped).sort();
    cats.forEach(function(cat) {
        html += '<div style="grid-column:1/-1;text-align:center;padding:16px 0 8px;"><h3 style="font-size:1.25rem;font-weight:800;color:var(--primary);border-bottom:2px solid #e5e7eb;padding-bottom:8px;display:inline-block;">— ' + cat + ' —</h3></div>';
        grouped[cat].forEach(function(p) {
            var tagHtml = '';
            if (p.tag === 'oferta') {
                tagHtml = '<span class="product-tag">Oferta</span>';
            } else if (p.tag === 'nuevo') {
                tagHtml = '<span class="product-tag new">Nuevo</span>';
            }
            
            html += '<div class="product-card" onclick="openProductModal(' + p.id + ')">' +
                '<div class="img-wrap">' +
                    tagHtml +
                    '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%230d3b33%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%22150%22 y=%22150%22 text-anchor=%22middle%22 font-family=%22Inter,sans-serif%22 font-size=%2220%22 fill=%22white%22%3E' + encodeURIComponent(p.name) + '%3C/text%3E%3C/svg%3E\'">' +
                '</div>' +
                '<div class="info">' +
                    '<h3>' + p.name + '</h3>' +
                    (p.detail ? '<span class="detail">' + p.detail + '</span>' : '') +
                    '<span class="desc">' + p.desc + '</span>' +
                    '<span class="price">$' + p.price.toLocaleString() + '</span>' +
                    '<button class="btn-detail">Ver Detalles</button>' +
                '</div>' +
            '</div>';
        });
    });
    grid.innerHTML = html;
}

// ================================================================
// 4. CATEGORÍAS RÁPIDAS
// ================================================================

function renderQuickCategories() {
    var container = document.getElementById('quickCategories');
    if (!container) return;
    
    var cats = ['all'];
    products.forEach(function(p) {
        if (cats.indexOf(p.category) === -1) cats.push(p.category);
    });
    
    container.innerHTML = cats.map(function(c) {
        var label = c === 'all' ? 'Todos' : c;
        return '<button class="quick-cat-btn' + (c === 'all' ? ' active' : '') + '" data-category="' + c + '" onclick="filterByCategory(\'' + c + '\')">' + label + '</button>';
    }).join('');
}

// ================================================================
// 5. FILTROS
// ================================================================

function filterByCategory(cat) {
    currentCategory = cat;
    
    var btns = document.querySelectorAll('.filter-btn');
    btns.forEach(function(b) {
        b.classList.toggle('active', b.dataset.category === cat);
    });
    
    var quickBtns = document.querySelectorAll('.quick-cat-btn');
    quickBtns.forEach(function(b) {
        b.classList.toggle('active', b.dataset.category === cat);
    });
    
    renderProducts();
}

function filterProducts() {
    renderProducts();
}

// ================================================================
// 6. MODALES
// ================================================================

function openProductModal(id) {
    currentProduct = products.find(function(p) { return p.id === id; });
    if (!currentProduct) return;
    currentQty = 1;
    document.getElementById('modalTitle').textContent = currentProduct.name;
    var img = document.getElementById('modalImage');
    img.src = currentProduct.image;
    img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%230d3b33%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%22150%22 y=%22150%22 text-anchor=%22middle%22 font-family=%22Inter,sans-serif%22 font-size=%2224%22 fill=%22white%22%3E' + encodeURIComponent(currentProduct.name) + '%3C/text%3E%3C/svg%3E';
    };
    document.getElementById('modalDesc').textContent = currentProduct.desc;
    updateModalPrice();
    document.getElementById('modalQty').textContent = '1';
    document.getElementById('productModal').classList.add('show');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
}

function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    document.getElementById('modalQty').textContent = currentQty;
    updateModalPrice();
}

function updateModalPrice() {
    if (currentProduct) {
        var total = currentProduct.price * currentQty;
        document.getElementById('modalPrice').textContent = '$' + total.toLocaleString();
    }
}

function addToCartFromModal() {
    if (currentProduct) {
        addToCart(currentProduct, currentQty);
        closeProductModal();
    }
}

function openCartModal() {
    updateUI();
    document.getElementById('cartModal').classList.add('show');
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('show');
}

// ================================================================
// 7. ENVIAR A GOOGLE SHEETS - CORREGIDO (CORS)
// ================================================================

function enviarAGoogleSheets(telefono, productos, total, peso) {
    var url = 'https://script.google.com/macros/s/AKfycbzJM-Nqe4y4uF1-I5s0aASZrIAdhuteoXzrfjz1cYjcFXnXF3LZVOU601AAnT9yW1iQ/exec';
    
    var data = {
        telefono: telefono,
        productos: productos,
        total: total,
        peso: peso
    };
    
    console.log('📤 Enviando a Google Sheets:', data);
    
    // Usamos 'no-cors' para evitar problemas de CORS
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function() {
        console.log('✅ Pedido enviado a Google Sheets (no-cors)');
    })
    .catch(function(error) {
        console.warn('⚠️ Error al enviar a Google Sheets:', error);
    });
}

// ================================================================
// 8. FUNCIONES DE CONTACTO
// ================================================================

function obtenerMensajePedido() {
    if (cart.length === 0) {
        return null;
    }

    var telefonoInput = document.getElementById('clienteTelefono');
    var telefonoCliente = telefonoInput ? telefonoInput.value.trim() : '';
    
    if (!telefonoCliente || telefonoCliente.length < 8) {
        showToast('⚠️ Ingresa tu número de teléfono para continuar');
        if (telefonoInput) telefonoInput.focus();
        return null;
    }

    var total = getTotal();
    var pesoTotal = cart.reduce(function(s, i) {
        return s + (i.weight || 0.5) * i.quantity;
    }, 0);

    var listaProductos = cart.map(function(item) {
        return item.name + ' x' + item.quantity;
    }).join(', ');
    
    enviarAGoogleSheets(telefonoCliente, listaProductos, total.toFixed(2), pesoTotal.toFixed(1));

    var numeroPedido = Math.floor(1000 + Math.random() * 9000);
    var fecha = new Date().toLocaleString('es-CU');

    var mensaje = '🛒 *NUEVO PEDIDO #' + numeroPedido + '*\n';
    mensaje += '📅 ' + fecha + '\n\n';
    mensaje += '📋 *PRODUCTOS:*\n';
    cart.forEach(function(item) {
        mensaje += '  • ' + item.name + ' × ' + item.quantity + ' = $' + (item.price * item.quantity).toLocaleString() + '\n';
    });
    mensaje += '\n💰 *Total: $' + total.toLocaleString() + ' CUP*';
    mensaje += '\n📦 *Peso aprox: ' + pesoTotal.toFixed(1) + ' kg*';
    mensaje += '\n\n--- *DATOS DEL CLIENTE* ---';
    mensaje += '\n📍 *Dirección:* (Confirma)';
    mensaje += '\n📞 *Teléfono:* ' + telefonoCliente;
    mensaje += '\n💳 *Pago:* (Efectivo / Transferencia)';
    mensaje += '\n\n⏰ *Entregamos en el día (9am - 8pm)*';
    mensaje += '\n\n✅ *El administrador confirmará los datos y coordinará la entrega*';

    return mensaje;
}

function enviarPorWhatsAppConCarrito() {
    var mensaje = obtenerMensajePedido();
    if (!mensaje) return;
    
    var url = 'https://wa.me/5356382909?text=' + encodeURIComponent(mensaje);
    window.open(url, '_blank');
    closeCartModal();
}

function enviarPorSMSConCarrito() {
    var mensaje = obtenerMensajePedido();
    if (!mensaje) return;
    
    var url = 'sms:5356382909?body=' + encodeURIComponent(mensaje);
    window.open(url, '_blank');
    setTimeout(function() {
        showToast('📱 Si no se abre, copia el mensaje y pégalo en SMS');
    }, 1000);
    closeCartModal();
}

function llamarPorTelefono() {
    var telefono = '5356382909';
    var url = 'tel:' + telefono;
    window.open(url, '_blank');
    closeCartModal();
}

// ================================================================
// 9. TOAST Y ANIMACIONES
// ================================================================

var toastTimeout;

function showToast(msg) {
    var el = document.getElementById('toast');
    var msgEl = document.getElementById('toastMsg');
    if (!el || !msgEl) return;
    msgEl.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function() { el.classList.remove('show'); }, 2500);
}

function shakeCart() {
    var btn = document.getElementById('cartFloat');
    if (!btn) return;
    btn.classList.remove('shake');
    void btn.offsetWidth;
    btn.classList.add('shake');
}

// ================================================================
// 10. DETECCIÓN DE CAMBIOS
// ================================================================

function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(registration) {
            setInterval(function() {
                registration.update();
                console.log('🔄 Buscando actualizaciones...');
            }, 5 * 60 * 1000);
        });
    }
}

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        checkForUpdates();
    }
});

// ================================================================
// 11. INICIALIZACIÓN
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    var cats = ['all'];
    products.forEach(function(p) {
        if (cats.indexOf(p.category) === -1) cats.push(p.category);
    });
    var container = document.getElementById('filterContainer');
    if (container) {
        container.innerHTML = cats.map(function(c) {
            return '<button class="filter-btn' + (c === 'all' ? ' active' : '') + '" data-category="' + c + '" onclick="filterByCategory(\'' + c + '\')">' + (c === 'all' ? 'Todos' : c) + '</button>';
        }).join('');
    }
    
    renderQuickCategories();
    
    setTimeout(function() {
        renderProducts();
    }, 300);
    
    updateUI();
    
    document.querySelectorAll('.modal-overlay').forEach(function(m) {
        m.addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('show');
        });
    });
    
    var header = document.getElementById('mainHeader');
    window.addEventListener('scroll', function() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 80);
    });
    
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) e.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(function(el) {
            observer.observe(el);
        });
    }
    
    setTimeout(checkForUpdates, 5000);
});
