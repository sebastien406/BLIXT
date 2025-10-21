

// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const Mailjet = require('node-mailjet');
// const fs = require('fs'); // Pour la lecture du fichier HTML
// const path = require('path'); // Pour la gestion des chemins

// const app = express();
// const PORT = process.env.PORT || 10000; 

// // ✅ Mailjet Connexion
// const mailjet = Mailjet.apiConnect(
//     process.env.MAILJET_API_KEY,
//     process.env.MAILJET_SECRET_KEY
// );

// // --- Configuration de Sécurité (CORS) ---
// const YOUR_RENDER_SITE_URL = 'https://blixt.onrender.com'; 
// const corsOptions = {
//     origin: YOUR_RENDER_SITE_URL, 
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
// // ----------------------------------------

// // Middlewares pour lire les données POST
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// const DESTINATION_EMAIL = "mrlapin508@gmail.com"; 

// // 💡 GESTION DU TEMPLATE HTML : Lecture au démarrage
// let emailTemplateHtml = null;

// try {
//     // Le chemin est configuré pour trouver 'modele-email.html' dans le même dossier que 'index.js'
//     const templatePath = path.join(__dirname, 'modele-email.html'); 
//     emailTemplateHtml = fs.readFileSync(templatePath, 'utf8');
//     console.log('✅ Modèle d\'e-mail HTML chargé avec succès.');
// } catch (error) {
//     console.error(`❌ ERREUR FATALE: Impossible de lire le fichier modèle-email.html.`, error.message);
//     process.exit(1); 
// }
// // ------------------------------

// // Route de test 
// app.get('/', (req, res) => {
//     res.json({ 
//         message: 'API Mailjet BLIXT opérationnelle',
//         timestamp: new Date().toISOString(),
//         env_check: {
//             api_key_present: !!process.env.MAILJET_API_KEY,
//             secret_key_present: !!process.env.MAILJET_SECRET_KEY
//         }
//     });
// });

// // Endpoint /api/contact
// app.post('/api/contact', async (req, res) => {
//     const { name, email, phone, message, hp_field } = req.body;
    
//     console.log('📨 Nouvelle requête contact reçue:', { name, email, phone: phone ? 'fourni' : 'non fourni' });
    
//     // 1. Contrôle Anti-Spam (Honeypot)
//     if (hp_field) {
//         console.log("⚠️ Honeypot activé. Requête ignorée.");
//         return res.status(200).json({ success: true, message: "Merci pour votre message." }); 
//     }

//     // 2. Vérification des champs requis
//     if (!name || !email || !message) {
//         console.log('❌ Champs manquants');
//         return res.status(400).json({ 
//             success: false, 
//             message: "Nom, email et message sont requis." 
//         });
//     }

//     // --- TEMPLATING : Remplacement des placeholders avec les données ---
//     let finalHtml = emailTemplateHtml; 
    
//     finalHtml = finalHtml.replace(/__NAME__/g, name);
//     finalHtml = finalHtml.replace(/__EMAIL__/g, email);
//     finalHtml = finalHtml.replace(/__PHONE__/g, phone || 'Non renseigné'); 
    
//     // Remplacement du message avec gestion des sauts de ligne pour le HTML
//     finalHtml = finalHtml.replace(/__MESSAGE__/g, message.replace(/\n/g, '<br>')); 
//     finalHtml = finalHtml.replace(/__DATE__/g, new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
//     // ------------------------------------------------------------------
    
//     // Texte brut (TextPart)
//     const textPartContent = `
// Nouvelle demande de devis BLIXT

// Nom: ${name}
// Email: ${email}
// Téléphone: ${phone || 'Non fourni'}

// Message:
// ${message}
//     `.trim();
    
//     try {
//         console.log('📤 Tentative d\'envoi via Mailjet...');
        
