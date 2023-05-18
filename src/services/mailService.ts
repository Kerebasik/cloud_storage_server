import * as nodemailer from 'nodemailer';

const SMTP_HOST: string = String(process.env.SMTP_HOST);
const SMTP_PORT: number = Number(process.env.SMTP_PORT);
const SMTP_USER: string = String(process.env.SMTP_USER);
const SMTP_PASS: string = String(process.env.SMTP_PASS);

export async function sendMail(to: string, link: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    return await transporter.sendMail({
      from: SMTP_USER,
      to: to,
      subject: 'Activated account',
      text: '',
      html: `
       <div>
            <p>Click on <a href=${process.env.API_URL}/api/auth/activated/${link}>${link}</a> for activated account.</p>
       </div>
    `,
    });
  } catch (e) {
    console.log(e);
    return;
  }
}
