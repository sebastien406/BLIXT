// // Configuration de l'API
// const API_URL = 'https://blixt-mailjet-api.onrender.com/api/contact';

// // Log de confirmation du chargement du script
// console.log('🚀 Script contact-form.js chargé avec succès');
// console.log('🌐 API URL configurée:', API_URL);

// document.getElementById('contactForm').addEventListener('submit', function(e) {
//     e.preventDefault();

//     const form = e.target;
//     const formData = new FormData(form);
//     const data = {};

//     // Récupération de toutes les données du formulaire
//     formData.forEach((value, key) => {
//         data[key] = value;
//     });

//     // Vérification du consentement
//     const consentCheckbox = document.getElementById('consent');
//     if (!consentCheckbox.checked) {
//         alert("Veuillez accepter l'utilisation de vos données.");
//         return;
//     }

//     const submitButton = form.querySelector('button[type="submit"]');
//     const originalText = submitButton.textContent;

//     // Désactivation du bouton pendant l'envoi
//     submitButton.textContent = 'Envoi en cours...';
//     submitButton.disabled = true;
//     submitButton.style.opacity = '0.6';
//     submitButton.style.cursor = 'not-allowed';

//     console.log('⚙️ Vérification reCAPTCHA v3...');

//     // Vérification de la disponibilité de grecaptcha
//     if (typeof grecaptcha === 'undefined') {
//         //mettre autre chose!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//         // Réactivation du bouton
//         resetSubmitButton(submitButton, originalText);
//         return;
//     }

//     // Étape reCAPTCHA : génération du token avant l'envoi
//     grecaptcha.ready(function() {
//         grecaptcha.execute('6LcC7_grAAAAANd0w6CgPGfru3hXMv43d_ZypJNR', { action: 'submit' })
//             .then(function(token) {
//                 console.log('Token reCAPTCHA généré :', token);
//                 data['g-recaptcha-response'] = token;
//                 console.log('Données envoyées :', data);

//                 // Envoi des données à l'API
//                 return fetch(API_URL, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(data),
//                 });
//             })
//             .then(response => {
//                 console.log('📨 Réponse reçue, status:', response.status);
//                 return response.json().then(json => ({ status: response.status, body: json }));
//             })
//             .then(({ status, body }) => {
//                 console.log('📊 Données de réponse:', body);

//                 if (status === 200 && body.success) {
//                     console.log('✅ Succès ! Redirection vers la page de remerciement...');
//                     window.location.href = 'merci.html';
//                 } else {
//                     console.error('❌ Échec:', body.message);
//                     alert("Erreur d'envoi : " + (body.message || 'Veuillez vérifier les informations.'));
//                     // Réinitialiser le bouton en cas d'échec
//                     resetSubmitButton(submitButton, originalText);
//                 }
//             })
//             .catch(error => {
//                 console.error('❌ Erreur:', error);
//                 alert("Erreur de connexion avec le serveur. Veuillez réessayer pluds tard.");
//                 // Réinitialiser le bouton en cas d'erreur
//                 resetSubmitButton(submitButton, originalText);
//             });
//     });
// });


// // Fonction pour réinitialiser le bouton de soumission
// function resetSubmitButton(button, originalText) {
//     button.textContent = originalText;
//     button.disabled = false;
//     button.style.opacity = '1';
//     button.style.cursor = 'pointer';
// }


// Configuration de l'API
const API_URL = 'https://blixt-mailjet-api.onrender.com/api/contact';

// Fonction pour afficher des messages élégants
function showMessage(message, type = 'error') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        color: '#1a1a1a',
        backgroundColor: type === 'error' ? '#00e0ff' : '#10b981',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 10000);
}

// Ajouter les keyframes pour l'animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Vérification du consentement
    const consentCheckbox = document.getElementById('consent');
    if (!consentCheckbox.checked) {
        showMessage("Veuillez accepter l'utilisation de vos données personnelles.");
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Désactivation du bouton pendant l'envoi
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    // Vérification de la disponibilité de grecaptcha
    if (typeof grecaptcha === 'undefined') {
        showMessage("Service de sécurité indisponible. Veuillez rafraîchir la page.");
        resetSubmitButton(submitButton, originalText);
        return;
    }

    // Génération du token reCAPTCHA
    grecaptcha.ready(function() {
        grecaptcha.execute('6LcC7_grAAAAANd0w6CgPGfru3hXMv43d_ZypJNR', { action: 'submit' })
            .then(function(token) {
                data['g-recaptcha-response'] = token;

                // Envoi des données à l'API
                return fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            })
            .then(response => {
                return response.json().then(json => ({ status: response.status, body: json }));
            })
            .then(({ status, body }) => {
                if (status === 200 && body.success) {
                    window.location.href = 'merci.html';
                } else {
                    showMessage("Une erreur s'est produite lors de l'envoi. Veuillez réessayer.");
                    resetSubmitButton(submitButton, originalText);
                }
            })
            .catch(error => {
                showMessage("Impossible de contacter le serveur. Veuillez réessayer ultérieurement.");
                resetSubmitButton(submitButton, originalText);
            });
    });
});

// Fonction pour réinitialiser le bouton de soumission
function resetSubmitButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
}