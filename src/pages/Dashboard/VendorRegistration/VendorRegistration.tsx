import { useContext, useState, useMemo } from "react";
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
import { X, Search, Loader2 } from "lucide-react";

//const TABS = ["New Bookings", "Ongoing", "Completed", "Cancelled"] as const;

const VendorRegistration = () => {
  const navigate = useNavigate();

  const [authState] = useContext<any>(AuthContext);
  const userId = authState?.user?._id;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const userRequest = useUserRequest();
  const vendorRegistrationsQuery: any = useQuery({
    queryKey: [
      "vendor-registrations",
      searchQuery.length >= 3 ? searchQuery : "",
    ],
    queryFn: () => {
      const endpoint =
        searchQuery.length >= 3
          ? `/bookings/admin/pending/vendors?search=${encodeURIComponent(searchQuery)}`
          : `/bookings/admin/pending/vendors`;
      return userRequest?.get(endpoint).then((res: any) => ({
        results: res.data,
      }));
    },
    placeholderData: (previousData: any) => previousData,
  });

  // console.log(
  //   "vendorRegistrationsQuery ??",
  //   vendorRegistrationsQuery?.data?.results,
  // );
  const vendorRegistrationsData = vendorRegistrationsQuery?.data?.results?.data;

  // Filter bookings based on selected tab
  if (
    vendorRegistrationsQuery?.isLoading &&
    !vendorRegistrationsData &&
    !searchQuery
  ) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <Card className="rounded-3xl shadow-sm">
        <div className="pt-0 pb-2 pl-4 pr-4 border-b space-y-4 mb-[-1.5rem]">
          {/* Tabs */}

          {/* Your Bookings Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-gabaritoHeading lg:text-xl font-semibold tracking-extra-wide text-kv-semi-black">
              Pending Applications
            </h2>

            {/* Search Bar */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF4800]/30 focus:border-[#FF4800] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          {vendorRegistrationsQuery?.isFetching && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-b-3xl">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF4800]" />
            </div>
          )}
          <CustomTable
            headers={[
              { label: "Vendor Name" },
              // { label: "Business Name" },
              { label: "Vendor Type" },
              { label: "Location" },
              { label: "Action" },
            ]}
            data={vendorRegistrationsData}
            emptyState={
              vendorRegistrationsQuery?.isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-gray-500"
                  ></TableCell>
                </TableRow>
              ) : undefined
            }
            renderRow={(vendor: any) => (
              <TableRow key={vendor?._id}>
                <TableCell className="pl-4 pt-6 pb-6">
                  {vendor?.businessInfo?.businessName ||
                    vendor?.firstName + " " + vendor?.lastName}
                </TableCell>
                <TableCell>{vendor?.businessInfo?.businessType}</TableCell>

                <TableCell>
                  {vendor?.businessInfo?.businessStreet +
                    ", " +
                    vendor?.businessInfo?.city}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() =>
                      navigate(`/vendor-registrations/${vendor?._id}`)
                    }
                    className="cursor-pointer text-kv-primary hover:text-orange-600 font-medium"
                  >
                    View Vendor
                  </button>
                </TableCell>
              </TableRow>
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default VendorRegistration;
