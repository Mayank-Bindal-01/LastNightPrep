const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Yeh hamara digital postman hai
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  //Kisko bhejna hai, kya bhejna hai
  const mailOptions = {
    from: `"LateNightPrep" <${process.env.EMAIL_USER}>`,
    to: options.email, // User ki email ID
    subject: options.subject, // Email ka Title
    text: options.message, // Email ka actual text
  };

  // 3. Email Send 
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;