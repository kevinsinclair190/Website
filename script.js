// Initialize the website
document.addEventListener('DOMContentLoaded', function () {
    initModelPreviews();
    initMainModelViewer();
    renderModelGallery();
    setupEventListeners();
    document.querySelector('.model-viewer-section').style.display = 'none';
});

// Sample model data
const models = [
    { id: 1, name: "Donut", price: 169, category: "Food", file: "Donut" },
    { id: 2, name: "Auto Rickshaw", price: 899, category: "vehicles",  file: "auto" },
    { id: 3, name: "Taj Mahal", price: 1499, category: "architecture",  file: "taj" },
];

let cart = [];

// Initialize miniature model previews
function initModelPreviews() {
    const previewContainers = document.querySelectorAll('.model-preview');
    previewContainers.forEach(container => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f9fa);

        const aspect = container.clientWidth / container.clientHeight;
        const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 15);
        scene.add(directionalLight);

        const geometry = new THREE.BoxGeometry(1.5, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x4e54c8, shininess: 60 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        function animate() {
            requestAnimationFrame(animate);
            mesh.rotation.y += 0.01;
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    });
}

// Initialize the main model viewer
function initMainModelViewer() {
    const container = document.getElementById('model-viewer');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef2f7);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    const geometry = new THREE.BoxGeometry(2, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x4e54c8, shininess: 60 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Render the model gallery
function renderModelGallery() {
    const container = document.getElementById('model-container');
    container.innerHTML = '';
    models.forEach(model => {
        const card = document.createElement('div');
        card.className = 'model-card';
        card.innerHTML = `
            <div class="model-preview" id="preview-${model.id}"></div>
            <div class="card-body">
                <h5>${model.name}</h5>
                <p class="text-muted">${getCategoryName(model.category)}</p>
            </div>
            <div class="card-footer">
                <h3 class="price">₹${model.price}</h3>
                <button class="add-to-cart-btn" data-id="${model.id}">
                    <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    setTimeout(initModelPreviews, 100);
}

function getCategoryName(category) {
    const names = {
        'architecture': 'Architecture',
        'vehicles': 'Vehicles',
        'cultural': 'Cultural',
        'decor': 'Home Decor'
    };
    return names[category] || category;
}

function setupEventListeners() {
    document.querySelector('.navbar-toggler').addEventListener('click', function () {
        document.querySelector('.navbar-collapse').classList.toggle('show');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                document.querySelector('.navbar-collapse').classList.remove('show');
            }
        });
    });

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Filtering logic can be added here
        });
    });

    document.getElementById('search-btn').addEventListener('click', function () {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        // Search logic can be added here
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const modelId = parseInt(btn.dataset.id);
            addToCart(modelId);
        }

        const card = e.target.closest('.model-card');
        if (card) {
            const modelId = parseInt(card.querySelector('.add-to-cart-btn').dataset.id);
            viewModelDetails(modelId);
        }
    });

    document.getElementById('add-to-cart').addEventListener('click', function () {
        const modelId = parseInt(document.getElementById('model-title').dataset.id);
        addToCart(modelId);
    });

    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    document.getElementById('newsletterForm').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        this.reset();
    });
}

function addToCart(modelId) {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    const existingItem = cart.find(item => item.id === modelId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: model.id, name: model.name, price: model.price, quantity: 1 });
    }

    updateCart();
    showNotification(`${model.name} added to cart!`);
}

function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-badge').textContent = totalItems;

    const cartItems = document.getElementById('cart-items-container');
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h4>Your cart is empty</h4>
                <p>Browse our collection and add some amazing 3D models!</p>
                <a href="#models" class="btn btn-primary">Explore Models</a>
            </div>
        `;
    } else {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small>₹${item.price} × ${item.quantity}</small>
                    </div>
                    <div>
                        <span class="fw-bold">₹${item.price * item.quantity}</span>
                        <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const discount = subtotal >= 2000 ? subtotal * 0.1 : 0;
    const total = subtotal + tax - discount;

    document.getElementById('cart-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('cart-discount').textContent = `-₹${discount.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
}

function viewModelDetails(modelId) {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    document.getElementById('model-title').textContent = model.name;
    document.getElementById('model-title').dataset.id = model.id;
    document.getElementById('model-category').textContent = getCategoryName(model.category);
    document.getElementById('model-description').textContent = model.description;
    document.querySelector('.model-viewer-section .price').textContent = `₹${model.price}`;

    document.querySelector('.model-viewer-section').style.display = 'block';
    document.querySelector('.model-viewer-section').scrollIntoView({ behavior: 'smooth' });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
// Login handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    alert(`Welcome back, ${email}`);
    this.reset();
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
});

// Signup handling
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    alert(`Account created for ${name}`);
    this.reset();
    bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
});
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    console.log("Login submitted"); // Debug line

    const email = document.getElementById('loginEmail').value;
    alert(`Welcome back, ${email}`);
    this.reset();

    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
});
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    console.log("Signup submitted"); // Debug line

    const name = document.getElementById('signupName').value;
    alert(`Account created for ${name}`);
    this.reset();

    bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();

});
