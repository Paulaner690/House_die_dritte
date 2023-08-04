import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);

const sandbox = "sandbox882344e580a941f1ad013a452905e588.mailgun.org";

const defaultOptions = {
  to: ["paulizbg@gmail.com"],
  subject: "Hello",
  html: "<h1>Testing some Mailgun awesomeness!</h1>",
};

let mg;

export const sendMail = async ({ to, subject, html } = defaultOptions) => {
  if (!mg) {
    mg = mailgun.client({
      username: "api",
      key:
        process.env.MAILGUN_API_KEY ||
        "e40a19adcf29015462559090d11721fc-4e034d9e-94688507",
    });
  }

  return mg.messages.create(sandbox, {
    from: `Excited User <mailgun@${sandbox}`,
    to: to,
    subject: subject,
    html: html,
  });
};
