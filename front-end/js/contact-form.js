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

// ==========================
// contact-form.js (version finale propre)
// ==========================

// Configuration de l'API (backend hébergé sur Render)
const API_URL = 'https://blixt-mailjet-api.onrender.com/api/contact';

// --- LOG DÉMARRAGE ---
console.log('🚀 Script contact-form.js chargé avec succès');
console.log('🌐 API URL configurée :', API_URL);

// --- GESTION DU FORMULAIRE ---
document.getElementById('contactForm').addEventListener('submit', async function (e) {
e.preventDefault()
const form = e.target;
const formData = new FormData(form);
const data = {};

formData.forEach((value, key) => {
    data[key] = value;
});

// --- Vérification du consentement RGPD ---
const consentCheckbox = document.getElementById('consent');
if (!consentCheckbox.checked) {
    alert("Veuillez accepter l'utilisation de vos données avant d'envoyer le formulaire.");
    return;
}

const submitButton = form.querySelector('button[type=\"submit\"]');
const originalText = submitButton.textContent;

// Désactiver le bouton pendant l'envoi
submitButton.textContent = 'Envoi en cours...';
submitButton.disabled = true;
submitButton.style.opacity = '0.6';
submitButton.style.cursor = 'not-allowed';

console.log('⚙️ Vérification reCAPTCHA v3...');

// Vérifier que grecaptcha est bien chargé
if (typeof grecaptcha === 'undefined') {
    console.error('❌ reCAPTCHA non chargé (grecaptcha est undefined)');
    alert("Erreur reCAPTCHA — veuillez recharger la page et réessayer.");
    return resetSubmitButton(submitButton, originalText);
}

try {
    // --- Étape 1 : Générer le token ---
    const token = await grecaptcha.execute('6LcHj_UrAAAAAF62B2oDMTqIaxOa1FMvgpt3SEDd', { action: 'submit' });
    console.log('✅ Token reCAPTCHA généré :', token);

    // Ajouter le token aux données du formulaire
    data['g-recaptcha-response'] = token;

    console.log('📦 Données envoyées :', data);

    // --- Étape 2 : Envoi à ton API ---
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    console.log('📨 Réponse reçue, status :', response.status);
    const result = await response.json();
    console.log('📊 Contenu de la réponse :', result);

    // --- Étape 3 : Gestion du résultat ---
    if (response.ok && result.success) {
        console.log('✅ Message envoyé avec succès');
        window.location.href = 'merci.html'; // Redirection vers la page de remerciement
    } else {
        console.error('❌ Échec de l’envoi :', result.message);
        alert("Erreur : " + (result.message || "Échec de la vérification reCAPTCHA."));
        resetSubmitButton(submitButton, originalText);
    }

} catch (error) {
    console.error('💥 Erreur pendant l’envoi :', error);
    alert("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
    resetSubmitButton(submitButton, originalText);
}
});

// --- Fonction utilitaire pour réinitialiser le bouton ---
function resetSubmitButton(button, originalText) {
button.textContent = originalText;
button.disabled = false;
button.style.opacity = '1';
button.style.cursor = 'pointer';
}