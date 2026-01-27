/**
 * /src/pages/Dashboard/Users/Users.tsx
 * Displays a list of all users with actions to suspend or deactivate
 * Includes dropdown menu and confirmation modals for user actions
 * RELEVANT FILES: Routes.tsx, requestMethods.tsx, CustomTable.tsx
 */

import { useContext, useState, useRef, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import { TableCell, TableRow } from "../../../components/ui/table";
import CustomTable from "../../../components/ui/custom/CustomTable";
import Loader from "../../../components/ui/custom/loader";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserRequest } from "@/utils/requestMethods";
import { toast } from "@/hooks/use-toast";
import { X, AlertTriangle, Loader2 } from "lucide-react";

type ModalType = "suspend" | "deactivate" | null;

const Users = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [authState] = useContext<any>(AuthContext);
  const userId = authState?.user?._id;

  // Dropdown state - tracks which user's dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

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

  const userRequest = useUserRequest();
  const usersQuery: any = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      userRequest
        ?.get(`/bookings/admin/users?page=1&limit=10`)
        .then((res: any) => {
          return {
            results: res.data,
          };
        }),
  });

  console.log("usersQuery ??", usersQuery?.data?.results?.data);
  const usersData = usersQuery?.data?.results?.data;

  // Suspend user mutation
  const suspendMutation = useMutation({
    mutationFn: async (userId: string) => userRequest?.patch(``, { userId }), // TODO: Add suspend endpoint here
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to suspend user",
        variant: "destructive",
      });
      setIsActionLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User suspended successfully",
      });
      setIsActionLoading(false);
      closeModal();
    },
  });

  // Deactivate user mutation
  const deactivateMutation = useMutation({
    mutationFn: async (userId: string) => userRequest?.patch(``, { userId }), // TODO: Add deactivate endpoint here
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to deactivate user",
        variant: "destructive",
      });
      setIsActionLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
      setIsActionLoading(false);
      closeModal();
    },
  });

  // Toggle dropdown
  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  // Open modal
  const openModal = (type: ModalType, user: any) => {
    setModalType(type);
    setSelectedUser(user);
    setOpenDropdownId(null);
  };

  // Close modal
  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  // Handle confirm action
  const handleConfirmAction = () => {
    if (!selectedUser) return;
    setIsActionLoading(true);

    if (modalType === "suspend") {
      suspendMutation.mutate(selectedUser._id);
    } else if (modalType === "deactivate") {
      deactivateMutation.mutate(selectedUser._id);
    }
  };

  if (usersQuery?.isLoading) {
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
              All Users
            </h2>
          </div>
        </div>

        <CustomTable
          headers={[
            { label: "Name" },
            { label: "Email" },
            { label: "Phone Number" },
            { label: "Total Bookings" },
            { label: "Action" },
          ]}
          data={usersData}
          renderRow={(user: any) => (
            <TableRow key={user?._id}>
              <TableCell className="pl-4 pt-5 pb-5">
                {user?.firstName} {user?.lastName}
              </TableCell>
              <TableCell>{user?.email}</TableCell>
              <TableCell>{user?.phoneNumber || "N/A"}</TableCell>
              <TableCell>{user?.bookingCount}</TableCell>
              <TableCell>
                <div className="flex items-center relative">
                  <div
                    className="relative"
                    ref={openDropdownId === user?._id ? dropdownRef : null}
                  >
                    <button
                      onClick={() => toggleDropdown(user?._id)}
                      className="text-kv-primary hover:text-orange-600 font-medium cursor-pointer"
                    >
                      <svg
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
                    </button>
                    {/* Dropdown Menu */}
                    {openDropdownId === user?._id && (
                      <div className="absolute right-[20px] bottom-0 mt-1 z-[9999] flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px]">
                        <button
                          onClick={() => openModal("suspend", user)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {user?.suspended ? "Unsuspend User" : "Suspend User"}
                          {/* /bookings/admin/{userId}/suspend */}
                        </button>
                        <button
                          onClick={() => openModal("deactivate", user)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {user?.admindeactivated
                            ? "Activate User"
                            : "Deactivate User"}
                          {/* /bookings/admin/{userId}/block */}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        />
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
              Suspend User
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-center mb-8">
              Are you sure you want to suspend this User?
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
                onClick={handleConfirmAction}
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
              Deactivate User
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-center mb-2">
              Are you sure you want to deactivate this User?
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
                onClick={handleConfirmAction}
                disabled={isActionLoading}
                className="px-6 py-2.5 bg-[#FF4800] text-white rounded-full text-sm font-medium hover:bg-[#E64100] transition-colors disabled:opacity-50 cursor-pointer min-w-[130px]"
              >
                {isActionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Yes, Deactivate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
