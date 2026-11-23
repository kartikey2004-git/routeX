import { LandingFrame } from "@/modules/landing/components/landing-frame";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandingFrame>{children}</LandingFrame>;
}
