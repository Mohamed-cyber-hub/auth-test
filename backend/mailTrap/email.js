import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender, } from "./mailTrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipients = [{ email }];
    
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: 'Verify Your Email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: 'Email Verification',
        })
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Error sending email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, name) => { 
    const recipients = [{ email }];

    try {
        const response =await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: 'ca7e91ec-5f25-4d9b-8cac-14a7148de52c',
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name,
            },
        })
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Error sending email: ${error}`);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => { 
    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: 'Reset Your Password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
            category: 'Password Reset',
        })
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Error sending email: ${error}`);
    }
}

export const sendResetSuccessEmail = async (email) => { 
    const recipients = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: 'Password Reset Successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'Password Reset Success',
        })
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Error sending email: ${error}`);
    }
}