import { Link } from "react-router-dom";
import PageHeader from "@/components/Header/PageHeader";
import { FiShoppingCart, FiUsers } from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi";
import { TbTrendingUp, TbTrendingDown } from "react-icons/tb";
import { useUserRequest } from "@/utils/requestMethods";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { formatDate, formatTime } from "@/utils/formatters";

// Helper function to format percentage change
const formatPercentageChange = (
  value: number | null | undefined,
): string | null => {
  if (value === null || value === undefined) return null;
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

// Helper function to determine change type
const getChangeType = (
  value: number | null | undefined,
): "positive" | "negative" | null => {
  if (value === null || value === undefined) return null;
  return value >= 0 ? "positive" : "negative";
};

// Helper function to format numbers with commas
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "0";
  return value.toLocaleString();
};

// Dummy data for recent bookings
const recentBookings = [
  {
    id: 1,
    vendor: "Amazing Catering Service",
    time: "02:00 PM",
    date: "Mar 23, 2025",
  },
  {
    id: 2,
    vendor: "Amazing Catering Service",
    time: "02:00 PM",
    date: "Mar 23, 2025",
  },
  {
    id: 3,
    vendor: "Amazing Catering Service",
    time: "02:00 PM",
    date: "Mar 23, 2025",
  },
  {
    id: 4,
    vendor: "Amazing Catering Service",
    time: "02:00 PM",
    date: "Mar 23, 2025",
  },
  {
    id: 5,
    vendor: "Amazing Catering Service",
    time: "02:00 PM",
    date: "Mar 23, 2025",
  },
  {
    id: 6,
    vendor: "Amazing Catering Service",
    time: "02:00 PM",
    date: "Mar 23, 2025",
  },
  {
    id: 7,
    vendor: "Amazing Catering Service",
    time: "02:00 PM",
    date: "Mar 23, 2025",
  },
  {
    id: 8,
    vendor: "Amazing Catering Service",
    time: "02:00 PM",
    date: "Mar 23, 2025",
  },
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

const StatCard = ({
  title,
  value,
  change,
  changeType,
  changeLabel,
  icon,
  iconBg,
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5">
      <div
        className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center mb-4`}
      >
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
            <span
              className={`text-sm ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}
            >
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
  const userRequest = useUserRequest();

  // Get metrics data
  const metricsQuery: any = useQuery({
    queryKey: ["metrics"],
    queryFn: () =>
      userRequest?.get(`bookings/admin/dashboard/metrics`).then((res: any) => {
        return {
          results: res.data,
        };
      }),
  });

  const metricsData = metricsQuery?.data?.results;

  // Get recent bookings
  const recentBookingsQuery: any = useQuery({
    queryKey: ["bookings"],
    queryFn: () =>
      userRequest
        ?.get(
          `bookings/admin/bookings/by-status?status=New%20Bookings&page=1&limit=10`,
        )
        .then((res: any) => {
          return {
            results: res.data,
          };
        }),
  });

  const recentBookingsData = recentBookingsQuery?.data?.results?.data;
  console.log("recentBookingsData ??", recentBookingsData);

  // Get recent vendors
  const recentVendorRegistrationsQuery: any = useQuery({
    queryKey: ["vendor-registrations"],
    queryFn: () =>
      userRequest
        ?.get(`bookings/admin/dashboard/recent-vendors`)
        .then((res: any) => {
          return {
            results: res.data,
          };
        }),
  });

  const recentVendorRegistrationsData =
    recentVendorRegistrationsQuery?.data?.results?.data;
  // console.log(
  //   "recentVendorRegistrationsData ??",
  //   recentVendorRegistrationsData,
  // );

  // Build stats data from metricsData
  const statsData = [
    {
      id: 1,
      title: "Total Vendors",
      value: formatNumber(metricsData?.vendors?.total),
      change: formatPercentageChange(metricsData?.vendors?.percentageChange),
      changeType: getChangeType(metricsData?.vendors?.percentageChange),
      changeLabel: "vs last month",
      icon: <FiShoppingCart className="w-5 h-5 text-[#1E3A5F]" />,
      iconBg: "bg-[#E8EEF4]",
    },
    {
      id: 2,
      title: "Total Bookings",
      value: formatNumber(metricsData?.bookings?.total),
      change: formatPercentageChange(metricsData?.bookings?.percentageChange),
      changeType: getChangeType(metricsData?.bookings?.percentageChange),
      changeLabel: "vs last month",
      icon: <HiOutlineTicket className="w-5 h-5 text-[#0D9488]" />,
      iconBg: "bg-[#E6F7F5]",
    },
    {
      id: 3,
      title: "Total Users",
      value: formatNumber(metricsData?.totalUsers),
      change: null,
      changeType: null,
      changeLabel: null,
      icon: <FiUsers className="w-5 h-5 text-[#1E3A5F]" />,
      iconBg: "bg-[#E8EEF4]",
    },
  ];

  if (metricsQuery?.isLoading || recentBookingsQuery?.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

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
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                      Vendor
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                      Time & Date
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookingsData?.map((booking: any) => (
                    <tr
                      key={booking?._id}
                      className="border-b border-gray-50 last:border-b-0"
                    >
                      <td className="py-3 px-2 text-sm text-gray-700">
                        {booking?.vendorid?.businessInfo?.businessName ||
                          booking?.userid?.firstName +
                            " " +
                            booking?.userid?.lastName}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-500">
                        {formatDate(booking?.eventday)}{" "}
                        {formatTime(booking?.eventtime)}
                      </td>
                      <td className="py-3 px-2">
                        <Link
                          to={`/bookings/${booking._id}`}
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
            <TableHeader
              title="Recent Vendor Registrations"
              viewAllLink="/vendor-registrations"
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                      Vendor
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentVendorRegistrationsData
                    ?.slice(0, 10)
                    ?.map((registration: any) => (
                      <tr
                        key={registration?._id}
                        className="border-b border-gray-50 last:border-b-0"
                      >
                        <td className="py-3 px-2 text-sm text-gray-700">
                          {registration?.businessInfo?.businessName ||
                            registration?.firstName +
                              " " +
                              registration?.lastName}
                        </td>
                        <td className="py-3 px-2">
                          <Link
                            to={`/vendor-registrations/${registration?._id}`}
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
