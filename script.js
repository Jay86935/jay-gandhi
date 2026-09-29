document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- 2. Smooth Scrolling with Offset ---
    const links = document.querySelectorAll('a[href^="#"]');
    const navbar = document.getElementById('navbar');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Active Navbar Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav .hidden.md\\:flex a');

    const highlightCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('text-accent-500');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('text-accent-500');
                    }
                });
            }
        });
    };

    const highlightObserver = new IntersectionObserver(highlightCallback, {
        threshold: 0.3
    });

    sections.forEach(section => highlightObserver.observe(section));

    // --- 5. Navbar Style on Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'bg-slate-950/95');
            navbar.classList.remove('bg-slate-950/80');
        } else {
            navbar.classList.remove('shadow-lg', 'bg-slate-950/95');
            navbar.classList.add('bg-slate-950/80');
        }
    });

    // --- 6. Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-accent-600', 'text-white');
                b.classList.add('bg-slate-800', 'text-slate-300');
            });
            
            // Add active class to clicked button
            btn.classList.add('active', 'bg-accent-600', 'text-white');
            btn.classList.remove('bg-slate-800', 'text-slate-300');

            const filterValue = btn.getAttribute('data-filter');

            projects.forEach(project => {
                if (filterValue === 'all' || project.getAttribute('data-category').includes(filterValue)) {
                    project.classList.remove('hide');
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        project.classList.add('hide');
                    }, 400); // Wait for transition
                }
            });
        });
    });
});
