// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const Mailjet = require('node-mailjet');

// const app = express();
// const PORT = process.env.PORT || 10000; 

// // ✅ CORRECTION CRITIQUE : Utiliser apiConnect au lieu du constructeur
// const mailjet = Mailjet.apiConnect(
//     process.env.MAILJET_API_KEY,
//     process.env.MAILJET_SECRET_KEY
// );

// // --- Configuration de Sécurité (CORS) ---
// // **VÉRIFIEZ ET REMPLACEZ** cette URL par l'URL exacte de votre site BLIXT sur Render
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

// // Adresses e-mail
// const DESTINATION_EMAIL = "mrlapin508@gmail.com"; 
// const SENDER_EMAIL = "nivelet.sebastien@orange.fr"; // Doit être vérifiée dans votre compte Mailjet !

// // Route de test pour vérifier que l'API fonctionne
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

// // Endpoint /api/contact qui sera appelé par votre formulaire
// app.post('/api/contact', async (req, res) => {
//     const { name, email, phone, message, hp_field } = req.body;
    
//     console.log('📨 Nouvelle requête contact reçue:', { name, email, phone: phone ? 'fourni' : 'non fourni' });
    
//     // 1. Contrôle Anti-Spam (Honeypot)
//     if (hp_field) {
//         console.log("⚠️ Honeypot activé. Requête ignorée.");
//         // Répondre succès pour ne pas alerter le bot
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
    
//     try {
//         console.log('📤 Tentative d\'envoi via Mailjet...');
        
//         const request = mailjet
//             .post('send', { version: 'v3.1' })
//             .request({
//                 Messages: [
//                     {
//                         From: {
//                             Email: SENDER_EMAIL,
//                             Name: "Formulaire BLIXT"
//                         },
//                         To: [
//                             {
//                                 Email: DESTINATION_EMAIL,
//                                 Name: "Équipe BLIXT"
//                             }
//                         ],
//                         Subject: `Demande de devis BLIXT par ${name}`,
//                         TextPart: `
// Nouvelle demande de devis BLIXT

// Nom: ${name}
// Email: ${email}
// Téléphone: ${phone || 'Non fourni'}

// Message:
// ${message}
//                         `.trim(),
//                         HTMLPart: `
// <!DOCTYPE html>
// <html>
// <head>
//     <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background-color: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
//         .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
//         .field { margin-bottom: 20px; padding: 15px; background: white; border-left: 4px solid #667eea; }
//         .label { font-weight: bold; color: #667eea; display: block; margin-bottom: 5px; }
//         .value { color: #333; }
//         .message-box { background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 4px; margin-top: 10px; }
//         .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <h2>⚡ Nouvelle demande de devis BLIXT</h2>
//         </div>
//         <div class="content">
//             <div class="field">
//                 <span class="label">👤 Nom complet</span>
//                 <span class="value">${name}</span>
//             </div>
//             <div class="field">
//                 <span class="label">📧 Email</span>
//                 <span class="value"><a href="mailto:${email}">${email}</a></span>
//             </div>
//             <div class="field">
//                 <span class="label">📱 Téléphone</span>
//                 <span class="value">${phone || 'Non renseigné'}</span>
//             </div>
//             <div class="field">
//                 <span class="label">💬 Message</span>
//                 <div class="message-box">
//                     ${message.replace(/\n/g, '<br>')}
//                 </div>
//             </div>
//             <div class="footer">
//                 📅 Reçu le ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
//             </div>
//         </div>
//     </div>
// </body>
// </html>
//                         `.trim()
//                     }
//                 ]
//             });

//         await request;
        
//         console.log('✅ Email envoyé avec succès !');
//         console.log('📊 Message envoyé à:', DESTINATION_EMAIL);

//         // Succès
//         return res.status(200).json({ 
//             success: true, 
//             message: "Message envoyé avec succès." 
//         });

//     } catch (error) {
//         console.error('❌ Erreur Mailjet:', error.statusCode, error.message);
        
//         // Log détaillé pour le debug
//         if (error.response) {
//             console.error('📋 Détails de l\'erreur:', JSON.stringify(error.response.body, null, 2));
//         }
        
//         // Échec Mailjet
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
//         message: 'Route non trouvée. Utilisez GET / ou POST /api/contact' 
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
//     console.log(`   ├─ API Key: ${process.env.MAILJET_API_KEY ? '✅ Présente' : '❌ Manquante'}`);
//     console.log(`   ├─ Secret Key: ${process.env.MAILJET_SECRET_KEY ? '✅ Présente' : '❌ Manquante'}`);
//     console.log(`   ├─ Expéditeur: ${SENDER_EMAIL}`);
//     console.log(`   └─ Destinataire: ${DESTINATION_EMAIL}`);
//     console.log('');
//     console.log('🔒 Sécurité:');
//     console.log(`   └─ CORS autorisé pour: ${YOUR_RENDER_SITE_URL}`);
//     console.log('');
//     console.log('📍 Routes disponibles:');
//     console.log('   ├─ GET  / (test de l\'API)');
//     console.log('   └─ POST /api/contact (envoi de formulaire)');
//     console.log('═══════════════════════════════════════════════════');
//     console.log('');
// });



