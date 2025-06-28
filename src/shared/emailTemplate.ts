import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <h2 style="color: #333333; font-size: 22px;">Hi ${values.name},</h2>
    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
      Thank you for signing up. Your one-time verification code is below:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="background-color: #BB6D42; color: #ffffff; padding: 12px 24px; font-size: 24px; letter-spacing: 3px; border-radius: 6px; display: inline-block;">
        ${values.otp}
      </span>
    </div>
    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
      This code is valid for 3 minutes.
    </p>
    <p style="color: #888888; font-size: 14px; line-height: 1.6;">
      If you did not request this code, you can safely ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
    <p style="color: #999999; font-size: 13px; text-align: center;">
      © ${new Date().getFullYear()} Your Company. All rights reserved.
    </p>
  </div>
</body>
`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <h2 style="color: #333333; font-size: 22px;">Password Reset Request</h2>
    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password. Use the following code to proceed:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="background-color: #BB6D42; color: #ffffff; padding: 12px 24px; font-size: 24px; letter-spacing: 3px; border-radius: 6px; display: inline-block;">
        ${values.otp}
      </span>
    </div>
    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
      This code is valid for 3 minutes.
    </p>
    <p style="color: #888888; font-size: 14px; line-height: 1.6;">
      If you did not request a password reset, please ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
    <p style="color: #999999; font-size: 13px; text-align: center;">
      © ${new Date().getFullYear()} Your Company. All rights reserved.
    </p>
  </div>
</body>
`,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
};
