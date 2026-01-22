import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@check-in-sy.com",
      pass: "F.X.D@app06",
    },
  });

  await transporter.sendMail({
    from: '"CHECK-IN SY" <info@check-in-sy.com>',
    to,
    subject,
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>${subject}</h2>
        <p>${message}</p>
      </div>
    `,
  });
};
