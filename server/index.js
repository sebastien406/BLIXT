const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Mailjet = require('node-mailjet'); // L'objet Mailjet est importé

const app = express();
// Render fournira la variable d'environnement PORT, sinon on utilise 3000
const PORT = process.env.PORT || 3000; 

// CORRECTION IMPORTANTE : Initialisation de Mailjet via le constructeur
const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY
});

// --- Configuration de Sécurité (CORS) ---
// **VÉRIFIEZ ET REMPLACEZ** cette URL par l'URL exacte de votre site BLIXT sur Render
const YOUR_RENDER_SITE_URL = 'https://blixt.onrender.com'; 
const corsOptions = {
    origin: YOUR_RENDER_SITE_URL, 
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// ----------------------------------------

// Middlewares pour lire les données POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Adresses e-mail
const DESTINATION_EMAIL = "mrlapin508@gmail.com"; 
const SENDER_EMAIL = "niveletsebastien@gmail.com"; // Doit être vérifiée dans votre compte Mailjet !

// Endpoint /api/contact qui sera appelé par votre formulaire
app.post('/api/contact', async (req, res) => {
    
    const { name, email, phone, message, hp_field } = req.body;
    
    // 1. Contrôle Anti-Spam (Honeypot)
    if (hp_field) {
        console.log("Honeypot activé. Requête ignorée.");
        // Répondre succès pour ne pas alerter le bot
        return res.status(200).json({ success: true, message: "Merci pour votre message." }); 
    }

    // 2. Vérification des champs requis
    if (!email || !message) {
        return res.status(400).json({ success: false, message: "Email et message sont requis." });
    }
    
    try {
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: SENDER_EMAIL,
                        Name: "Formulaire BLIXT"
                    },
                    To: [
                        {
                            Email: DESTINATION_EMAIL,
                            Name: "Équipe BLIXT"
                        }
                    ],
                    Subject: `Demande de devis BLIXT par ${name || 'Inconnu'}`,
                    TextPart: `
                        Nom: ${name}
                        Email: ${email}
                        Téléphone: ${phone || 'Non fourni'}
                        Message: ${message}
                    `,
                }
            ]
        });

        await request;

        // Succès
        return res.status(200).json({ success: true, message: "Message envoyé avec succès." });

    } catch (error) {
        console.error('Erreur Mailjet:', error.message);
        // Échec Mailjet
        return res.status(500).json({ success: false, message: "Erreur lors de l'envoi via Mailjet. Code: " + error.statusCode });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});