import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');

class MailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: 'contato.emptio@gmail.com',
        pass: '!@#Emptio#@!',
      },
    });
  }

  async forgotPassword({ email, code }) {
    const mailOptions: Mail.Options = {
      from: '"Emptio" <contato.emptio@gmail.com>',
      to: email,
      subject: 'Recuperação de Senha',
      text: `Seu código de recuperação de senha é ${code}`,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export default new MailService();
