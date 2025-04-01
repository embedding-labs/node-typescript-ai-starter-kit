// services/email.service.ts

interface OtpMailParams {
  emailId: string;
  otp: number;
}

export class MailService {
  /**
   * Send OTP verification email
   * @param params Email parameters with OTP
   * @returns Promise<boolean>
   */
  public async sentOtpMail(params: OtpMailParams): Promise<boolean> {
    try {
      const { emailId, otp } = params;
      
      // In a real implementation, you would send an actual email here
      // This is just a placeholder that logs the OTP
      console.log(`[DEV] Sending OTP ${otp} to ${emailId}`);
      
      // Return true to simulate successful email sending
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw error;
    }
  }
}
