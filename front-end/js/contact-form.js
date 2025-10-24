

// // Configuration de l'API
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

// Configuration de l'API
const API_URL = 'https://blixt-mailjet-api.onrender.com/api/contact'; 

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
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    console.log('⚙️ Vérification reCAPTCHA v3...');

    // ✅ Étape reCAPTCHA : génération du jeton avant l'envoi
    grecaptcha.ready(function() {
        grecaptcha.execute('6LfvPPUrAAAAAEI8ZlcYbo5nbWcgwljeM6mjp-Ar', { action: 'submit' }).then(function(token) {
    console.log('Token reCAPTCHA généré :', token); // Ajoute cette ligne
    data['g-recaptcha-response'] = token;
    console.log('📤 Envoi des données vers l\'API...', data);
    // ...
});


            // Envoi des données à l'API
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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
                    
                    // Réactivation du bouton
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                }
            })
            .catch(error => {
                console.error('❌ Erreur réseau:', error);
                alert("Erreur de connexion avec le serveur. Veuillez vérifier votre connexion internet et réessayer.");
                
                // Réactivation du bouton
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            });
        });
    });


// Log de confirmation du chargement du script
console.log('🚀 Script contact-form.js chargé avec succès');
console.log('🌐 API URL configurée:', API_URL);
