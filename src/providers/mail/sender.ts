import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/configuration';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailSender {
  private transporter;
  private mailConfig;

  constructor(@Inject('CONFIG') config: ConfigService) {
    this.mailConfig = config.get('mail');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.mailConfig.user,
        pass: this.mailConfig.password,
      },
    });
  }

  async sendMail({
    subject,
    content,
    attachments = [],
    recipient = this.mailConfig.staffEmail,
  }) {
    const mailOptions = {
      to: recipient,
      subject,
      html: content,
      attachments,
    };

    this.transporter.sendMail(mailOptions, (erro) => {
      if (erro) {
        console.log(erro.toString());
      } else {
        console.log(`New KML export sent`);
      }
    });
  }
}
