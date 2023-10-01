import AuthGuard from "@/components/AuthGuard/AuthGuard";
import Home from "./home/Home";

export default function Index() {
  return (
    <AuthGuard>
      <Home />
    </AuthGuard>
  );
}
