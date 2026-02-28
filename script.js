/* ══════════════════════════════════════════════════════════
   MIAH MD. RUYEL — PORTFOLIO JAVASCRIPT
   Animations, Interactions & UX Enhancements
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── PRELOADER ───
    const preloader = document.getElementById('preloader');
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 2000);
    });

    // Fallback: hide preloader after 4s even if load event is slow
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 4000);


    // ─── CUSTOM CURSOR ───
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth ring follow
        function animateCursor() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Expand cursor on interactive elements
        const interactives = document.querySelectorAll('a, button, .project-card, .software-item, .doc-card, .filter-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
        });
    }


    // ─── SCROLL PROGRESS BAR ───
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }


    // ─── NAVBAR SCROLL BEHAVIOR ───
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    // ─── MOBILE MENU ───
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        }
    });


    // ─── HERO TYPING EFFECT ───
    const heroTitle = document.getElementById('heroTitle');
    const titles = [
        'Highway Design Engineer',
        'Geotechnical Engineering Enthusiast',
        'MSc Student — Politecnico di Milano',
        'Structural Designer'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeTitle() {
        const current = titles[titleIndex];

        if (isDeleting) {
            heroTitle.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            heroTitle.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        // Add blinking cursor
        heroTitle.style.borderRight = '2px solid var(--color-accent)';

        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2500; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 400; // Pause before typing next
        }

        setTimeout(typeTitle, typeSpeed);
    }

    // Start typing after hero animation
    setTimeout(typeTitle, 2600);


    // ─── SCROLL-TRIGGERED ANIMATIONS ───
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));


    // ─── COUNTER ANIMATION ───
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }


    // ─── SKILL BARS ANIMATION ───
    const skillFills = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const width = el.getAttribute('data-width');
                el.style.width = width + '%';
                skillObserver.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(el => skillObserver.observe(el));


    // ─── PROJECT FILTER ───
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInCard 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });


    // ─── PROJECT CARD TILT EFFECT ───
    if (window.matchMedia('(pointer: fine)').matches) {
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }


    // ─── MAGNETIC BUTTON EFFECT ───
    if (window.matchMedia('(pointer: fine)').matches) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }


    // ─── CONTACT FORM ───
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.btn-submit');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const subject = contactForm.querySelector('#subject').value.trim();
        const message = contactForm.querySelector('#message').value.trim();

        if (!name || !email || !subject || !message) {
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');

            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // Floating label fix — add placeholder for CSS :not(:placeholder-shown)
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.setAttribute('placeholder', ' ');
    });


    // ─── BACK TO TOP ───
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ─── SMOOTH SCROLL FOR NAV LINKS ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ─── PARALLAX EFFECT ON HERO SHAPES ───
    const geoShapes = document.querySelectorAll('.geo-shape');

    function parallaxShapes() {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            geoShapes.forEach((shape, index) => {
                const speed = 0.03 + (index * 0.015);
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    }


    // ─── 3D EXPERIENCE CAROUSEL LOGIC ───
    const expCarousel = document.querySelector('.experience-carousel');
    if (expCarousel) {
        const cards = Array.from(expCarousel.querySelectorAll('.exp-card-container'));
        const btnPrev = document.getElementById('prevExp');
        const btnNext = document.getElementById('nextExp');
        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'left-card', 'right-card', 'hidden');

                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('left-card');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('right-card');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        // Initialize carousel
        updateCarousel();

        // Control buttons
        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateCarousel();
            });

            btnNext.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateCarousel();
            });
        }

        // Clickable background cards
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (!card.classList.contains('active')) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });
    }

    // ─── 3D CONSULTATION CAROUSEL LOGIC ───
    const consCarousel = document.querySelector('.consultation-carousel');
    if (consCarousel) {
        const cards = Array.from(consCarousel.querySelectorAll('.exp-card-container'));
        const btnPrev = document.getElementById('prevCons');
        const btnNext = document.getElementById('nextCons');
        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'left-card', 'right-card', 'hidden');

                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('left-card');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('right-card');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        updateCarousel();

        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateCarousel();
            });

            btnNext.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateCarousel();
            });
        }

        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (!card.classList.contains('active')) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });
    }

    // ─── 3D DOCUMENTS CAROUSEL LOGIC ───
    const docCarousel = document.querySelector('.documents-carousel');
    if (docCarousel) {
        const cards = Array.from(docCarousel.querySelectorAll('.exp-card-container'));
        const btnPrev = document.getElementById('prevDoc');
        const btnNext = document.getElementById('nextDoc');
        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'left-card', 'right-card', 'hidden');

                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('left-card');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('right-card');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        updateCarousel();

        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateCarousel();
            });

            btnNext.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateCarousel();
            });
        }

        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (!card.classList.contains('active')) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });
    }

    // ─── CONSOLIDATED SCROLL HANDLER ───
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavbar();
                updateActiveNav();
                updateBackToTop();
                parallaxShapes();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial calls
    updateNavbar();
    updateScrollProgress();
    updateBackToTop();


    // ─── STAGGERED ANIMATION FOR GRID ITEMS ───
    // Add CSS animation keyframe dynamically
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
    document.head.appendChild(style);


    // ─── NAVBAR LINK ACTIVE UNDERLINE ───
    const navLinkStyle = document.createElement('style');
    navLinkStyle.textContent = `
    .nav-link.active { color: var(--color-white); }
    .nav-link.active::after { width: 100%; }
  `;
    document.head.appendChild(navLinkStyle);


    // ─── TEXT REVEAL ON HERO ── INTERSECTION BASED ───
    // For elements that are in the hero section, the CSS handles it via delays.
    // For elements outside the hero, the Intersection Observer handles it.


    // ─── SMOOTH RESIZE HANDLER ───
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate any values that depend on viewport
            updateScrollProgress();
        }, 250);
    });

});




/* ─── FILE MANAGER LOGIC ─── */
document.addEventListener("DOMContentLoaded", () => {
    // File Data Structure
    const fileData = {
        "excel-design-tools": [
            {
                "name": "Bearing Capacity Of Soil.xlsx",
                "type": "excel",
                "size": "12.3 KB",
                "date": "2020-10-08",
                "url": "documents/academic/excel-design-tools/Bearing Capacity Of Soil.xlsx"
            }
        ],
        "academic-notes": [
            {
                "name": "Google Drive Link",
                "type": "link",
                "size": "-",
                "date": "2026-02-28",
                "url": "https://drive.google.com/drive/folders/0Bwex-E2mIXMcUkM4cXEtZ0dQV1E?resourcekey=0-wE1D7ZGqwNBcBz1ODq3WNw&usp=sharing"
            }
        ],
        "softwares": [
            {
                "name": "Google Drive Link",
                "type": "link",
                "size": "-",
                "date": "2026-02-28",
                "url": "https://drive.google.com/open?id=1RyK_4eOLiuelDA5-BD5WgfDlQROfTA8D&usp=drive_fs"
            }
        ],
        "Courses": [
            {
                "name": "AutoCAD",
                "type": "folder",
                "size": "-",
                "date": "2026-02-20",
                "children": []
            },
            {
                "name": "ETABS",
                "type": "folder",
                "size": "-",
                "date": "2026-02-28",
                "children": [
                    {
                        "name": "Google Drive Link",
                        "type": "link",
                        "size": "-",
                        "date": "2026-02-28",
                        "url": "https://drive.google.com/open?id=107VIRN9hmh4EG_dbmAUzhoRnfXxWMsNC&usp=drive_fs"
                    }
                ]
            }
        ]
    };

    /* ─── FILE MANAGER LOGIC ─── */

    // File Data is available from outer scope
    const modal = document.getElementById('fileManagerModal');
    const closeModalBtn = document.getElementById('fmCloseCtx');
    const fileListContainer = document.getElementById('fmFileList');
    const fmTitle = document.getElementById('fmTitle');
    const fmSearch = document.getElementById('fmSearch');
    const fmSort = document.getElementById('fmSort');
    const fmFileCount = document.getElementById('fmFileCount');
    const viewListBtn = document.getElementById('viewList');
    const viewGridBtn = document.getElementById('viewGrid');

    // New UI Elements for Explorer
    const fileToolbar = document.querySelector('.file-toolbar');
    let breadcrumbContainer = document.getElementById('fmBreadcrumbs');
    let backBtn = document.getElementById('fmBackBtn');

    // Inject Breadcrumbs/Back Btn if not exists (HTML structure update might be better, but doing via JS for safety if HTML not updated manually)
    if (!breadcrumbContainer) {
        const navBar = document.createElement('div');
        navBar.className = 'fm-nav-bar';
        navBar.innerHTML = `
          <button id="fmBackBtn" class="fm-back-btn" disabled><i class="fas fa-arrow-left"></i></button>
          <div id="fmBreadcrumbs" class="fm-breadcrumbs"></div>
      `;
        // Insert after toolbar
        if (fileToolbar) {
            fileToolbar.insertAdjacentElement('afterend', navBar);
        }
        breadcrumbContainer = document.getElementById('fmBreadcrumbs');
        backBtn = document.getElementById('fmBackBtn');
    }

    let currentView = 'list'; // 'list' or 'grid'

    // Navigation State
    let navigationStack = []; // Stack of folder objects { name: 'Root', items: [...] }
    let currentItems = [];    // Current level items

    // Open Modal
    document.querySelectorAll('.folder-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            const folderName = card.querySelector('h3').innerText;

            if (fileData[category]) {
                // Initialize Stack with Root
                navigationStack = [
                    { name: folderName, items: fileData[category] }
                ];
                updateCurrentLevel();

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Navigation Logic
    function updateCurrentLevel() {
        const currentLevel = navigationStack[navigationStack.length - 1];
        currentItems = [...currentLevel.items]; // Clone for sorting/filtering locally

        // Update UI
        renderFiles(currentItems);
        updateBreadcrumbs();
        updateBackButton();

        // Update Title to current folder name
        if (fmTitle) fmTitle.innerText = currentLevel.name;
    }

    function navigateToFolder(folderName, folderItems) {
        navigationStack.push({ name: folderName, items: folderItems });
        updateCurrentLevel();
        // Reset search on navigation
        if (fmSearch) fmSearch.value = '';
    }

    function navigateBack() {
        if (navigationStack.length > 1) {
            navigationStack.pop();
            updateCurrentLevel();
            if (fmSearch) fmSearch.value = '';
        } else {
            // If at root, close modal
            closeFileManager();
        }
    }

    if (backBtn) {
        backBtn.addEventListener('click', navigateBack);
    }

    function updateBackButton() {
        if (backBtn) {
            // Always enabled now that it closes modal at root
            backBtn.disabled = false;
            backBtn.style.opacity = '1';
            backBtn.style.cursor = 'pointer';

            // Optional: Change icon or style if at root to indicate "Close/Back"
            // But standard back arrow is fine
        }
    }

    function updateBreadcrumbs() {
        if (!breadcrumbContainer) return;
        breadcrumbContainer.innerHTML = '';

        navigationStack.forEach((level, index) => {
            const span = document.createElement('span');
            span.className = 'breadcrumb-item';
            span.innerText = level.name;

            if (index === navigationStack.length - 1) {
                span.classList.add('active');
            } else {
                // Allow clicking breadcrumb to jump back
                span.addEventListener('click', () => {
                    // Pop stack until we reach this index
                    navigationStack = navigationStack.slice(0, index + 1);
                    updateCurrentLevel();
                });
            }

            breadcrumbContainer.appendChild(span);

            // Add separator
            if (index < navigationStack.length - 1) {
                const sep = document.createElement('span');
                sep.className = 'breadcrumb-separator';
                sep.innerHTML = '<i class="fas fa-chevron-right"></i>';
                breadcrumbContainer.appendChild(sep);
            }
        });
    }

    // Close Modal
    function closeFileManager() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        navigationStack = []; // Reset
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeFileManager);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeFileManager();
    });

    // Render Files
    function renderFiles(items) {
        fileListContainer.innerHTML = '';

        if (items.length === 0) {
            fileListContainer.innerHTML = '<div style="text-align:center; color:var(--color-text-muted); margin-top:3rem;"><i class="fas fa-search" style="font-size:2rem; margin-bottom:1rem; opacity:0.5;"></i><p>No files found.</p></div>';
            if (fmFileCount) fmFileCount.innerText = '0 items';
            return;
        }

        const listClass = currentView === 'list' ? 'file-list-view' : 'file-grid-view';
        const wrapper = document.createElement('div');
        wrapper.className = listClass;

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'file-item';
            if (item.type === 'folder') el.classList.add('is-folder');

            let iconClass = 'fa-file';
            if (item.type === 'folder') iconClass = 'fa-folder';
            else if (item.type === 'pdf') iconClass = 'fa-file-pdf';
            else if (item.type === 'excel') iconClass = 'fa-file-excel';
            else if (item.type === 'word') iconClass = 'fa-file-word';
            else if (item.type === 'archive') iconClass = 'fa-file-archive';
            else if (item.type === 'video') iconClass = 'fa-file-video';
            else if (item.type === 'code') iconClass = 'fa-project-diagram';
            else if (item.type === 'link') iconClass = 'fa-external-link-alt';

            // Icon Color Logic
            let iconColorStyle = '';
            if (item.type === 'folder') iconColorStyle = 'color: #ffd700;'; // Gold for folders
            else if (item.type === 'video') iconColorStyle = 'color: #e74c3c;'; // Red for videos
            else if (item.type === 'link') iconColorStyle = 'color: #34a853;'; // Green for links

            el.innerHTML = `
        <div class="file-item-icon" style="${iconColorStyle}"><i class="fas ${iconClass}"></i></div>
        <div class="file-item-info">
          <span class="file-item-name">${item.name}</span>
          <span class="file-item-meta">${item.type === 'folder' ? 'Folder' : item.size + ' • ' + item.date}</span>
        </div>
        <div class="file-item-action">
            ${item.type === 'folder'
                    ? '<i class="fas fa-chevron-right"></i>'
                    : item.type === 'video'
                        ? '<i class="fas fa-play"></i>'
                        : item.type === 'link'
                            ? '<i class="fas fa-external-link-alt"></i>'
                            : '<i class="fas fa-download"></i>'}
        </div>
      `;

            // Click Action
            el.addEventListener('click', () => {
                if (item.type === 'folder') {
                    navigateToFolder(item.name, item.children || []);
                } else if (item.type === 'video') {
                    openVideoModal(item.name, item.url);
                } else {
                    window.open(item.url, '_blank');
                }
            });

            wrapper.appendChild(el);
        });

        fileListContainer.appendChild(wrapper);
        if (fmFileCount) fmFileCount.innerText = `${items.length} items`;
    }

    // Filter & Search
    function filterFiles() {
        const query = fmSearch.value.toLowerCase();
        const sortType = fmSort.value;

        // Always filter from the current stack top's items to avoid losing context
        const currentLevel = navigationStack[navigationStack.length - 1];
        if (!currentLevel) return;

        let filtered = currentLevel.items.filter(item =>
            item.name.toLowerCase().includes(query)
        );

        // Sort
        filtered.sort((a, b) => {
            // Always folders on top
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;

            if (sortType === 'name') return a.name.localeCompare(b.name);
            if (sortType === 'size') return parseFloat(a.size || 0) - parseFloat(b.size || 0);
            if (sortType === 'date') return new Date(b.date) - new Date(a.date);
            return 0;
        });

        // Update currentItems view only
        renderFiles(filtered);
    }

    if (fmSearch) fmSearch.addEventListener('input', filterFiles);
    if (fmSort) fmSort.addEventListener('change', filterFiles);

    // View Toggle
    if (viewListBtn && viewGridBtn) {
        viewListBtn.addEventListener('click', () => {
            currentView = 'list';
            viewListBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
            renderFiles(currentItems); // Re-render existing sorted/filtered list
        });

        viewGridBtn.addEventListener('click', () => {
            currentView = 'grid';
            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
            renderFiles(currentItems);
        });
    }

    // Video Player Modal Logic
    const videoModal = document.getElementById('videoPlayerModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const vpTitle = document.getElementById('vpTitle');
    const vpCloseCtx = document.getElementById('vpCloseCtx');

    function openVideoModal(title, url) {
        if (vpTitle) vpTitle.innerText = title;
        if (videoPlayer) {
            videoPlayer.src = url;
            videoPlayer.load();
            // Optional: videoPlayer.play();
        }
        if (videoModal) {
            videoModal.classList.add('active');
            // document.body.style.overflow is already set by fileManagerModal, but just in case
            document.body.style.overflow = 'hidden';
        }
    }

    function closeVideoModal() {
        if (videoModal) {
            videoModal.classList.remove('active');
            // Return to file manager scrolling context if file manager is active
            if (!document.getElementById('fileManagerModal').classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoPlayer.src = "";
        }
    }

    if (vpCloseCtx) {
        vpCloseCtx.addEventListener('click', closeVideoModal);
    }

    // Close on background click
    window.addEventListener('click', (e) => {
        if (e.target === videoModal) closeVideoModal();
    });

});
