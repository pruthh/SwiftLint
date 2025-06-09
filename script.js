// Initialize Three.js scene
let scene, camera, renderer, hanger, lintRoller;
let isDetached = false;

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Setup Three.js scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f6fa);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    document.getElementById('3d-container').appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create hanger model
    createHangerModel();

    // Add scroll animation
    setupScrollAnimation();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Create hanger model
function createHangerModel() {
    // Create hanger group
    hanger = new THREE.Group();

    // Create hanger hook
    const hookGeometry = new THREE.TorusGeometry(0.2, 0.05, 16, 32);
    const hookMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
    const hook = new THREE.Mesh(hookGeometry, hookMaterial);
    hook.rotation.x = Math.PI / 2;
    hook.position.y = 1.5;
    hanger.add(hook);

    // Create hanger body
    const bodyGeometry = new THREE.BoxGeometry(1, 0.1, 0.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x3498db });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    hanger.add(body);

    // Create lint roller
    const rollerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
    const rollerMaterial = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
    lintRoller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    lintRoller.rotation.x = Math.PI / 2;
    lintRoller.position.y = 0.5;
    lintRoller.position.z = 0.3;
    hanger.add(lintRoller);

    scene.add(hanger);
}

// Setup scroll animation
function setupScrollAnimation() {
    // Rotate hanger on scroll
    gsap.to(hanger.rotation, {
        y: Math.PI * 2,
        duration: 2,
        scrollTrigger: {
            trigger: "#product",
            start: "top center",
            end: "bottom center",
            scrub: true
        }
    });

    // Detach lint roller on scroll
    ScrollTrigger.create({
        trigger: "#product",
        start: "top center",
        onEnter: () => detachLintRoller(),
        onLeaveBack: () => attachLintRoller()
    });
}

// Detach lint roller
function detachLintRoller() {
    if (!isDetached) {
        gsap.to(lintRoller.position, {
            z: 1,
            duration: 1,
            ease: "power2.inOut"
        });
        isDetached = true;
    }
}

// Attach lint roller
function attachLintRoller() {
    if (isDetached) {
        gsap.to(lintRoller.position, {
            z: 0.3,
            duration: 1,
            ease: "power2.inOut"
        });
        isDetached = false;
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Initialize and start animation
init();
animate();

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add hover effects to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    const totalItems = items.length;

    // Create dots
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        const offset = -currentIndex * 50; // Changed to 50 for 2 items
        carousel.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        goToSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        goToSlide(currentIndex);
    }

    // Event listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Auto-advance slides every 3 seconds
    let autoSlide = setInterval(nextSlide, 3000);

    // Pause auto-advance on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });

    carousel.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 3000);
    });

    // Initialize first slide
    goToSlide(0);
});

// Enhanced scroll animations
gsap.registerPlugin(ScrollTrigger);

// Animate features on scroll
gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2
    });
});

// Parallax effect for hero section
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero',
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    y: 100,
    opacity: 0.5
});

// Animate product section
gsap.from('.product-info', {
    scrollTrigger: {
        trigger: '.product-showcase',
        start: "top center"
    },
    x: -100,
    opacity: 0,
    duration: 1
}); 