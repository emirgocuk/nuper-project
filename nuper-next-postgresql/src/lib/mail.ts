import nodemailer from 'nodemailer';

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
        const info = await transporter.sendMail({
            from: `"Nuper" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { error: "Email could not be sent." };
    }
}

export async function sendAccountApprovedEmail(email: string, name: string) {
    const loginLink = `${process.env.NEXTAUTH_URL}/login`;

    return await sendEmail({
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
}