import 'dotenv/config'; // Au lieu de require('dotenv').config();
import express from 'express'; // Au lieu de const express = require('express');
import cors from 'cors'; // Au lieu de const cors = require('cors');
import Mailjet from 'node-mailjet'; // Au lieu de const Mailjet = require('node-mailjet');
import fetch from 'node-fetch'; // Au lieu de const fetch = require('node-fetch');


const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Connexion à Mailjet
const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

// --- Sécurité (CORS) ---
// const YOUR_RENDER_SITE_URL = 'https://blixt.onrender.com';
// const corsOptions = {
//     origin: YOUR_RENDER_SITE_URL,
//     optionsSuccessStatus: 200
// };
const corsOptions = {
    origin: ['https://blixt.onrender.com', 'http://127.0.0.1:5500'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Emails
const DESTINATION_EMAIL = "mrlapin508@gmail.com";
const SENDER_EMAIL = "nivelet.sebastien@orange.fr";

// --- Test API ---
app.get('/', (req, res) => {
    res.json({
        message: 'API Mailjet BLIXT opérationnelle',
        timestamp: new Date().toISOString(),
        env_check: {
            api_key_present: !!process.env.MAILJET_API_KEY,
            secret_key_present: !!process.env.MAILJET_SECRET_KEY,
            recaptcha_key_present: !!process.env.RECAPTCHA_SECRET_KEY
        }
    });
});

// --- Route principale ---
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message, hp_field, 'g-recaptcha-response': recaptchaToken } = req.body;

    console.log('📨 Nouvelle requête contact reçue:', { name, email });

    // 🛑 Honeypot anti-spam
    if (hp_field) {
        console.log("⚠️ Honeypot activé. Requête ignorée.");
        return res.status(200).json({ success: true, message: "Merci pour votre message." });
    }

    // ⚠️ Vérification des champs
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Nom, email et message sont requis."
        });
    }

    // ✅ Étape reCAPTCHA : validation du token côté serveur
    try {
        console.log('🔒 Vérification reCAPTCHA côté serveur...');
        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
        const recaptchaRes = await fetch(verifyURL, { method: 'POST' });
        const recaptchaData = await recaptchaRes.json();

        console.log('📊 Résultat reCAPTCHA:', recaptchaData);

        if (!recaptchaData.success || recaptchaData.score < 0.5) {
            console.warn('🚫 Vérification reCAPTCHA échouée.');
            return res.status(400).json({
                success: false,
                message: "Échec reCAPTCHA : tentative suspecte détectée."
            });
        }
    } catch (err) {
        console.error('❌ Erreur lors de la vérification reCAPTCHA:', err);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la vérification du reCAPTCHA."
        });
    }

    // ✅ Si le reCAPTCHA est validé → envoi du mail via Mailjet
    try {
        console.log('📤 Envoi du mail via Mailjet...');
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: { Email: SENDER_EMAIL, Name: "Formulaire BLIXT" },
                        To: [{ Email: DESTINATION_EMAIL, Name: "Équipe BLIXT" }],
                        Subject: `Demande de devis BLIXT par ${name}`,
                        TextPart: `
Nom: ${name}
Email: ${email}
Téléphone: ${phone || 'Non fourni'}

Message:
${message}
                        `.trim(),
                        HTMLPart: `
                        <html>
                        <body style="font-family: Arial; color: #333;">
                        <h2>⚡ Nouvelle demande de devis BLIXT</h2>
                        <p><b>👤 Nom:</b> ${name}</p>
                        <p><b>📧 Email:</b> ${email}</p>
                        <p><b>📱 Téléphone:</b> ${phone || 'Non renseigné'}</p>
                        <p><b>💬 Message:</b><br>${message.replace(/\n/g, '<br>')}</p>
                        <p style="font-size:12px;color:#777;">📅 Reçu le ${new Date().toLocaleString('fr-FR')}</p>
                        </body>
                        </html>`
                    }
                ]
            });

        await request;
        console.log('✅ Email envoyé avec succès !');
        return res.status(200).json({ success: true, message: "Message envoyé avec succès." });

    } catch (error) {
        console.error('❌ Erreur Mailjet:', error.statusCode, error.message);
        return res.status(500).json({
            success: false,
            message: `Erreur lors de l'envoi via Mailjet.`
        });
    }
});

// --- Gestion 404 ---
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée. Utilisez GET / ou POST /api/contact'
    });
});

// --- Lancement du serveur ---
app.listen(PORT, () => {
    console.log('🚀 Serveur BLIXT démarré sur le port', PORT);
});
