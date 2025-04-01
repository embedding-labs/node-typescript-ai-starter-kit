// config/google-auth.ts

export const googleAuthConfig = {
  // OAuth Client Configuration
  client: {
    id: process.env.GOOGLE_CLIENT_ID || '',
    secret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  
  // OAuth Redirect URIs
  redirectUris: {
    login: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback',
  },
  
  // Scopes required for your application
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ],
  
  
  // User profile fields mapping (Google profile -> Your app's user model)
  userProfileMapping: {
    emailField: 'email',
    nameField: 'name',
    pictureField: 'picture',
    defaultRole: 'user',
  },

};

export default googleAuthConfig;