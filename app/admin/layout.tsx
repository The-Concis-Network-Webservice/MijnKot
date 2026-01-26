import { AdminProvider } from "./AdminProvider";
import { ToastProvider } from "./_components/toast";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <ToastProvider>{children}</ToastProvider>
    </AdminProvider>
  );
}

