import { config } from '../config';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { isEmail } from '../utils/helpers';
const OAuth2 = google.auth.OAuth2;

// create OAuth2 client
export const handleSendMail = async (to: string, subject: string, content: string) => {
  return await new Promise((resolve, reject) => {
    // 內容不可為空
    if (!to || !subject || !content) {
      reject(new Error('內容不可為空'));
    }
    // 是否為 Email
    if (!isEmail(to)) {
      reject(new Error('請輸入正確的 Email 格式'));
    }

    const oauth2Client = new OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    // set refresh token
    oauth2Client.setCredentials({
      refresh_token: config.GOOGLE_REFRESH_TOKEN
    });

    // get access token using promise
    oauth2Client
      .getAccessToken()
      .then((res) => {
        const accessToken = res.token;
        if (!accessToken) {
          reject(new Error('無法取得 OAuth Access Token'));
        }

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: config.GOOGLE_EMAIL,
            clientId: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            refreshToken: config.GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken ?? ''
          }
        });

        // create mail options
        const mailOptions = {
          from: config.GOOGLE_EMAIL,
          to,
          subject,
          html: content
        };

        // send mail
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          }
          resolve({ message: 'Email 已發送' });
        });
      })
      .catch(() => {
        reject(new Error('無法取得 OAuth Access Token'));
      });
  });
};
