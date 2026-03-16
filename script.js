// ==========================================
// 1. CAROUSEL COMPÉTENCES (SKILLS)
// ==========================================
const skills = [
    { icon: 'bxl-html5', name: 'HTML' },
    { icon: 'bxl-css3', name: 'CSS' },
    { icon: 'bxl-javascript', name: 'JavaScript' },
    { icon: 'bxl-python', name: 'Python' },
    { icon: 'bxl-php', name: 'PHP' },
    { icon: 'bxl-laravel', name: 'Laravel' },
    { icon: 'bxl-postgresql', name: 'PostgreSql' },
    { icon: 'bxl-data', name: 'SqlServer' },
    { icon: 'bxl-data', name: 'MySql' }
];

let currentIndex = 0;

function generateCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return; // Sécurité si l'élément n'existe pas
    carousel.innerHTML = '';

    skills.forEach(skill => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `
            <p><i class='bx ${skill.icon}'></i></p>
            <p>${skill.name}</p>
        `;
        carousel.appendChild(slide);
    });
}

function moveSlide(direction) {
    const carousel = document.querySelector('.carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');

    if (slides.length === 0) return;

    const slideWidth = slides[0].offsetWidth + 10; // +10 pour le gap éventuel

    currentIndex += direction;

    if (currentIndex < 0) currentIndex = slides.length - 1;
    else if (currentIndex >= slides.length) currentIndex = 0;

    carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

generateCarousel();

// ==========================================
// 2. CAROUSEL OUTILS (TOOLS)
// ==========================================
const MesOutils = [
    { icon: 'bxl-git', title: 'Git' },
    { icon: 'bxl-microsoft-teams', title: 'Microsoft Teams' },
    { icon: 'bx-bookmarks', title: 'OneNote' },
    { icon: 'bxl-visual-studio', title: 'VsCode' },
    { icon: 'bxl-azure', title: 'Azure DevOps' },
    { icon: 'bx-cloud', title: 'Azure Portal' }
];

let secondCurrentIndex = 0;

function generateSecondCarousel() {
    const secondCarousel = document.querySelector('.second-carousel');
    if (!secondCarousel) return;
    secondCarousel.innerHTML = '';

    MesOutils.forEach(tool => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `
            <p><i class='bx ${tool.icon}'></i></p>
            <p>${tool.title}</p>
        `;
        secondCarousel.appendChild(slide);
    });
}

function moveSecondSlide(direction) {
    const secondCarousel = document.querySelector('.second-carousel');
    const slides = secondCarousel.querySelectorAll('.carousel-slide');

    if (slides.length === 0) return;

    const slideWidth = slides[0].offsetWidth + 10;

    secondCurrentIndex += direction;

    if (secondCurrentIndex < 0) secondCurrentIndex = slides.length - 1;
    else if (secondCurrentIndex >= slides.length) secondCurrentIndex = 0;

    secondCarousel.style.transform = `translateX(-${secondCurrentIndex * slideWidth}px)`;
}

generateSecondCarousel();

// ====================================================================================
// 3. VEILLE TECHNOLOGIQUE (JSON LOCAL VIA GITHUB ACTIONS)
// ====================================================================================

const VEILLE_JSON_PATH = "./data/articles.json";

const veilleContainer = document.getElementById('veille-container-dynamique');
const veilleLoader = document.getElementById('veille-loader');

let allArticles = []; // Stockage global pour le filtrage
let currentFilter = 'Tous';
let currentSort = 'desc';

async function chargerVeilleDynamique() {
    if (!veilleContainer) return;

    try {
        const response = await fetch(VEILLE_JSON_PATH);

        if (!response.ok) throw new Error(`Fichier non trouvé (en attente de la 1ère synchro)`);

        const articles = await response.json();
        allArticles = articles; // Sauvegarder

        if (veilleLoader) veilleLoader.style.display = 'none';

        if (!articles || articles.length === 0) {
            veilleContainer.innerHTML = "<p>Pas d'articles récents.</p>";
            return;
        }

        // Afficher la barre de filtres
        const filtersBar = document.getElementById('veille-filters-bar');
        if (filtersBar) filtersBar.style.display = 'flex';

        genererFiltres();
        appliquerFiltresEtTri();

    } catch (error) {
        console.error("Erreur Veille:", error);
        if (veilleLoader) {
            veilleLoader.innerHTML = "Veille en cours de synchronisation...";
            veilleLoader.style.color = '#f39c12';
        }
    }
}

