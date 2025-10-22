
// const API_URL = 'https://blixt-mailjet-api.onrender.com/api/contact'; 

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

//     console.log('📤 Envoi des données vers l\'API...');

//     fetch(API_URL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => {
//         console.log('📨 Réponse reçue, status:', response.status);
//         return response.json().then(json => ({ status: response.status, body: json }));
//     })
//     .then(({ status, body }) => {
//         console.log('📊 Données de réponse:', body);
        
//         if (status === 200 && body.success) {
//             console.log('✅ Succès ! Redirection vers la page de remerciement...');
//             window.location.href = 'merci.html'; 
//         } else {
//             console.error('❌ Échec:', body.message);
//             alert("Erreur d'envoi : " + (body.message || 'Veuillez vérifier les informations.'));
            
//             // Réactivation du bouton
//             submitButton.textContent = originalText;
//             submitButton.disabled = false;
//             submitButton.style.opacity = '1';
//             submitButton.style.cursor = 'pointer';
//         }
//     })
//     .catch(error => {
//         console.error('❌ Erreur réseau:', error);
//         alert("Erreur de connexion avec le serveur. Veuillez vérifier votre connexion internet et réessayer.");
        
//         // Réactivation du bouton
//         submitButton.textContent = originalText;
//         submitButton.disabled = false;
//         submitButton.style.opacity = '1';
//         submitButton.style.cursor = 'pointer';
//     });
// });

// // Log de confirmation du chargement du script
// console.log('🚀 Script contact-form.js chargé avec succès');
// console.log('🌐 API URL configurée:', API_URL);

// URL de ton API Node sur Render
const API_URL = 'https://blixt-mailjet-api.onrender.com/api/contact';

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Vérifie la case de consentement
    const consentCheckbox = document.getElementById('consent');
    if (!consentCheckbox.checked) {
        alert("Veuillez accepter l'utilisation de vos données.");
        return;
    }

    // Vérifie le reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        alert("Veuillez valider le reCAPTCHA avant d'envoyer le message.");
        return;
    }
    data["g-recaptcha-response"] = recaptchaResponse;

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    console.log('📤 Envoi des données vers l’API...');

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json().then(json => ({ status: response.status, body: json })))
    .then(({ status, body }) => {
        console.log('📊 Réponse:', body);
        if (status === 200 && body.success) {
            window.location.href = 'merci.html';
        } else {
            alert("Erreur : " + (body.message || 'Veuillez réessayer.'));
            resetButton(submitButton, originalText);
        }
    })
    .catch(error => {
        console.error('❌ Erreur réseau:', error);
        alert("Erreur de connexion avec le serveur. Veuillez réessayer.");
        resetButton(submitButton, originalText);
    })
    .finally(() => {
        grecaptcha.reset();
    });
});

function resetButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
}

console.log('🚀 contact-form.js chargé avec succès');
