import React, { useState } from "react";
import { useGetCollections } from "../hooks/collection";
import {
  Archive,
  Clock,
  Code,
  ExternalLink,
  HelpCircle,
  Loader2,
  Plus,
  Search,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateCollection from "./create-collection";
import EmptyCollections from "./empty-collection";
import CollectionFolder from "./collection-folder";
import { Hint } from "@/components/ui/hint";

interface Props {
  // We can add proper types further : TODO

  currentWorkspace: {
    id: string;
    name: string;
  }; // we have a lot of data inside currentWorkspace
}

/*

Sidebar component mein future mein multiple tabs add kiye ja sakte hain, jaise:
   
   - Environment: APIs ke environment settings manage karne ke liye

   - Requests: API requests aur unke responses handle karne ke liye

   - Collections: Groups of requests in collection related data manage karne ke liye


  Filhal, hum sirf Collection tab pe focus kar rahe hain aur uski UI implement kar rahe hain.


  Baaki tabs ko aage chalke implement karna hai, tab sidebar ko full tabbed functionality milegi.


*/

const TabbedSidebar = ({ currentWorkspace }: Props) => {
  // state for current active tab

  const [activeTab, setactiveTab] = useState("Collections");

  // state for opening modals (definitely multiple models honge humare pass)

  const [isModalOpen, setIsModalOpen] = useState(false);

  // get all the pre-existing or newer collections jo hum banayenge for a particular workspace

  const { data: collections, isPending } = useGetCollections(
    currentWorkspace?.id
  );

  if (isPending)
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 tet-indigo-400 animate-spin" />
      </div>
    );

  // console.log(collections);

  const sidebarItems = [
    { icon: Archive, label: "Collections" },
    { icon: Clock, label: "History" },
    { icon: Share2, label: "Share" },
    { icon: Code, label: "Code" },
  ];

  // utility for rendering tab content accordingly to various cases

  const renderTabContent = () => {
    switch (activeTab) {
      case "Collections":
        return (
          <div className="h-full bg-zinc-950 text-zinc-100 flex flex-col">
            {/* Now this div for current selected workspace mein hum hai uske liye*/}

            <div className="flex items-center justify-between p-4 border-b border-zinc-400">
              <div className="flex items-center space-x-2">
                {/* name of current workspace */}
                <span className="text-sm text-zinc-400">
                  {currentWorkspace?.name}
                </span>

                <span className="text-zinc-600"></span>
                <span className="text-sm font-medium">Collections</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <HelpCircle className="w-4 h-4 text-zinc-400 hover:text-zinc-300 cursor-pointer" />
                <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300 cursor-pointer" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-zinc-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* New Button */}
            <div className="p-4 border-b border-zinc-800">
              <Button variant={"ghost"} onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New</span>
              </Button>
            </div>

            {collections && collections.length > 0 ? (
              collections.map((collection) => {
                return (
                  <div
                    className="flex flex-col justify-start items-start p-3 border-b border-zinc-800"
                    key={collection.id}
                  >
                    {/* passing collection as prop to show in folder-style ui */}
                    <CollectionFolder collection={collection} />
                  </div>
                );
              })
            ) : (
              <EmptyCollections />
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 text-zinc-400">Select a tab to view content</div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <div className="w-14 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 space-y-3">
        {/* 
        
        Sidebar ke saare items ko map karke render kar rahe hain aur click par active tab ka background change hota hai.

        */}

        {sidebarItems.map((item, index) => (
          <Hint label={item.label} key={index} side="left">
            <div
              key={index}
              onClick={() => setactiveTab(item.label)}
              className={`w-10 h-10 rounded-sm flex items-center justify-center cursor-pointer 
          transition-all duration-200 ease-in-out
          ${
            activeTab === item.label
              ? "text-indigo-600"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
            >
              <item.icon className="w-5 h-5" />
            </div>
          </Hint>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 bg-zinc-900 overflow-y-auto">
        {/* Tab content will render here */}
        {renderTabContent()}
      </div>

      {/*  
      
      this createCollection accepts some props like workspaceId 
         
         - for creating a collection for a particular workspace 

         - isModalOpen , setIsModalOpen for opening a modal 
      
      */}

      <CreateCollection
        workspaceId={currentWorkspace?.id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default TabbedSidebar;
