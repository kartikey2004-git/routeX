/*
  Landing copy. Every claim must be something the product does today.
  No pricing, no customer logos, no testimonials: none of those exist yet,
  and inventing them would mislead the people reading this page.
*/

export const nav = {
  links: [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
};

export const hero = {
  eyebrow: "REST and WebSocket workbench",
  headline: "Send the request. Read the response. Keep both.",
  lede: "RouteX is where backend developers build, send and organize API requests. Read status and timing at a glance, save requests into collections, and share the workspace with a link.",
  primaryCta: "Continue with GitHub",
  secondaryCta: { label: "See how it works", href: "#product" },
  note: "Next, sign in with GitHub. RouteX never asks for a password.",
  shortcuts: [
    { keys: ["⌘", "K"], label: "Command palette" },
    { keys: ["⌘", "↵"], label: "Send" },
    { keys: ["⌘", "S"], label: "Save" },
  ],
};

export type TourTab = {
  id: string;
  label: string;
  title: string;
  body: string;
  points: string[];
};

export const tour: TourTab[] = [
  {
    id: "rest",
    label: "REST",
    title: "A request and its response, side by side",
    body: "Choose the method, type the URL, and set parameters, headers and a JSON body. The status, timing and size sit above the response, so you know the outcome before you read the payload.",
    points: [
      "Methods: GET, POST, PUT, PATCH, DELETE",
      "Send with ⌘↵ from anywhere in the editor",
      "Stack the response below or beside the request",
    ],
  },
  {
    id: "websocket",
    label: "WebSocket",
    title: "Watch every message in order",
    body: "Connect to a ws:// or wss:// endpoint, send JSON or plain text, and follow the log as traffic arrives. Sent and received messages are marked by direction.",
    points: [
      "Reconnects automatically after a dropped connection",
      "Arrow keys step through the log",
      "Expand any message to see the formatted payload",
    ],
  },
  {
    id: "collections",
    label: "Collections",
    title: "Keep requests where the team can find them",
    body: "Group requests into named collections inside a workspace. Rename, filter and delete from the same place, and see which request is open.",
    points: [
      "Save an open request into any collection with ⌘S",
      "Filter collections by name",
      "Invite teammates to the workspace with a link",
    ],
  },
  {
    id: "ai",
    label: "AI assist",
    title: "Start from a sentence, not a blank body",
    body: "Describe the payload you need and RouteX generates a JSON body. Ask for a name for a request you haven't named yet, and pick from the suggestions.",
    points: [
      "Generated JSON replaces the current body, so use it on a fresh request",
      "Suggests request names with a reason for each",
      "Name suggestions change nothing until you pick one",
    ],
  },
];

export const features = [
  {
    icon: "gauge",
    title: "Timing you can see",
    body: "Status code, duration and size appear above the body. The timing bar makes slow responses obvious at a glance.",
  },
  {
    icon: "keyboard",
    title: "Built for the keyboard",
    body: "⌘K opens the command palette, ⌘G starts a new request, ⌘S saves, and ⌘↵ sends. Each shortcut is shown where you use it.",
  },
  {
    icon: "save",
    title: "Nothing is lost",
    body: "Edits to parameters, headers and bodies save as you type. Unsaved requests keep a visible dot until you save them.",
  },
  {
    icon: "search",
    title: "Find anything",
    body: "The command palette searches requests across every collection in the workspace, plus commands and other workspaces.",
  },
  {
    icon: "users",
    title: "Share a workspace",
    body: "Generate an invite link and send it to a teammate. Expired or used links explain what went wrong instead of failing silently.",
  },
  {
    icon: "sun",
    title: "Light or dark",
    body: "The workbench opens in light mode. Switch to dark from the top bar whenever you prefer it.",
  },
];

export const steps = [
  {
    title: "Sign in",
    body: "Continue with GitHub. Your first workspace is created for you.",
  },
  {
    title: "Build a request",
    body: "Pick a method, enter the URL, and add parameters, headers or a body.",
  },
  {
    title: "Send and read",
    body: "Read the status, timing and response. Adjust and send again with ⌘↵.",
  },
  {
    title: "Save and share",
    body: "Save the request into a collection. Invite teammates with a link when you're ready.",
  },
];

export const faq = [
  {
    q: "Do I need an account?",
    a: "Yes. You sign in with GitHub, and RouteX doesn't ask for a password.",
  },
  {
    q: "Where are my requests stored?",
    a: "Saved requests and collections are stored in a PostgreSQL database.",
  },
  {
    q: "Can I test WebSocket servers?",
    a: "Yes. Connect to any ws:// or wss:// endpoint you can reach, send text or JSON, and follow the message log.",
  },
  {
    q: "How do I bring my team in?",
    a: "Open the invite menu in the top bar, generate a link, and send it. Anyone with a valid link can join the workspace.",
  },
  {
    q: "Is AI required?",
    a: "No. AI assist is optional. Name suggestions and JSON generation only run when you ask for them.",
  },
];

export const finalCta = {
  headline: "Your next request is one click away.",
  body: "Sign in with GitHub and start in the workbench. Your first workspace is ready when you land.",
  cta: "Continue with GitHub",
};

// A realistic exchange, shown as a static specimen in the hero and REST tour.
export const specimen = {
  method: "POST",
  url: "https://api.example.com/v1/orders",
  requestBody: `{
  "sku": "KB-104",
  "quantity": 2,
  "shipTo": "Pune, IN"
}`,
  status: 201,
  statusText: "Created",
  durationMs: 84,
  sizeLabel: "312 B",
  responseBody: `{
  "id": "ord_8f2c1a",
  "status": "pending",
  "total": 3498,
  "currency": "INR"
}`,
};
