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
        'Geotechnical Engineer',
        'M.Sc. Student — Politecnico di Milano',
        'Foundation Design Specialist',
        'Soil Mechanics Enthusiast'
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
            "name": "Engineering Ethics.pdf",
            "type": "pdf",
            "size": "42.6 KB",
            "date": "2019-11-23",
            "url": "documents/academic/academic-notes/Engineering Ethics.pdf"
        },
        {
            "name": "Geotechnical Engineering 2.pdf",
            "type": "pdf",
            "size": "12.6 MB",
            "date": "2020-06-05",
            "url": "documents/academic/academic-notes/Geotechnical Engineering 2.pdf"
        },
        {
            "name": "irrigation.pdf",
            "type": "pdf",
            "size": "10.2 MB",
            "date": "2020-03-16",
            "url": "documents/academic/academic-notes/irrigation.pdf"
        },
        {
            "name": "Structural Analysis - R C Hibbeler.pdf",
            "type": "pdf",
            "size": "38.2 MB",
            "date": "2025-07-26",
            "url": "documents/academic/academic-notes/Structural Analysis - R C Hibbeler.pdf"
        },
        {
            "name": "Structural Engineering 3.pdf",
            "type": "pdf",
            "size": "9.5 MB",
            "date": "2023-10-03",
            "url": "documents/academic/academic-notes/Structural Engineering 3.pdf"
        },
        {
            "name": "Structural Engineering v.pdf",
            "type": "pdf",
            "size": "7.4 MB",
            "date": "2020-03-16",
            "url": "documents/academic/academic-notes/Structural Engineering v.pdf"
        },
        {
            "name": "transportation dovuments.rar",
            "type": "archive",
            "size": "1.2 MB",
            "date": "2026-02-11",
            "url": "documents/academic/academic-notes/transportation dovuments.rar"
        }
    ],
    "softwares": [
        {
            "name": "3dec520_290.rar",
            "type": "archive",
            "size": "65.8 MB",
            "date": "2026-02-16",
            "url": "documents/academic/softwares/3dec520_290.rar"
        },
        {
            "name": "CRISIS_2008_V4.2.ZIP",
            "type": "archive",
            "size": "108.6 MB",
            "date": "2026-01-19",
            "url": "documents/academic/softwares/CRISIS_2008_V4.2.ZIP"
        },
        {
            "name": "DEEPSOIL 7.0.rar",
            "type": "archive",
            "size": "316.7 MB",
            "date": "2026-02-16",
            "url": "documents/academic/softwares/DEEPSOIL 7.0.rar"
        },
        {
            "name": "Degtrav10.4.zip",
            "type": "archive",
            "size": "7.1 MB",
            "date": "2025-09-15",
            "url": "documents/academic/softwares/Degtrav10.4.zip"
        },
        {
            "name": "globalmapper19.rar",
            "type": "archive",
            "size": "384 MB",
            "date": "2026-02-16",
            "url": "documents/academic/softwares/globalmapper19.rar"
        },
        {
            "name": "Nitro PDF Pro v7.2.0.12 [x32 & x64] [h33t.com] Full.rar",
            "type": "archive",
            "size": "90.4 MB",
            "date": "2026-02-16",
            "url": "documents/academic/softwares/Nitro PDF Pro v7.2.0.12 [x32 & x64] [h33t.com] Full.rar"
        },
        {
            "name": "Spettri-NTCver.1.0.3.xlsx",
            "type": "excel",
            "size": "19.5 MB",
            "date": "2026-01-21",
            "url": "documents/academic/softwares/Spettri-NTCver.1.0.3.xlsx"
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
            "date": "2026-02-18",
            "children": [
                {
                    "name": "Books & Notes",
                    "type": "folder",
                    "size": "-",
                    "date": "2026-02-18",
                    "children": [
                        {
                            "name": "02. Books _ Notes",
                            "type": "folder",
                            "size": "-",
                            "date": "2026-02-18",
                            "children": [
                                {
                                    "name": "Design of Concrete Structures 13th Ed- A.H.Nilson.pdf",
                                    "type": "pdf",
                                    "size": "39.8 MB",
                                    "date": "2021-08-15",
                                    "url": "documents/academic/Courses/ETABS/Books & Notes/02. Books _ Notes/Design of Concrete Structures 13th Ed- A.H.Nilson.pdf"
                                },
                                {
                                    "name": "Joseph_E._Bowles_Foundation_Analysis_and_Design.pdf",
                                    "type": "pdf",
                                    "size": "57.2 MB",
                                    "date": "2022-01-03",
                                    "url": "documents/academic/Courses/ETABS/Books & Notes/02. Books _ Notes/Joseph_E._Bowles_Foundation_Analysis_and_Design.pdf"
                                },
                                {
                                    "name": "RC Design I.pdf",
                                    "type": "pdf",
                                    "size": "1.1 MB",
                                    "date": "2018-04-08",
                                    "url": "documents/academic/Courses/ETABS/Books & Notes/02. Books _ Notes/RC Design I.pdf"
                                },
                                {
                                    "name": "RC Design II.pdf",
                                    "type": "pdf",
                                    "size": "2.4 MB",
                                    "date": "2019-10-15",
                                    "url": "documents/academic/Courses/ETABS/Books & Notes/02. Books _ Notes/RC Design II.pdf"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Class 2",
                    "type": "folder",
                    "size": "-",
                    "date": "2026-02-18",
                    "children": [
                        {
                            "name": "Screenshot (33).png",
                            "type": "code",
                            "size": "963.7 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (33).png"
                        },
                        {
                            "name": "Screenshot (34).png",
                            "type": "code",
                            "size": "697 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (34).png"
                        },
                        {
                            "name": "Screenshot (35).png",
                            "type": "code",
                            "size": "1.9 MB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (35).png"
                        },
                        {
                            "name": "Screenshot (36).png",
                            "type": "code",
                            "size": "486.2 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (36).png"
                        },
                        {
                            "name": "Screenshot (37).png",
                            "type": "code",
                            "size": "744.6 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (37).png"
                        },
                        {
                            "name": "Screenshot (38).png",
                            "type": "code",
                            "size": "622.6 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (38).png"
                        },
                        {
                            "name": "Screenshot (39).png",
                            "type": "code",
                            "size": "861.4 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (39).png"
                        },
                        {
                            "name": "Screenshot (40).png",
                            "type": "code",
                            "size": "677.3 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (40).png"
                        },
                        {
                            "name": "Screenshot (41).png",
                            "type": "code",
                            "size": "690.4 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (41).png"
                        },
                        {
                            "name": "Screenshot (42).png",
                            "type": "code",
                            "size": "762.8 KB",
                            "date": "2023-06-15",
                            "url": "documents/academic/Courses/ETABS/Class 2/Screenshot (42).png"
                        }
                    ]
                },
                {
                    "name": "Class 4",
                    "type": "folder",
                    "size": "-",
                    "date": "2026-02-18",
                    "children": [
                        {
                            "name": "class 4.$et",
                            "type": "code",
                            "size": "24.8 KB",
                            "date": "2023-07-06",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 4.$et"
                        },
                        {
                            "name": "class 4.ebk",
                            "type": "code",
                            "size": "43 KB",
                            "date": "2023-07-06",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 4.ebk"
                        },
                        {
                            "name": "class 4.EDB",
                            "type": "code",
                            "size": "43 KB",
                            "date": "2023-07-06",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 4.EDB"
                        },
                        {
                            "name": "class 4.ico",
                            "type": "code",
                            "size": "2.7 KB",
                            "date": "2023-07-06",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 4.ico"
                        },
                        {
                            "name": "class 5.$et",
                            "type": "code",
                            "size": "11.9 KB",
                            "date": "2023-07-06",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 5.$et"
                        },
                        {
                            "name": "class 5.ebk",
                            "type": "code",
                            "size": "33.1 KB",
                            "date": "2023-07-06",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 5.ebk"
                        },
                        {
                            "name": "class 5.EDB",
                            "type": "code",
                            "size": "33.5 KB",
                            "date": "2023-07-06",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 5.EDB"
                        },
                        {
                            "name": "class 5.ico",
                            "type": "code",
                            "size": "2.2 KB",
                            "date": "2023-07-06",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 5.ico"
                        },
                        {
                            "name": "class 6.$et",
                            "type": "code",
                            "size": "12.4 KB",
                            "date": "2023-07-10",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 6.$et"
                        },
                        {
                            "name": "class 6.EDB",
                            "type": "code",
                            "size": "34.4 KB",
                            "date": "2023-07-10",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 6.EDB"
                        },
                        {
                            "name": "class 6.ico",
                            "type": "code",
                            "size": "2.2 KB",
                            "date": "2023-07-10",
                            "url": "documents/academic/Courses/ETABS/Class 4/class 6.ico"
                        }
                    ]
                },
                {
                    "name": "Codes",
                    "type": "folder",
                    "size": "-",
                    "date": "2026-02-18",
                    "children": [
                        {
                            "name": "01. Codes",
                            "type": "folder",
                            "size": "-",
                            "date": "2026-02-18",
                            "children": [
                                {
                                    "name": "BNBC_June_2017_All Word File",
                                    "type": "folder",
                                    "size": "-",
                                    "date": "2026-02-18",
                                    "children": [
                                        {
                                            "name": "Volume_1",
                                            "type": "folder",
                                            "size": "-",
                                            "date": "2026-02-18",
                                            "children": [
                                                {
                                                    "name": "Part_1",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "2 TABLE OF CONTENTS-1_DONE.docx",
                                                            "type": "word",
                                                            "size": "23.5 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_1/2 TABLE OF CONTENTS-1_DONE.docx"
                                                        },
                                                        {
                                                            "name": "3 Part 1-Chap 1 to 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "36.5 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_1/3 Part 1-Chap 1 to 3_DONE.docx"
                                                        },
                                                        {
                                                            "name": "3 Part 1-Chap 1_DONE.docx",
                                                            "type": "word",
                                                            "size": "26 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_1/3 Part 1-Chap 1_DONE.docx"
                                                        },
                                                        {
                                                            "name": "4 Part 1-Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "28.9 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_1/4 Part 1-Chap 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "5 Part 1-Chap 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "28.6 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_1/5 Part 1-Chap 3_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Part_2",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "1 Seperator Part 2.docx",
                                                            "type": "word",
                                                            "size": "14.9 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/1 Seperator Part 2.docx"
                                                        },
                                                        {
                                                            "name": "10 BNBC_Part2_Appendix_E_DONE.docx",
                                                            "type": "word",
                                                            "size": "21.6 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/10 BNBC_Part2_Appendix_E_DONE.docx"
                                                        },
                                                        {
                                                            "name": "11 BNBC_Part2_Appendix_F_DONE.docx",
                                                            "type": "word",
                                                            "size": "21.1 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/11 BNBC_Part2_Appendix_F_DONE.docx"
                                                        },
                                                        {
                                                            "name": "2 TABLE_OF_CONTENTS-2_DONE.docx",
                                                            "type": "word",
                                                            "size": "26.2 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/2 TABLE_OF_CONTENTS-2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "3 Part 2-Chap 1 to 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "37.9 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/3 Part 2-Chap 1 to 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "4 BNBC_Part2_Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "36 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/4 BNBC_Part2_Chap 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "5 BNBC_Part2_Chap 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "39.1 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/5 BNBC_Part2_Chap 3_DONE.docx"
                                                        },
                                                        {
                                                            "name": "6 BNBC_Part2_Appendix_A_DONE.docx",
                                                            "type": "word",
                                                            "size": "22 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/6 BNBC_Part2_Appendix_A_DONE.docx"
                                                        },
                                                        {
                                                            "name": "7 BNBC_Part2_Appendix_B_DONE.docx",
                                                            "type": "word",
                                                            "size": "20.9 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/7 BNBC_Part2_Appendix_B_DONE.docx"
                                                        },
                                                        {
                                                            "name": "8 BNBC_Part2_Appendix_C_DONE.docx",
                                                            "type": "word",
                                                            "size": "20.9 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/8 BNBC_Part2_Appendix_C_DONE.docx"
                                                        },
                                                        {
                                                            "name": "9 BNBC_Part2_Appendix_D_DONE.docx",
                                                            "type": "word",
                                                            "size": "20.9 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_2/9 BNBC_Part2_Appendix_D_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Part_3",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "1 separator part 3.docx",
                                                            "type": "word",
                                                            "size": "14.3 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/1 separator part 3.docx"
                                                        },
                                                        {
                                                            "name": "10 BNBC_Part3_App D_Accessibility_DONE.docx",
                                                            "type": "word",
                                                            "size": "2.3 MB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/10 BNBC_Part3_App D_Accessibility_DONE.docx"
                                                        },
                                                        {
                                                            "name": "11 BNBC_Part3_App E_ Building Type_DONE.docx",
                                                            "type": "word",
                                                            "size": "337.4 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/11 BNBC_Part3_App E_ Building Type_DONE.docx"
                                                        },
                                                        {
                                                            "name": "12 BNBC_Part3_App F_Offstreet parking_DONE.docx",
                                                            "type": "word",
                                                            "size": "914.9 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/12 BNBC_Part3_App F_Offstreet parking_DONE.docx"
                                                        },
                                                        {
                                                            "name": "2 TABLE OF CONTENTS-3_DONE.docx",
                                                            "type": "word",
                                                            "size": "33.5 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/2 TABLE OF CONTENTS-3_DONE.docx"
                                                        },
                                                        {
                                                            "name": "3 BNBC_Part3_Chap 1_DONE.docx",
                                                            "type": "word",
                                                            "size": "464.6 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/3 BNBC_Part3_Chap 1_DONE.docx"
                                                        },
                                                        {
                                                            "name": "4 BNBC_Part3_Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "1007 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/4 BNBC_Part3_Chap 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "5 BNBC_Part3_Chap 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "50.7 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/5 BNBC_Part3_Chap 3_DONE.docx"
                                                        },
                                                        {
                                                            "name": "6 BNBC_Part3_Chap 4_DONE.docx",
                                                            "type": "word",
                                                            "size": "135.6 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/6 BNBC_Part3_Chap 4_DONE.docx"
                                                        },
                                                        {
                                                            "name": "7 BNBC_Part3_App A_ Development Control_DONE.docx",
                                                            "type": "word",
                                                            "size": "34.7 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/7 BNBC_Part3_App A_ Development Control_DONE.docx"
                                                        },
                                                        {
                                                            "name": "8 BNBC_Part3_App B_min std housing_DONE.docx",
                                                            "type": "word",
                                                            "size": "285.7 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/8 BNBC_Part3_App B_min std housing_DONE.docx"
                                                        },
                                                        {
                                                            "name": "9 BNBC_Part3_App C_ Cluster housing_DONE.docx",
                                                            "type": "word",
                                                            "size": "338.7 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_3/9 BNBC_Part3_App C_ Cluster housing_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Part_4",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "1 Seperator part 4.docx",
                                                            "type": "word",
                                                            "size": "15 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/1 Seperator part 4.docx"
                                                        },
                                                        {
                                                            "name": "10 BNBC_Part4_App C_DONE.docx",
                                                            "type": "word",
                                                            "size": "27.9 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/10 BNBC_Part4_App C_DONE.docx"
                                                        },
                                                        {
                                                            "name": "2 TABLE OF CONTENTS Part-4.docx",
                                                            "type": "word",
                                                            "size": "28.8 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/2 TABLE OF CONTENTS Part-4.docx"
                                                        },
                                                        {
                                                            "name": "3 BNBC_Part4_Chap 1_DONE.docx",
                                                            "type": "word",
                                                            "size": "37.2 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/3 BNBC_Part4_Chap 1_DONE.docx"
                                                        },
                                                        {
                                                            "name": "4 BNBC_Part4_Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "49.6 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/4 BNBC_Part4_Chap 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "5 BNBC_Part4_Chap 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "57.6 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/5 BNBC_Part4_Chap 3_DONE.docx"
                                                        },
                                                        {
                                                            "name": "6 BNBC_Part4_Chap 4_DONE.docx",
                                                            "type": "word",
                                                            "size": "78.2 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/6 BNBC_Part4_Chap 4_DONE.docx"
                                                        },
                                                        {
                                                            "name": "7_Final_Part4_Chap 5_DONE.docx",
                                                            "type": "word",
                                                            "size": "39.4 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/7_Final_Part4_Chap 5_DONE.docx"
                                                        },
                                                        {
                                                            "name": "8 BNBC_Part4_App A_DONE.docx",
                                                            "type": "word",
                                                            "size": "38.8 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/8 BNBC_Part4_App A_DONE.docx"
                                                        },
                                                        {
                                                            "name": "9 BNBC_Part4_App B_DONE.docx",
                                                            "type": "word",
                                                            "size": "35.5 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_4/9 BNBC_Part4_App B_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Part_5",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "1 Seperator Part 5.docx",
                                                            "type": "word",
                                                            "size": "14.7 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_5/1 Seperator Part 5.docx"
                                                        },
                                                        {
                                                            "name": "2 TABLE OF CONTENTS-5.docx",
                                                            "type": "word",
                                                            "size": "33 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_5/2 TABLE OF CONTENTS-5.docx"
                                                        },
                                                        {
                                                            "name": "3 BNBC_Part5_Chap 1_DONE.doc",
                                                            "type": "word",
                                                            "size": "60.5 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_5/3 BNBC_Part5_Chap 1_DONE.doc"
                                                        },
                                                        {
                                                            "name": "4 BNBC_Part5_Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "155.1 KB",
                                                            "date": "2018-12-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Part_5/4 BNBC_Part5_Chap 2_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Index_Volume_1.docx.docx",
                                                    "type": "word",
                                                    "size": "118.9 KB",
                                                    "date": "2018-12-17",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_1/Index_Volume_1.docx.docx"
                                                }
                                            ]
                                        },
                                        {
                                            "name": "Volume_2",
                                            "type": "folder",
                                            "size": "-",
                                            "date": "2026-02-18",
                                            "children": [
                                                {
                                                    "name": "~$BNBC_Part6_Chap 1_KMA_DONE.docx",
                                                    "type": "word",
                                                    "size": "162 B",
                                                    "date": "2021-07-16",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/~$BNBC_Part6_Chap 1_KMA_DONE.docx"
                                                },
                                                {
                                                    "name": "~$BNBC_Part6_Chap 2_KMA_DONE.docx",
                                                    "type": "word",
                                                    "size": "162 B",
                                                    "date": "2021-07-16",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/~$BNBC_Part6_Chap 2_KMA_DONE.docx"
                                                },
                                                {
                                                    "name": "10 BNBC_Part 6_Chap 8_DONE.docx",
                                                    "type": "word",
                                                    "size": "1.5 MB",
                                                    "date": "2018-12-17",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/10 BNBC_Part 6_Chap 8_DONE.docx"
                                                },
                                                {
                                                    "name": "11 BNBC_Part 6_Chap 9_DONE.docx",
                                                    "type": "word",
                                                    "size": "166 KB",
                                                    "date": "2017-06-23",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/11 BNBC_Part 6_Chap 9_DONE.docx"
                                                },
                                                {
                                                    "name": "12 BNBC_Part 6_Chap 10_1st Part_DONE.docx",
                                                    "type": "word",
                                                    "size": "1.8 MB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/12 BNBC_Part 6_Chap 10_1st Part_DONE.docx"
                                                },
                                                {
                                                    "name": "13 BNBC_Part 6_Chap 10 _ 2nd Part_DONE.docx",
                                                    "type": "word",
                                                    "size": "1.4 MB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/13 BNBC_Part 6_Chap 10 _ 2nd Part_DONE.docx"
                                                },
                                                {
                                                    "name": "14 BNBC_Part 6_Chap 11_DONE.docx",
                                                    "type": "word",
                                                    "size": "1 MB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/14 BNBC_Part 6_Chap 11_DONE.docx"
                                                },
                                                {
                                                    "name": "15 BNBC_Part 6_Chap 12_DONE.docx",
                                                    "type": "word",
                                                    "size": "541.9 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/15 BNBC_Part 6_Chap 12_DONE.docx"
                                                },
                                                {
                                                    "name": "16 BNBC_Part 6_Chap 13_DONE.docx",
                                                    "type": "word",
                                                    "size": "88.2 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/16 BNBC_Part 6_Chap 13_DONE.docx"
                                                },
                                                {
                                                    "name": "17 BNBC_Part6_App_A_DONE.docx",
                                                    "type": "word",
                                                    "size": "359.1 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/17 BNBC_Part6_App_A_DONE.docx"
                                                },
                                                {
                                                    "name": "18 BNBC_Part6_App_B_DONE.docx",
                                                    "type": "word",
                                                    "size": "625.2 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/18 BNBC_Part6_App_B_DONE.docx"
                                                },
                                                {
                                                    "name": "19 BNBC_Part6_App_C_DONE.docx",
                                                    "type": "word",
                                                    "size": "33.4 KB",
                                                    "date": "2015-08-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/19 BNBC_Part6_App_C_DONE.docx"
                                                },
                                                {
                                                    "name": "2 TABLE OF CONTENTS-6_DONE.docx",
                                                    "type": "word",
                                                    "size": "46.9 KB",
                                                    "date": "2017-06-23",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/2 TABLE OF CONTENTS-6_DONE.docx"
                                                },
                                                {
                                                    "name": "20 BNBC_Part6_App_D_DONE.docx",
                                                    "type": "word",
                                                    "size": "3 MB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/20 BNBC_Part6_App_D_DONE.docx"
                                                },
                                                {
                                                    "name": "21 BNBC_Part6_App_E_DONE.docx",
                                                    "type": "word",
                                                    "size": "32.1 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/21 BNBC_Part6_App_E_DONE.docx"
                                                },
                                                {
                                                    "name": "22 BNBC_Part6_App_F_DONE.docx",
                                                    "type": "word",
                                                    "size": "1.3 MB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/22 BNBC_Part6_App_F_DONE.docx"
                                                },
                                                {
                                                    "name": "23 BNBC_Part6_App_G_DONE.docx",
                                                    "type": "word",
                                                    "size": "243.6 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/23 BNBC_Part6_App_G_DONE.docx"
                                                },
                                                {
                                                    "name": "24 BNBC_Part6_App_H_DONE.docx",
                                                    "type": "word",
                                                    "size": "37.8 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/24 BNBC_Part6_App_H_DONE.docx"
                                                },
                                                {
                                                    "name": "25 BNBC_Part6_App_I_DONE.docx",
                                                    "type": "word",
                                                    "size": "410.5 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/25 BNBC_Part6_App_I_DONE.docx"
                                                },
                                                {
                                                    "name": "26 BNBC_Part6_App_J_DONE.docx",
                                                    "type": "word",
                                                    "size": "205.5 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/26 BNBC_Part6_App_J_DONE.docx"
                                                },
                                                {
                                                    "name": "27 BNBC_Part6_App_K_DONE.docx",
                                                    "type": "word",
                                                    "size": "997.9 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/27 BNBC_Part6_App_K_DONE.docx"
                                                },
                                                {
                                                    "name": "28 BNBC_Part6_App_L_DONE.docx",
                                                    "type": "word",
                                                    "size": "32.6 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/28 BNBC_Part6_App_L_DONE.docx"
                                                },
                                                {
                                                    "name": "29 BNBC_Part6_App_M_DONE.docx",
                                                    "type": "word",
                                                    "size": "1.4 MB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/29 BNBC_Part6_App_M_DONE.docx"
                                                },
                                                {
                                                    "name": "3 BNBC_Part6_Chap 1_KMA_DONE.docx",
                                                    "type": "word",
                                                    "size": "119 KB",
                                                    "date": "2018-03-27",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/3 BNBC_Part6_Chap 1_KMA_DONE.docx"
                                                },
                                                {
                                                    "name": "30 BNBC_Part6_App_N_DONE.docx",
                                                    "type": "word",
                                                    "size": "33.8 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/30 BNBC_Part6_App_N_DONE.docx"
                                                },
                                                {
                                                    "name": "31 BNBC_Part6_App_O_DONE.docx",
                                                    "type": "word",
                                                    "size": "45.8 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/31 BNBC_Part6_App_O_DONE.docx"
                                                },
                                                {
                                                    "name": "32 BNBC_Part6_App_P_DONE.docx",
                                                    "type": "word",
                                                    "size": "31.5 KB",
                                                    "date": "2015-07-08",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/32 BNBC_Part6_App_P_DONE.docx"
                                                },
                                                {
                                                    "name": "33 BNBC_Part6_App_Q_DONE.docx",
                                                    "type": "word",
                                                    "size": "43.8 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/33 BNBC_Part6_App_Q_DONE.docx"
                                                },
                                                {
                                                    "name": "34 BNBC_Part6_App_R_DONE.docx",
                                                    "type": "word",
                                                    "size": "44.1 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/34 BNBC_Part6_App_R_DONE.docx"
                                                },
                                                {
                                                    "name": "35 BNBC_Part6_App_S_DONE.docx",
                                                    "type": "word",
                                                    "size": "37.8 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/35 BNBC_Part6_App_S_DONE.docx"
                                                },
                                                {
                                                    "name": "36 BNBC_Part6_App_T_DONE.docx",
                                                    "type": "word",
                                                    "size": "31.5 KB",
                                                    "date": "2017-06-03",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/36 BNBC_Part6_App_T_DONE.docx"
                                                },
                                                {
                                                    "name": "37 BNBC_Part6_App_U_DONE.docx",
                                                    "type": "word",
                                                    "size": "33.7 KB",
                                                    "date": "2015-07-08",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/37 BNBC_Part6_App_U_DONE.docx"
                                                },
                                                {
                                                    "name": "4 BNBC_Part6_Chap 2_KMA_DONE.docx",
                                                    "type": "word",
                                                    "size": "13.6 MB",
                                                    "date": "2018-03-13",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/4 BNBC_Part6_Chap 2_KMA_DONE.docx"
                                                },
                                                {
                                                    "name": "5 BNBC_Part6_Chap 3_DONE.docx",
                                                    "type": "word",
                                                    "size": "891.7 KB",
                                                    "date": "2017-06-21",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/5 BNBC_Part6_Chap 3_DONE.docx"
                                                },
                                                {
                                                    "name": "6 BNBC_Part6_Chap 4_DONE.docx",
                                                    "type": "word",
                                                    "size": "331.1 KB",
                                                    "date": "2017-06-23",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/6 BNBC_Part6_Chap 4_DONE.docx"
                                                },
                                                {
                                                    "name": "7 BNBC_Part6_Chap 5_DONE.docx",
                                                    "type": "word",
                                                    "size": "1.3 MB",
                                                    "date": "2018-01-27",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/7 BNBC_Part6_Chap 5_DONE.docx"
                                                },
                                                {
                                                    "name": "8 BNBC_Part 6_Chap 6_DONE.docx",
                                                    "type": "word",
                                                    "size": "1.2 MB",
                                                    "date": "2018-03-13",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/8 BNBC_Part 6_Chap 6_DONE.docx"
                                                },
                                                {
                                                    "name": "9 BNBC_Part6_Chap 7_DONE.docx",
                                                    "type": "word",
                                                    "size": "1.5 MB",
                                                    "date": "2017-06-23",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/9 BNBC_Part6_Chap 7_DONE.docx"
                                                },
                                                {
                                                    "name": "Index_Volume_2.docx.docx",
                                                    "type": "word",
                                                    "size": "118.9 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_2/Index_Volume_2.docx.docx"
                                                }
                                            ]
                                        },
                                        {
                                            "name": "Volume_3",
                                            "type": "folder",
                                            "size": "-",
                                            "date": "2026-02-18",
                                            "children": [
                                                {
                                                    "name": "Part_10",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "1 Seperator part 10.docx",
                                                            "type": "word",
                                                            "size": "14.7 KB",
                                                            "date": "2015-07-15",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_10/1 Seperator part 10.docx"
                                                        },
                                                        {
                                                            "name": "2 TABLE OF CONTENTS-10_DONE.docx",
                                                            "type": "word",
                                                            "size": "23.2 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_10/2 TABLE OF CONTENTS-10_DONE.docx"
                                                        },
                                                        {
                                                            "name": "3 BNBC_Part10_Chap 1_DONE.docx",
                                                            "type": "word",
                                                            "size": "58.1 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_10/3 BNBC_Part10_Chap 1_DONE.docx"
                                                        },
                                                        {
                                                            "name": "4 BNBC_Part10_Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "25.4 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_10/4 BNBC_Part10_Chap 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "5 BNBC_Part10_Chap 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "32.4 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_10/5 BNBC_Part10_Chap 3_DONE.docx"
                                                        },
                                                        {
                                                            "name": "6 BNBC_Part10_Append A_DONE.docx",
                                                            "type": "word",
                                                            "size": "34.4 KB",
                                                            "date": "2017-06-04",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_10/6 BNBC_Part10_Append A_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Part_7",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "2 TABLE OF CONTENTS-7_DONE.docx",
                                                            "type": "word",
                                                            "size": "31.8 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_7/2 TABLE OF CONTENTS-7_DONE.docx"
                                                        },
                                                        {
                                                            "name": "3 BNBC_Part7_Chap 1_DONE.docx",
                                                            "type": "word",
                                                            "size": "49.2 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_7/3 BNBC_Part7_Chap 1_DONE.docx"
                                                        },
                                                        {
                                                            "name": "4 BNBC_Part7_Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "49.2 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_7/4 BNBC_Part7_Chap 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "5 BNBC_Part7_Chap 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "67 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_7/5 BNBC_Part7_Chap 3_DONE.docx"
                                                        },
                                                        {
                                                            "name": "6 BNBC_Part7_Chap 4_DONE.docx",
                                                            "type": "word",
                                                            "size": "42.2 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_7/6 BNBC_Part7_Chap 4_DONE.docx"
                                                        },
                                                        {
                                                            "name": "7 BNBC_Part7_Chap 5_DONE.docx",
                                                            "type": "word",
                                                            "size": "44.3 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_7/7 BNBC_Part7_Chap 5_DONE.docx"
                                                        },
                                                        {
                                                            "name": "8 Appendix A_ Part 7_DONE.docx",
                                                            "type": "word",
                                                            "size": "30.3 KB",
                                                            "date": "2017-06-03",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_7/8 Appendix A_ Part 7_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Part_8",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "1 Seperator Part 8.docx",
                                                            "type": "word",
                                                            "size": "14.9 KB",
                                                            "date": "2015-07-15",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/1 Seperator Part 8.docx"
                                                        },
                                                        {
                                                            "name": "10 BNBC_Part8_Chap 8_DONE.docx",
                                                            "type": "word",
                                                            "size": "58.2 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/10 BNBC_Part8_Chap 8_DONE.docx"
                                                        },
                                                        {
                                                            "name": "11 BNBC_Part8_App_A_DONE.docx",
                                                            "type": "word",
                                                            "size": "28.6 KB",
                                                            "date": "2017-06-06",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/11 BNBC_Part8_App_A_DONE.docx"
                                                        },
                                                        {
                                                            "name": "12 BNBC_Part8_App_B_DONE.docx",
                                                            "type": "word",
                                                            "size": "31.3 KB",
                                                            "date": "2017-06-06",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/12 BNBC_Part8_App_B_DONE.docx"
                                                        },
                                                        {
                                                            "name": "13 BNBC_Part8_App_C_DONE.docx",
                                                            "type": "word",
                                                            "size": "30.9 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/13 BNBC_Part8_App_C_DONE.docx"
                                                        },
                                                        {
                                                            "name": "14 BNBC_Part8_App_D_DONE.docx",
                                                            "type": "word",
                                                            "size": "5.4 MB",
                                                            "date": "2017-06-04",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/14 BNBC_Part8_App_D_DONE.docx"
                                                        },
                                                        {
                                                            "name": "15 BNBC_Part8_App_E_DONE.docx",
                                                            "type": "word",
                                                            "size": "4.9 MB",
                                                            "date": "2015-07-13",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/15 BNBC_Part8_App_E_DONE.docx"
                                                        },
                                                        {
                                                            "name": "16 BNBC_Part8_App_F_DONE.docx",
                                                            "type": "word",
                                                            "size": "4.6 MB",
                                                            "date": "2015-07-13",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/16 BNBC_Part8_App_F_DONE.docx"
                                                        },
                                                        {
                                                            "name": "17 BNBC_Part8_App_G_DONE.docx",
                                                            "type": "word",
                                                            "size": "4.8 MB",
                                                            "date": "2015-07-14",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/17 BNBC_Part8_App_G_DONE.docx"
                                                        },
                                                        {
                                                            "name": "18 BNBC_Part8_App_H_DONE.docx",
                                                            "type": "word",
                                                            "size": "5 MB",
                                                            "date": "2015-07-14",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/18 BNBC_Part8_App_H_DONE.docx"
                                                        },
                                                        {
                                                            "name": "19 BNBC_Part8_App_I_DONE.docx",
                                                            "type": "word",
                                                            "size": "5.5 MB",
                                                            "date": "2015-07-13",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/19 BNBC_Part8_App_I_DONE.docx"
                                                        },
                                                        {
                                                            "name": "2 TABLE OF CONTENTS-8 M_DONE.docx",
                                                            "type": "word",
                                                            "size": "37.3 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/2 TABLE OF CONTENTS-8 M_DONE.docx"
                                                        },
                                                        {
                                                            "name": "20 BNBC_Part8_App_J_DONE.docx",
                                                            "type": "word",
                                                            "size": "4.6 MB",
                                                            "date": "2015-07-13",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/20 BNBC_Part8_App_J_DONE.docx"
                                                        },
                                                        {
                                                            "name": "21 BNBC_Part8_App_K_DONE.docx",
                                                            "type": "word",
                                                            "size": "4.7 MB",
                                                            "date": "2015-07-13",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/21 BNBC_Part8_App_K_DONE.docx"
                                                        },
                                                        {
                                                            "name": "22 BNBC_Part8_App_L_DONE.docx",
                                                            "type": "word",
                                                            "size": "19.5 KB",
                                                            "date": "2017-06-04",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/22 BNBC_Part8_App_L_DONE.docx"
                                                        },
                                                        {
                                                            "name": "23 BNBC_Part8_App_M_DONE.docx",
                                                            "type": "word",
                                                            "size": "18.7 KB",
                                                            "date": "2015-07-20",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/23 BNBC_Part8_App_M_DONE.docx"
                                                        },
                                                        {
                                                            "name": "24 BNBC_Part8_App_N_DONE.docx",
                                                            "type": "word",
                                                            "size": "18.2 KB",
                                                            "date": "2017-06-06",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/24 BNBC_Part8_App_N_DONE.docx"
                                                        },
                                                        {
                                                            "name": "25 BNBC_Part8_App_O_DONE.docx",
                                                            "type": "word",
                                                            "size": "1 MB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/25 BNBC_Part8_App_O_DONE.docx"
                                                        },
                                                        {
                                                            "name": "26 BNBC_Part8_App_P_DONE.docx",
                                                            "type": "word",
                                                            "size": "19.2 KB",
                                                            "date": "2015-08-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/26 BNBC_Part8_App_P_DONE.docx"
                                                        },
                                                        {
                                                            "name": "27 BNBC_Part8_App_Q_DONE.docx",
                                                            "type": "word",
                                                            "size": "25.7 KB",
                                                            "date": "2015-07-15",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/27 BNBC_Part8_App_Q_DONE.docx"
                                                        },
                                                        {
                                                            "name": "28 BNBC_Part8_App_R_DONE.docx",
                                                            "type": "word",
                                                            "size": "1.6 MB",
                                                            "date": "2017-06-06",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/28 BNBC_Part8_App_R_DONE.docx"
                                                        },
                                                        {
                                                            "name": "29 BNBC_Part8_App_S_DONE.docx",
                                                            "type": "word",
                                                            "size": "26.7 KB",
                                                            "date": "2017-06-06",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/29 BNBC_Part8_App_S_DONE.docx"
                                                        },
                                                        {
                                                            "name": "3 BNBC_Part8_Chap 1_DONE.docx",
                                                            "type": "word",
                                                            "size": "879.6 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/3 BNBC_Part8_Chap 1_DONE.docx"
                                                        },
                                                        {
                                                            "name": "30 BNBC_Part8_App_T_DONE.docx",
                                                            "type": "word",
                                                            "size": "25.2 KB",
                                                            "date": "2015-07-15",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/30 BNBC_Part8_App_T_DONE.docx"
                                                        },
                                                        {
                                                            "name": "31 BNBC_Part8_App_U_DONE.docx",
                                                            "type": "word",
                                                            "size": "78.1 KB",
                                                            "date": "2015-07-15",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/31 BNBC_Part8_App_U_DONE.docx"
                                                        },
                                                        {
                                                            "name": "32 BNBC_Part 8_App_V_DONE.docx",
                                                            "type": "word",
                                                            "size": "18.3 KB",
                                                            "date": "2015-08-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/32 BNBC_Part 8_App_V_DONE.docx"
                                                        },
                                                        {
                                                            "name": "33 BNBC_Part 8_App_W_DONE.docx",
                                                            "type": "word",
                                                            "size": "18.1 KB",
                                                            "date": "2015-08-17",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/33 BNBC_Part 8_App_W_DONE.docx"
                                                        },
                                                        {
                                                            "name": "4 BNBC_Part8_Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "127.1 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/4 BNBC_Part8_Chap 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "5 BNBC_Part8_Chap 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "311.9 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/5 BNBC_Part8_Chap 3_DONE.docx"
                                                        },
                                                        {
                                                            "name": "6 BNBC_Part8_Chap 4_DONE.docx",
                                                            "type": "word",
                                                            "size": "607 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/6 BNBC_Part8_Chap 4_DONE.docx"
                                                        },
                                                        {
                                                            "name": "7 BNBC_Part8_Chap 5_DONE.docx",
                                                            "type": "word",
                                                            "size": "90.9 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/7 BNBC_Part8_Chap 5_DONE.docx"
                                                        },
                                                        {
                                                            "name": "8 BNBC_Part8_Chap 6_DONE.docx",
                                                            "type": "word",
                                                            "size": "1.6 MB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/8 BNBC_Part8_Chap 6_DONE.docx"
                                                        },
                                                        {
                                                            "name": "9 BNBC_Part8_Chap 7_DONE.docx",
                                                            "type": "word",
                                                            "size": "144.4 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_8/9 BNBC_Part8_Chap 7_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Part_9",
                                                    "type": "folder",
                                                    "size": "-",
                                                    "date": "2026-02-18",
                                                    "children": [
                                                        {
                                                            "name": "1 Seperator Part 9.docx",
                                                            "type": "word",
                                                            "size": "14.6 KB",
                                                            "date": "2015-07-15",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_9/1 Seperator Part 9.docx"
                                                        },
                                                        {
                                                            "name": "2 TABLE OF CONTENTS-9_DONE.docx",
                                                            "type": "word",
                                                            "size": "18.4 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_9/2 TABLE OF CONTENTS-9_DONE.docx"
                                                        },
                                                        {
                                                            "name": "3 BNBC_Part9_Chap 1_DONE.docx",
                                                            "type": "word",
                                                            "size": "28.7 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_9/3 BNBC_Part9_Chap 1_DONE.docx"
                                                        },
                                                        {
                                                            "name": "4 BNBC_Part9_Chap 2_DONE.docx",
                                                            "type": "word",
                                                            "size": "32.4 KB",
                                                            "date": "2017-06-23",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_9/4 BNBC_Part9_Chap 2_DONE.docx"
                                                        },
                                                        {
                                                            "name": "5 BNBC_Part9_Chap 3_DONE.docx",
                                                            "type": "word",
                                                            "size": "40.8 KB",
                                                            "date": "2017-06-19",
                                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Part_9/5 BNBC_Part9_Chap 3_DONE.docx"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "Index_Volume_3.docx.docx",
                                                    "type": "word",
                                                    "size": "119 KB",
                                                    "date": "2017-06-19",
                                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Volume_3/Index_Volume_3.docx.docx"
                                                }
                                            ]
                                        },
                                        {
                                            "name": "1 Cover Page Vol 1_HBRI_DONE.docx",
                                            "type": "word",
                                            "size": "33.1 KB",
                                            "date": "2018-12-17",
                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/1 Cover Page Vol 1_HBRI_DONE.docx"
                                        },
                                        {
                                            "name": "1 Cover page Vol 2_HBRI_DONE.docx",
                                            "type": "word",
                                            "size": "34.2 KB",
                                            "date": "2018-12-17",
                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/1 Cover page Vol 2_HBRI_DONE.docx"
                                        },
                                        {
                                            "name": "1 Cover Page Vol 3_HBRI_DONE.docx",
                                            "type": "word",
                                            "size": "32.5 KB",
                                            "date": "2018-12-17",
                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/1 Cover Page Vol 3_HBRI_DONE.docx"
                                        },
                                        {
                                            "name": "Preface.docx",
                                            "type": "word",
                                            "size": "40.3 KB",
                                            "date": "2018-12-17",
                                            "url": "documents/academic/Courses/ETABS/Codes/01. Codes/BNBC_June_2017_All Word File/Preface.docx"
                                        }
                                    ]
                                },
                                {
                                    "name": "ACI 318-08 Building Code Requirements for Structural Concrete and Commentary.pdf",
                                    "type": "pdf",
                                    "size": "16.1 MB",
                                    "date": "2014-06-15",
                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/ACI 318-08 Building Code Requirements for Structural Concrete and Commentary.pdf"
                                },
                                {
                                    "name": "ASCE 7-05 Minimum Design Loads For Buildings And Other Structures.pdf",
                                    "type": "pdf",
                                    "size": "18.2 MB",
                                    "date": "2008-03-12",
                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/ASCE 7-05 Minimum Design Loads For Buildings And Other Structures.pdf"
                                },
                                {
                                    "name": "Copy of Gazetted-BNBC-2020-Enhanced-file-published-by-Dr.-Khan-Mahmud-Amanat.pdf",
                                    "type": "pdf",
                                    "size": "45.7 MB",
                                    "date": "2021-12-25",
                                    "url": "documents/academic/Courses/ETABS/Codes/01. Codes/Copy of Gazetted-BNBC-2020-Enhanced-file-published-by-Dr.-Khan-Mahmud-Amanat.pdf"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Course Videos",
                    "type": "folder",
                    "size": "-",
                    "date": "2026-02-18",
                    "children": [
                        {
                            "name": "Class - 01.mp4",
                            "type": "video",
                            "size": "294.1 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class - 01.mp4"
                        },
                        {
                            "name": "Class-02.mp4",
                            "type": "video",
                            "size": "123.8 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-02.mp4"
                        },
                        {
                            "name": "Class-03 Part 01.mp4",
                            "type": "video",
                            "size": "35.2 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-03 Part 01.mp4"
                        },
                        {
                            "name": "Class-03__Part_02.mp4",
                            "type": "video",
                            "size": "252.9 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-03__Part_02.mp4"
                        },
                        {
                            "name": "Class-04.mp4",
                            "type": "video",
                            "size": "300.8 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-04.mp4"
                        },
                        {
                            "name": "Class-05.mp4",
                            "type": "video",
                            "size": "185.4 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-05.mp4"
                        },
                        {
                            "name": "Class-06 (1).mp4",
                            "type": "video",
                            "size": "493.1 MB",
                            "date": "2023-01-04",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-06 (1).mp4"
                        },
                        {
                            "name": "Class-07.mp4",
                            "type": "video",
                            "size": "369.7 MB",
                            "date": "2023-01-09",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-07.mp4"
                        },
                        {
                            "name": "Class-08_Part_01.mp4",
                            "type": "video",
                            "size": "359.4 MB",
                            "date": "2023-01-09",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-08_Part_01.mp4"
                        },
                        {
                            "name": "Class-08_Part_02.mp4",
                            "type": "video",
                            "size": "164.9 MB",
                            "date": "2023-01-09",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-08_Part_02.mp4"
                        },
                        {
                            "name": "Class-09_Extra_Recorded.mp4",
                            "type": "video",
                            "size": "250.3 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-09_Extra_Recorded.mp4"
                        },
                        {
                            "name": "Class-09_Load_Define_Assign.mp4",
                            "type": "video",
                            "size": "444.6 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-09_Load_Define_Assign.mp4"
                        },
                        {
                            "name": "Class-10.mp4",
                            "type": "video",
                            "size": "354.1 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-10.mp4"
                        },
                        {
                            "name": "Class-11.mp4",
                            "type": "video",
                            "size": "813.4 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-11.mp4"
                        },
                        {
                            "name": "Class-12.mp4",
                            "type": "video",
                            "size": "414.1 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-12.mp4"
                        },
                        {
                            "name": "Class-13.mp4",
                            "type": "video",
                            "size": "660 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-13.mp4"
                        },
                        {
                            "name": "Class-14.mp4",
                            "type": "video",
                            "size": "391.9 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-14.mp4"
                        },
                        {
                            "name": "Class-15_Shear_Wall_Part_01.mp4",
                            "type": "video",
                            "size": "245.9 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-15_Shear_Wall_Part_01.mp4"
                        },
                        {
                            "name": "Class-15_Slab_Part_02.mp4",
                            "type": "video",
                            "size": "243.6 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-15_Slab_Part_02.mp4"
                        },
                        {
                            "name": "Class-16_Foundation_Part_01.mp4",
                            "type": "video",
                            "size": "162.8 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-16_Foundation_Part_01.mp4"
                        },
                        {
                            "name": "Class-16_Foundation_Part_02.mp4",
                            "type": "video",
                            "size": "236.5 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-16_Foundation_Part_02.mp4"
                        },
                        {
                            "name": "Class-17.mp4",
                            "type": "video",
                            "size": "334.4 MB",
                            "date": "2023-05-06",
                            "url": "documents/academic/Courses/ETABS/Course Videos/Class-17.mp4"
                        }
                    ]
                },
                {
                    "name": "Excel Files",
                    "type": "folder",
                    "size": "-",
                    "date": "2026-02-18",
                    "children": [
                        {
                            "name": "06. Excel Files",
                            "type": "folder",
                            "size": "-",
                            "date": "2026-02-18",
                            "children": [
                                {
                                    "name": "Column Size by Slab Tributery Area.xls",
                                    "type": "excel",
                                    "size": "2.1 MB",
                                    "date": "2023-01-01",
                                    "url": "documents/academic/Courses/ETABS/Excel Files/06. Excel Files/Column Size by Slab Tributery Area.xls"
                                },
                                {
                                    "name": "Economic Column Size Batch.xls",
                                    "type": "excel",
                                    "size": "1.8 MB",
                                    "date": "2022-10-31",
                                    "url": "documents/academic/Courses/ETABS/Excel Files/06. Excel Files/Economic Column Size Batch.xls"
                                },
                                {
                                    "name": "Foundation_Impact.xlsx",
                                    "type": "excel",
                                    "size": "52.6 KB",
                                    "date": "2023-01-01",
                                    "url": "documents/academic/Courses/ETABS/Excel Files/06. Excel Files/Foundation_Impact.xlsx"
                                },
                                {
                                    "name": "Irregularity_Impact_Batch.xls",
                                    "type": "excel",
                                    "size": "941.5 KB",
                                    "date": "2022-07-27",
                                    "url": "documents/academic/Courses/ETABS/Excel Files/06. Excel Files/Irregularity_Impact_Batch.xls"
                                },
                                {
                                    "name": "Load Combination.xls",
                                    "type": "excel",
                                    "size": "36 KB",
                                    "date": "2023-01-01",
                                    "url": "documents/academic/Courses/ETABS/Excel Files/06. Excel Files/Load Combination.xls"
                                },
                                {
                                    "name": "Rebar of Beam _ Column.xls",
                                    "type": "excel",
                                    "size": "2.1 MB",
                                    "date": "2022-11-01",
                                    "url": "documents/academic/Courses/ETABS/Excel Files/06. Excel Files/Rebar of Beam _ Column.xls"
                                },
                                {
                                    "name": "Serviceability_Impact.xls",
                                    "type": "excel",
                                    "size": "75.5 KB",
                                    "date": "2022-02-20",
                                    "url": "documents/academic/Courses/ETABS/Excel Files/06. Excel Files/Serviceability_Impact.xls"
                                },
                                {
                                    "name": "Soil Class.xlsx",
                                    "type": "excel",
                                    "size": "10.9 KB",
                                    "date": "2021-08-08",
                                    "url": "documents/academic/Courses/ETABS/Excel Files/06. Excel Files/Soil Class.xlsx"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Other Documents",
                    "type": "folder",
                    "size": "-",
                    "date": "2026-02-18",
                    "children": [
                        {
                            "name": "04. Other Documents",
                            "type": "folder",
                            "size": "-",
                            "date": "2026-02-18",
                            "children": [
                                {
                                    "name": "Building-Rigid-or-Flexible_Frequency-calculation_ASCE-7-05.pdf",
                                    "type": "pdf",
                                    "size": "916 KB",
                                    "date": "2022-07-07",
                                    "url": "documents/academic/Courses/ETABS/Other Documents/04. Other Documents/Building-Rigid-or-Flexible_Frequency-calculation_ASCE-7-05.pdf"
                                },
                                {
                                    "name": "Design of Shallow Foundations.pdf",
                                    "type": "pdf",
                                    "size": "298.3 KB",
                                    "date": "2021-12-09",
                                    "url": "documents/academic/Courses/ETABS/Other Documents/04. Other Documents/Design of Shallow Foundations.pdf"
                                },
                                {
                                    "name": "Dhaka Imarat Nirman Bidhimala-2008.pdf",
                                    "type": "pdf",
                                    "size": "20.7 MB",
                                    "date": "2019-10-15",
                                    "url": "documents/academic/Courses/ETABS/Other Documents/04. Other Documents/Dhaka Imarat Nirman Bidhimala-2008.pdf"
                                },
                                {
                                    "name": "Lateral Ties _ Bar Cutoff.pdf",
                                    "type": "pdf",
                                    "size": "222.1 KB",
                                    "date": "2021-11-30",
                                    "url": "documents/academic/Courses/ETABS/Other Documents/04. Other Documents/Lateral Ties _ Bar Cutoff.pdf"
                                },
                                {
                                    "name": "Property Modifier.pdf",
                                    "type": "pdf",
                                    "size": "170.8 KB",
                                    "date": "2021-07-05",
                                    "url": "documents/academic/Courses/ETABS/Other Documents/04. Other Documents/Property Modifier.pdf"
                                },
                                {
                                    "name": "Shell formulation – thick or thin.pdf",
                                    "type": "pdf",
                                    "size": "127.5 KB",
                                    "date": "2021-07-05",
                                    "url": "documents/academic/Courses/ETABS/Other Documents/04. Other Documents/Shell formulation – thick or thin.pdf"
                                },
                                {
                                    "name": "Slab Rebar.pdf",
                                    "type": "pdf",
                                    "size": "3.3 MB",
                                    "date": "2021-10-05",
                                    "url": "documents/academic/Courses/ETABS/Other Documents/04. Other Documents/Slab Rebar.pdf"
                                },
                                {
                                    "name": "Vertical EQ in ETABS.pdf",
                                    "type": "pdf",
                                    "size": "349.7 KB",
                                    "date": "2023-01-01",
                                    "url": "documents/academic/Courses/ETABS/Other Documents/04. Other Documents/Vertical EQ in ETABS.pdf"
                                }
                            ]
                        }
                    ]
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

            // Icon Color Logic
            let iconColorStyle = '';
            if (item.type === 'folder') iconColorStyle = 'color: #ffd700;'; // Gold for folders
            else if (item.type === 'video') iconColorStyle = 'color: #e74c3c;'; // Red for videos

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
