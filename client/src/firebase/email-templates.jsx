import { firestore } from "./firebase.utils"

export const sendRegistrationEmail = async (email, password, firstName, lastName) => {
    await firestore.collection('emails').add({
        to: email,
        // cc: 'mpolat@hampdencharter.org',
        message: {
            subject: `HCSS Staff Portal Account`,
            text: `Hello ${firstName} ${lastName},
            
Please use the credentials below to sign into HCSS Staff Portal Account:
Email: ${email}
Password: ${password}

Here is the link for the HCSS Staff Portal: 
https://staffportal.hampdencharter.org

Please do not forget to change your password after your first login. You can change your password from the settings page.

Thank you
            `,
            // html: "This is the <code>HTML</code> section of the email body.",
        },
    });
};