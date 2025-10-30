

// document.addEventListener('DOMContentLoaded', function() {
    
//     // Fonction réutilisable pour inclure n'importe quel élément
//     function includeHTML(containerId, templatePath) {
//         fetch(templatePath)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Erreur de chargement de ${templatePath}: ${response.status}`);
//                 }
//                 return response.text();
//             })
//             .then(htmlContent => {
//                 const container = document.getElementById(containerId);
//                 if (container) {
//                     container.innerHTML = htmlContent;
//                 } else {
//                     console.warn(`Conteneur #${containerId} non trouvé.`);
//                 }
//             })
//             .catch(error => {
//                 console.error(`Erreur lors de l'inclusion:`, error);
//             });
//     }

//     // --- Appel des inclusions ---
    
//     // 1. Inclusion du Header
//     includeHTML('global-header', 'header.html'); 
    
//     // 2. Inclusion du Footer
//     includeHTML('global-footer', 'footer.html'); 
    
//     // Note : Le chemin 'header.html' et 'footer.html' est correct 
//     // car ils sont à la racine, à côté de index.html.

// });


document.addEventListener('DOMContentLoaded', function() {
    
    function includeHTML(containerId, templatePath) {
        fetch(templatePath)
            .then(response => {
                if (!response.ok) {
                    console.error(`Erreur ${response.status} lors du chargement de ${templatePath}`);
                    throw new Error(`Échec de la requête: ${response.status}`);
                }
                return response.text();
            })
            .then(htmlContent => {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = htmlContent;
                    console.log(`✅ ${templatePath} chargé dans #${containerId}`);

                    if (containerId === 'global-header') {
                        // On attend un instant pour s’assurer que le DOM est prêt
                        setTimeout(() => {
                            if (typeof setupBurgerMenuAndCarrousel === 'function') {
                                console.log('⚙️ Initialisation du menu burger...');
                                setupBurgerMenuAndCarrousel();
                            } else {
                                console.warn('❌ setupBurgerMenuAndCarrousel non trouvé.');
                            }
                        }, 50);
                    }
                } else {
                    console.warn(`Conteneur #${containerId} non trouvé.`);
                }
            })
            .catch(error => {
                console.error('Problème d’inclusion:', error);
            });
    }

    // ✅ Chemins relatifs (sans /)
    includeHTML('global-header', 'header.html');
    includeHTML('global-footer', 'footer.html');
});
