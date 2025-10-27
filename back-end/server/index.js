
// import 'dotenv/config'; // Au lieu de require('dotenv').config();
// import express from 'express'; // Au lieu de const express = require('express');
// import cors from 'cors'; // Au lieu de const cors = require('cors');
// import Mailjet from 'node-mailjet'; // Au lieu de const Mailjet = require('node-mailjet');
// import fetch from 'node-fetch'; // Au lieu de const fetch = require('node-fetch');


// const app = express();
// const PORT = process.env.PORT || 10000;

// // ✅ Connexion à Mailjet
// const mailjet = Mailjet.apiConnect(
//     process.env.MAILJET_API_KEY,
//     process.env.MAILJET_SECRET_KEY
// );

// // --- Sécurité (CORS) ---
// const corsOptions = {
//     origin: [
//         'https://blixt.onrender.com',    // 🌐 ton site hébergé
//         'http://localhost:3000',         // 💻 ton environnement de test local (port 3000)
//         'http://127.0.0.1:3000',         // alternative locale (port 3000)
//         'http://127.0.0.1:5500',         // ✅ Le port de Live Server (corrigé)
//         'http://localhost:5500'          // ✅ L'alternative localhost pour Live Server (corrigé)
//     ],
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // Emails
// const DESTINATION_EMAIL = "mrlapin508@gmail.com";
// const SENDER_EMAIL = "nivelet.sebastien@orange.fr";

// // --- Test API ---
// app.get('/', (req, res) => {
//     res.json({
//         message: 'API Mailjet BLIXT opérationnelle',
//         timestamp: new Date().toISOString(),
//         env_check: {
//             api_key_present: !!process.env.MAILJET_API_KEY,
//             secret_key_present: !!process.env.MAILJET_SECRET_KEY,
//             recaptcha_key_present: !!process.env.RECAPTCHA_SECRET_KEY
//         }
//     });
// });

// app.post('/api/contact', async (req, res) => {
//     const { name, email, phone, message, hp_field, 'g-recaptcha-response': recaptchaToken } = req.body;
//     console.log('Requête reçue :', { name, email, recaptchaToken });

//     if (hp_field) {
//         console.log("Honeypot activé. Requête ignorée.");
//         return res.status(200).json({ success: true, message: "Merci pour votre message." });
//     }

//     if (!name || !email || !message) {
//         return res.status(400).json({ success: false, message: "Nom, email et message sont requis." });
//     }

//     // --- 1. Vérification reCAPTCHA ---
//     // try {
//     //     console.log('Vérification reCAPTCHA avec le token :', recaptchaToken);
//     //     const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
//     //     const recaptchaRes = await fetch(verifyURL, { method: 'POST' });
//     //     const recaptchaData = await recaptchaRes.json();
//     //     console.log('Réponse de l\'API reCAPTCHA :', recaptchaData);

//     //     if (!recaptchaData.success) {
//     //         console.warn('Échec de la vérification reCAPTCHA :', recaptchaData['error-codes']);
//     //         return res.status(400).json({
//     //             success: false,
//     //             message: `Échec reCAPTCHA : ${recaptchaData['error-codes'] ? recaptchaData['error-codes'].join(', ') : 'tentative suspecte détectée.'}`
//     //         });
//     //     }
//     //     if (recaptchaData.score < 0.1) {
//     //         console.warn('Score reCAPTCHA trop bas :', recaptchaData.score);
//     //         return res.status(400).json({
//     //             success: false,
//     //             message: "Score reCAPTCHA trop bas."
//     //         });
//     //     }
//     // } catch (err) {
//     //     console.error('Erreur lors de la vérification reCAPTCHA:', err);
//     //     return res.status(500).json({ success: false, message: "Erreur lors de la vérification du reCAPTCHA." });
//     // } 
//     // --- 1. Vérification reCAPTCHA test1---
// try {
//     console.log('Vérification reCAPTCHA avec le token :', recaptchaToken);

//     // Vérification sécurisée avec body encodé
//     const verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
//     const params = new URLSearchParams();
//     params.append('secret', process.env.RECAPTCHA_SECRET_KEY);
//     params.append('response', recaptchaToken);

//     const recaptchaRes = await fetch(verifyURL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: params
//     });

//     const recaptchaData = await recaptchaRes.json();
//     console.log('Réponse de l\'API reCAPTCHA :', recaptchaData);

//     if (!recaptchaData.success) {
//         console.warn('Échec de la vérification reCAPTCHA :', recaptchaData['error-codes']);
//         return res.status(400).json({
//             success: false,
//             message: `Échec reCAPTCHA : ${
//                 recaptchaData['error-codes']
//                     ? recaptchaData['error-codes'].join(', ')
//                     : 'tentative suspecte détectée.'
//             }`
//         });
//     }

//     if (recaptchaData.score < 0.1) {
//         console.warn('Score reCAPTCHA trop bas :', recaptchaData.score);
//         return res.status(400).json({
//             success: false,
//             message: "Score reCAPTCHA trop bas."
//         });
//     }

// } catch (err) {
//     console.error('Erreur lors de la vérification reCAPTCHA:', err);
//     return res.status(500).json({ success: false, message: "Erreur lors de la vérification du reCAPTCHA." });
// }


