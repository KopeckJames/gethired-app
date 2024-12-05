import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticateWithGoogle } from "~/models/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return redirect("/?error=No authorization code provided");
  }

  try {
    const { token } = await authenticateWithGoogle(code);

    // Set cookie and redirect
    return redirect("/", {
      headers: {
        "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax`,
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return redirect(
      `/?error=${encodeURIComponent(
        "Failed to authenticate with Google. Please try again."
      )}`
    );
  }
}

// Export an empty component since this route only handles server-side logic
export default function AuthCallback() {
  return null;
}
