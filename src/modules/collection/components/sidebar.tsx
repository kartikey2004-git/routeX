import React, { useState } from "react";
import { useGetCollections } from "../hooks/collection";
import {
  Archive,
  Clock,
  Code,
  ExternalLink,
  HelpCircle,
  Plus,
  Search,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateCollection from "./create-collection";
import EmptyCollections from "./empty-collection";
import CollectionFolder from "./collection-folder";
import { Hint } from "@/components/ui/hint";
import { Skeleton } from "@/components/ui/skeleton";

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
    currentWorkspace?.id,
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
          <div className="h-full bg-card text-foreground flex flex-col border-r">
            {/* Now this div for current selected workspace mein hum hai uske liye*/}

            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                {/* name of current workspace */}
                <span className="text-sm text-muted-foreground">
                  {currentWorkspace?.name}
                </span>

                <span className="text-muted-foreground"></span>
                <span className="text-sm font-normal">Collections</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder="Search" className="pl-10" />
              </div>
            </div>

            {/* New Button */}
            <div className="p-4 border-b">
              <Button variant={"ghost"} onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New</span>
              </Button>
            </div>

            {isPending ? (
              <div className="flex flex-col gap-2 p-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-9 w-full" />
                ))}
              </div>
            ) : collections && collections.length > 0 ? (
              collections.map((collection) => {
                return (
                  <div
                    className="flex flex-col justify-start items-start p-3 border-b"
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
          <div className="p-4 text-muted-foreground">
            Select a tab to view content
          </div>
        );
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full bg-background">
      {/* Sidebar */}
      <div className="w-14 shrink-0 border-r bg-card py-3">
        <div className="flex flex-col items-center gap-2.5">
          {/* 
        
        Sidebar ke saare items ko map karke render kar rahe hain aur click par active tab ka background change hota hai.

        */}

          {sidebarItems.map((item, index) => (
            <Hint label={item.label} key={index} side="right" className="">
              <div
                key={index}
                onClick={() => setactiveTab(item.label)}
                className={`flex h-9 w-9 items-center justify-center rounded-md cursor-pointer 
          transition-all duration-200 ease-in-out
          ${
            activeTab === item.label
              ? "bg-muted"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
              >
                <item.icon className="w-5 h-5" />
              </div>
            </Hint>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-card scrollbar-light">
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
