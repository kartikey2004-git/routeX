// Each auth page lays out the full screen itself (the sign-in page is a split layout).
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
