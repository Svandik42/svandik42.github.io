document.addEventListener('DOMContentLoaded', () => {

    const themeBtn = document.querySelector('.nav-theme');

    if (document.documentElement.getAttribute('data-theme') === 'light') {
        themeBtn.innerHTML = '<i data-feather="moon"></i>';
        feather.replace();
    }

    themeBtn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const next = isLight ? 'dark' : 'light';

        if (next === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }

        localStorage.setItem('theme', next);

        themeBtn.innerHTML = next === 'light'
            ? '<i data-feather="moon"></i>'
            : '<i data-feather="sun"></i>';
        feather.replace();
    });


    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    navToggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });


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

    let lastScroll = 0;
    const header = document.querySelector('header');
 
    window.addEventListener('scroll', () => {
        const current = window.scrollY;
 
        // u úplného vršku vždy ukaž
        if (current <= 0) {
            header.classList.remove('hidden');
            lastScroll = 0;
            return;
        }
 
        if (current > lastScroll && current > 80) {
            // scroll dolů (a kus od vršku) → schovej
            header.classList.add('hidden');
        } else {
            // scroll nahoru → ukaž
            header.classList.remove('hidden');
        }
        lastScroll = current;
    });
 