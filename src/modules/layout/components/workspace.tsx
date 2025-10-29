"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { Loader2, Plus, User } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useWorkspaces } from "@/modules/workspace/hooks/workspace";
import { useWorkspaceStore } from "../store";
import CreateWorkspace from "./create-workspace";

const Workspace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: workspaces, isLoading } = useWorkspaces();

  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceStore();

  /*
  
  useEffect call krenge now , kyu call kr rhe kyuki agar humare workspaces ka length jyada ho   
     
     - matlab humare pass ek bhi workspace exist krta hai 

     - aur abhi humne koi bhi workspace select nhi kri huyi hai 

     - toh hum pehle workspace ko select krlenge
  
  */

  // avoids useEffect although because it hampers the performance of application

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace, setSelectedWorkspace]);

  if (isLoading) {
    return <Loader2 className="animate-spin size-4 text-blue-400" />;
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="font-semibold text-blue-400">No Workspace Found</div>
    );
  }

  return (
    <>
      <Hint label="Change Workspace">
        <Select
          value={selectedWorkspace?.id}
          onValueChange={(id) => {
            // if id of particular workspace changed then find the particular workspace in array with same id , and set it to selected workspace

            const ws = workspaces.find((w) => w.id === id);
            if (ws) setSelectedWorkspace(ws);
          }}
        >
          <SelectTrigger className="border flex flex-row items-center space-x-1">
            <User className="size-4 text-white" />
            <span className="text-sm  font-semibold">
              <SelectValue placeholder="Select workspace" />

              <SelectContent>
                {workspaces.map((ws) => {
                  return (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </SelectItem>
                  );
                })}

                <Separator className="my-1" />
                <div className="flex items-center justify-between text-sm font-semibold text-zinc-600">
                  {/* here show all created workspaces and all workspaces where we are a member */}

                  <span className="text-sm ml-1 font-semibold text-zinc-500">
                    My Workspaces
                  </span>

                  {/* now I want humein ek naya workspace create krne ka option miljayein */}

                  {/* when we click on this plus icon ek modal open hona chahiye for creating new worspace */}

                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </SelectContent>
            </span>
          </SelectTrigger>
        </Select>
      </Hint>

      <CreateWorkspace
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      {/* Workspace create hone ke baad, agar kisi workspace pe click karein, toh wahi app ka globally selected workspace ban jaayega */}
    </>
  );
};

export default Workspace;

/* 
  
  - This component will try to render a prefetched workspace if available . It can also accept a workspace directly as a prop


  - By default automatically login pe workspace automatically create/intialize hojayega if we have no workspaces

  - If we have multiple workspaces already toh usme se pehla wala workspace select hojayega

*/
