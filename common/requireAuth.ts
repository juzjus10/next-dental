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

    return await func(ctx);
  };