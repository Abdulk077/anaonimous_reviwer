import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
// Assuming your transporter is already defined above in your file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendReviewerApplicationEmail = async (userData, applications) => {
    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb;">New Reviewer Application</h2>
            <p><strong>Applicant ID:</strong> ${userData.id}</p>
            <p><strong>Applicant Role:</strong> ${userData.role}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
                ${applications.map((item, index) => `
                    <div style="margin-bottom: 15px;">
                        <p style="margin: 0; font-weight: bold; color: #475569;">${index + 1}. ${item.question}</p>
                        <p style="margin: 5px 0 0 0; color: #1e293b;">${item.answer}</p>
                    </div>
                `).join('')}
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
                This application was submitted on ${new Date().toLocaleString()}
            </p>
        </div>
    `;

    return await transporter.sendMail({
        from: '"PeerReview System" <noreply@system.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `Reviewer Request - ID: ${userData.id}`,
        html: htmlContent
    });
};