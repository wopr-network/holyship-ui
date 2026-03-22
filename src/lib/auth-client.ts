import { twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.holyship.wtf";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [twoFactorClient()],
});

export const { useSession, signIn, signUp, signOut, linkSocial, unlinkAccount, listAccounts } =
  authClient;
