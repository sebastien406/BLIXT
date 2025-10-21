
// contact-form.js (backend)
import 'dotenv/config';
import express from "express";
import fetch from "node-fetch";
import Mailjet from "node-mailjet";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Configuration Mailjet
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
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
