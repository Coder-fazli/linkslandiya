// ===== FAQ Accordion =====
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('open')) {
                    other.classList.remove('open');
                }
            });

            item.classList.toggle('open');
        });
    });

    // ===== Timeline Scroll Animations =====
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timeline = document.querySelector('.timeline');

    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -80px 0px',
        threshold: 0.3
    };

    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    timelineSteps.forEach(step => {
        stepObserver.observe(step);
    });

    // Timeline progress bar
    function updateProgress() {
        if (!timeline || !timelineProgress) return;

        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let progress = 0;

        if (rect.top < windowHeight * 0.5) {
            const scrolled = (windowHeight * 0.5) - rect.top;
            progress = Math.min((scrolled / rect.height) * 100, 100);
        }

        timelineProgress.style.height = progress + '%';
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });

    updateProgress();

    // ===== Service Cards Fade In =====
    const serviceCards = document.querySelectorAll('.service-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        cardObserver.observe(card);
    });

    // ===== Feature Boxes Fade In =====
    const featureBoxes = document.querySelectorAll('.feature-box');

    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, i * 80);
            }
        });
    }, { threshold: 0.1 });

    featureBoxes.forEach((box, index) => {
        box.style.opacity = '0';
        const isLeft = box.closest('.features-left');
        box.style.transform = isLeft ? 'translateX(-20px)' : 'translateX(20px)';
        box.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        featureObserver.observe(box);
    });

    // ===== FAQ Items Fade In =====
    const faqItemsAll = document.querySelectorAll('.faq-item');

    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 60);
            }
        });
    }, { threshold: 0.1 });

    faqItemsAll.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(16px)';
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        faqObserver.observe(item);
    });

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
