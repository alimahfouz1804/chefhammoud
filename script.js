/**
 * Chef Hammoud — Premium Personal Chef Website
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==================================================================
       DISH DATA
       ================================================================== */
    const dishes = [
        {
            id: 1,
            name: "Oven-Baked Salmon",
            nameAr: "",
            nameEn: "",
            category: "Seafood",
            image: "images/dish1.jpg",
            description: "Perfectly seasoned salmon fillets baked to golden perfection, served on a bed of roasted vegetables with hasselback potatoes, cherry tomatoes, and fresh herbs.",
            instagram: "https://www.instagram.com/reel/DdrTMwNs4y5/?stkn=MThpOGkzaDVzcm1saA==",
            featured: true
        },
        {
            id: 2,
            name: "منسف أردني",
            nameEn: "Jordanian Mansaf",
            nameAr: "",
            category: "Main Course",
            image: "images/dish2.jpg",
            description: "A traditional Jordanian masterpiece — tender lamb shanks slow-cooked in a rich, tangy yogurt sauce, served over fragrant saffron rice with toasted almonds and crispy bread.",
            instagram: "https://www.instagram.com/reel/DdWpFQZsMaE/?stkn=MW5oazFseDFlMXMxMg==",
            featured: true
        },
        {
            id: 3,
            name: "صينية لحمة و خضرة بالفرن",
            nameEn: "Oven-Roasted Meat & Vegetables",
            nameAr: "",
            category: "Meat",
            image: "images/dish3.jpg",
            description: "Succulent roasted meat surrounded by a vibrant array of oven-roasted vegetables — tomatoes, carrots, onions, mushrooms, and peppers — seasoned with rosemary and thyme.",
            instagram: "https://www.instagram.com/reel/DdJzbMcMRKA/?stkn=MXJhMXFndXF2MjY1dg==",
            featured: true
        }
    ];

    /* ==================================================================
       1. LOADING SCREEN
       ================================================================== */
    const loadingScreen = document.getElementById('loading-screen');
    const showPage = () => {
        document.body.classList.add('loaded');
        if (loadingScreen) {
            setTimeout(() => loadingScreen.remove(), 600);
        }
    };

    if (loadingScreen) {
        // Wait at least 1.2s, but also wait for images to finish if quick
        const minDelay = new Promise(r => setTimeout(r, 1200));
        const windowLoad = new Promise(r => {
            if (document.readyState === 'complete') r();
            else window.addEventListener('load', r, { once: true });
        });
        Promise.all([minDelay, windowLoad]).then(showPage);
        // Safety: show page after 4s max regardless
        setTimeout(showPage, 4000);
    } else {
        showPage();
    }

    /* ==================================================================
       2. NAVIGATION
       ================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    const updateNavbar = () => {
        if (!navbar) return;
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href === `#${id}` || href === `index.html#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' });

        sections.forEach(s => sectionObserver.observe(s));
    }

    /* ==================================================================
       3. SMOOTH SCROLLING
       ================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ==================================================================
       4. SCROLL REVEAL
       ================================================================== */
    const initReveal = () => {
        const elements = document.querySelectorAll('.reveal:not(.active)');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(el => observer.observe(el));
    };
    initReveal();

    /* ==================================================================
       5. DISH CARD RENDERING
       ================================================================== */
    const getDisplayName = (dish) => {
        if (dish.nameEn && dish.nameEn.length > 0) {
            return `${dish.name} <span style="font-size:0.85em;opacity:0.7;">(${dish.nameEn})</span>`;
        }
        return dish.name;
    };

    const getPlainName = (dish) => {
        return dish.nameEn ? `${dish.name} - ${dish.nameEn}` : dish.name;
    };

    const renderDishCards = (container, dishArray) => {
        if (!container) return;
        container.innerHTML = '';

        if (dishArray.length === 0) {
            const noResults = document.getElementById('no-results');
            if (noResults) noResults.style.display = 'block';
            return;
        }

        const noResults = document.getElementById('no-results');
        if (noResults) noResults.style.display = 'none';

        dishArray.forEach((dish, index) => {
            const card = document.createElement('div');
            card.className = 'dish-card reveal';
            card.dataset.category = dish.category;
            card.dataset.id = dish.id;
            card.style.transitionDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="dish-card-image">
                    <img src="${dish.image}" alt="${getPlainName(dish)}" loading="lazy">
                    <div class="dish-card-overlay">
                        <span class="overlay-text">View Dish</span>
                    </div>
                </div>
                <div class="dish-card-body">
                    <span class="dish-category">${dish.category}</span>
                    <h3 class="dish-name">${getDisplayName(dish)}</h3>
                    <p class="dish-description">${dish.description}</p>
                    <button class="btn-view-dish" data-id="${dish.id}">View Dish</button>
                </div>
            `;
            container.appendChild(card);
        });

        // Re-init reveals for newly added cards
        initReveal();
    };

    // Render on home page
    const featuredGrid = document.getElementById('featured-dishes-grid');
    if (featuredGrid) {
        renderDishCards(featuredGrid, dishes.filter(d => d.featured));
    }

    // Render on dishes page
    const allDishesGrid = document.getElementById('all-dishes-grid');
    if (allDishesGrid) {
        renderDishCards(allDishesGrid, dishes);
    }

    /* ==================================================================
       6. DISH MODAL
       ================================================================== */
    const modal = document.createElement('div');
    modal.className = 'dish-modal';
    modal.id = 'dish-modal';
    document.body.appendChild(modal);

    const instagramSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;

    const openDishModal = (dishId) => {
        const dish = dishes.find(d => d.id === parseInt(dishId));
        if (!dish) return;

        modal.innerHTML = `
            <div class="dish-modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <div class="modal-image">
                    <img src="${dish.image}" alt="${getPlainName(dish)}">
                </div>
                <div class="modal-body">
                    <span class="dish-category">${dish.category}</span>
                    <h2 class="modal-dish-name">${getDisplayName(dish)}</h2>
                    <p class="modal-description">${dish.description}</p>
                    <p class="modal-chef">Prepared by <strong>Chef Hammoud</strong></p>
                    ${dish.instagram ? `
                    <a href="${dish.instagram}" target="_blank" rel="noopener noreferrer" class="btn-instagram-reel">
                        ${instagramSVG}
                        Watch the Creation on Instagram
                    </a>` : ''}
                </div>
            </div>
        `;

        // Small delay for transition to work
        requestAnimationFrame(() => {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    };

    const closeDishModal = () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        setTimeout(() => { modal.innerHTML = ''; }, 400);
    };

    // Delegate click events for opening modal
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.dish-card');
        const viewBtn = e.target.closest('.btn-view-dish');
        const searchResult = e.target.closest('.search-result-item');

        let dishId = null;
        if (viewBtn) {
            dishId = viewBtn.dataset.id;
        } else if (card) {
            dishId = card.dataset.id;
        } else if (searchResult) {
            dishId = searchResult.dataset.id;
            // Close search results
            document.querySelectorAll('.search-results').forEach(r => r.classList.remove('active'));
            document.querySelectorAll('.search-input').forEach(i => { i.value = ''; });
        }

        if (dishId) {
            openDishModal(dishId);
        }
    });

    // Close modal events
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close')) {
            closeDishModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeDishModal();
        }
    });

    /* ==================================================================
       7. SEARCH
       ================================================================== */
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    document.querySelectorAll('.search-input').forEach(input => {
        const wrapper = input.closest('.search-container') || input.parentElement;
        let resultsEl = wrapper.querySelector('.search-results');

        // Create results element if not found
        if (!resultsEl) {
            resultsEl = document.createElement('div');
            resultsEl.className = 'search-results';
            wrapper.appendChild(resultsEl);
        }

        const doSearch = debounce((query) => {
            if (!query || query.length < 1) {
                resultsEl.classList.remove('active');
                resultsEl.innerHTML = '';
                return;
            }

            const q = query.toLowerCase();
            const results = dishes.filter(d =>
                d.name.toLowerCase().includes(q) ||
                (d.nameEn && d.nameEn.toLowerCase().includes(q)) ||
                (d.nameAr && d.nameAr.toLowerCase().includes(q)) ||
                d.category.toLowerCase().includes(q) ||
                d.description.toLowerCase().includes(q)
            );

            resultsEl.innerHTML = '';

            if (results.length > 0) {
                results.forEach(dish => {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.dataset.id = dish.id;
                    item.innerHTML = `
                        <img src="${dish.image}" alt="${getPlainName(dish)}">
                        <div class="search-result-info">
                            <h4>${getPlainName(dish)}</h4>
                            <span>${dish.category}</span>
                        </div>
                    `;
                    resultsEl.appendChild(item);
                });
            } else {
                resultsEl.innerHTML = '<div class="search-no-results">No dishes found</div>';
            }

            resultsEl.classList.add('active');
        }, 250);

        input.addEventListener('input', (e) => doSearch(e.target.value.trim()));

        // Close search results on outside click
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !resultsEl.contains(e.target)) {
                resultsEl.classList.remove('active');
            }
        });
    });

    /* ==================================================================
       8. CATEGORY FILTERING (Dishes Page)
       ================================================================== */
    const filtersContainer = document.getElementById('category-filters');
    if (filtersContainer && allDishesGrid) {
        // Build unique categories from dishes
        const categories = [...new Set(dishes.map(d => d.category))];

        // Add category buttons dynamically
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.category = cat.toLowerCase();
            btn.textContent = cat;
            filtersContainer.appendChild(btn);
        });

        // Handle filter clicks
        filtersContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            const filtered = category === 'all'
                ? dishes
                : dishes.filter(d => d.category.toLowerCase() === category);

            // Fade out, re-render, fade in
            allDishesGrid.style.opacity = '0';
            setTimeout(() => {
                renderDishCards(allDishesGrid, filtered);
                allDishesGrid.style.opacity = '1';
            }, 300);
        });
    }

    /* ==================================================================
       9. BACK TO TOP
       ================================================================== */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==================================================================
       10. HERO TAGLINE ROTATION
       ================================================================== */
    const tagline = document.getElementById('hero-tagline');
    if (tagline) {
        const phrases = [
            "Crafting Flavor. Creating Experiences.",
            "Where Passion Meets the Plate.",
            "Every Plate Tells a Story.",
            "Taste Begins with the Eyes."
        ];
        let currentIndex = 0;

        setInterval(() => {
            tagline.classList.add('fade-out');
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % phrases.length;
                tagline.textContent = phrases[currentIndex];
                tagline.classList.remove('fade-out');
            }, 500);
        }, 4000);
    }

    /* ==================================================================
       11. PARALLAX EFFECT (subtle)
       ================================================================== */
    const hero = document.querySelector('.hero, .dishes-hero');
    if (hero && window.innerWidth > 768) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const limit = hero.offsetHeight;
                    if (scrolled < limit) {
                        hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ==================================================================
       12. INSTAGRAM GRID LINKS
       ================================================================== */
    document.querySelectorAll('.instagram-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            if (dishes[index] && dishes[index].instagram) {
                window.open(dishes[index].instagram, '_blank');
            } else {
                window.open('https://instagram.com/chef_hammoud', '_blank');
            }
        });
    });

});
