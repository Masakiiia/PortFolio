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
    { icon: 'bxl-postgresql', name: 'PostgreSql' }, // Correction icône
    { icon: 'bxl-data', name: 'SqlServer' }, // Correction icône générique si pas dispo
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
    const container = document.querySelector('.carousel-container'); // Assure-toi d'avoir une div parente ou cible le bon wrapper
    const carousel = document.querySelector('.carousel');
    // IMPORTANT: On cible uniquement les slides de CE carousel
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
    { icon: 'bx-bookmarks', title: 'OneNote' }, // bx-bookmarks est standard
    { icon: 'bxl-visual-studio', title: 'VsCode' }, // bxl-visual-studio existe souvent
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
    // IMPORTANT: On cible uniquement les slides de CE carousel
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

// On pointe vers le fichier local qui sera généré dans ton repo
const VEILLE_JSON_PATH = "./data/articles.json"; 

const veilleContainer = document.getElementById('veille-container-dynamique');
const veilleLoader = document.getElementById('veille-loader');

async function chargerVeilleDynamique() {
    if (!veilleContainer) return;

    try {
        // On récupère le fichier JSON local
        const response = await fetch(VEILLE_JSON_PATH);
        
        if (!response.ok) throw new Error(`Fichier non trouvé (en attente de la 1ère synchro)`);
        
        const articles = await response.json();
        
        if (veilleLoader) veilleLoader.style.display = 'none';
        veilleContainer.innerHTML = ''; 

        if (!articles || articles.length === 0) {
            veilleContainer.innerHTML = "<p>Pas d'articles récents.</p>";
            return;
        }

        // On affiche les articles (on prend les 10 derniers par exemple)
        articles.slice(0, 10).forEach(article => {
            // Adaptation des noms de champs selon ton export Notion
            const titre = article.Titre || "Sans titre";
            const url = article.URL || "#";
            const analyse = article.Resume || "Analyse en cours...";
            const theme = article.Theme || "Tech";
            const dateRaw = article.Date || new Date();
            let dateAffichee = new Date(dateRaw).toLocaleDateString("fr-FR");

            const card = document.createElement('div');
            card.className = 'veille-card';
            
            const themeClass = theme.toLowerCase().split('/')[0].trim();

            card.innerHTML = `
                <div class="card-header">
                    <span class="tag ${themeClass}">${theme}</span>
                    <span class="date">${dateAffichee}</span>
                </div>
                <h3><a href="${url}" target="_blank">${titre}</a></h3>
                <p class="analyse-ia">${analyse}</p>
                <a href="${url}" target="_blank" class="read-more">Lire la source <i class='bx bx-link-external'></i></a>
            `;
            
            veilleContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Erreur Veille:", error);
        if (veilleLoader) {
            veilleLoader.innerHTML = "Veille en cours de synchronisation...";
            veilleLoader.style.color = '#f39c12';
        }
    }
}

window.addEventListener('load', chargerVeilleDynamique);
