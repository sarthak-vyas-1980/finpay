import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/Signin",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/transfer/:path*",
  ],
};
