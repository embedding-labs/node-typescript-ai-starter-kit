import mongoose, { Schema } from 'mongoose';
import { IMailOtp } from '../interfaces/user.interface';

const MailOtpSchema: Schema = new Schema({
  emailId: { 
    type: String, 
    required: true,
    index: true 
  },
  otp: { 
    type: Number, 
    required: true 
  },
  isUsed: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 900 // auto expire after 15 minutes (900 seconds)
  }
});

export default mongoose.model<IMailOtp>('MailOtp', MailOtpSchema); 