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
//         console.error('grecaptcha n\'est pas défini. Le script reCAPTCHA n\'a pas été chargé correctement.');
//         alert("Erreur lors de la vérification reCAPTCHA. Veuillez réessayer.");

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
//                 alert("Erreur de connexion avec le serveur. Veuillez vérifier votre connexion internet et réessayer.");
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

// Clé de site publique V3 STANDARD (Nécessaire pour le frontend)
const RECAPTCHA_SITE_KEY = '6LcC7_grAAAAANd0w6CgPGfru3hXMv43d_ZypJNR'; 

// Log de confirmation du chargement du script
console.log('🚀 Script contact-form.js chargé avec succès');
console.log('🌐 API URL configurée:', API_URL);

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {};

    // Récupération de toutes les données du formulaire
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Vérification du consentement
    const consentCheckbox = document.getElementById('consent');
    if (!consentCheckbox.checked) {
        alert("Veuillez accepter l'utilisation de vos données.");
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Désactivation du bouton pendant l'envoi
    submitButton.textContent = 'Vérification de sécurité...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    console.log('⚙️ Exécution reCAPTCHA V3 standard...');

    // Vérification de la disponibilité de grecaptcha
    if (typeof grecaptcha === 'undefined') {
        console.error('grecaptcha n\'est pas défini.');
        alert("Erreur de sécurité. Veuillez actualiser la page.");
        resetSubmitButton(submitButton, originalText);
        return;
    }

    // ⭐ Étape reCAPTCHA : génération du token V3 standard
    grecaptcha.ready(function() {
        // NOTE: On utilise grecaptcha.execute avec la clé standard
        grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit_contact' }) 
            .then(function(token) {
                console.log('Token reCAPTCHA généré :', token);
                data['g-recaptcha-response'] = token; // Ajout du token aux données
                console.log('Données envoyées :', data);

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
                console.log('📨 Réponse reçue, status:', response.status);
                return response.json().then(json => ({ status: response.status, body: json }));
            })
            .then(({ status, body }) => {
                console.log('📊 Données de réponse:', body);

                if (status === 200 && body.success) {
                    console.log('✅ Succès ! Redirection vers la page de remerciement...');
                    window.location.href = 'merci.html';
                } else {
                    console.error('❌ Échec:', body.message);
                    alert("Erreur d'envoi : " + (body.message || 'Veuillez vérifier les informations.'));
                    // Réinitialiser le bouton en cas d'échec
                    resetSubmitButton(submitButton, originalText);
                }
            })
            .catch(error => {
                console.error('❌ Erreur de réseau ou de sécurité:', error);
                alert("Erreur de connexion avec le serveur. Veuillez vérifier votre connexion internet et réessayer.");
                // Réinitialiser le bouton en cas d'erreur
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