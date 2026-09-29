const CONFIG = {
    // Canvas Particles
    particleCount: window.innerWidth < 768 ? 30 : 70,
    particleConnectDistance: 120,
    particleSpeed: 0.5,
    
    // UI Effects
    magneticPull: 0.3, // Strength of button magnet effect
    parallaxSpeed: 0.2, // Hero text parallax speed
    
    // Terminal Intro
    terminalLines: [
        "> initializing hardware interfaces... OK",
        "> loading perception stack... OK",
        "> establishing ROS nodes... OK",
        "> retrieving portfolio data... OK",
        "> system ready."
    ],
    terminalTypeSpeed: 40,
    
    // "Now Building" widget content
    nowBuilding: "An autonomous swarm communication protocol for micro-UAVs using ESP32 mesh networks."
};

document.addEventListener('DOMContentLoaded', () => {
    
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const html = document.documentElement;

    // --- 0. Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
    
    if (localStorage.getItem('theme') === 'light') {
        html.setAttribute('data-theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
    }

    const toggleTheme = () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    if(themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if(mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

    // --- 1. Now Building Widget ---
    const nowBuildingEl = document.getElementById('now-building-text');
    if (nowBuildingEl) nowBuildingEl.innerText = CONFIG.nowBuilding;

    // --- 2. Toast Feedback System ---
    const toastContainer = document.getElementById('toast-container');
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'bg-surface text-text px-4 py-2 rounded shadow-lg font-mono text-sm border border-border transform translate-y-4 opacity-0 transition-all duration-300';
        toast.innerText = message;
        toastContainer.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        });
        
        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // --- 3. Copy Email ---
    document.querySelectorAll('.copy-email').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText('jaygandhi1314@gmail.com').then(() => {
                showToast('> Email copied to clipboard');
            });
        });
    });

    // --- 4. Terminal Intro ---
    const terminal = document.getElementById('terminal-intro');
    const terminalText = document.getElementById('terminal-text');
    const skipBtn = document.getElementById('skip-intro');
    let terminalTimeout;

    if (!sessionStorage.getItem('introPlayed') && !isReducedMotion && terminal) {
        let lineIdx = 0;
        let charIdx = 0;
        
        setTimeout(() => skipBtn.classList.remove('opacity-0'), 1000);

        const typeTerminal = () => {
            if (lineIdx >= CONFIG.terminalLines.length) {
                setTimeout(closeTerminal, 800);
                return;
            }
            
            const line = CONFIG.terminalLines[lineIdx];
            terminalText.innerHTML = CONFIG.terminalLines.slice(0, lineIdx).join('<br>') + (lineIdx > 0 ? '<br>' : '') + line.substring(0, charIdx) + '<span class="bg-accent w-2 h-4 inline-block ml-1 animate-pulse"></span>';
            
            charIdx++;
            if (charIdx > line.length) {
                lineIdx++;
                charIdx = 0;
                terminalTimeout = setTimeout(typeTerminal, 400); // Pause between lines
            } else {
                terminalTimeout = setTimeout(typeTerminal, CONFIG.terminalTypeSpeed + (Math.random() * 30));
            }
        };

        const closeTerminal = () => {
            clearTimeout(terminalTimeout);
            terminal.classList.add('opacity-0');
            sessionStorage.setItem('introPlayed', 'true');
            setTimeout(() => terminal.remove(), 500);
        };

        skipBtn.addEventListener('click', closeTerminal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.contains(terminal)) closeTerminal();
        }, { once: true });

        setTimeout(typeTerminal, 500);
    } else if (terminal) {
        terminal.remove();
    }

    // --- 5. Custom Cursor (Desktop Only) ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    
    if (!isTouchDevice && !isReducedMotion && cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
        }, { passive: true });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.2;
            ringY += (mouseY - ringY) * 0.2;
            cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
            requestAnimationFrame(animateRing);
        };
        requestAnimationFrame(animateRing);

        const hoverables = document.querySelectorAll('a, button, .project-card, .skill-chip');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('scale-150', 'bg-accent-soft');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('scale-150', 'bg-accent-soft');
            });
        });
    } else {
        if(cursorDot) cursorDot.remove();
        if(cursorRing) cursorRing.remove();
    }

    // --- 6. Canvas Particle Network ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas && !isReducedMotion && !isTouchDevice) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let heroVisible = true;

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed;
                this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw(accentColor) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = accentColor;
                ctx.fill();
            }
        }

        for (let i = 0; i < CONFIG.particleCount; i++) particles.push(new Particle());

        const animateParticles = () => {
            if (!heroVisible) {
                requestAnimationFrame(animateParticles);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get dynamic color
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-soft').trim();
            
            // Connect to mouse
            const mouseRect = canvas.getBoundingClientRect();
            const localMouseX = mouseX - mouseRect.left;
            const localMouseY = mouseY - mouseRect.top;

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(accentColor);

                const dxm = particles[i].x - localMouseX;
                const dym = particles[i].y - localMouseY;
                const distm = Math.sqrt(dxm*dxm + dym*dym);
                if (distm < CONFIG.particleConnectDistance * 1.5) {
                    ctx.beginPath();
                    ctx.strokeStyle = accentColor;
                    ctx.globalAlpha = 1 - (distm / (CONFIG.particleConnectDistance * 1.5));
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(localMouseX, localMouseY);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < CONFIG.particleConnectDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = accentColor;
                        ctx.globalAlpha = 1 - (dist / CONFIG.particleConnectDistance);
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();

        new IntersectionObserver(entries => {
            heroVisible = entries[0].isIntersecting;
        }).observe(document.getElementById('home'));
    }

    // --- 7. Magnetic Buttons ---
    if (!isTouchDevice && !isReducedMotion) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * CONFIG.magneticPull}px, ${y * CONFIG.magneticPull}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.3s ease-out';
                setTimeout(() => btn.style.transition = '', 300);
            });
        });
    }

    // --- 8. Parallax & Timeline Scroll ---
    const parallaxText = document.querySelector('.parallax-text');
    const timelineLine = document.getElementById('timeline-progress');
    const timelineContainer = document.getElementById('timeline-container');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (!isReducedMotion && parallaxText && scrollY < window.innerHeight) {
            parallaxText.style.transform = `translateY(${scrollY * CONFIG.parallaxSpeed}px)`;
        }

        if (timelineContainer && timelineLine) {
            const rect = timelineContainer.getBoundingClientRect();
            const startDraw = window.innerHeight * 0.8;
            if (rect.top < startDraw && rect.bottom > 0) {
                const height = Math.min(rect.height, startDraw - rect.top);
                timelineLine.style.height = `${height}px`;
            }
        }
    }, { passive: true });

    // --- 9. Project Cards: 3D Tilt & Spotlight ---
    const cards = document.querySelectorAll('.project-card');
    
    if (!isTouchDevice && !isReducedMotion) {
        cards.forEach(card => {
            const spotlight = card.querySelector('.spotlight');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                if (spotlight) {
                    spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, transparent 80%)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                if (spotlight) spotlight.style.background = 'transparent';
            });
        });
    }

    // --- 10. Project Filtering & Search ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('project-search');
    const projectCountEl = document.getElementById('project-count');
    
    const updateProjects = () => {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const activeBtn = document.querySelector('.filter-btn.active');
        const filterCategory = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const cat = card.getAttribute('data-category');
            const tags = Array.from(card.querySelectorAll('.tags-container span')).map(s => s.innerText.toLowerCase());
            
            const matchesSearch = title.includes(query) || tags.some(t => t.includes(query));
            const matchesFilter = filterCategory === 'all' || cat.includes(filterCategory);

            if (matchesSearch && matchesFilter) {
                card.style.display = '';
                setTimeout(() => {
                    card.classList.remove('layout-hide');
                }, 10);
                visibleCount++;
            } else {
                card.classList.add('layout-hide');
                setTimeout(() => {
                    if(card.classList.contains('layout-hide')) card.style.display = 'none';
                }, 300);
            }
        });
        
        if (projectCountEl) projectCountEl.innerText = `Showing ${visibleCount} of ${cards.length} projects`;
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-accent', 'text-accent-text');
                b.classList.add('bg-surface', 'border', 'border-border', 'text-text');
            });
            btn.classList.add('active', 'bg-accent', 'text-accent-text');
            btn.classList.remove('bg-surface', 'border', 'border-border', 'text-text');
            updateProjects();
        });
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', updateProjects);
    }

    // --- 11. Skill Chips Interaction ---
    const skillChips = document.querySelectorAll('.skill-chip');
    skillChips.forEach(chip => {
        chip.addEventListener('mouseenter', () => {
            const targetCat = chip.getAttribute('data-target');
            if (!targetCat) return;
            cards.forEach(card => {
                if (!card.getAttribute('data-category').includes(targetCat)) {
                    card.classList.add('dimmed');
                }
            });
        });
        chip.addEventListener('mouseleave', () => {
            cards.forEach(card => card.classList.remove('dimmed'));
        });
        chip.addEventListener('click', () => {
            const targetCat = chip.getAttribute('data-target');
            if (!targetCat) return;
            
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${targetCat}"]`);
            if (targetBtn) targetBtn.click();
            
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- 12. Command Palette (Easter Egg) ---
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.getElementById('cmd-results');
    const cmdTriggers = document.querySelectorAll('.cmd-trigger');
    
    const commands = [
        { icon: 'fa-home', label: 'Go to Home', action: () => document.getElementById('home').scrollIntoView() },
        { icon: 'fa-user', label: 'Go to About', action: () => document.getElementById('about').scrollIntoView() },
        { icon: 'fa-microchip', label: 'Go to Projects', action: () => document.getElementById('projects').scrollIntoView() },
        { icon: 'fa-file-pdf', label: 'Download CV', action: () => window.open('Jay_Gandhi_CV.pdf', '_blank') },
        { icon: 'fa-envelope', label: 'Copy Email', action: () => { navigator.clipboard.writeText('jaygandhi1314@gmail.com'); showToast('> Email copied to clipboard'); } },
        { icon: 'fa-moon', label: 'Toggle Theme', action: toggleTheme }
    ];

    const renderCmds = (query = '') => {
        cmdResults.innerHTML = '';
        const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
        
        if (filtered.length === 0) {
            cmdResults.innerHTML = '<div class="text-text-muted text-sm p-4 text-center font-mono">No commands found</div>';
            return;
        }

        filtered.forEach((cmd, idx) => {
            const btn = document.createElement('button');
            btn.className = `w-full text-left p-3 rounded font-mono text-sm flex items-center transition-colors focus:outline-none focus:bg-accent-soft ${idx === 0 ? 'bg-surface-2' : 'hover:bg-surface-2'}`;
            btn.innerHTML = `<i class="fas ${cmd.icon} w-6 text-accent"></i> <span class="text-text">${cmd.label}</span>`;
            
            btn.addEventListener('click', () => {
                cmdPalette.close();
                cmd.action();
            });
            btn.addEventListener('mouseenter', () => {
                cmdResults.querySelectorAll('button').forEach(b => b.classList.remove('bg-surface-2'));
                btn.classList.add('bg-surface-2');
            });
            cmdResults.appendChild(btn);
        });
    };

    const openCmd = () => {
        if(cmdPalette) {
            cmdPalette.showModal();
            cmdInput.value = '';
            renderCmds();
            setTimeout(() => cmdInput.focus(), 10);
        }
    };

    cmdTriggers.forEach(btn => btn.addEventListener('click', openCmd));

    document.addEventListener('keydown', (e) => {
        if ((e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') || (e.ctrlKey && e.key === 'k')) {
            e.preventDefault();
            if (cmdPalette && !cmdPalette.open) openCmd();
            else if (cmdPalette && cmdPalette.open) cmdPalette.close();
        }
    });

    if (cmdInput) {
        cmdInput.addEventListener('input', (e) => renderCmds(e.target.value));
        cmdInput.addEventListener('keydown', (e) => {
            const buttons = cmdResults.querySelectorAll('button');
            const activeIdx = Array.from(buttons).findIndex(b => b.classList.contains('bg-surface-2'));
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                buttons.forEach(b => b.classList.remove('bg-surface-2'));
                if (buttons[activeIdx + 1]) buttons[activeIdx + 1].classList.add('bg-surface-2');
                else if (buttons[0]) buttons[0].classList.add('bg-surface-2');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                buttons.forEach(b => b.classList.remove('bg-surface-2'));
                if (buttons[activeIdx - 1]) buttons[activeIdx - 1].classList.add('bg-surface-2');
                else if (buttons[buttons.length - 1]) buttons[buttons.length - 1].classList.add('bg-surface-2');
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIdx >= 0) buttons[activeIdx].click();
            }
        });
    }

    if (cmdPalette) {
        cmdPalette.addEventListener('click', (e) => {
            if (e.target === cmdPalette) cmdPalette.close();
        });
    }

    // --- 13. Form Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const icon = document.getElementById('submit-icon');
            const success = document.getElementById('form-success');
            
            btn.classList.add('pointer-events-none', 'opacity-80');
            icon.classList.remove('hidden');
            
            setTimeout(() => {
                contactForm.reset();
                btn.classList.remove('pointer-events-none', 'opacity-80');
                icon.classList.add('hidden');
                success.classList.remove('hidden');
                showToast('> Message transmitted successfully');
                setTimeout(() => success.classList.add('hidden'), 5000);
            }, 1000);
        });
    // --- 14. Scroll Reveal ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .stagger-grid').forEach(el => revealObserver.observe(el));

    // --- 14b. Timeline Reveal ---
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                entry.target.classList.add('opacity-100', 'translate-y-0');
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-entry').forEach(el => timelineObserver.observe(el));

    // --- 15. Typewriter Effect ---
    const typeWriterEl = document.getElementById('typewriter');
    if (typeWriterEl) {
        const roles = ["Robotics Engineer.", "Embedded Systems.", "Perception Architect."];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        
        const typeRole = () => {
            const currentRole = roles[roleIdx];
            
            if (isDeleting) {
                typeWriterEl.innerText = currentRole.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typeWriterEl.innerText = currentRole.substring(0, charIdx + 1);
                charIdx++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIdx === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                typeSpeed = 500;
            }
            setTimeout(typeRole, typeSpeed);
        };
        setTimeout(typeRole, 2000); // Wait for terminal to mostly finish
    }

    // --- 16. Stat Counters ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; 
                const step = target / (duration / 16); 
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCounter();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

    // --- 17. Mobile Menu & Scroll Progress & Back to Top ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const backToTopBtn = document.getElementById('back-to-top');
    const progressBar = document.getElementById('progress-bar');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    window.addEventListener('scroll', () => {
        // Progress bar
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }
        
        // Back to top
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        }
    }, { passive: true });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 18. Lightbox Close Logic ---
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    
    const closeLightbox = () => {
        if(lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                document.getElementById('lightbox-img').src = '';
            }, 300);
        }
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
    }
});

// --- 19. Global Lightbox Trigger ---
window.openLightbox = (slug, title, date, desc, tags, link) => {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const dateEl = document.getElementById('lightbox-date');
    const descEl = document.getElementById('lightbox-desc');
    const tagsEl = document.getElementById('lightbox-tags');
    const linkEl = document.getElementById('lightbox-link');
    
    img.src = `assets/images/${slug}/cover.jpg`;
    titleEl.innerText = title;
    
    if (date) {
        dateEl.innerText = date;
        dateEl.style.display = 'block';
    } else {
        dateEl.style.display = 'none';
    }
    
    descEl.innerText = desc;
    tagsEl.innerHTML = '';
    
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'text-[10px] font-mono bg-accent-soft text-accent px-2 py-1 rounded';
        span.innerText = tag;
        tagsEl.appendChild(span);
    });
    
    if (link) {
        linkEl.href = link;
        linkEl.style.display = 'inline-flex';
    } else {
        linkEl.style.display = 'none';
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};
