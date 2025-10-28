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

console.log("🚀 Script contact-form.js chargé avec succès");

// --- Configuration ---
const API_URL = "https://blixt-mailjet-api.onrender.com/api/contact";
console.log("🌐 API URL configurée:", API_URL);

// ⚠️ REMPLACEZ par votre VRAIE clé publique reCAPTCHA v3
// Obtenez-la ici: https://www.google.com/recaptcha/admin
const RECAPTCHA_SITE_KEY = "6LcC7_grAAAAANd0w6CgPGfru3hXMv43d_ZypJNR";

// --- Chargement de reCAPTCHA v3 ---
(function loadRecaptcha() {
  if (typeof grecaptcha === "undefined") {
    console.log("⚙️ Chargement du script reCAPTCHA...");
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => console.log("✅ reCAPTCHA v3 chargé avec succès!");
    script.onerror = () => console.error("❌ Échec du chargement de reCAPTCHA");
    document.head.appendChild(script);
  } else {
    console.log("✅ reCAPTCHA déjà disponible.");
  }
})();

// --- Fonction d'envoi du formulaire ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusDiv = document.getElementById("form-status");

  if (!form) {
    console.error("❌ Formulaire #contact-form non trouvé dans la page.");
    return;
  }

  console.log("✅ Formulaire trouvé, écouteur d'événement attaché");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📝 Formulaire soumis - Début du traitement");

    // Afficher le statut d'envoi
    if (statusDiv) {
      statusDiv.textContent = "⏳ Envoi en cours...";
      statusDiv.style.color = "#007bff";
    }

    // Récupération des données du formulaire
    const formData = {
      name: form.querySelector('input[name="name"]')?.value.trim() || "",
      email: form.querySelector('input[name="email"]')?.value.trim() || "",
      phone: form.querySelector('input[name="phone"]')?.value.trim() || "",
      message: form.querySelector('textarea[name="message"]')?.value.trim() || "",
      hp_field: form.querySelector('input[name="hp_field"]')?.value || "",
    };

    console.log("🧾 Données du formulaire récupérées:", {
      name: formData.name,
      email: formData.email,
      hasPhone: !!formData.phone,
      messageLength: formData.message.length,
      hp_field: formData.hp_field ? "REMPLI (spam détecté)" : "vide (OK)"
    });

    try {
      // --- Étape 1 : Vérifier que reCAPTCHA est chargé ---
      if (typeof grecaptcha === "undefined") {
        throw new Error("❌ reCAPTCHA n'est pas chargé. Rechargez la page.");
      }

      console.log("🔐 Demande de génération du token reCAPTCHA...");

      // --- Étape 2 : Obtenir le token reCAPTCHA ---
      const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "submit" });
      
      if (!token) {
        throw new Error("Token reCAPTCHA non généré.");
      }

      console.log("✅ Token reCAPTCHA obtenu:", token.substring(0, 30) + "...");

      // --- Étape 3 : Préparer le payload ---
      // ⚠️ IMPORTANT: Utiliser "recaptchaToken" (nom attendu par votre backend)
      const payload = {
        ...formData,
        recaptchaToken: token
      };

      console.log("📦 Payload préparé avec recaptchaToken:", {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        messageLength: payload.message?.length,
        hp_field: payload.hp_field,
        hasRecaptchaToken: !!payload.recaptchaToken
      });

      // --- Étape 4 : Envoyer au backend ---
      console.log("📤 Envoi de la requête POST vers:", API_URL);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📨 Réponse HTTP reçue, status:", response.status);

      // --- Étape 5 : Traiter la réponse ---
      const data = await response.json();
      console.log("📊 Corps de la réponse JSON:", data);

      if (response.ok && data.success) {
        console.log("✅ MESSAGE ENVOYÉ AVEC SUCCÈS!");
        if (statusDiv) {
          statusDiv.textContent = "✅ Message envoyé avec succès !";
          statusDiv.style.color = "#28a745";
        }
        form.reset();
      } else {
        const errorMsg = data.message || "Erreur inconnue.";
        console.error("❌ Échec de l'envoi:", errorMsg);
        if (statusDiv) {
          statusDiv.textContent = `❌ Échec: ${errorMsg}`;
          statusDiv.style.color = "#dc3545";
        }
      }

    } catch (error) {
      console.error("⚠️ ERREUR lors de l'envoi:", error.message);
      console.error("Stack trace:", error);
      if (statusDiv) {
        statusDiv.textContent = `❌ ${error.message || "Une erreur est survenue."}`;
        statusDiv.style.color = "#dc3545";
      }
    }
  });

  console.log("🎯 Gestionnaire de formulaire initialisé et prêt");
});