/*
chalaake dikhao aur problem btao : okieee :
we use Prisma instance to query the database

   - NextJS uses hot reloading : whenever we save something inside the app , it gonna create new prisma client every single time and we don't want to do that


    - In Next.js development mode (when you save a file), it hot-reloads your code multiple times.


    - If there's a new PrismaClient() every time, you'll end up with many database connections open (which will eventually crash Neon/Postgres).  

    - connections overloading in connection.pool

    - I don't want to crash your database due to multiple Prisma clients.

*/

// This imports the PrismaClient class from Prisma's generated client. This class is what you'll use to talk to your database (run queries, migrations, etc).

import { PrismaClient } from "@prisma/client";

// TypeScript ko bata rahe hain ki global object ke andar ek prisma variable ho sakta hai warna TypeScript error dega jab hum globalThis.prisma use karenge

declare global {
  var prisma: PrismaClient | undefined;
}

// agar pehle se globalThis.prisma hai to use hi lelo agar nahi hai to naya PrismaClient banao aur logging enable kar do

const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

/*

  - sirf development mode me globalThis.prisma ko set kar rahe hain

  - taaki hot-reload hone par bar-bar naye connections na bane

  - production me zaroorat nahi hai, waha ek hi baar client banega

*/

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = db;
}

export default db;

/*

  -  By attaching Prisma to globalThis, you ensure only one instance is reused across reloads.


  - globalThis.prisma: This global variable ensures that the Prisma client instance is reused across hot reloads during development.


     - Without this, each time your application reloads, a new instance of the Prisma client would be created, potentially leading to connection issues.

------------------------------------------

   - In development (NODE_ENV !== "production"):
      
      - It assigns the db instance to globalThis.prisma.

      - So on the next reload, Prisma will reuse the same instance 

   - In production:
      
      - It does not attach Prisma to globalThis. This is because production runs once per request (no hot reload), so creating fresh instances is fine.


      - Follows best practices for both dev (reusing the client) and prod (creating per-deploy safe clients).

     
*/