const axios = require('axios');

/**
 * Generates a 6-digit numeric verification code.
 * @returns {string} A 6-digit string.
 */
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends a verification email to the given email address.
 * @param {string} email The email address to send the verification code to.
 * @param {string} verificationCode The verification code to include in the email.
 * @returns {Promise} A promise that resolves with the email sending result.
 */
async function sendVerificationEmail(email, verificationCode) {
    const data = {
        sendto: email,
        name: 'Creative-skills-hub',
        replyTo: 'haggairameni@gmail.com',
        ishtml: 'true',
        title: 'Your Verification Code',
        body: `Your verification code is: ${verificationCode}`
    };

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://mail-sender-api1.p.rapidapi.com/',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // You need to replace this with your actual RapidAPI Key
                'X-RapidAPI-Host': 'mail-sender-api1.p.rapidapi.com'
            },
            data: JSON.stringify(data)
        });

        console.log("Email sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to send verification email:", error);
        throw error;
    }
}

module.exports = { generateVerificationCode, sendVerificationEmail };
