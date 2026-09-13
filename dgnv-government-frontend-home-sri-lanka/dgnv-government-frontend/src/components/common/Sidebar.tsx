import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaCog,
  FaFileAlt,
  FaHome,
  FaListAlt,
  FaPlusCircle,
  FaSignOutAlt,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import type { Role } from "../../types/platform";
import { clearSession } from "../../utils/session";

type SidebarItem = {
  label: string;
  path: string;
  icon: IconType;
  disabled?: boolean;
};

const itemsByRole: Record<Role, SidebarItem[]> = {
  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard", icon: FaHome },
    { label: "Register Officer", path: "/admin/officers/register", icon: FaUserShield },
    { label: "View Officers", path: "/admin/officers", icon: FaUsers },
    { label: "View Citizens", path: "/admin/citizens", icon: FaUsers },
    { label: "Request Monitoring", path: "/admin/requests", icon: FaListAlt },
    { label: "Reports", path: "/admin/reports", icon: FaChartPie },
    { label: "Settings", path: "/admin/settings", icon: FaCog },
  ],
  OFFICER: [
    { label: "Dashboard", path: "/officer/dashboard", icon: FaHome },
    { label: "Assigned Requests", path: "/officer/requests", icon: FaListAlt },
  ],
  CITIZEN: [
    { label: "Dashboard", path: "/citizen/dashboard", icon: FaHome },
    { label: "Create Request", path: "/citizen/requests/new", icon: FaPlusCircle },
    { label: "My Requests", path: "/citizen/requests", icon: FaFileAlt },
    { label: "Volunteer Details", path: "/citizen/volunteer", icon: FaUsers },
    { label: "Profile", path: "/citizen/profile", icon: FaCog },
  ],
};

type SidebarProps = {
  role: Role;
};

const Sidebar = ({ role }: SidebarProps) => {
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>DGNV</span>
        <small>Government Platform</small>
      </div>

      <nav>
        {itemsByRole[role].map((item) => {
          const Icon = item.icon;

          return item.disabled ? (
            <span className="sidebar-link disabled" key={item.label}>
              <Icon />
              {item.label}
            </span>
          ) : (
            <NavLink className="sidebar-link" to={item.path} key={item.label}>
              <Icon />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button className="sidebar-link logout-button" onClick={logout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
