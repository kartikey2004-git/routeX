/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { REST_METHOD } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";

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

// sending request method which accepts request data as props , which contain method , url ( headers , parameters and body are optional )

export const sendRequest = async (req: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
}) => {
  const config: AxiosRequestConfig = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    params: req.params,
    data: req.body,
    validateStatus: () => true, // but ye error bhi capture krta hai
  };

  // in-built performance API : performance is a global reference : must read learning ko bahut milega

  const start = performance.now();

  // The performance.now() method returns a high resolution timestamp in milliseconds.

  try {
    const res = await axios(config);
    const end = performance.now();

    // track the performance for getting the time for sending req to getting api response

    const duration = end - start;

    // data size

    // The TextEncoder interface enables you to character encoding a JavaScript string using UTF-8.

    const size =
      res.headers["Content-Length"] ||
      new TextEncoder().encode(JSON.stringify(res.data)).length;

    // console.log(res.data);

    return {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(Object.entries(res.headers)),
      data: res.data,
      duration: Math.round(duration),
      size,
    };
  } catch (error: any) {
    const end = performance.now();
    return {
      error: error.message,
      duration: Math.round(end - start),
    };
  }
};

// utility which accepts proper configuration : we are using axios here

// run method for sending request

export async function run(requestId: string) {
  try {
    // check request with this particular request id exists in database or not

    const request = await db.request.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      throw new Error(`Request with id ${requestId} not found`);
    }

    // configuration for particular request : kya data humne frontend se bheja hai

    const requestConfig = {
      method: request?.method,
      url: request?.url,

      headers: (request?.headers as Record<string, string>) || undefined,

      params: (request?.parameters as Record<string, any>) || undefined,

      body: request?.body || undefined,
    };

    // utility method to send request to backend

    const result = await sendRequest(requestConfig);

    // we can store this result to database , but also hum persistent bhi rkh skte hai usse frontend pe , agar kisi ne result ko save kra toh

    const requestRun = await db.requestRun.create({
      data: {
        requestId: request.id,
        status: result.status || 0,

        statusText: result.statusText || (result.error ? "Error" : null),

        headers: result.headers || "",

        body: result.data
          ? typeof result.data === "string"
            ? result.data
            : JSON.stringify(result.data)
          : "",

        durationMs: result.duration || 0,
      },
    });

    if (result.data && !result.error) {
      // update the particular request response data in db

      await db.request.update({
        where: {
          id: request.id,
        },
        data: {
          response: result.data,
          updatedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      requestRun,
      result,
    };
  } catch (error: any) {
    // handling the error properly : if code fails when runs

    try {
      const failedRun = await db.requestRun.create({
        data: {
          requestId,
          status: 0,
          statusText: "Failed",
          headers: "",
          body: error.message,
          durationMs: 0,
        },
      });

      return {
        success: false,
        error: error.message,
        requestRun: failedRun,
      };
    } catch (dbError) {
      return {
        success: false,
        error: `Request failed: ${error.message}. DB save failed: ${
          (dbError as Error).message
        }`,
      };
    }
  }
}
/*

- assignment : instead of checking inside database
   
   - we can make one more utility function which is runDirectly 

   - means if request is not saved in database or some'one don't want to save the request in db or just try to check endpoint

   - implement that feature

   -  we can check github if troubled
*/

export async function runDirect(requestData: {
  id: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  parameters?: Record<string, any>;
  body?: any;
}) {
  try {
    const requestConfig = {
      method: requestData.method,
      url: requestData.url,
      headers: requestData.headers,
      params: requestData.parameters,
      body: requestData.body,
    };

    const result = await sendRequest(requestConfig);

    const requestRun = await db.requestRun.create({
      data: {
        requestId: requestData.id,
        status: result.status || 0,

        statusText: result.statusText || (result.error ? "Error" : null),

        headers: result.headers || "",

        body: result.data
          ? typeof result.data === "string"
            ? result.data
            : JSON.stringify(result.data)
          : "",

        durationMs: result.duration || 0,
      },
    });

    // Update request with latest response if successful
    if (result.data && !result.error) {
      await db.request.update({
        where: { id: requestData.id },
        data: {
          response: result.data,
          updatedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      requestRun,
      result,
    };
  } catch (error: any) {
    const failedRun = await db.requestRun.create({
      data: {
        requestId: requestData.id,
        status: 0,
        statusText: "Failed",
        headers: "",
        body: error.message,
        durationMs: 0,
      },
    });

    return {
      success: false,
      error: error.message,
      requestRun: failedRun,
    };
  }
}
