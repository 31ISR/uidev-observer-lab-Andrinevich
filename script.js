// Шаг 0: Проверка подключения
console.log("Скрипт подключен");

// Шаг 3, 4, 5: IntersectionObserver для базовой анимации
const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -80px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Шаг 2: Добавляем класс-активатор
            entry.target.classList.add('animate');
            
            // Шаг 5: Отписываемся от элемента, чтобы анимация сработала один раз
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Собираем все элементы, которым нужна базовая анимация
const animateElements = document.querySelectorAll('.animate-on-scroll, .slide-left, .slide-right, .scale-up, .fade-in, .stagger-item');
animateElements.forEach(el => observer.observe(el));

// Шаг 6: Stagger-анимация (появление по очереди)
const staggerGroups = document.querySelectorAll('.stats-grid, .testimonials');

staggerGroups.forEach(group => {
    const items = group.querySelectorAll('.stagger-item');
    
    // Создаем отдельный наблюдатель для каждой группы
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 200); // Задержка 0.2s
                });
                // Отписываемся от группы после первого срабатывания
                staggerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за самим контейнером (секцией)
    staggerObserver.observe(group);
});

// Шаг 7.1: Полоска прогресса
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    scrollProgress.style.width = scrollPercent + '%';
});

// Шаг 7.2: Шапка меняет прозрачность
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.9)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Шаг 7.3: Плавный скролл по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Учитываем высоту фиксированной шапки (100px), чтобы заголовок не прятался под неё
            const headerHeight = header.offsetHeight;
            const elementPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Шаг 8: Анимированные счетчики
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            
            statNumbers.forEach(number => {
                const target = parseInt(number.textContent.replace(/[^\d]/g, ''));
                const duration = 2000;
                let current = 0;
                const step = target / (duration / 16);
                
                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        number.textContent = number.textContent.replace(/[^\d]/g, '').replace(/\d+/g, target);
                        clearInterval(counter);
                    } else {
                        // Округляем и добавляем разделитель тысяч, если нужно
                        number.textContent = number.textContent.replace(/[^\d]/g, '').replace(/\d+/g, Math.floor(current));
                    }
                }, 16);
            });
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Дополнительный функционал: Активный пункт меню при скролле
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function changeNavActive() {
    let scrollY = window.scrollY + 100; // Смещение на высоту шапки

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(a => {
                a.classList.remove("active");
                if (a.getAttribute("href") === `#${sectionId}`) {
                    a.classList.add("active");
                }
            });
        }
    });
}

window.addEventListener("scroll", changeNavActive);
changeNavActive(); // Вызов при первой загрузке