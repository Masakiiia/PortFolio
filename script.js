// Tableau des compétences avec leurs icônes et noms
const skills = [
    { icon: 'bxl-html5', name: 'HTML' },
    { icon: 'bxl-css3', name: 'CSS' },
    { icon: 'bxl-javascript', name: 'JavaScript' },
    { icon: 'bxl-python', name: 'Python' },
    { icon: 'bxl-php', name: 'PHP' },
    { icon: 'bxl-laravel', name: 'Laravel' },
    { icon: 'bxl-database', name: 'PostgreSql' },
    { icon: 'bxl-database', name: 'SqlServer' },
    { icon: 'bxl-database', name: 'MySql' }
];

let currentIndex = 0;   // Index actuel du carrousel, débutant à 0

// Fonction pour générer dynamiquement les diapositives du carrousel
function generateCarousel() {
    const carousel = document.querySelector('.carousel');    // Récupère le conteneur du carrousel
    carousel.innerHTML = '';    // Vide le carrousel avant de le remplir à nouveau

    // Crée une diapositive pour chaque compétence dans le tableau "skills"
    skills.forEach(skill => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `
            <p><i class='bx ${skill.icon}'></i></p>
            <p>${skill.name}</p>
        `;
        carousel.appendChild(slide);    // Ajoute chaque diapositive au carrousel
    });
}

// Fonction pour déplacer le carrousel (vers la gauche ou vers la droite)
function moveSlide(direction) {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const slideWidth = slides[0].offsetWidth + 10;  // Calcul de la largeur de chaque slide

    currentIndex += direction; // Modification de l'index

    // Si l'index devient négatif, on revient à la dernière diapositive
    if (currentIndex < 0) {
        currentIndex = slides.length - 1;   // Dernière diapositive
    }
    // Si on dépasse la dernière diapositive, on revient au début
    else if (currentIndex >= slides.length) {
        currentIndex = 0;   // Première diapositive
    }

    // Applique la translation au carrousel
    carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

// Initialiser le carrousel dès le chargement de la page
generateCarousel();

// Liste des outils
const MesOutils = [
    { icon: 'bxl-git', title: 'Git' },
    { icon: 'bxl-microsoft-teams', title: 'Microsoft Teams' },
    { icon: 'bx-bookmarks', title: 'Microsoft OneNote' },
    { icon: 'bx-code', title: 'VsCode' },
    { icon: 'bx-cloud', title: 'AzureDevOps' },
    { icon: 'bx-cloud-upload', title: 'Azure Portal' }
];

let secondCurrentIndex = 0; // Index pour le second carrousel

// Fonction pour générer le second carrousel
function generateSecondCarousel() {
    const secondCarousel = document.querySelector('.second-carousel');
    secondCarousel.innerHTML = '';  // Vide le carrousel avant de le remplir à nouveau

    // Crée les diapositives du second carrousel
    MesOutils.forEach(project => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `
            <p><i class="bx ${project.icon}"></i></p>
            <p>${project.title}</p>
        `;
        secondCarousel.appendChild(slide);
    });
}

// Fonction pour déplacer le second carrousel
function moveSecondSlide(direction) {
    const secondCarousel = document.querySelector('.second-carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const slideWidth = slides[0].offsetWidth + 10;  // Calcul de la largeur de chaque slide

    secondCurrentIndex += direction;

    // Si l'index devient négatif, on revient à la dernière diapositive
    if (secondCurrentIndex < 0) {
        secondCurrentIndex = slides.length - 1; // Dernière diapositive
    }
    // Si on dépasse la dernière diapositive, on revient au début
    else if (secondCurrentIndex >= slides.length) {
        secondCurrentIndex = 0; // Première diapositive
    }

    // Applique la translation au carrousel
    secondCarousel.style.transform = `translateX(-${secondCurrentIndex * slideWidth}px)`;
}

// Initialiser le second carrousel dès le chargement de la page
generateSecondCarousel();


// ====================================================================================
// NOUVELLE PARTIE : VEILLE TECHNOLOGIQUE DYNAMIQUE (SOLUTION 2 - APPS SCRIPT)
// ====================================================================================

// 1. **ATTENTION : COLLE TON URL D'APPLICATION WEB GOOGLE APPS SCRIPT ICI !**
// Cette URL doit être celle que tu as obtenue après le déploiement de ton script Apps Script.
const VEILLE_API_URL = "https://script.google.com/macros/s/AKfycbybd4nvg__OreTpcCbLoW9Xgzl1fe_pfMrAduad7Cy39ZtpF0ULCbGK6mxoI02F7mJM/exec"; // <-- REMPLACE CETTE LIGNE

const veilleContainer = document.getElementById('veille-container-dynamique');
const veilleLoader = document.getElementById('veille-loader');


/**
 * Récupère les données de l'API Apps Script et les injecte dans le DOM.
 */
async function chargerVeilleDynamique() {
    // Vérifie si les conteneurs existent
    if (!veilleContainer) return;

    try {
        const response = await fetch(VEILLE_API_URL);
        if (!response.ok) {
            throw new Error(`Erreur réseau: ${response.status}`);
        }
        
        const articles = await response.json();
        
        // Masquer le loader
        if (veilleLoader) {
            veilleLoader.style.display = 'none';
        }
        veilleContainer.innerHTML = ''; // Vide le conteneur pour y mettre le contenu dynamique

        if (articles.length === 0) {
            veilleContainer.innerHTML = "<p>Aucun article sélectionné et analysé pour le moment.</p>";
            return;
        }

        // Créer les cartes pour chaque article retourné par l'API
        articles.forEach(article => {
            const veilleCard = document.createElement('div');
            veilleCard.classList.add('veille-card');
            
            // Note: L'API ne renvoie pas l'image. J'utilise un placeholder.
            // Si tu veux des images, il faudra ajouter une colonne 'Image_URL' dans ton GSheet.
            
            veilleCard.innerHTML = `
                <img src="img/default_veille.jpg" alt="${article.titre}" class="veille-image">
                <h3>
                    <a href="${article.url}" target="_blank">${article.titre}</a>
                </h3>
                <p class="veille-analyse"><strong>Analyse :</strong> ${article.analyse}</p>
                <div class="meta">
                    <strong>Thème :</strong> ${article.theme} | <strong>Date :</strong> ${article.date}
                </div>
                <a href="${article.url}" target="_blank">Lire l'article original</a>
            `;
            
            veilleContainer.appendChild(veilleCard);
        });

    } catch (error) {
        console.error("Erreur lors du chargement de la veille:", error);
        if (veilleLoader) {
            veilleLoader.innerHTML = "❌ Erreur de chargement de l'API. Vérifiez l'URL (F12) et les permissions Google.";
            veilleLoader.style.color = 'red';
        } else {
            veilleContainer.innerHTML = "❌ Erreur de chargement.";
        }
    }
}

// Lance le chargement de la veille après le chargement complet du DOM
// On utilise 'DOMContentLoaded' ou window 'load' pour s'assurer que l'élément est prêt.
window.addEventListener('load', chargerVeilleDynamique);

// ************************************************************************************
// ************************************************************************************