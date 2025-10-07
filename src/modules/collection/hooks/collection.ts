import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCollection,
  deleteCollection,
  editCollection,
  getCollections,
} from "../actions";

// Custom hook banaya hai when we have to get all collections

export function useGetCollections(workspaceId: string) {
  return useQuery({
    // querykey is unique key which is used for caching and identify this query ,

    // here "collection" + workspaceId mila ke ek unique identifier banaya hai

    queryKey: ["collections", workspaceId],

    // we have to pass props: workspaceId to this queryFn , so that it can get all collections for particular workspace

    queryFn: async () => getCollections(workspaceId),
  });
}

// Custom hook banaya hai  when we have to create a new collection

export function useCreateCollection(workspaceId: string) {
  const queryClient = useQueryClient(); // directly QueryClient instance ka access

  /*
  
  - we need to pass workspaceId as props ( for linking collection to particular workspace ) while call this mutation fn

  now we have to invalidate it because , jab useMutation query chalta hai
     
     - toh naya collection toh add hojayega particular workspace mein but ye fetch nahi hoga

     - woh query turant stale/outdated hojati hai , data cache hojata hai


  - and to  refetch fresh data again from db , humein invalidate krna hoga query ko , by using QueryClient  invalidateQueries function


  */

  return useMutation({
    mutationFn: async (name: string) => createCollection(workspaceId, name),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections", workspaceId],
      });
    },
  });
}

// Custom hooks banaya hai when we have to delete a collection by its collectionId

export function useDeleteCollection(collectionId: string) {
  const queryClient = useQueryClient(); // directly QueryClient instance ka access

  /*
  
  - here we delete a particular collection by its collectionId while call this mutation fn 

  now we have to invalidate it because , jab useMutation query chalta hai
     
     - toh collection toh delete hojayega but ye refetch nahi hoga

     - woh query turant stale/outdated hojati hai , data cache hojata hai


  - and to  refetch fresh data again from db , humein invalidate krna hoga query ko , by using QueryClient  invalidateQueries function


  */

  return useMutation({
    mutationFn: async () => deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
  });
}

export function useEditCollection(collectionId: string, name: string) {
  const queryClient = useQueryClient(); // directly QueryClient instance ka access

  /*
  
  - we need to pass collectionId , collection name as props while call this mutation fn for updating/editing collection


  now we have to invalidate it because , jab useMutation query chalta hai
     
     - toh collection edit/update toh hojayega but ye fetch nahi hoga

     - woh query turant stale/outdated hojati hai , data cache hojata hai


  - and to  refetch fresh data again from db , humein invalidate krna hoga query ko , by using QueryClient  invalidateQueries function


  */

  return useMutation({
    mutationFn: async () => editCollection(collectionId, name),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
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
