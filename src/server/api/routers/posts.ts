import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const posts = createTRPCRouter({
    // puplicProcedure is for a non secure route
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
});
