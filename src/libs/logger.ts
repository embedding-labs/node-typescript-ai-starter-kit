import winston from 'winston';

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console(),
    
    // Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({ 
      filename: 'logs/error.log',
      level: 'error'
    }),
    
    // Write all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Export logger instance
export default logger;