let currentSearch = '';
let currentDateFilter = '';

function genererFiltres() {
    const searchInput = document.getElementById('search-veille');
    const dateInput = document.getElementById('date-filter-veille');
    const sortSelect = document.getElementById('sort-veille');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            appliquerFiltresEtTri();
        });
    }

    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            currentDateFilter = e.target.value; // Format 'YYYY-MM-DD'
            appliquerFiltresEtTri();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            appliquerFiltresEtTri();
        });
    }
}

function appliquerFiltresEtTri() {
    let articlesFiltres = allArticles;

    // 1. Filtre textuel (Recherche)
    if (currentSearch !== '') {
        articlesFiltres = articlesFiltres.filter(article => {
            const theme = (article.Theme || "").toLowerCase();
            const titre = (article.Titre || "").toLowerCase();
            const resume = (article.Resume || "").toLowerCase();
            return theme.includes(currentSearch) || titre.includes(currentSearch) || resume.includes(currentSearch);
        });
    }

    // 2. Filtre par Date exacte
    if (currentDateFilter !== '') {
        articlesFiltres = articlesFiltres.filter(article => {
            if (!article.Date) return false;

            const articleDateObj = new Date(article.Date);
            if (isNaN(articleDateObj.getTime())) return false;

            const annee = articleDateObj.getFullYear();
            const mois = String(articleDateObj.getMonth() + 1).padStart(2, '0');
            const jour = String(articleDateObj.getDate()).padStart(2, '0');
            const dateStr = `${annee}-${mois}-${jour}`;

            return dateStr === currentDateFilter;
        });
    }

    // 3. Tri par date (chronologique)
    articlesFiltres.sort((a, b) => {
        const dateA = new Date(a.Date || 0);
        const dateB = new Date(b.Date || 0);

        if (currentSort === 'desc') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    renderArticles(articlesFiltres);
}

function renderArticles(articles) {
    veilleContainer.innerHTML = '';

    if (articles.length === 0) {
        veilleContainer.innerHTML = "<p>Aucun article ne correspond à ce filtre.</p>";
        return;
    }

    articles.forEach(article => {
        const titre = article.Titre || "Sans titre";
        const url = article.URL || "#";
        const analyse = article.Resume || "Analyse en cours...";
        const theme = article.Theme || "Tech";
        const dateRaw = article.Date || new Date();
        let dateAffichee = new Date(dateRaw).toLocaleDateString("fr-FR");

        let tagsHtml = '';
        if (theme.includes('#')) {
            const tagsList = theme.split('#').filter(t => t.trim() !== '');
            tagsHtml = tagsList.map(t => `<span class="tag">#${t.trim()}</span>`).join('');
        } else {
            tagsHtml = `<span class="tag">${theme}</span>`;
        }

        const card = document.createElement('div');
        card.className = 'veille-card';

        // L'attribut data-aos ajouté dynamiquement pour animer chaque carte visible
        card.setAttribute('data-aos', 'fade-up');

        card.innerHTML = `
            <div class="card-content-top">
                <h3><a href="${url}" target="_blank">${titre}</a></h3>
                <div class="card-meta">
                    <div class="tags-container">
                        ${tagsHtml}
                    </div>
                    <span class="date">${dateAffichee}</span>
                </div>
            </div>
            <p class="analyse-ia">${analyse}</p>
            <a href="${url}" target="_blank" class="read-more">Lire la source <i class='bx bx-link-external'></i></a>
        `;

        veilleContainer.appendChild(card);
    });

    // Indispensable si AOS est utilisé, pour forcer le recalcul des animations sur le nouveau DOM
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

window.addEventListener('load', chargerVeilleDynamique);

// ==========================================
// 4. MENU MOBILE
// ==========================================
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.querySelector('.sidebar');

if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (sidebar.classList.contains('active')) {
            icon.classList.remove('bx-menu');
            icon.classList.add('bx-x');
        } else {
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });

    const navLinks = sidebar.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    });
}