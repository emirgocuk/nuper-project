import nodemailer from 'nodemailer';
import { logger } from './logger';
import { getBaseUrl } from './utils';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    try {
        logger.info("Sending email", { to, subject });
        
        const info = await transporter.sendMail({
            from: `"Nuper" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });
        
        logger.info("Email sent successfully", { to, messageId: info.messageId });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        logger.error("Failed to send email", error as Error, { to, subject });
        return { error: "Email could not be sent." };
    }
}

export async function sendAccountApprovedEmail(email: string, name: string) {
    const loginLink = `${getBaseUrl()}/login`;
    
    logger.info("Sending approval email", { email });
    
    try {
        const result = await sendEmail({
            to: email,
            subject: "Hesabınız Onaylandı! 🎉",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0F172A;">Tebrikler ${name}!</h2>
                    <p style="color: #475569; font-size: 16px;">Hesabınız yönetici tarafından onaylandı.</p>
                    <p style="color: #475569; font-size: 16px;">Artık Nuper platformuna tam erişim sağlayabilirsiniz. Girişimcilerle/Yatırımcılarla buluşmaya hazırsınız.</p>

                    <div style="margin: 30px 0;">
                        <a href="${loginLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Giriş Yap</a>
                    </div>

                    <p style="color: #94A3B8; font-size: 12px;">Bu e-posta otomatik olarak gönderilmiştir.</p>
                </div>
            `
        });
        
        logger.info("Approval email sent", { email });
        return result;
    } catch (error) {
        logger.error("Failed to send approval email", error as Error, { email });
        return { error: "Approval email could not be sent." };
    }
}

export async function sendVerificationEmail(email: string, name: string, verifyLink: string) {
    logger.info('Sending verification email', { email });

    return await sendEmail({
        to: email,
        subject: "Email Doğrulama - Nuper",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0F172A; font-size: 24px; font-weight: bold; margin: 0;">Nuper</h1>
                </div>

                <div style="background-color: #F8FAFC; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #0F172A; font-size: 20px; margin-top: 0;">Merhaba ${name}!</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Nuper'e hoşgeldiniz! Hesabınızı tamamlamak için lütfen aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyLink}" style="background-color: #2563EB; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Email'i Doğrula</a>
                    </div>

                    <p style="color: #64748B; font-size: 14px; margin: 20px 0 0 0;">
                        Bu linkin geçerlilik süresi 24 saattir. Linki kullanarak hesabınızı güvenle doğrulayabilirsiniz.
                    </p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                    <p style="color: #94A3B8; font-size: 12px; margin: 0;">Bu e-posta otomatik olarak gönderilmiştir.</p>
                    <p style="color: #94A3B8; font-size: 12px; margin: 5px 0 0 0;">Nuper Platform - Girişimciler ve Yatırımcılar İçin</p>
                </div>
            </div>
        `
    });
}
