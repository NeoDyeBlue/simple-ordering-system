import { AdminProvider } from "../../contexts/Admin.context";
import AdminNavLayout from "./AdminNavLayout";

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminNavLayout>{children}</AdminNavLayout>
    </AdminProvider>
  );
}
