import { Env } from "~/types/Env";

export const checkTurnstileForm = async (
  formData: FormData,
  request: Request,
  env: Env,
): Promise<any> => {
  const token = formData.get("cf-turnstile-response");
  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("x-forwarded-for");

  let message = "";
  if (!env.TURNSTILE_SECRET_KEY) {
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
  verifyFormData.append("secret", env.TURNSTILE_SECRET_KEY);
  verifyFormData.append("response", token as string);
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