//     // ✅ Si le reCAPTCHA est validé → envoi du mail via Mailjet
//     try {
//         console.log('📤 Envoi du mail via Mailjet...');
//         const request = mailjet
//             .post('send', { version: 'v3.1' })
//             .request({
//                 Messages: [
//                     {
//                         From: { Email: SENDER_EMAIL, Name: "Formulaire BLIXT" },
//                         To: [{ Email: DESTINATION_EMAIL, Name: "Équipe BLIXT" }],
//                         Subject: `Demande de devis BLIXT par ${name}`,
//                         TextPart: `
// Nom: ${name}
// Email: ${email}
// Téléphone: ${phone || 'Non fourni'}

// Message:
// ${message}
//                         `.trim(),
//                         HTMLPart: `
//                         <html>
//                         <body style="font-family: Arial; color: #333;">
//                         <h2>⚡ Nouvelle demande de devis BLIXT</h2>
//                         <p><b>👤 Nom:</b> ${name}</p>
//                         <p><b>📧 Email:</b> ${email}</p>
//                         <p><b>📱 Téléphone:</b> ${phone || 'Non renseigné'}</p>
//                         <p><b>💬 Message:</b><br>${message.replace(/\n/g, '<br>')}</p>
//                         <p style="font-size:12px;color:#777;">📅 Reçu le ${new Date().toLocaleString('fr-FR')}</p>
//                         </body>
//                         </html>`
//                     }
//                 ]
//             });

//         await request;
//         console.log('✅ Email envoyé avec succès !');
//         return res.status(200).json({ success: true, message: "Message envoyé avec succès." });

//     } catch (error) {
//         console.error('❌ Erreur Mailjet:', error.statusCode, error.message);
//         return res.status(500).json({
//             success: false,
//             message: `Erreur lors de l'envoi via Mailjet.`
//         });
//     }
// });

// // --- Gestion 404 ---
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route non trouvée. Utilisez GET / ou POST /api/contact'
//     });
// });

// // --- Lancement du serveur ---
// app.listen(PORT, () => {
//     console.log('🚀 Serveur BLIXT démarré sur le port', PORT);
// });

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Mailjet from 'node-mailjet';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 10000;

// Constantes
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const DESTINATION_EMAIL = "mrlapin508@gmail.com";
const SENDER_EMAIL = "nivelet.sebastien@orange.fr";

// ✅ Connexion à Mailjet
const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

// --- Sécurité (CORS) ---
const corsOptions = {
    origin: [
        'https://blixt.onrender.com',      // 🌐 ton site hébergé
        'http://localhost:3000',           // 💻 ton environnement de test local
        'http://127.0.0.1:3000',           // alternative locale
        'http://127.0.0.1:5500',           // ✅ Le port de Live Server 
        'http://localhost:5500'            // ✅ L'alternative localhost
    ],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// --- Test API ---
app.get('/', (req, res) => {
    res.json({
        message: 'API Mailjet BLIXT opérationnelle',
        timestamp: new Date().toISOString(),
        env_check: {
            api_key_present: !!process.env.MAILJET_API_KEY,
            secret_key_present: !!process.env.MAILJET_SECRET_KEY,
            recaptcha_key_present: !!RECAPTCHA_SECRET_KEY // Utilise la constante
        }
    });
});

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message, hp_field, 'g-recaptcha-response': recaptchaToken } = req.body;
    console.log('Requête reçue :', { name, email, recaptchaToken });

    if (hp_field) {
        console.log("Honeypot activé. Requête ignorée.");
        return res.status(200).json({ success: true, message: "Merci pour votre message." });
    }

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Nom, email et message sont requis." });
    }
    
    // --- 1. Vérification reCAPTCHA ---
    
    // 🛑 VÉRIFICATION CRITIQUE: La clé secrète du serveur doit exister.
    if (!RECAPTCHA_SECRET_KEY) {
        console.error('ERREUR ENV: RECAPTCHA_SECRET_KEY est manquant sur le serveur !');
        return res.status(500).json({ 
            success: false, 
            message: "Erreur serveur: Clé de vérification reCAPTCHA manquante. (Vérifiez les variables d'environnement de l'API)." 
        });
    }

    // 🛑 VÉRIFICATION CRITIQUE: Le token du client doit exister.
    if (!recaptchaToken) {
        console.warn('RECAPTCHA: Token client manquant dans la requête.');
        return res.status(400).json({
            success: false,
            message: "Échec reCAPTCHA : Token de réponse manquant ou vide."
        });
    }

    try {
        console.log('Vérification reCAPTCHA avec le token :', recaptchaToken);

        // Méthode simplifiée : paramètres directement dans l'URL pour la vérification
        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
        
        const recaptchaRes = await fetch(verifyURL, { method: 'POST' });
        const recaptchaData = await recaptchaRes.json();
        console.log('Réponse de l\'API reCAPTCHA :', recaptchaData);

        if (!recaptchaData.success) {
            // Google renvoie l'erreur 'invalid-input-response' si la 'secret key' est vide/fausse.
            const errorCodes = recaptchaData['error-codes'] ? recaptchaData['error-codes'].join(', ') : 'tentative suspecte détectée.';
            
            console.warn('Échec de la vérification reCAPTCHA. Codes :', errorCodes);
            
            return res.status(400).json({
                success: false,
                message: `Échec reCAPTCHA : ${errorCodes}`
            });
        }

        if (recaptchaData.score < 0.1) {
            console.warn('Score reCAPTCHA trop bas :', recaptchaData.score);
            return res.status(400).json({
                success: false,
                message: "Score reCAPTCHA trop bas. (Score: " + recaptchaData.score + ")"
            });
        }

    } catch (err) {
        console.error('Erreur lors de la vérification reCAPTCHA:', err);
        return res.status(500).json({ success: false, message: "Erreur lors de la vérification du reCAPTCHA." });
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
