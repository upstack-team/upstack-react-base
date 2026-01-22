// Service d'envoi d'emails - Configuration basique
export interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Configuration basique pour le développement
  console.log('📧 Email envoyé:', {
    to: options.to,
    subject: options.subject,
    text: options.text
  })
  
  // En production, intégrer avec un service comme SendGrid, Nodemailer, etc.
  // Exemple avec Nodemailer :
  /*
  const transporter = nodemailer.createTransporter({
    // Configuration SMTP
  })
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  })
  */
}