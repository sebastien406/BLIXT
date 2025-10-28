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

// contact-form.js — version finale compatible Render + reCAPTCHA v3 + CSP
console.log("🚀 Script contact-form.js chargé avec succès");

// --- Configuration ---
const API_URL = "https://blixt-mailjet-api.onrender.com/api/contact";
console.log("🌐 API URL configurée:", API_URL);

const RECAPTCHA_SITE_KEY = "TA_CLE_SITE_RECAPTCHA"; // ⚠️ Remplace ici par ta vraie clé publique (site key)

// --- Fonction d’envoi du formulaire ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusDiv = document.getElementById("form-status");

  if (!form) {
    console.error("❌ Formulaire non trouvé dans la page.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusDiv.textContent = "⏳ Envoi en cours...";

    const formData = {
      name: form.querySelector('input[name="name"]').value.trim(),
      email: form.querySelector('input[name="email"]').value.trim(),
      phone: form.querySelector('input[name="phone"]').value.trim(),
      message: form.querySelector('textarea[name="message"]').value.trim(),
      hp_field: form.querySelector('input[name="hp_field"]')?.value || "",
    };

    console.log("🧾 Données formulaire:", formData);

    try {
      // --- Étape 1 : obtenir le token reCAPTCHA ---
      const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "submit" });
      console.log("🔐 Token reCAPTCHA obtenu:", token ? "OK" : "Manquant");

      if (!token) {
        throw new Error("Token reCAPTCHA manquant.");
      }

      // --- Étape 2 : envoyer au backend ---
      console.log("📤 Envoi des données vers l'API...");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, "g-recaptcha-response": token }),
      });

      console.log("📨 Réponse reçue, status:", response.status);

      const data = await response.json();
      console.log("📊 Données de réponse:", data);

      if (response.ok) {
        statusDiv.textContent = "✅ Message envoyé avec succès !";
        form.reset();
      } else {
        statusDiv.textContent = `❌ Échec: ${data.message || "Erreur inconnue."}`;
      }
    } catch (error) {
      console.error("⚠️ Erreur lors de l'envoi:", error);
      statusDiv.textContent = "❌ Une erreur est survenue. Vérifie ta connexion.";
    }
  });
});

// --- Charger reCAPTCHA v3 ---
(function loadRecaptcha() {
  if (typeof grecaptcha === "undefined") {
    console.log("⚙️ Chargement du script reCAPTCHA...");
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => console.log("✅ reCAPTCHA v3 chargé !");
    document.head.appendChild(script);
  } else {
    console.log("✅ reCAPTCHA déjà disponible.");
  }
})();

