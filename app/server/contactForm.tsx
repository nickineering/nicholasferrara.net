import { Resend } from "resend";
import { Env } from "~/types/Env";
import { checkTurnstileForm } from "~/util/checkTurnstileForm";
import { ContactEmailTemplate } from "~/emails/contact";

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

const headers = { "Content-Type": "application/json;charset=utf-8" };

const isDev = process.env.NODE_ENV === "development";

export async function handleContactForm(
  request: Request,
  env: Env,
  testWithFakeEmail = isDev,
): Promise<Response> {
  const formData = await request.formData();

  const turnstileOutcome = await checkTurnstileForm(formData, request, env);
  if (!turnstileOutcome.success) {
    return new Response(
      JSON.stringify({
        success: false,
        message:
          "The system thinks you are a bot, but it might have made a mistake. " +
          "Please refresh the page and try again. Alternatively, you can contact me on LinkedIn. " +
          "I am sorry for the inconvenience.",
        turnstileOutcome,
      }),
      {
        headers,
        status: 400,
      },
    );
  }

  const field = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const name = field("name");
  const email = field("email");
  const message = field("message");

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "`name`, `email`, and `message` are required in request.",
      }),
      {
        headers,
        status: 500,
      },
    );
  }

  const resend = new Resend(env.RESEND_API_KEY);

  let to = ["Nicholas Ferrara <hire@nicholasferrara.net>"];
  if (testWithFakeEmail) {
    to = ["Always Delivers <delivered@resend.dev>"];
  }

  const { error } = await resend.emails.send({
    from: "Nick's Website <no-reply@nicholasferrara.net>",
    to,
    replyTo: `${name} <${email}>`,
    subject: `Message from ${name}`,
    react: <ContactEmailTemplate name={name} email={email} message={message} />,
  });

  if (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "There was a problem sending your message.",
        error,
      }),
      {
        headers,
        status: 500,
      },
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message:
        "Thanks for getting in touch! I'll take a look at your message as soon as possible.",
    }),
    { headers },
  );
}
