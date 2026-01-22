import { useLocation } from "react-router-dom";
import { dashboardRoutes } from "@/layout/Routes";

interface DashboardHeaderProps {
  title?: string;
}

// Map of paths to page titles for routes not in dashboardRoutes
const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/bookings": "Bookings",
  "/vendors": "Vendors",
  "/vendor-registrations": "Vendor Registrations",
  "/users": "Users",
  "/transactions": "Transactions",
  "/withdrawals": "Withdrawals",
  "/support": "Support",
  "/settings": "Settings",
};

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const location = useLocation();

  // Get title from props, route config, or pageTitles map
  const getPageTitle = (): string => {
    if (title) return title;

    // Check dashboardRoutes first
    const route = dashboardRoutes.find((r) => r.path === location.pathname);
    if (route?.name) return route.name;

    // Check pageTitles map
    if (pageTitles[location.pathname]) return pageTitles[location.pathname];

    // Fallback: derive from pathname
    const pathSegment = location.pathname.split("/").filter(Boolean)[0] || "dashboard";
    return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1).replace(/-/g, " ");
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
    </div>
  );
};

export default DashboardHeader;
