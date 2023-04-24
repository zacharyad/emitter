import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import {filterUserForClient} from '../../helper/filterBackendForFrontend'
import type {Post} from '@prisma/client'


// Create a new ratelimiter, that allows 3 requests per 1 min
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
  */ 
 prefix: "@upstash/ratelimit",
});

const addUsersDataToPosts = async (posts: Post[]) => {
    const users = (await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId), limit:100
    })).map(filterUserForClient)
    
    
    return posts.map(post => {
        const author = users.find((user => user.id === post.authorId));
        
        if(!author || !author.username){
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Author fort post not found"})
        }
        
        return {
            post,
            author: {
                ...author,
                username: author.username
            }
        }
    })
}

export const postsRouter = createTRPCRouter({
    // puplicProcedure is for a non secure route
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({take:100, orderBy: [{createdAt: "desc"}]});
        return addUsersDataToPosts(posts)
    }),
    getPostsFromUser: publicProcedure.input(z.object({userId: z.string()})).query(async ({input, ctx}) => {
        const posts = await ctx.prisma.post.findMany({where: {authorId: input.userId}, take:100, orderBy: [{createdAt: "desc"}]})
         return addUsersDataToPosts(posts)
    }),
    
    create: privateProcedure.input(z.object({content: z.string().emoji("Only Emojis are aloud").min(1).max(280)}))
    .mutation(async ({ctx, input}) => {
        const authorId = ctx.userId;
        const {success} = await ratelimit.limit(authorId)

        if(!success){ 
            throw new TRPCError({code: "TOO_MANY_REQUESTS"})     
        }
        const post = await ctx.prisma.post.create({
            data: {
                authorId,
                content: input.content
            }
        })
        return post
    })
})


