import AuthGuard from "@/components/AuthGuard/AuthGuard";
import Home from "./home/Home";
export const fetchCache = 'force-no-store'
export default function Index() {
  return (
    <AuthGuard>
      <Home />
    </AuthGuard>
  );
}
