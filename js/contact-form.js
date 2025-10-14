// DANS js/contact-form.js

// !!! IMPORTANT : REMPLACEZ CETTE URL !!!
// C'est l'URL de votre service Render + /api/contact
const API_URL = 'https://blixt-mailjet-api.onrender.com'; 

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        return response.json().then(json => ({ status: response.status, body: json }));
    })
    .then(({ status, body }) => {
        if (status === 200 && body.success) {
            // Succès : Redirection vers la page de remerciement
            window.location.href = '/merci.html'; 
        } else {
            // Échec
            alert("Erreur d'envoi : " + (body.message || 'Veuillez vérifier les informations.'));
            submitButton.textContent = 'Envoyer votre message';
            submitButton.disabled = false;
        }
    })
    .catch(error => {
        console.error('Erreur réseau:', error);
        alert("Erreur de connexion avec le serveur.");
        submitButton.textContent = 'Envoyer votre message';
        submitButton.disabled = false;
    });
});