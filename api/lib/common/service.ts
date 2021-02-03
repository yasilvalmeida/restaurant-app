import Mail from "./mail";
import { BackendBaseUrl } from "./model";


export async function sendVerificationEmail(user) {
  let message;
  const verifyUrl = `${BackendBaseUrl}/verify-email/?token=${user.verificationToken}`;
    message = `<p>Please use the below token to verify your email:</p>
            <p><b>${user.verificationToken}</b></p>
            <p>Please click the below link to verify your email:</p>
            <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
        `;
  Mail.to = user.email,
  Mail.subject = 'Rest App - Verify Email',
  Mail.message = `<h4>Verify Email</h4><p>Thanks for registering!</p>${message}`
  let result = Mail.sendMail();
  return result;
}

export async function sendPasswordResetEmail(user) {
    let message;
    const resetUrl = `${BackendBaseUrl}/reset-password/?token=${user.passwordResetToken}`;
    message = `<p>Please use the below token to reset your password:</p>
               <p><b>${user.passwordResetToken}</b></p>
               <p>Please click the below link to reset your password:</p>
               <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>`;
    Mail.to      = user.email,
    Mail.subject = 'Rest App - Reset Password',
    Mail.message = `<h4>Reset Password Email</h4> ${message}`
    return await Mail.sendMail();
}