import React from "react";
import { RequestTab } from "../store/useRequestStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeyValueFormEditor from "./key-value-form";
import BodyEditor from "./body-editor";

interface Props {
  tab: RequestTab;
  updateTab: (id: string, data: Partial<RequestTab>) => void;
}

type KeyValue = { key: string; value: string; enabled?: boolean };

const emptyRow: KeyValue = { key: "", value: "", enabled: true };

const parseKeyValueData = (jsonString?: string): KeyValue[] => {
  if (!jsonString) return [];
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Autosaved edits are silent: the field itself shows the state, so a toast
// on every keystroke would only add noise.
const RequestEditorArea = ({ tab, updateTab }: Props) => {
  const parameters = parseKeyValueData(tab.parameters);
  const headers = parseKeyValueData(tab.headers);

  const handleHeadersChange = (data: KeyValue[]) => {
    const filteredHeaders = data.filter(
      (item) =>
        item.enabled !== false && (item.key.trim() || item.value.trim()),
    );
    updateTab(tab.id, { headers: JSON.stringify(filteredHeaders) });
  };

  const handleParametersChange = (data: KeyValue[]) => {
    const filteredParams = data.filter(
      (item) =>
        item.enabled !== false && (item.key.trim() || item.value.trim()),
    );
    updateTab(tab.id, { parameters: JSON.stringify(filteredParams) });
  };

  const handleBodyChange = (data: { contentType: string; body?: string }) => {
    updateTab(tab.id, { body: data.body || "" });
  };

  const hasBody = Boolean(tab.body && tab.body.trim());

  return (
    <Tabs defaultValue="parameters" className="gap-0">
      <TabsList className="h-8 gap-4 border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="parameters"
          className="h-8 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 text-[13px] text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Params
          {parameters.length > 0 && <Count n={parameters.length} />}
        </TabsTrigger>
        <TabsTrigger
          value="headers"
          className="h-8 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 text-[13px] text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Headers
          {headers.length > 0 && <Count n={headers.length} />}
        </TabsTrigger>
        <TabsTrigger
          value="body"
          className="h-8 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 text-[13px] text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Body
          {hasBody && <span className="size-1.5 rounded-full bg-primary" aria-label="Has content" />}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="parameters" forceMount className="pt-4 data-[state=inactive]:hidden">
        <KeyValueFormEditor
          title="Query parameters"
          initialData={parameters.length > 0 ? parameters : [emptyRow]}
          onSubmit={handleParametersChange}
          placeholder={{ key: "name", value: "value", description: "Query parameter" }}
        />
      </TabsContent>

      <TabsContent value="headers" forceMount className="pt-4 data-[state=inactive]:hidden">
        <KeyValueFormEditor
          title="Headers"
          initialData={headers.length > 0 ? headers : [emptyRow]}
          onSubmit={handleHeadersChange}
          placeholder={{ key: "Header", value: "Value", description: "HTTP header" }}
        />
      </TabsContent>

      <TabsContent value="body" className="pt-4">
        <BodyEditor
          initialData={{
            contentType: "application/json",
            body: tab.body || "",
          }}
          onSubmit={handleBodyChange}
        />
      </TabsContent>
    </Tabs>
  );
};

function Count({ n }: { n: number }) {
  return (
    <span className="ml-1.5 rounded-sm bg-muted px-1 font-mono text-[11px] text-muted-foreground">
      {n}
    </span>
  );
}

export default RequestEditorArea;
