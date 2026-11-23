import { WorkbenchSkeleton } from "@/components/shared/workbench-skeleton";

// Shown while a workbench route streams in.
export default function Loading() {
  return <WorkbenchSkeleton label="Loading your workbench" />;
}
