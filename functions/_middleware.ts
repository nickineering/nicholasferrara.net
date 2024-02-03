import mailchannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = (context) =>
  mailchannelsPlugin({
    personalizations: (data) => {
      return [
        {
          to: [{ name: "Nicholas Ferrara", email: "hire@nicholasferrara.net" }],
          reply_to: {
            name: data.formData.get("name") as string,
            email: data.formData.get("email") as string,
          },
          dkim_domain: "nicholasferrara.net",
          dkim_selector: "mailchannels",
          dkim_private_key: (context.env as any).DKIM_PRIVATE_KEY,
        },
      ];
    },
    from: {
      name: "Nick's Website",
      email: "no-reply@nicholasferrara.net",
    },
    subject: "Contact Form",
    respondWith: () => {
      return new Response(
        `Thanks for getting in touch! I'll take a look at your message as soon as possible.`
      );
    },
  })(context);
