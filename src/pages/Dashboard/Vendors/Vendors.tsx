/**
 * /src/pages/Dashboard/Vendors/Vendors.tsx
 * Displays a list of all vendors with actions to view, suspend, or deactivate
 * Includes dropdown menu and confirmation modals for vendor actions
 * RELEVANT FILES: Routes.tsx, requestMethods.tsx, CustomTable.tsx
 */

import { useContext, useState, useRef, useEffect, useCallback } from "react";
import { Card } from "../../../components/ui/card";
import { TableCell, TableRow } from "../../../components/ui/table";
import CustomTable from "../../../components/ui/custom/CustomTable";
import Loader from "../../../components/ui/custom/loader";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserRequest } from "@/utils/requestMethods";
import { toast } from "@/hooks/use-toast";
import { X, AlertTriangle, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import more from "./more.svg";

type ModalType = "suspend" | "deactivate" | null;

const Vendors = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [authState] = useContext<any>(AuthContext);
  const userId = authState?.user?._id;

  // Dropdown state - tracks which vendor's dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset to page 1 when search query changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const userRequest = useUserRequest();
  const vendorsQuery: any = useQuery({
    queryKey: ["vendors", searchQuery.length >= 3 ? searchQuery : "", currentPage],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "10");
      if (searchQuery.length >= 3) {
        params.set("search", searchQuery);
      }
      const endpoint = `/bookings/admin/vendors?${params.toString()}`;
      return userRequest?.get(endpoint).then((res: any) => ({
        results: res.data,
      }));
    },
    placeholderData: (previousData: any) => previousData,
  });

  console.log("vendorsQuery > ??", vendorsQuery?.data?.results);
  const vendorsData = vendorsQuery?.data?.results?.data;
  const paginationMeta = vendorsQuery?.data?.results;
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

  // Suspend vendor mutation
  const suspendMutation = useMutation({
    mutationFn: async ({ userId, user }: { userId: string; user: any }) =>
      userRequest?.patch(`/bookings/admin/${userId}/suspend`, {
        value: !user.suspended,
      }),
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to suspend vendor",
        variant: "destructive",
      });
      setIsActionLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({
        title: "Success",
        description: "Successfully updated vendor status",
      });
      setIsActionLoading(false);
      closeModal();
    },
  });

  // Deactivate vendor mutation
  const deactivateMutation = useMutation({
    mutationFn: async ({ userId, user }: { userId: string; user: any }) =>
      userRequest?.patch(`/bookings/admin/${userId}/block`, {
        value: !user.blocked,
      }),
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to deactivate vendor",
        variant: "destructive",
      });
      setIsActionLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({
        title: "Success",
        description: "Successfully updated vendor status",
      });
      setIsActionLoading(false);
      closeModal();
    },
  });

  // Toggle dropdown
  const toggleDropdown = (vendorId: string) => {
    setOpenDropdownId(openDropdownId === vendorId ? null : vendorId);
  };

  // Open modal
  const openModal = (type: ModalType, vendor: any) => {
    setModalType(type);
    setSelectedVendor(vendor);
    setOpenDropdownId(null);
  };

  // Close modal
  const closeModal = () => {
    setModalType(null);
    setSelectedVendor(null);
  };

  // // Handle confirm action
  // const handleConfirmAction = () => {
  //   if (!selectedVendor) return;
  //   setIsActionLoading(true);

  //   if (modalType === "suspend") {
  //     suspendMutation.mutate(selectedVendor._id);
  //   } else if (modalType === "deactivate") {
  //     deactivateMutation.mutate(selectedVendor._id);
  //   }
  // };

  // Handle confirm action
  const handleConfirmAction = (vendor: any) => {
    if (!selectedVendor) return;
    setIsActionLoading(true);

    if (modalType === "suspend") {
      console.log("vendor ??", vendor);
      suspendMutation.mutate({ userId: vendor._id, user: vendor });
    } else if (modalType === "deactivate") {
      deactivateMutation.mutate({ userId: vendor._id, user: vendor });
    }
  };

  if (vendorsQuery?.isLoading && !vendorsData && !searchQuery) {
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
              All Vendors
            </h2>

            {/* Search Bar */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
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
          {vendorsQuery?.isFetching && (
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
            data={vendorsData}
            emptyState={
              vendorsQuery?.isFetching ? (
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
                <TableCell className="pl-4 pt-4 pb-4">
                  {vendor?.businessInfo?.businessName ||
                    vendor?.firstName + " " + vendor?.lastName}
                </TableCell>
                <TableCell>
                  {vendor?.businessInfo?.businessType || "N/A"}
                </TableCell>
                {vendor?.businessInfo?.businessStreet &&
                vendor?.businessInfo?.city ? (
                  <TableCell>
                    {vendor?.businessInfo?.businessStreet +
                      ", " +
                      vendor?.businessInfo?.city}
                  </TableCell>
                ) : (
                  <TableCell>N/A</TableCell>
                )}
                <TableCell>
                  <div className="flex items-center relative">
                    <button
                      onClick={() => navigate(`/vendors/${vendor?._id}`)}
                      className="text-kv-primary hover:text-orange-600 font-medium cursor-pointer"
                    >
                      View More
                    </button>
                    <div
                      className="relative"
                      ref={openDropdownId === vendor?._id ? dropdownRef : null}
                    >
                      <img
                        className="cursor-pointer w-6 h-6 pl-2"
                        src={more}
                        alt="more"
                        onClick={() => toggleDropdown(vendor?._id)}
                      />
                      {/* Dropdown Menu */}
                      {openDropdownId === vendor?._id && (
                        <div className="absolute right-[20px] bottom-0 mt-1 z-[9999] flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px]">
                          <button
                            onClick={() => openModal("suspend", vendor)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          >
                            {vendor?.suspended
                              ? "Unsuspend Vendor"
                              : "Suspend Vendor"}
                          </button>
                          <button
                            onClick={() => openModal("deactivate", vendor)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          >
                            {vendor?.blocked
                              ? "Activate Vendor"
                              : "Deactivate Vendor"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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

      {/* Suspend Modal */}
      {modalType === "suspend" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-3">
              {selectedVendor?.suspended ? "Unsuspend" : "Suspend"} Vendor
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-center mb-8">
              Are you sure you want to suspend this Vendor?
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmAction(selectedVendor)}
                disabled={isActionLoading}
                className="px-6 py-2.5 bg-[#FF4800] text-white rounded-full text-sm font-medium hover:bg-[#E64100] transition-colors disabled:opacity-50 cursor-pointer min-w-[120px]"
              >
                {isActionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Yes, Suspend"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {modalType === "deactivate" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-3">
              {selectedVendor?.blocked ? "Activate" : "Deactivate"} Vendor
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-center mb-2">
              Are you sure you want to deactivate this Vendor?
            </p>
            <p className="text-gray-500 text-center mb-8">
              This process cannot be undone
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmAction(selectedVendor)}
                disabled={isActionLoading}
                className="px-6 py-2.5 bg-[#FF4800] text-white rounded-full text-sm font-medium hover:bg-[#E64100] transition-colors disabled:opacity-50 cursor-pointer min-w-[130px]"
              >
                {isActionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  `Yes, ${selectedVendor?.blocked ? "Activate" : "Deactivate"}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
