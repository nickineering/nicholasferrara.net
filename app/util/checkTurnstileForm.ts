import {
  FormData as CloudFlareFormData,
  EventContext,
} from "@cloudflare/workers-types";
import { PagesEnv } from "~/types/PagesEnv";

export const checkTurnstileForm = async (
  formData: CloudFlareFormData,
  context: EventContext<PagesEnv, any, any>
): Promise<any> => {
  const token = formData.get("cf-turnstile-response");
  const ip = context.request.headers.get("CF-Connecting-IP");

  if (!token || !ip) {
    return {
      success: false,
      error: "Antibot check was not completed before submitting the form.",
    };
  }

  const verifyFormData = new FormData();
  verifyFormData.append("secret", context.env.TURNSTILE_SECRET_KEY);
  verifyFormData.append("response", token);
  verifyFormData.append("remoteip", ip);

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: verifyFormData,
      method: "POST",
    }
  );

  const outcome = await result.json();
  return outcome;
};
