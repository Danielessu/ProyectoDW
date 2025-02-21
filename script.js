// Carrito de compras como objeto para rastrear cantidad por plato
let carrito = {};

// Cargar solo las funciones necesarias cuando la página se cargue
window.onload = function () {
    console.log("La página se cargó correctamente.");
    actualizarCarrito();     // Carga inicial del carrito
    updateHeaderCartCount(); // Sincroniza el contador del header
    document.getElementById("ordenar-comida-btn").addEventListener("click", (event) => {
        event.preventDefault();
        ordenarComida();
    });
};

// Agregar ítem al carrito
function agregarAlCarrito(item, precio) {
    if (carrito[item]) {
        carrito[item].cantidad += 1;
    } else {
        carrito[item] = { precio: precio, cantidad: 1 };
    }
    actualizarCarrito();
    updateHeaderCartCount();
}

// Actualizar la visualización del carrito
function actualizarCarrito() {
    const cartItems = document.getElementById("cart-items");
    const headerCartCount = document.getElementById("header-cart-count"); 
    const cartCount = document.getElementById("cart-count");//conteo carrito
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !headerCartCount || !cartCount || !cartTotal) {
        console.error("No se encontraron elementos del carrito.");
        return;
    }

    cartItems.innerHTML = "";  // Limpia el contenido actual del carrito

    let totalItems = 0;
    let totalPrice = 0;

    // Recorre cada ítem del carrito y crea los elementos HTML
    for (const [nombre, item] of Object.entries(carrito)) {
        totalItems += item.cantidad;
        totalPrice += item.precio * item.cantidad;

        const listItem = document.createElement("li");
        listItem.className = "cart-item";
        listItem.innerHTML = `
            <span>${nombre} - $${item.precio} x ${item.cantidad}</span>
            <div>
                <button onclick="modificarCantidad('${nombre}', -1)">-</button>
                <button onclick="modificarCantidad('${nombre}', 1)">+</button>
            </div>
        `;

        cartItems.appendChild(listItem);
    }

    // Actualiza contadores y total
    headerCartCount.textContent = totalItems;
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
}

// Modificar cantidad (+ o -) de un ítem en el carrito
function modificarCantidad(nombre, cambio) {
    if (carrito[nombre]) {
        carrito[nombre].cantidad += cambio;

        if (carrito[nombre].cantidad <= 0) {
            delete carrito[nombre]; // Elimina si la cantidad es 0
        }

        actualizarCarrito();
    }
}

// Vaciar el carrito completo
function vaciarCarrito() {
    carrito = {};
    actualizarCarrito();
    updateHeaderCartCount();
}

// Mostrar mensaje de confirmación de la orden
function showOrderMessage(message) {
    const messageBox = document.getElementById("order-message");
    const messageText = document.getElementById("order-message-text");

    if (messageBox && messageText) {
        messageText.textContent = message;
        messageBox.style.display = "block";
        messageBox.classList.remove("hide");
        messageBox.classList.add("show");

        // Desaparece después de 3 segundos
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.classList.add("hide");

            setTimeout(() => {
                messageBox.style.display = "none";
                messageBox.classList.remove("hide");
            }, 500);
        }, 3000);
    }
}

// Ordenar comida y vaciar el carrito
function ordenarComida(event) {
    if (event) event.preventDefault();  // Evita la recarga de la página

    if (Object.keys(carrito).length === 0) {
        showOrderMessage("El carrito está vacío. Agrega ítems antes de ordenar.");
        return;
    }

    // Datos del pedido
    const pedido = {
        fecha: new Date().toLocaleString(),
        items: carrito,
        total: Object.values(carrito).reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    };

    // Muestra los detalles del pedido en la consola
    console.log("🕰️ Fecha del pedido:", pedido.fecha);
    console.log("🛒 Detalles del pedido:");
    Object.entries(pedido.items).forEach(([nombre, { precio, cantidad }]) => {
        console.log(`- ${nombre}: ${cantidad} x $${precio} = $${precio * cantidad}`);
    });
    console.log(`💰 Total del pedido: $${pedido.total}`);

    // Muestra el mensaje y luego vacía el carrito
    showOrderMessage("¡Tu pedido ha sido realizado con éxito! Gracias por elegir Santo Domingo.");

    // Vaciar el carrito después de mostrar el mensaje (tras 3 segundos)
    setTimeout(() => {
        vaciarCarrito();
    }, 3000);
}

// Mostrar u ocultar el carrito
function toggleCarrito() {
    const cart = document.getElementById("cart");
    if (cart) {
        cart.classList.toggle("active");
    }
}

// Actualizar el contador del header
function updateHeaderCartCount() {
    const headerCartCount = document.getElementById("header-cart-count");
    const totalItems = Object.values(carrito).reduce((sum, item) => sum + item.cantidad, 0);

    if (headerCartCount) {
        headerCartCount.textContent = totalItems;
    }
}
