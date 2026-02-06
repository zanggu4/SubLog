import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
  throw new Error(
    "AUTH_SECRET must be set and at least 32 characters. Run: pnpm dlx auth secret"
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      authorization: {
        params: { scope: "repo read:user user:email" },
      },
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.login = (profile as { login?: string }).login;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.login = token.login as string;
      return session;
    },
  },
});
