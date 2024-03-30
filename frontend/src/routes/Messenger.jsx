import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";

export default function Messenger() {
  return (
    <div className="flex flex-1 h-screen mx-auto w-full max-w-7xl">
      <Sidebar />

      <Outlet />
    </div>
  );
}
