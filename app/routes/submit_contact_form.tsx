import { ActionFunction } from "@remix-run/cloudflare";
import { Resend } from "resend";
import { ContactEmailTemplate } from "../emails/contact";

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const resend = new Resend((context as any).env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "Nick's Website <no-reply@nicholasferrara.net>",
    to: ["Nicholas Ferrara <hire@nicholasferrara.net>"],
    replyTo: `${name} <${email}>`,
    subject: `Message from ${name}`,
    react: (
      <ContactEmailTemplate
        name={name as string}
        email={email as string}
        message={message as string}
      />
    ),
  });

  if (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "There was a problem sending your message.",
        error,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message:
        "Thanks for getting in touch! I'll take a look at your message as soon as possible.",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
