// Create A Better Auth Instance

import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma"; // ye prisma ORM ka adapter hai

import db from "./db"; // prisma client jo database se baat krega

import { env } from "./env";

// console.log(env.GOOGLE_CLIENT_ID);


export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins:["http://localhost:3000"]
});

/* 

In prisma + better auth, if we want to implement oAuth using google or github provider
  
  - if we run that commands that provided , automatically all authenticated related prisma schema models added automatically


- We support google as well as github provider because for invite feature, coz we don't have multiple github


*/
