import {
  FormData as CloudFlareFormData,
  EventContext,
} from "@cloudflare/workers-types";
import { PagesEnv } from "~/types/PagesEnv";

export const checkTurnstileForm = async (
  formData: CloudFlareFormData,
  context: EventContext<PagesEnv, any, any>,
): Promise<any> => {
  const token = formData.get("cf-turnstile-response");
  const ip =
    context.request.headers.get("CF-Connecting-IP") ??
    context.request.headers.get("x-forwarded-for");

  let message = "";
  if (!context.env.TURNSTILE_SECRET_KEY) {
    message = "No turnstile secret key configured";
  }
  if (!token) {
    message = "Antibot check was not completed before submitting the form.";
  }
  if (!ip) {
    message = "Could not determine client IP address.";
  }
  if (message) {
    console.error(message);
    return { success: false, message };
  }

  const verifyFormData = new FormData();
  verifyFormData.append("secret", context.env.TURNSTILE_SECRET_KEY);
  verifyFormData.append("response", token!);
  verifyFormData.append("remoteip", ip!);

  try {
    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        body: verifyFormData,
        method: "POST",
      },
    );

    const outcome = await result.json();
    return outcome;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return {
      success: false,
      error: "Failed to verify with Turnstile service",
    };
  }
};
