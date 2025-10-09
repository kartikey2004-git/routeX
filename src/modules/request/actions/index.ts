"use server";

import db from "@/lib/db";
import { REST_METHOD } from "@prisma/client";

export type Request = {
  name: string;
  method: REST_METHOD;
  url: string;

  body?: string;
  headers?: string;
  parameters?: string;
};

/* 
 
Ye method isliye banaya gaya hai taaki jab hum koi nayi request banayein, use ek collection ke andar save kar sakein.


  Normally multiple requests hoti hain, lekin unhe save tabhi karna hai jab wo kisi collection se linked ho.
    

     - Agar request "Collection" wale FilePlus icon se modal ke through create hoti hai, toh wo directly us collection ke andar save ho jayegi.


     - Lekin agar request "Request Playground" ke navbar se ya shortcut (Ctrl + New) se create hoti hai — jiska naam by default "Untitled" hota hai — toh wo ek temporary request (unsaved state) ke form mein rahegi.

     - we tracked the unsaved state 
     
     Jab hume ye unsaved request kisi collection ke sath attach karni ho, tab ye method use hoga.

*/

export const addRequestToCollection = async (
  collectionId: string,
  value: Request
) => {
  // create a request in a particular collection with help of collectionId which we pass as prop

  const request = await db.request.create({
    data: {
      collectionId,
      name: value.name,
      method: value.method,
      url: value.url,
      body: value.body,
      headers: value.headers,
      parameters: value.parameters,
    },
  });

  return request;
};

/*

   - Ctrl + S shortcut se hum current request ko save karte hain. Lekin yeh saving tabhi possible hai jab request kisi collection se already linked ho.


   -  Agar request kisi collection ke andar hai → hum usi existing request ko update karenge (same as creating, bas naye banane ke bajaye update karenge).


			- Agar request abhi tak kisi collection se attach nahi hai →  toh save nahi hoga, kyunki collection ke bina request ka context incomplete hai.


*/

export const saveRequest = async (id: string, value: Request) => {
  const request = await db.request.update({
    where: {
      id: id, // passing request id from props
    },
    data: {
      name: value.name,
      method: value.method,
      url: value.url,
      body: value.body,
      headers: value.headers,
      parameters: value.parameters,
    },
  });

  return request;
};

export const getAllRequestFromCollection = async (collectionId: string) => {
  // extract all the request from db related to particular collection

  const requests = await db.request.findMany({
    where: {
      collectionId: collectionId,
    },
  });

  return requests;
};

export const deleteRequestFromCollection = async (
  requestId: string,
  collectionId: string
) => {
  /*

  delete the particular request from a particular collection by its requestId
     
     - we also have to pass collectionId because request is not globally unique because our setup is nested
  
  */

  await db.request.delete({
    where: {
      id: requestId,
      collectionId: collectionId,
    },
  });
};

export const editRequestFromCollection = async (
  requestId: string,
  collectionId: string,
  name: string,
  method: REST_METHOD,
  url: string
) => {
  /*

  edit the particular request from a particular collection by its requestId
     
     - we also have to pass collectionId because request is not globally unique because our setup is nested
  
  */

  await db.request.update({
    where: {
      id: requestId,
      collectionId: collectionId,
    },
    data: {
      name,
      method,
      url,
    },
  });
};
