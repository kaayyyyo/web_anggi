document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const openingScreen = document.getElementById('opening-screen');
    const mainContent = document.getElementById('main-content');
    const musicControl = document.getElementById('music-control');
    const interactiveBtn = document.getElementById('interactive-btn');
    const interactiveReveal = document.getElementById('interactive-reveal');
    const envelope = document.getElementById('envelope');
    const letterContent = document.getElementById('letter-content');
    const finalBtn = document.getElementById('final-btn');
    const cinematicEnding = document.getElementById('cinematic-ending');
    const endingSequence = document.getElementById('ending-sequence');
    const heartIcon = document.querySelector('.heart-icon');

    // Create background audio (placeholder for user's file)
    const bgMusic = new Audio('assets/music/Forever.mp3');
    bgMusic.loop = true;
    let isMusicPlaying = false;
    let musicError = false;

    // Scroll Progress Line
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.scroll-progress').style.width = scrolled + "%";
    });

    // Particles Generation
    function createAmbientParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const particleCount = window.matchMedia('(max-width: 767px)').matches ? 7 : 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = window.matchMedia('(max-width: 767px)').matches
                ? Math.random() * 10 + 6
                : Math.random() * 20 + 10;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(particle);
        }
    }

    createAmbientParticles();

    // Load Photos
    const photoPlaceholders = document.querySelectorAll('.photo-placeholder');
    photoPlaceholders.forEach(placeholder => {
        const src = placeholder.getAttribute('data-src');
        if (src) {
            const img = new Image();
            img.onload = () => {
                placeholder.style.backgroundImage = `url('${src}')`;
                placeholder.classList.add('loaded'); // This hides the fallback heart in CSS
            };
            img.src = src;
        }
    });

    // Opening Button Interaction
    openBtn.addEventListener('click', () => {
        // Subtle button compress
        openBtn.style.transform = 'scale(0.95)';
        
        // Music attempt
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicControl.classList.remove('hidden');
        }).catch(() => {
            musicError = true;
            console.log("Autoplay prevented by browser.");
        });

        // Cinematic Fade out
        setTimeout(() => {
            openingScreen.style.opacity = '0';
            
            setTimeout(() => {
                openingScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                
                // Initialize Scroll Reveals
                initScrollReveals();
                
                // Trigger Confetti
                triggerConfetti();
            }, 1500); // Wait for fade out
        }, 300);
    });

    // Scroll Reveal System
    function initScrollReveals() {
        // Find all reveal classes
        const revealElements = document.querySelectorAll(
            '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .collage-item'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    
                    // Check if it's a collage item that needs dynamic delay
                    if (entry.target.classList.contains('collage-item')) {
                        const delay = entry.target.getAttribute('data-delay');
                        if (delay) {
                            setTimeout(() => {
                                entry.target.classList.add('is-visible');
                                // Transform tilt specific classes based on frame-style
                                if (entry.target.classList.contains('tilt-left')) {
                                    entry.target.style.transform = 'translateY(0) rotate(-1.5deg)';
                                } else if (entry.target.classList.contains('tilt-right')) {
                                    entry.target.style.transform = 'translateY(0) rotate(1.5deg)';
                                } else if (entry.target.classList.contains('tilt-left-strong')) {
                                    entry.target.style.transform = 'translateY(0) rotate(-3deg)';
                                } else if (entry.target.classList.contains('tilt-right-strong')) {
                                    entry.target.style.transform = 'translateY(0) rotate(3deg)';
                                } else {
                                    entry.target.style.transform = 'translateY(0) rotate(0)';
                                }
                            }, parseInt(delay));
                        } else {
                            entry.target.classList.add('is-visible');
                        }
                    } else {
                        entry.target.classList.add('is-visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // Confetti
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#D3A7B1', '#F0E8DD', '#FFFFFF']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#D3A7B1', '#F0E8DD', '#FFFFFF']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }

    // Interactive Button ("What?")
    interactiveBtn.addEventListener('click', () => {
        if (!interactiveReveal.classList.contains('show')) {
            // Heart pop animation
            if (heartIcon) {
                heartIcon.classList.add('heart-pop');
                setTimeout(() => heartIcon.classList.remove('heart-pop'), 400);
            }
            interactiveReveal.classList.add('show');
        }
    });

    // Envelope Interaction
    const seal = document.querySelector('.heart-seal');
    if (envelope) {
        envelope.addEventListener('click', () => {
            if (envelope.classList.contains('open')) return;
            
            // Step 1 & 2: Open flap
            envelope.classList.add('open');
            
            // Step 3, 4, 5: Slide letter up
            setTimeout(() => {
                envelope.classList.add('extract');
            }, 800);
            
            // Step 7, 8: Transition to full letter
            setTimeout(() => {
                const transitionSection = document.getElementById('transition-letter');
                transitionSection.classList.add('fade-out');
                
                setTimeout(() => {
                    transitionSection.classList.add('hidden');
                    letterContent.classList.remove('hidden');
                    
                    // Reveal letter content smoothly
                    setTimeout(() => {
                        const letterInner = document.querySelector('.letter-content-inner');
                        const signature = document.querySelector('.script-signature');
                        const letterBtn = document.querySelector('.letter-btn-container');
                        
                        if (letterInner) letterInner.classList.add('opacity-1');
                        
                        setTimeout(() => {
                            if (signature) signature.classList.add('opacity-1');
                            if (letterBtn) letterBtn.classList.add('opacity-1');
                        }, 1200);
                    }, 50);
                }, 1000);
            }, 2400); // Give time for extraction animation
        });
    }

    // Final Button to Cinematic Ending
    finalBtn.addEventListener('click', () => {
        // Hide music button for ending
        musicControl.style.opacity = '0';
        
        cinematicEnding.classList.remove('hidden');
        
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            cinematicEnding.classList.add('show');
            setTimeout(startEndingSequence, 2000);
        }, 50);
    });

    // Cinematic Ending Sequence
    const phrases = [
        "It's been a long journey.",
        "And I know there will be many more journeys ahead.",
        "Some might be easy.",
        "Some might be hard.",
        "But I hope...",
        "I get to be there<br>for many more chapters<br>with you. ♡"
    ];

    let currentPhrase = 0;

    function startEndingSequence() {
        document.body.style.overflow = 'hidden'; // Lock scroll during ending
        showNextPhrase();
    }

    function showNextPhrase() {
        if (currentPhrase < phrases.length) {
            const p = document.createElement('p');
            
            p.className = 'cinematic-phrase';
            p.innerHTML = phrases[currentPhrase]; // Use innerHTML to parse <br>
            
            if (currentPhrase === 5) {
                p.className = 'cinematic-phrase massive-ending-text mt-8';
            }

            endingSequence.appendChild(p);
            
            // Fade and slight slide up
            setTimeout(() => {
                p.style.opacity = '1';
                p.style.transform = 'translateY(0)';
            }, 100);
            
            let pauseTime = 3500;
            if (currentPhrase === 5) pauseTime = 5500; 
            
            setTimeout(() => {
                p.style.opacity = '0';
                p.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    endingSequence.innerHTML = '';
                    currentPhrase++;
                    showNextPhrase();
                }, 1500); 
            }, pauseTime);
            
        } else {
            showFinalMessage();
        }
    }
    
    function showFinalMessage() {
        endingSequence.innerHTML = `
            <div class="final-message">
                <h1>Congratulations, Anggi. 🎓</h1>
                <p>I'm proud of you.</p>
                <span class="always-text">Always.</span>
                <p style="margin-top: 4rem; font-family: var(--font-handwriting); font-size: 1.8rem; color: #D3A7B1;">— Raka ♡</p>
            </div>
        `;
        
        const finalMsg = endingSequence.querySelector('.final-message');
        setTimeout(() => {
            finalMsg.style.opacity = '1';
        }, 500);
    }

    // Music Control Toggle
    musicControl.addEventListener('click', () => {
        if (!musicError) {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicControl.classList.add('paused');
                isMusicPlaying = false;
            } else {
                bgMusic.play();
                musicControl.classList.remove('paused');
                isMusicPlaying = true;
            }
        }
    });
});
