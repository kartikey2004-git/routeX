/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { nanoid } from "nanoid";

interface SavedRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  body?: string;
  headers?: string;
  parameters?: string;
}

export type RequestTab = {
  id: string;
  title: string;
  method: string;
  url: string;
  body?: string;
  headers?: string;
  parameters?: string;
  unsavedChanges?: boolean; // just to track changes in particular tab

  requestId?: string; // requestId
  collectionId?: string; // collectionId for which collection request belong to

  workspaceId?: string; // workspaceId
};

// here both editor and viewer ar present

type PlaygroundState = {
  tabs: RequestTab[]; // multiple request tabs
  activeTabId: string | null; // konsa request tab active hai , uski id

  addTab: () => void; // for adding a new tab
  closeTab: (id: string) => void; // for closing a particular tab

  setActiveTab: (id: string) => void; // function for setting active req tab by id

  updateTab: (id: string, data: Partial<RequestTab>) => void; // function to update paeticular req tab

  markUnsaved: (id: string, value: boolean) => void; // mark particular tab to be unsaved tab

  openRequestTab: (req: any) => void; // for opening a request tab for a particular req

  updateTabFromSavedRequest: (
    tabId: string,
    savedRequest: SavedRequest
  ) => void; // for updating a particular tab from saved request

  // responseViewerData: ResponseData | null;
  // setResponseViewerData: (data: ResponseData) => void;
};

export const useRequestPlaygroundStore = create<PlaygroundState>((set) => ({
  tabs: [],
  activeTabId: null,

  // addTab adds new request tab to tabs array

  addTab: () =>
    set((state) => {
      const newTab: RequestTab = {
        id: nanoid(),
        title: "Untitled",
        method: "GET",
        url: "",
        body: "",
        headers: "",
        parameters: "",
        unsavedChanges: true, // intially jab request tab hum banayenge wo save nhi hoga database mein
      };
      return {
        tabs: [...state.tabs, newTab], // yaha pe humne tabs array ko spread krke usme ek naya tab add (append) kiya hai

        activeTabId: newTab.id,
      };
    }),

  closeTab: (id) =>
    set((state) => {
      /*

     This logic handles closing a request tab. 
        
        - Jab user koi req tab close karta hai, toh hum us specific req tab ko 'tabs' array se remove karte hain. 

        - Remove karne ke liye array ko filter karte hain aur sirf woh tabs retain karte hain jinki requestTab ID closed tab ki ID se match nahi karti. 

        - Isse 'tabs' ka state hamesha sirf currently open tabs dikhata hai.
     
     */

      const newTabs = state.tabs.filter((t) => t.id !== id);

      /*
     
     Ye logic active tab update karne ke liye hai jab koi request tab close hoti hai. 

         - Agar close ho rahi tab currently active tab hai

           - toh hum active tab ko filtered 'newTabs' array ke first tab par set kar dete hain (jo remaining open tabs me se pehla tab hota hai). 

           - Agar close ho rahi tab active tab nahi hai, toh active tab wahi rahega. 

           - isse tab close hone par active tab hamesha ek valid tab ko point kare.
     
     */

      const newActive =
        state.activeTabId === id && newTabs.length > 0
          ? newTabs[0].id
          : state.activeTabId;
      return { tabs: newTabs, activeTabId: newActive };
    }),

  // helps in setting newActivetab by taking ( id: reqTabId) as parameters

  setActiveTab: (id) => set({ activeTabId: id }),

  // update the data in particular requestTab explicitly (id: requestTabId and data as parameters ) and set unsavedChanges to true ( means no unsaved changes now )

  updateTab: (id, data) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, ...data, unsavedChanges: true } : t
      ),
    })),

  // it marks the check to database that humare pass ab koi bhi data nahi hai jo saved nahi db mein

  markUnsaved: (id, value) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, unsavedChanges: value } : t
      ),
    })),

  openRequestTab: (req) =>
    set((state) => {
      /*

      - req backend se ayegi 

      - Sab open request tabs mein check karo ki koi tab ka request ID incoming request ke ID ke equal hai ya nahi.

       Agar hai, toh us tab ko active tab set karo instead of naya tab open karne ke.

     */

      const existing = state.tabs.find((t) => t.requestId === req.id);
      if (existing) {
        return { activeTabId: existing.id };
      }

      const newTab: RequestTab = {
        id: nanoid(),
        title: req.name || "Untitled",
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers,
        parameters: req.parameters,
        requestId: req.id, // identifier for particular request in backend

        collectionId: req.collectionId,
        workspaceId: req.workspaceId,
        unsavedChanges: false,
      };

      return {
        tabs: [...state.tabs, newTab], // yaha pe humne tabs array ko spread krke usme ek naya tab add (append) kiya hai

        activeTabId: newTab.id,
      };
    }),

  /*
  
  -  Jab bhi hum database mein koi changes karte hain – chahe add ho ya update particular request mein
     
     - is function ko call karenge with tabId as parameter aur saved request backend se ayegi. 

     - Phir hum particular tab ke liye us request ka data backend se update karenge. 

     - Active tab ka data turant update ho jayega, giving us a real-time, optimistic UI experience. 
  
  */

  updateTabFromSavedRequest: (tabId: string, savedRequest: SavedRequest) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === tabId
          ? {
              ...t,
              id: savedRequest.id, // Replace temporary id with saved one
              title: savedRequest.name,
              method: savedRequest.method,
              body: savedRequest?.body,
              headers: savedRequest?.headers,
              parameters: savedRequest?.parameters,
              url: savedRequest.url,
              unsavedChanges: false,
            }
          : t
      ),
      activeTabId: savedRequest.id, // keep active in sync
    })),
}));
