const replaceIcons = () => {
    if (window.feather) {
        feather.replace();
    }
};

document.addEventListener('DOMContentLoaded', () => {


const contactBtn = document.getElementById('contact-btn');
const contactModal = document.getElementById('contact-modal');
const footerMailTrigger = document.getElementById('contact-mail-footer');

    if (contactBtn && contactModal) {
        const modalMailLink = document.getElementById('modal-mail-link');
        const modalCopyBtn = document.getElementById('modal-copy-btn');
        const modalCloseBtn = contactModal.querySelector('.contact-modal-close');

        const openModal = () => {
            if (typeof contactModal.showModal === 'function') {
                contactModal.showModal();
            }
        };

        contactBtn.addEventListener('click', openModal);

        if (footerMailTrigger) {
            footerMailTrigger.addEventListener('click', (event) => {
                event.preventDefault();
                openModal();
            });

            footerMailTrigger.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openModal();
                }
            });
        }

        modalCloseBtn.addEventListener('click', () => contactModal.close());

        modalMailLink.addEventListener('click', () => contactModal.close());

        modalCopyBtn.addEventListener('click', () => {
            contactModal.close();
            copyEmail();
        });

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) contactModal.close();
        });
    }


    const themeBtn = document.querySelector('.nav-theme');

    if (themeBtn) {
        const updateThemeButton = () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            themeBtn.innerHTML = isLight ? '<i data-feather="sun"></i>' : '<i data-feather="moon"></i>';
            themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
            themeBtn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
            replaceIcons();
        };

        updateThemeButton();

        themeBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const next = isLight ? 'dark' : 'light';

            if (next === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }

            localStorage.setItem('theme', next);
            updateThemeButton();
        });
    }


    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }


    navList.querySelectorAll('li[data-section]').forEach(item => {
        item.addEventListener('click', () => {
            const section = document.getElementById(item.dataset.section);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
            navList.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    function applyStagger(panel) {
        const items = panel.querySelectorAll('.tech-item, .certification-box');
        items.forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.04}s`;
        });
    }

    function reveal(panel) {
        panel.classList.add('visible');
        applyStagger(panel);
        void panel.offsetWidth;
        requestAnimationFrame(() => {
            panel.classList.add('animate');
        });

        clearTimeout(panel._staggerTimer);
        panel._staggerTimer = setTimeout(() => {
            panel.querySelectorAll('.tech-item, .certification-box').forEach(item => {
                item.style.transitionDelay = '';
            });
        }, 800);
    }

    function hide(panel) {
        clearTimeout(panel._staggerTimer);
        panel.classList.remove('visible', 'animate');
        panel.querySelectorAll('.tech-item, .certification-box').forEach(item => {
            item.style.transitionDelay = '';
        });
    }


    const tabs = document.querySelectorAll('.tabs-group');

    tabs.forEach(group => {
        const buttons = group.querySelectorAll('.switch-btn');
        const panels = group.querySelectorAll('.tab-panel');

        reveal(panels[0]);

        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                group.classList.toggle('show-sections', index === 1);

                const target = btn.dataset.tab;
                panels.forEach(panel => {
                    if (panel.dataset.panel === target) {
                        reveal(panel);
                    } else {
                        hide(panel);
                    }
                });
            });
        });
    });


    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    let lastScroll = 0;
const header = document.querySelector('header');
const scrollThumb = document.getElementById('scroll-thumb');
let scrollbarTimer;

function updateScrollThumb() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = window.scrollY;

    const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30);
    const trackRange = clientHeight - thumbHeight;
    const scrollRange = scrollHeight - clientHeight;
    const thumbTop = scrollRange > 0 ? (scrollTop / scrollRange) * trackRange : 0;

    scrollThumb.style.height = `${thumbHeight}px`;
    scrollThumb.style.transform = `translateY(${thumbTop}px)`;
}

updateScrollThumb();
window.addEventListener('resize', updateScrollThumb);

window.addEventListener('scroll', () => {
    const current = window.scrollY;

    updateScrollThumb();
    scrollThumb.classList.add('visible');
    clearTimeout(scrollbarTimer);
    scrollbarTimer = setTimeout(() => {
        scrollThumb.classList.remove('visible');
    }, 1000);

    if (current <= 0) {
        header.classList.remove('hidden');
        lastScroll = 0;
        return;
    }

    if (current > lastScroll && current > 80) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    lastScroll = current;
});

const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
const certLists = document.querySelectorAll('.certification-list');
const workingOnTitle = document.querySelector('.cert-working-title');

const applyCertFilter = (filter) => {
    certLists.forEach(list => {
        let visibleCount = 0;

        list.querySelectorAll('li').forEach((item, index) => {
            const matches = filter === 'all' || item.dataset.category === filter;
            item.classList.toggle('cert-hidden', !matches);

            if (matches) {
                visibleCount++;
                item.classList.remove('cert-animate');
                void item.offsetWidth;
                item.style.transitionDelay = `${index * 0.04}s`;
                item.classList.add('cert-animate');
            } else {
                item.style.transitionDelay = '';
                item.classList.remove('cert-animate');
            }
        });

        if (workingOnTitle && list === workingOnTitle.nextElementSibling) {
            workingOnTitle.classList.toggle('cert-hidden', visibleCount === 0);
        }
    });
};

certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        certFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyCertFilter(btn.dataset.filter);
    });
});

});

function copyEmail() {
    const email = "svanda.vitek@gmail.com";
    const toast = document.getElementById("toast");
 
    navigator.clipboard.writeText(email).then(() => {
        showToast("Email copied! ✓");
    }).catch(() => {
        showToast("My email: " + email);
    });
}
 
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

