// Config file for mail server if any

const emailConfig = {
  // Brevo (formerly Sendinblue) Configuration
  brevo: {
    apiKey: process.env.BREVO_API_KEY || '',
    defaultSender: {
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com',
      name: process.env.BREVO_SENDER_NAME || 'Your App Name'
    },
    templates: {
      welcome: parseInt(process.env.BREVO_WELCOME_TEMPLATE_ID || '1', 10),
      resetPassword: parseInt(process.env.BREVO_RESET_PASSWORD_TEMPLATE_ID || '2', 10),
      verifyEmail: parseInt(process.env.BREVO_VERIFY_EMAIL_TEMPLATE_ID || '3', 10)
    },
    settings: {
      timeout: parseInt(process.env.BREVO_TIMEOUT || '5000', 10), // 5 seconds
      retryAttempts: parseInt(process.env.BREVO_RETRY_ATTEMPTS || '3', 10),
      retryDelay: parseInt(process.env.BREVO_RETRY_DELAY || '1000', 10) // 1 second
    }
  }
};

export default emailConfig;
