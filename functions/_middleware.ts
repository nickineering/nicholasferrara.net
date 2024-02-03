import mailchannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest: PagesFunction = mailchannelsPlugin({
  personalizations: (data) => {
    return [
      {
        to: [{ name: "Nicholas Ferrara", email: "hire@nicholasferrara.net" }],
        reply_to: {
          name: data.formData.get("name") as string,
          email: data.formData.get("email") as string,
        },
      },
    ];
  },
  from: {
    name: "Nick's Website",
    email: "no-reply@nicholasferrara.net",
  },
  subject: "Contact Form [nfnet]",
  respondWith: () => {
    return new Response(
      `Thanks for getting in touch! I'll take a look at your message as soon as possible.`
    );
  },
});
