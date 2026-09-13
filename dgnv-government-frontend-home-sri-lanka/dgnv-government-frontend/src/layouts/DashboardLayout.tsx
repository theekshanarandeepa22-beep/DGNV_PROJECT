import type { ReactNode } from "react";
import Sidebar from "../components/common/Sidebar";
import type { Role } from "../types/platform";

type DashboardLayoutProps = {
  role: Role;
  children: ReactNode;
};

const DashboardLayout = ({ role, children }: DashboardLayoutProps) => (
  <div className="dashboard-shell">
    <Sidebar role={role} />
    <main className="dashboard-main">{children}</main>
  </div>
);

export default DashboardLayout;
