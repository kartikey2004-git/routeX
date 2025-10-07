"use server";

import db from "@/lib/db";

// server actions related to collections

export const createCollection = async (workspaceId: string, name: string) => {
  // we want workspaceId because we have a dependency , ki without workspace , hum direct collections nahi banane chahte hai

  const collection = await db.collection.create({
    data: {
      name, // the name of the collection
      workspace: {
        // Here, we’re linking this collection to an existing workspace (via workspaceId)

        // connect is Prisma’s way of saying: “I don’t want to create a new workspace, I just want to reference an existing one using its id”.

        connect: {
          id: workspaceId,
        },
      },
    },
  });

  return collection;
};

export const getCollections = async (workspaceId: string) => {
  // Get all collections that belong to a specific workspace using its ID

  const collection = await db.collection.findMany({
    where: {
      workspaceId,
    },
  });

  return collection;
};

export const deleteCollection = async (collectionId: string) => {
  // delete the particular collection by its collectionId

  await db.collection.delete({
    where: {
      id: collectionId,
    },
  });
};

export const editCollection = async (collectionId: string, name: string) => {

  // edit the name of collection
  await db.collection.update({
    where: {
      id: collectionId,
    },
    data: {
      name,
    },
  });
};
