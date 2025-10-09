import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addRequestToCollection,
  saveRequest,
  getAllRequestFromCollection,
  type Request,
  deleteRequestFromCollection,
  editRequestFromCollection,
} from "../actions";
import { REST_METHOD } from "@prisma/client";

// Custom hook banaya hai to add request to collection

export function useAddRequestToCollection(collectionId: string) {
  const queryClient = useQueryClient(); // directly QueryClient instance ka access

  /*

   we need to pass collectionId as props ( for linking request to particular collection ) while call this mutation fn

   now we have to invalidate it because , jab useMutation query chalta hai
     
      - toh naya request toh add hojayega particular collection mein 
      
      - woh query turant stale/outdated hojati hai , data cache hojata hai

      - and to  refetch fresh data again from db , humein invalidate krna hoga query ko , by using QueryClient  invalidateQueries function

*/

  return useMutation({
    mutationFn: async (value: Request) =>
      addRequestToCollection(collectionId, value),

    // data is the return callback value when we call this addRequestToCollection in mutationFn

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests", collectionId] });

      // querykey is unique key which is used for caching and identify this query

      console.log(data);
    },
  });
}

// Custom hooks banaya hai when we have to get all requests from a collection by its collectionId

export function useGetAllRequestFromCollection(collectionId: string) {
  return useQuery({
    queryKey: ["requests", collectionId],

    // we have to pass props: collectionId to this queryFn , so that it can get all requests for particular collection

    queryFn: async () => getAllRequestFromCollection(collectionId),
  });
}

export function useSaveRequest(id: string) {
  const queryClient = useQueryClient(); // directly QueryClient instance ka access

  /*

   we need to pass ( id:request id ) as props for updating request while call this mutation fn

   now we have to invalidate it because , jab useMutation query chalta hai
     
      - toh request update toh hojayega 
      
      - lekin woh query turant stale/outdated hojati hai , data cache hojata hai

      - and to  refetch fresh data again from db , humein invalidate krna hoga query ko , by using QueryClient  invalidateQueries function

   */

  return useMutation({
    mutationFn: async (value: Request) => saveRequest(id, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      console.log(data);
    },
  });
}

// Custom hooks banaya hai when we have to delete a request from a collection by its requestId

export function useDeleteRequest(requestId: string, collectionId: string) {
  const queryClient = useQueryClient(); // directly QueryClient instance ka access

  /*
  
  - here we delete a particular request by its requestId from a collection while call this mutation fn 

  now we have to invalidate it because , jab useMutation query chalta hai
     
     - toh request toh delete hojayegi but refetch nahi hongi requests collections ki

     - woh query turant stale/outdated hojati hai , data cache hojata hai


  - and to  refetch fresh data again from db , humein invalidate krna hoga query ko , by using QueryClient  invalidateQueries function


  */

  return useMutation({
    mutationFn: async () => deleteRequestFromCollection(requestId, collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
    },
  });
}

export function useEditRequest(
  requestId: string,
  collectionId: string,
  name: string,
  method: REST_METHOD,
  url: string
) {
  const queryClient = useQueryClient(); // directly QueryClient instance ka access

  /*
  
  - we need to pass requestId , request name , method , url as props while call this mutation fn for updating/editing request
     
     -  we also have to pass collectionId because request is not globally unique because our setup is nested


  now we have to invalidate it because , jab useMutation query chalta hai
     
     - toh request edit/update toh hojayegi but fetch nahi hogi updated request from collection

     - woh query turant stale/outdated hojati hai , data cache hojata hai


  - and to  refetch fresh data again from db , humein invalidate krna hoga query ko , by using QueryClient  invalidateQueries function


  */

  return useMutation({
    mutationFn: async () =>
      editRequestFromCollection(requestId, collectionId, name, method, url),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
    },
  });
}

/*

  - Query key unique honi chahiye , yaha pe collections ka cache hoga

  - Query function -> ye function actual API call karega : Yaha hum getCollections call kar rahe hain jo saare collections laa rha hai ek workspace ke

1. useQuery

  - Read data from server.
  - Handles fetching, caching, auto-refetch.
    Example: getTodos, getUser.

2. useMutation

  - Write data (create, update, delete).
  - Used for POST/PUT/DELETE requests.
    Example: addTodo, updateUser.

3. useQueryClient

  - Gives direct access to the QueryClient (global cache).

  - Used to invalidate or update queries after mutation.

  - Example: after adding a todo, invalidate ['todos'] so it refetches.

*/
