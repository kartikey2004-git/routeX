"use server";

import db from "@/lib/db";
import { currentUser } from "@/modules/authentication/actions";
import { MEMBER_ROLE } from "@prisma/client";


export const initializeWorkspace = async () => {
  // utility for extracting current user data which search on basis of session user id in the database and extract user details

  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }

  /*

  Agar hum ek normal function call karte rahenge (jaise initializeWorkspace())
  
     - toh har baar jab user home page pe aayega, woh call dobara trigger ho jaayega.

  Problem kya hogi?

     - Har visit pe ek naya workspace initialize ya create ho jayega.

     - Matlab duplicate workspaces ban jayenge same naam ke.

  
  Isliye hum upsert query (TanStack Query mein) use karte hain.
    
     - Yeh ensure karta hai ki agar same key ke saath query pehle se cache mein hai, toh wohi result use ho jaaye. 

     - aur agar nahi hai toh workspace intialize krdo

     - Dobara unnecessary request nahi jayegi.

     - Workspace ek hi baar initialize hoga, bar-bar create nahi hoga.


  
  Final: Hum upsert query chalayenge taaki ek hi naam ka workspace bar-bar na bane, aur data cache se hi reuse ho jaye jab bhi home page pe aayen.

  */

  try {
    const workspace = await db.workspace.upsert({
      // Filter karega us workspace ko jisme ownerId current logged-in user ki id ho aur name ho "Personal workspace"

      where: {
        name_ownerId: {
          ownerId: user.id,
          name: "Personal Workspace",
        },
      },
      update: {}, // stage for updating existing workspace
      create: {
        // stage for creating new workspace
        name: "Personal Workspace",
        description: "Default workspace for personal use",
        ownerId: user.id,
        members: {
          create: {
            // stage for creating a member in workspace
            userId: user.id,
            role: MEMBER_ROLE.ADMIN,
          },
        },
      },
      // stage for including all members details in response
      include: {
        members: true,
      },
    });

    return {
      success: true,
      workspace,
    };
  } catch (error) {
    console.log("Error intializing workspace:", error);

    return {
      success: false,
      error: "Failed to intialize workspace",
    };
  }
};

export const getWorkspaces = async () => {
  // utility for extracting current user data which search on basis of session user id in the database and extract user details

  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");

  const workspaces = await db.workspace.findMany({
    //  DB se saare workspaces nikaalo jaha current user owner hai aur saare workspaces jaha current user member hai

    where: {
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    orderBy: { createdAt: "asc" },
  });

  return workspaces;
};

export const createWorkspaces = async (name: string) => {
  // utility for extracting current user data which search on basis of session user id in the database and extract user details

  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");

  //  Naya workspace create karte waqt user ka name aur ownerId set karna hai Aur members list mein current user ko automatically add karna hai

  const workspace = await db.workspace.create({
    data: {
      name,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: MEMBER_ROLE.ADMIN,
        },
      },
    },
  });

  return workspace;
};

export const getWorkspaceById = async (id: string) => {
  // Particular workspace ko uski id se find karo aur us workspace ke saare members ko include karo

  const workspace = await db.workspace.findUnique({
    where: { id },
    include: {
      members: true,
    },
  });

  return workspace;
};
