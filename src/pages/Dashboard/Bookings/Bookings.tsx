import React, { useContext, useState, useMemo } from "react";
import { Card } from "../../../components/ui/card";
import { TableCell, TableRow } from "../../../components/ui/table";
import CustomTable from "../../../components/ui/custom/CustomTable";
import Loader from "../../../components/ui/custom/loader";
//import NoData from "@/components/ui/custom/noAavaialbleData";
import { AuthContext } from "../../../context/AuthContext";

import { cn } from "../../../lib/utils";
import { formatDate, formatTime } from "../../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUserRequest } from "@/utils/requestMethods";

const TABS = ["New Bookings", "Ongoing", "Completed", "Cancelled"] as const;
type TabType = (typeof TABS)[number];
const Bookings = () => {
  const navigate = useNavigate();

  const [authState] = useContext<any>(AuthContext);
  const userId = authState?.user?._id;
  const [selectedTab, setSelectedTab] = useState<TabType>("New Bookings");

  const userRequest = useUserRequest();
  const bookingsQuery: any = useQuery({
    queryKey: ["bookings", selectedTab],
    queryFn: () =>
      userRequest
        ?.get(
          `bookings/admin/bookings/by-status?status=${selectedTab}&page=1&limit=10`,
        )
        .then((res: any) => {
          return {
            results: res.data,
          };
        }),
  });

  console.log("bookingsQuery ??", bookingsQuery?.data?.results);
  const bookingsData = bookingsQuery?.data?.results?.data;

  // Filter bookings based on selected tab
  const filteredBookings = useMemo(() => {
    if (!bookingsData) return [];

    return bookingsData.filter((booking: any) => {
      return booking?.status === selectedTab;
    });
  }, [bookingsData, selectedTab]);

  if (bookingsQuery?.isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full overflow-x-auto mb-4">
        <div className="w-full inline-flex items-center justify-center gap-2 sm:gap-3 p-1.5 bg-gray-100 rounded-full min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={cn(
                "cursor-pointer px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium font-interTightText transition-all duration-200 whitespace-nowrap",
                "w-full", // Set width to 25% of parent
                selectedTab === tab
                  ? "bg-white text-kv-semi-black shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <Card className="rounded-3xl shadow-sm">
        <div className="pt-0 pb-2 pl-4 pr-4 border-b space-y-4 mb-[-1.5rem]">
          {/* Tabs */}

          {/* Your Bookings Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-gabaritoHeading lg:text-xl font-semibold tracking-extra-wide text-kv-semi-black">
              All Bookings
            </h2>
          </div>
        </div>

        <CustomTable
          headers={[
            { label: "Customer Name" },
            // { label: "Business Name" },
            { label: "Date & Time" },
            { label: "Location" },
            { label: "Action" },
          ]}
          data={filteredBookings}
          renderRow={(booking: any) => (
            <TableRow key={booking?._id}>
              {booking?.userid ? (
                <TableCell className="pl-4 pt-4 pb-4">
                  {booking?.userid?.firstName} {booking?.userid?.lastName}
                </TableCell>
              ) : (
                <TableCell className="pl-4 pt-4 pb-4">
                  {booking?.vendorid?.businessInfo?.businessName}
                </TableCell>
              )}
              <TableCell>
                {formatDate(booking?.eventday)} {formatTime(booking?.eventtime)}
              </TableCell>

              <TableCell className="capitalize">
                {booking?.eventLocation}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => navigate(`/bookings/${booking?._id}`)}
                  className="text-kv-primary hover:text-orange-600 font-medium cursor-pointer"
                >
                  View Booking
                </button>
              </TableCell>
            </TableRow>
          )}
        />
      </Card>
    </div>
  );
};

export default Bookings;
