import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_SERVER_HOST'),
      port: this.configService.get<number>('EMAIL_SERVER_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_SERVER_USER'),
        pass: this.configService.get<string>('EMAIL_SERVER_PASSWORD'),
      },
    });
  }

  async sendMagicLink(email: string, magicLinkUrl: string) {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Your Sign-in Link for Mekong Boilerplate',
      text: `Click this link to sign in: ${magicLinkUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #333; text-align: center;">Sign in to Mekong Boilerplate</h1>
          <p style="color: #666; font-size: 16px;">Click the button below to sign in:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLinkUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Log In
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">${magicLinkUrl}</p>
          <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
            <p>If you didn't request this email, you can safely ignore it.</p>
          </div>
        </div>
      `,
    });
  }
}
