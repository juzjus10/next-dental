import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { nextAuthOptions } from "./auth";

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(
      ctx.req,
      ctx.res,
      nextAuthOptions
    );

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
    const isDentist = user.user_level === "dentist";
    const isSettingsPage = ctx.req.url === "/settings";
    const isUsersPage = ctx.req.url === "/users";
    if ((isDentist && isSettingsPage) || (isDentist && isUsersPage)) {
      return {
        redirect: {
          destination: "/", 
          permanent: false,
        },
      };
    }


    return await func(ctx);
  };