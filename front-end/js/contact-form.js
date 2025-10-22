const API_URL = 'https://blixt-mailjet-api.onrender.com/api/contact'; 

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    
    // Vérification du consentement
    const consentCheckbox = document.getElementById('consent');
    if (!consentCheckbox.checked) {
        alert("Veuillez accepter l'utilisation de vos données.");
        return;
    }

    // ✅ VÉRIFICATION RECAPTCHA V2
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse || recaptchaResponse.length === 0) {
        alert("Veuillez cocher la case 'Je ne suis pas un robot'.");
        return;
    }

    const formData = new FormData(form);
    const data = {};
    
    // Récupération de toutes les données du formulaire
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // ✅ AJOUT DU TOKEN RECAPTCHA AUX DONNÉES
    data.recaptchaToken = recaptchaResponse;

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Désactivation du bouton pendant l'envoi
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    console.log('📤 Envoi des données vers l\'API...');
    console.log('🔐 Token reCAPTCHA inclus');

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
            
            // ✅ RESET DU RECAPTCHA EN CAS D'ERREUR
            grecaptcha.reset();
            
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
        
        // ✅ RESET DU RECAPTCHA EN CAS D'ERREUR
        grecaptcha.reset();
        
        // Réactivation du bouton
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    });
});

// Log de confirmation du chargement du script
console.log('🚀 Script contact-form.js chargé avec succès');
console.log('🌐 API URL configurée:', API_URL);
console.log('🔐 reCAPTCHA v2 activé');