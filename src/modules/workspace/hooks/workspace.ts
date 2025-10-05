import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspaces, getWorkspaceById, getWorkspaces } from "../actions";

// Custom hook banaya hai when we have to get all workspaces 
export function useWorkspaces() {
  return useQuery({

    queryKey: ["workspaces"], // querykey is unique key which is used for caching data of  query

    queryFn: async () => getWorkspaces(),
  });
}

// Custom hook banaya hai  when we have to create a new workspace and we need to pass workspace name while creating it

export function useCreateWorkspace() {

  const queryClient = useQueryClient(); // directly QueryClient instance ka access

  return useMutation({
    mutationFn: async (name: string) => createWorkspaces(name), 

    /* we have to pass props or data : 
       
       - name to pass into function createWorkspace while call this mutation fn
       
       - now we have to invalidate it because , jab usemutation query chalta hai 
          
          - toh naya workspace toh add hojayega but ye fetch nahi hoga 

          - woh query turant stale/outdated hojati hai , data cache hojata hai 
          
          - and to  refetch fresh data again from db , humein invalidate krna hoga query ko , by using QueryClient  invalidateQueries function

    */

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

// Custom hook banaya hai when we have to fetch/get workspace by its particular id

export function useGetWorkspace(id:string){
  return useQuery({

    queryKey:["workspace",id], 

    // Query key unique honi chahiye , yaha pe har workspace id ka apna cache hoga


    // Query function -> ye function actual API call karega : Yaha hum getWorkspaceById(id) call kar rahe hain jo ek workspace ka data laata hai
    
    queryFn: async () => getWorkspaceById(id)
  })
}



/*

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
