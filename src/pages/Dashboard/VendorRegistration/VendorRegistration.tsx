import { useContext, useState, useCallback } from "react";
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
import { X, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

//const TABS = ["New Bookings", "Ongoing", "Completed", "Cancelled"] as const;

const VendorRegistration = () => {
  const navigate = useNavigate();

  const [authState] = useContext<any>(AuthContext);
  const userId = authState?.user?._id;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when search query changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const userRequest = useUserRequest();
  const vendorRegistrationsQuery: any = useQuery({
    queryKey: [
      "vendor-registrations",
      searchQuery.length >= 3 ? searchQuery : "",
      currentPage,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "10");
      if (searchQuery.length >= 3) {
        params.set("search", searchQuery);
      }
      const endpoint = `/bookings/admin/pending/vendors?${params.toString()}`;
      return userRequest?.get(endpoint).then((res: any) => ({
        results: res.data,
      }));
    },
    placeholderData: (previousData: any) => previousData,
  });

  console.log(
    "vendorRegistrationsQuery ??",
    vendorRegistrationsQuery?.data?.results,
  );
  const vendorRegistrationsData = vendorRegistrationsQuery?.data?.results?.data;
  const paginationMeta = vendorRegistrationsQuery?.data?.results;
  const totalPages = paginationMeta ? Math.ceil(paginationMeta.total / paginationMeta.limit) : 0;

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      if (start > 2) {
        pageNumbers.push("...");
      }
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF4800]/30 focus:border-[#FF4800] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-3 sm:px-5 py-4 bg-gray-50 rounded-b-3xl flex items-center justify-center space-x-1 overflow-x-auto">
              <div className="flex items-center space-x-1 min-w-max">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="p-2 rounded-xl hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  style={{ minWidth: "40px", minHeight: "40px" }}
                >
                  <ChevronLeft size={18} />
                </button>

                {getPageNumbers().map((number, index) =>
                  number === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-500 select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${number}`}
                      onClick={() => setCurrentPage(Number(number))}
                      aria-label={`Page ${number}`}
                      aria-current={currentPage === number ? "page" : undefined}
                      className={`min-w-[35px] min-h-[35px] rounded-3xl flex items-center justify-center text-sm touch-manipulation ${
                        currentPage === number
                          ? "bg-kv-secondary hover:bg-kv-secondary text-kv-primary"
                          : "text-gray-700 hover:bg-kv-secondary active:bg-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="p-2 rounded-md hover:bg-kv-secondary active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  style={{ minWidth: "40px", minHeight: "40px" }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VendorRegistration;