//         const request = mailjet
//             .post('send', { version: 'v3.1' })
//             .request({
//                 Messages: [
//                     {
//                         From: {
//                             Email: "votre-adresse-mailjet-verifiee@votredomaine.com", // ⚠️ À Remplacer
//                             Name: "Formulaire BLIXT"
//                         },
//                         To: [
//                             {
//                                 Email: DESTINATION_EMAIL,
//                                 Name: "Équipe BLIXT"
//                             }
//                         ],
//                         Subject: `Demande de devis BLIXT par ${name}`,
//                         TextPart: textPartContent,
//                         HTMLPart: finalHtml // Utilisation du template HTML rempli
//                     }
//                 ]
//             });

//         await request;
        
//         console.log('✅ Email envoyé avec succès !');

//         return res.status(200).json({ 
//             success: true, 
//             message: "Message envoyé avec succès." 
//         });

//     } catch (error) {
//         console.error('❌ Erreur Mailjet:', error.statusCode, error.message);
        
//         if (error.response) {
//             console.error('📋 Détails de l\'erreur:', JSON.stringify(error.response.body, null, 2));
//         }
        
//         return res.status(500).json({ 
//             success: false, 
//             message: `Erreur lors de l'envoi via Mailjet. Code: ${error.statusCode || 'inconnu'}`
//         });
//     }
// });

// // Gestion des routes non trouvées
// app.use((req, res) => {
//     res.status(404).json({ 
//         success: false, 
//         message: 'Route non trouvée.' 
//     });
// });

// // Démarrage du serveur
// app.listen(PORT, () => {
//     console.log('');
//     console.log('═══════════════════════════════════════════════════');
//     console.log('🚀 Serveur BLIXT démarré avec succès !');
//     console.log('═══════════════════════════════════════════════════');
//     console.log(`📡 Port: ${PORT}`);
//     console.log(`🌐 URL: http://localhost:${PORT}`);
//     console.log('');
//     console.log('📧 Configuration Mailjet:');
//     console.log(`   ├─ API Key: ${process.env.MAILJET_API_KEY ? '✅ Présente' : '❌ Manquante'}`);
//     console.log(`   ├─ Secret Key: ${process.env.MAILJET_SECRET_KEY ? '✅ Présente' : '❌ Manquante'}`);
//     console.log('');
//     console.log('🔒 Sécurité:');
//     console.log(`   └─ CORS autorisé pour: ${YOUR_RENDER_SITE_URL}`);
//     console.log('');
//     console.log('📍 Routes disponibles:');
//     console.log('   ├─ GET  / (test de l\'API)');
//     console.log('   └─ POST /api/contact (envoi de formulaire)');
//     console.log('═══════════════════════════════════════════════════');
//     console.log('');
// });

// contact-form.js (backend)

import express from "express";
import fetch from "node-fetch";
import Mailjet from "node-mailjet";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Configuration Mailjet
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

// ✅ Route unique pour traiter le formulaire
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message, hp_field, ["g-recaptcha-response"]: token } = req.body;

    // 🚫 Vérification du honeypot (anti-spam)
    if (hp_field) {
      console.log("⚠️ Spam détecté (honeypot activé). Requête ignorée.");
      return res.status(200).json({ success: true, message: "Message reçu." });
    }

    // 🧠 Vérification du reCAPTCHA
    if (!token) {
      return res.status(400).json({ success: false, message: "Token reCAPTCHA manquant." });
    }

    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    const captchaRes = await fetch(verifyURL, { method: "POST" });
    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      console.warn("❌ reCAPTCHA invalide :", captchaData);
      return res.status(400).json({ success: false, message: "Échec de la vérification reCAPTCHA." });
    }

    // ✉️ Envoi du mail via Mailjet
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "contact@tonsite.fr",
            Name: "Site Web BLIXT",
          },
          To: [
            {
              Email: "contact@blixtelec.fr",
              Name: "BLIXT",
            },
          ],
          Subject: "Nouveau message depuis le formulaire de contact",
          TextPart: `
            Nom : ${name}
            Email : ${email}
            Téléphone : ${phone || "Non renseigné"}
            Message :
            ${message}
          `,
        },
      ],
    });

    console.log("✅ Email envoyé :", result.body);
    res.status(200).json({ success: true, message: "Message envoyé avec succès !" });

  } catch (error) {
    console.error("❌ Erreur lors du traitement :", error);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// 🚀 Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur en ligne sur le port ${PORT}`));
