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
//         grecaptcha.execute('6LcHj_UrAAAAAF62B2oDMTqIaxOa1FMvgpt3SEDd', { action: 'submit' })
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

// URL de l'API Render pour l'envoi du formulaire
const API_URL = 'https://blixt-mailjet-api.onrender.com/api/contact';
// Clé de site reCAPTCHA V3 (publique) utilisée dans votre HTML
const RECAPTCHA_SITE_KEY = '6LcHj_UrAAAAAF62B2oDMTqIaxOa1FMvgpt3SEDd';

console.log(`🌐 API URL configurée: ${API_URL}`);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.btn-contact');
    const originalButtonText = submitButton.textContent;
    const messageDisplay = document.getElementById('messageDisplay');

    // --- Fonction d'affichage des messages ---
    function showMessage(type, message) {
        if (!messageDisplay) return;

        // Réinitialise la classe pour un nouveau message
        messageDisplay.className = 'message-box';
        
        if (type === 'success') {
            messageDisplay.classList.add('success');
        } else if (type === 'error') {
            messageDisplay.classList.add('error');
        }
        messageDisplay.textContent = message;
        messageDisplay.style.display = 'block';

        // Disparaît après 7 secondes
        setTimeout(() => {
            messageDisplay.style.display = 'none';
        }, 7000);
    }

    // --- Fonction de réinitialisation du bouton ---
    function enableSubmitButton() {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }

    // --- Écouteur de soumission du formulaire ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Désactiver le bouton pour éviter les doubles clics
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        messageDisplay.style.display = 'none';

        // 2. Tente d'obtenir le token reCAPTCHA V3 de manière robuste
        let recaptchaToken = null;

        try {
            // Assure que grecaptcha est prêt avant d'exécuter
            await new Promise(resolve => grecaptcha.ready(resolve));
            console.log('grecaptcha est prêt. Exécution...');
            
            // Exécute la vérification reCAPTCHA
            recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit_contact' });
            
            if (!recaptchaToken) {
                throw new Error("reCAPTCHA n'a pas pu générer le token (grecaptcha.execute a renvoyé vide).");
            }
            
            console.log('✅ Token reCAPTCHA généré avec succès.');

        } catch (error) {
            console.error('❌ Échec de la génération du token reCAPTCHA:', error.message);
            showMessage('error', "Échec de la vérification reCAPTCHA : le token n'a pas été généré. Veuillez réessayer. (Vérifiez l'autorisation de domaine chez Google)");
            enableSubmitButton();
            return;
        }

        // 3. Récupérer les données du formulaire
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => (data[key] = value));
        
        // Ajout du token reCAPTCHA au corps de la requête
        data['g-recaptcha-response'] = recaptchaToken;
        
        console.log('📤 Envoi des données vers l\'API...');

        // 4. Envoi à l'API Render
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            console.log(`📨 Réponse reçue, status: ${response.status}`);
            const result = await response.json();
            console.log('📊 Données de réponse:', result);

            if (result.success) {
                showMessage('success', "Message envoyé avec succès ! Nous vous recontacterons très vite.");
                form.reset(); // Réinitialise le formulaire en cas de succès
            } else {
                // Gérer les erreurs renvoyées par le serveur (ex: erreur de score, token manquant)
                const errorMessage = result.message || "Une erreur inconnue est survenue lors de l'envoi.";
                showMessage('error', `❌ Échec: ${errorMessage}`);
            }

        } catch (error) {
            console.error('❌ Erreur Fetch/Réseau:', error);
            showMessage('error', `❌ Erreur réseau. Impossible de contacter l'API Render.`);
        } finally {
            enableSubmitButton();
        }
    });
});
