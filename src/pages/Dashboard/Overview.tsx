import { Link } from "react-router-dom";
import PageHeader from "@/components/Header/PageHeader";
import { FiShoppingCart, FiUsers } from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi";
import { TbTrendingUp, TbTrendingDown } from "react-icons/tb";
import SideBar from "@/components/Sidebar/SideBar";

// Dummy data for stats
const statsData = [
  {
    id: 1,
    title: "Total Vendors",
    value: "21,877",
    change: "+18%",
    changeType: "positive" as const,
    changeLabel: "vs last month",
    icon: <FiShoppingCart className="w-5 h-5 text-[#1E3A5F]" />,
    iconBg: "bg-[#E8EEF4]",
  },
  {
    id: 2,
    title: "Total Bookings",
    value: "871",
    change: "-88%",
    changeType: "negative" as const,
    changeLabel: "vs last month",
    icon: <HiOutlineTicket className="w-5 h-5 text-[#0D9488]" />,
    iconBg: "bg-[#E6F7F5]",
  },
  {
    id: 3,
    title: "Total Users",
    value: "1,200",
    change: null,
    changeType: null,
    changeLabel: null,
    icon: <FiUsers className="w-5 h-5 text-[#1E3A5F]" />,
    iconBg: "bg-[#E8EEF4]",
  },
];

// Dummy data for recent bookings
const recentBookings = [
  { id: 1, vendor: "Amazing Catering Service", time: "02:00 PM", date: "Mar 23, 2025" },
  { id: 2, vendor: "Amazing Catering Service", time: "02:00 PM", date: "Mar 23, 2025" },
  { id: 3, vendor: "Amazing Catering Service", time: "02:00 PM", date: "Mar 23, 2025" },
  { id: 4, vendor: "Amazing Catering Service", time: "02:00 PM", date: "Mar 23, 2025" },
  { id: 5, vendor: "Amazing Catering Service", time: "02:00 PM", date: "Mar 23, 2025" },
  { id: 6, vendor: "Amazing Catering Service", time: "02:00 PM", date: "Mar 23, 2025" },
  { id: 7, vendor: "Amazing Catering Service", time: "02:00 PM", date: "Mar 23, 2025" },
  { id: 8, vendor: "Amazing Catering Service", time: "02:00 PM", date: "Mar 23, 2025" },
];

// Dummy data for recent vendor registrations
const recentVendorRegistrations = [
  { id: 1, vendor: "Amazing Catering Service" },
  { id: 2, vendor: "Amazing Catering Service" },
  { id: 3, vendor: "Amazing Catering Service" },
  { id: 4, vendor: "Amazing Catering Service" },
  { id: 5, vendor: "Amazing Catering Service" },
  { id: 6, vendor: "Amazing Catering Service" },
  { id: 7, vendor: "Amazing Catering Service" },
  { id: 8, vendor: "Amazing Catering Service" },
];

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: string | null;
  changeType: "positive" | "negative" | null;
  changeLabel: string | null;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard = ({ title, value, change, changeType, changeLabel, icon, iconBg }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5">
      <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {change && changeType && (
          <div className="flex items-center gap-1">
            {changeType === "positive" ? (
              <TbTrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TbTrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
              {change}
            </span>
            <span className="text-sm text-gray-400">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Table Header Component
interface TableHeaderProps {
  title: string;
  viewAllLink: string;
}

const TableHeader = ({ title, viewAllLink }: TableHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <Link
        to={viewAllLink}
        className="px-4 py-2 bg-[#FF4800] text-white text-sm font-medium rounded-2xl hover:bg-[#E64100] transition-colors"
      >
        View All
      </Link>
    </div>
  );
};

const Overview = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <SideBar /> */}

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* <PageHeader title="Dashboard" /> */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {statsData.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              changeLabel={stat.changeLabel}
              icon={stat.icon}
              iconBg={stat.iconBg}
            />
          ))}
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Bookings Table */}
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <TableHeader title="Recent Bookings" viewAllLink="/bookings" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Vendor</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Time & Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-50 last:border-b-0">
                      <td className="py-3 px-2 text-sm text-gray-700">{booking.vendor}</td>
                      <td className="py-3 px-2 text-sm text-gray-500">
                        {booking.time}, {booking.date}
                      </td>
                      <td className="py-3 px-2">
                        <Link
                          to={`/bookings/${booking.id}`}
                          className="text-sm text-[#FF4800] hover:underline font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Vendor Registrations Table */}
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <TableHeader title="Recent Vendor Registrations" viewAllLink="/vendor-registrations" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Vendor</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVendorRegistrations.map((registration) => (
                    <tr key={registration.id} className="border-b border-gray-50 last:border-b-0">
                      <td className="py-3 px-2 text-sm text-gray-700">{registration.vendor}</td>
                      <td className="py-3 px-2">
                        <Link
                          to={`/vendor-registrations/${registration.id}`}
                          className="text-sm text-[#FF4800] hover:underline font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;
