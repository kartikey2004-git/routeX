import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor from "@monaco-editor/react";
import {
  Clock,
  HardDrive,
  CheckCircle,
  Copy,
  Download,
  Filter,
  MoreHorizontal,
  Code,
  FileText,
  Settings,
  TestTube,
  Trash2,
} from "lucide-react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

type HeadersMap = Record<string, string>;

interface RequestRun {
  id: string;
  requestId?: string;
  status?: number;
  statusText?: string;
  headers?: HeadersMap;
  body?: string | object | null;
  durationMs?: number;
  createdAt?: string;
}

interface Result {
  status?: number;
  statusText?: string;
  duration?: number;
  size?: number;
}

export interface ResponseData {
  success: boolean;
  requestRun: RequestRun;
  result?: Result;
}

interface Props {
  responseData: ResponseData;
}

const ResponseViewer = ({ responseData }: Props) => {
  const [activeTab, setActiveTab] = useState("json");
  const { clearResponseViewerData } = useRequestPlaygroundStore();

  const getStatusColor = (status?: number): string => {
    const s = typeof status === "number" ? status : 0;
    if (s >= 200 && s < 300) return "text-green-600";
    if (s >= 300 && s < 400) return "text-yellow-600";
    if (s >= 400 && s < 500) return "text-orange-600";
    if (s >= 500) return "text-red-600";
    return "text-slate-500";
  };

  const formatBytes = (bytes?: number): string => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const copyToClipboard = (text: string) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => {
      /* ignore */
    });
  };

  // Defensive parse: body may be already an object or invalid JSON
  let responseBody: unknown = {};
  let formattedJsonString = "";
  try {
    const rawBody = responseData?.requestRun?.body;
    if (typeof rawBody === "string") {
      responseBody = rawBody.length ? JSON.parse(rawBody) : rawBody;
    } else {
      responseBody = rawBody ?? {};
    }
    formattedJsonString = JSON.stringify(responseBody, null, 2);
  } catch (e) {
    // If parsing fails, fall back to the raw string
    responseBody = responseData?.requestRun?.body ?? {};
    formattedJsonString =
      typeof responseBody === "string"
        ? responseBody
        : JSON.stringify(responseBody, null, 2);
  }

  const status: number | undefined =
    responseData.result?.status ?? responseData.requestRun?.status;
  const statusText: string | undefined =
    responseData.result?.statusText ?? responseData.requestRun?.statusText;
  const duration: number | undefined =
    responseData.result?.duration ?? responseData.requestRun?.durationMs;
  const size: number | undefined = responseData.result?.size;
  const rawBody = responseData.requestRun?.body;

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="w-full mx-auto max-w-6xl px-6 py-8">
        {/* Status Header */}
        <Card className="bg-white border-slate-200 shadow-lg rounded-lg mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Status:</span>
                  <Badge
                    className={`${getStatusColor(
                      status,
                    )} bg-transparent border-current`}
                  >
                    {status ?? "—"} • {statusText ?? ""}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600">Time:</span>
                  <span className="text-primary">
                    {duration ? `${duration} ms` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600">Size:</span>
                  <span className="text-green-600">{formatBytes(size)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  onClick={clearResponseViewerData}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Response
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Response Tabs */}
        <Card className="bg-white border-slate-200 shadow-lg rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground">Response Body</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-6 border-b border-slate-200">
                <TabsList className="bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="json"
                    className="bg-transparent data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-sm px-4 py-2 transition-all"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    JSON
                  </TabsTrigger>
                  <TabsTrigger
                    value="raw"
                    className="bg-transparent data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-sm px-4 py-2 transition-all"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Raw
                  </TabsTrigger>
                  <TabsTrigger
                    value="headers"
                    className="bg-transparent data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-sm px-4 py-2 transition-all"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Headers
                    <Badge
                      variant="secondary"
                      className="ml-2 text-xs bg-muted"
                    >
                      {Array.isArray(responseData?.requestRun?.headers)
                        ? responseData.requestRun.headers.length
                        : Object.keys(responseData?.requestRun?.headers || {})
                            .length || 0}
                    </Badge>
                  </TabsTrigger>

                  <TabsTrigger
                    value="test"
                    className="bg-transparent data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-sm px-4 py-2 transition-all"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Results
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="json" className="mt-0">
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-600 hover:text-slate-900 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm transition-all"
                      onClick={() => copyToClipboard(formattedJsonString)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="h-96 bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <Editor
                      defaultLanguage="json"
                      value={formattedJsonString}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        wordWrap: "on",
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        lineNumbers: "on",
                        glyphMargin: false,
                        folding: true,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "none",
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                      }}
                      theme="vs-light"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="raw" className="mt-0">
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-600 hover:text-slate-900 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm"
                      onClick={() => copyToClipboard(String(rawBody ?? ""))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="h-96 bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <Editor
                      height="100%"
                      defaultLanguage="text"
                      value={String(rawBody ?? "")}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        wordWrap: "on",
                        lineNumbers: "on",
                        glyphMargin: false,
                        folding: true,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "none",
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                      }}
                      theme="vs-light"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="headers" className="mt-0">
                <ScrollArea className="h-96 bg-white rounded-lg border border-slate-200">
                  <div className="p-6">
                    <div className="space-y-3">
                      {Object.entries(
                        responseData.requestRun.headers ?? {},
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start justify-between py-3 border-b border-slate-200 last:border-b-0"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 text-sm">
                              {key}
                            </div>
                            <div className="text-slate-600 text-sm break-all">
                              {value}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900 ml-2 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all"
                            onClick={() => copyToClipboard(`${key}: ${value}`)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="test" className="mt-0">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">
                      All tests passed
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-foreground">
                        Status code is 200
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-foreground">
                        Response time is less than 3000ms
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-foreground">
                        Content-Type is present
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponseViewer;
