import { useContext, useState, useMemo, useRef } from "react";
import { Card } from "../../../components/ui/card";
import { TableCell, TableRow } from "../../../components/ui/table";
import CustomTable from "../../../components/ui/custom/CustomTable";
import Loader from "../../../components/ui/custom/loader";
import SearchBar from "../../../components/ui/custom/SearchBar";
//import NoData from "@/components/ui/custom/noAavaialbleData";
import { AuthContext } from "../../../context/AuthContext";

import { cn } from "../../../lib/utils";
import { formatDate, formatPrice, formatTime } from "../../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserRequest } from "@/utils/requestMethods";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

//const TABS = ["New Bookings", "Ongoing", "Completed", "Cancelled"] as const;

const Withdrawals = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Dropdown state - tracks which vendor's dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = (vendorId: string) => {
    setOpenDropdownId(openDropdownId === vendorId ? null : vendorId);
  };

  const [authState] = useContext<any>(AuthContext);
  const userId = authState?.user?._id;
  const [searchQuery, setSearchQuery] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const userRequest = useUserRequest();
  const withdrawalsQuery: any = useQuery({
    queryKey: ["withdrawals"],
    queryFn: () =>
      userRequest
        ?.get(`/wallet/admin/withdrawals?page=1&limit=10`)
        .then((res: any) => {
          return {
            results: res.data,
          };
        }),
  });

  console.log("withdrawalsQuery ??", withdrawalsQuery?.data?.results?.data);
  const withdrawalsData = withdrawalsQuery?.data?.results?.data;

  // Approve withdrawal mutation
  const approveMutation = useMutation({
    mutationFn: async ({
      withdrawalId,
      data,
    }: {
      withdrawalId: string;
      data: any;
    }) =>
      userRequest?.patch(
        `/wallet/admin/withdrawals/${withdrawalId}/status`,
        data,
      ), // TODO: Add approve endpoint here
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to approve withdrawal",
        variant: "destructive",
      });
      setIsActionLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      toast({
        title: "Success",
        description: "Withdrawal approved successfully",
      });
      setIsActionLoading(false);
      setOpenDropdownId(null);
    },
  });

  const handleApprove = (withdrawalId: string) => {
    console.log("withdrawalId ??", withdrawalId);
    setIsActionLoading(true);

    approveMutation.mutate({ withdrawalId, data: { status: "successful" } });
  };

  // Decline withdrawal mutation
  const declineMutation = useMutation({
    mutationFn: async ({
      withdrawalId,
      data,
    }: {
      withdrawalId: string;
      data: any;
    }) =>
      userRequest?.patch(
        `/wallet/admin/withdrawals/${withdrawalId}/status`,
        data,
      ), // TODO: Add decline endpoint here
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to decline withdrawal",
        variant: "destructive",
      });
      setIsActionLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      toast({
        title: "Success",
        description: "Withdrawal declined successfully",
      });
      setIsActionLoading(false);
      setOpenDropdownId(null);
    },
  });

  const handleDecline = (withdrawalId: string) => {
    setIsActionLoading(true);
    declineMutation.mutate({ withdrawalId, data: { status: "declined" } });
  };

  // Loading state - must be AFTER all hooks
  if (withdrawalsQuery?.isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <Card className="rounded-3xl shadow-sm">
        <div className="pt-0 pb-2 pl-4 pr-4 border-b space-y-4 mb-[-1.5rem]">
          {/* Tabs */}

          {/* Search Bar */}
          <div className="flex items-center justify-between lg:w-[25%] w-full mb-2">
            <SearchBar
              placeholder="Search"
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
        </div>

        <CustomTable
          headers={[
            { label: "Date & Time" },
            { label: "Amount" },
            { label: "Bank" },
            { label: "Account Name" },
            { label: "Account No." },
            { label: "Status" },
            { label: "Action" },
          ]}
          data={withdrawalsData}
          renderRow={(withdrawal: any) => (
            <TableRow key={withdrawal?._id}>
              <TableCell className="pl-4 pt-5 pb-5">
                {formatDate(withdrawal?.createdAt)}
              </TableCell>
              <TableCell>{formatPrice(withdrawal?.amount)}</TableCell>
              <TableCell>
                {withdrawal?.userId?.receivingAccount?.bankName}
              </TableCell>
              <TableCell>
                {withdrawal?.userId?.receivingAccount?.accountName}
              </TableCell>
              <TableCell>
                {withdrawal?.userId?.receivingAccount?.accountNumber}
              </TableCell>
              <TableCell
                className={`capitalize ${withdrawal?.status === "pending" ? "text-yellow-500" : withdrawal?.status === "successful" ? "text-green-500" : " text-red-500"}`}
                //className="capitalize text-kv-primary"
              >
                {withdrawal?.status}
              </TableCell>
              <TableCell>
                <div
                  className="relative"
                  ref={openDropdownId === withdrawal?._id ? dropdownRef : null}
                >
                  <svg
                    className="cursor-pointer"
                    onClick={() => toggleDropdown(withdrawal?._id)}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.591 0.659007C11.4697 1.53768 11.4697 2.96231 10.591 3.84098C9.71231 4.71966 8.28768 4.71966 7.40901 3.84098C6.53033 2.96231 6.53033 1.53768 7.40901 0.659007C8.28765 -0.219669 9.71227 -0.219669 10.591 0.659007Z"
                      fill="black"
                    />
                    <path
                      d="M10.591 7.40901C11.4697 8.28768 11.4697 9.71231 10.591 10.591C9.71231 11.4697 8.28768 11.4697 7.40901 10.591C6.53033 9.71231 6.53033 8.28768 7.40901 7.40901C8.28765 6.53033 9.71227 6.53033 10.591 7.40901Z"
                      fill="black"
                    />
                    <path
                      d="M10.591 14.159C11.4697 15.0377 11.4697 16.4623 10.591 17.341C9.71231 18.2197 8.28768 18.2197 7.40901 17.341C6.53033 16.4623 6.53033 15.0377 7.40901 14.159C8.28765 13.2803 9.71227 13.2803 10.591 14.159Z"
                      fill="black"
                    />
                  </svg>
                  {/* Dropdown Menu */}
                  {openDropdownId === withdrawal?._id && (
                    <div className="absolute right-[90px] bottom-[0px] mt-1 z-[9999] flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px]">
                      <button
                        onClick={() => handleApprove(withdrawal?._id)}
                        disabled={approveMutation.isPending}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        {approveMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        onClick={() => handleDecline(withdrawal?._id)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        disabled={declineMutation.isPending}
                      >
                        {declineMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Decline"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        />
      </Card>
    </div>
  );
};

export default Withdrawals;
