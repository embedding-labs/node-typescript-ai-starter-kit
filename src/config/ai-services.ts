// config/ai-services.ts

export const aiServicesConfig = {
  // General API settings
  api: {
    timeout: parseInt(process.env.AI_API_TIMEOUT || '30000', 10), // 30 seconds in ms
    retryAttempts: parseInt(process.env.AI_API_RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(process.env.AI_API_RETRY_DELAY || '1000', 10), // ms between retries
  },
  
    // OpenAI (DALL-E) configuration
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      organizationId: process.env.OPENAI_ORG_ID || '',
      model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
      defaultSize: process.env.OPENAI_DEFAULT_SIZE || '1024x1024',
      defaultQuality: process.env.OPENAI_DEFAULT_QUALITY || 'standard', // 'standard' or 'hd'
      defaultStyle: process.env.OPENAI_DEFAULT_STYLE || 'vivid', // 'vivid' or 'natural'
    },
    
    // Stability AI configuration
    stability: {
      apiKey: process.env.STABILITY_API_KEY || '',
      engine: process.env.STABILITY_ENGINE || 'stable-diffusion-xl-1024-v1-0',
      defaultCfgScale: parseFloat(process.env.STABILITY_CFG_SCALE || '7.0'),
      defaultSteps: parseInt(process.env.STABILITY_STEPS || '30', 10),
      defaultSampler: process.env.STABILITY_SAMPLER || 'K_DPMPP_2M',
    },
  
};

export default aiServicesConfig;