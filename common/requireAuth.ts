import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { nextAuthOptions } from "./auth";

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);

    console.log("session", session);
    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    const user = session.user;
    const isDoctor = user.user_level === "doctor";
    const isSettingsPage = ctx.req.url === "/settings";
    const isUsersPage = ctx.req.url === "/users";

    //check if url is /dashboard and user is doctor

    if (isDoctor && ctx.req.url === "/dashboard") {
      return {
        redirect: {
          destination: `/doctors/${user.id}`,
          permanent: false,
        },
      };
    }

    if ((isDoctor && isSettingsPage) || (isDoctor && isUsersPage)) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    //return the user
    return func(ctx);
  };
