import nodemailer from "nodemailer"

const registryEmail = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { name, email, token } = data;

  // Enviar el email
  await transport.sendMail({
    from: "bienesraices.com",
    to: email,
    subject: "Confirmar cuenta en bienesraices.com",
    text: "Confirmar cuenta en bienesraices.com",
    html: `
    <p>Hola ${name}, confirma tu cuenta en bienesraices.com</p>
    <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:</p>
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirmar cuenta</a></p>
    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  })
};

export { registryEmail };
