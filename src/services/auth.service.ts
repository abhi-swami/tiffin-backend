const otpStore = new Map<string, string>();

export const sendOTP = (phone: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, otp);

  console.log(`OTP for ${phone}: ${otp}`);
  return true;
};

export const verifyOTP = (phone: string, otp: string) => {
  const validOtp = otpStore.get(phone);
  return validOtp === otp;
};