import { useState, useContext, useEffect } from "react";
import { Eye, EyeOff, User, Mail, Loader2 } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserRequest } from "@/utils/requestMethods";
import { Card } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import SearchBar from "@/components/ui/custom/SearchBar";
import CustomTable from "@/components/ui/custom/CustomTable";
import CustomButton from "@/components/ui/custom/button";

type TabType = "Profile" | "Administrators";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Profile");
  const [isLoading, setIsLoading] = useState(false);

  const [authState] = useContext<any>(AuthContext);
  const user = authState?.user?.user;
  console.log("USER::: ", user);

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "Super Admin",
  });

  // /users/find-user-by-id/{userId}
  const userQuery = useQuery({
    queryKey: ["getUser", user?._id],
    queryFn: () =>
      userRequest
        ?.get(`/users/find-user-by-id/${user?._id}`)
        .then((res: any) => {
          return {
            results: res.data,
          };
        }),
  });

  //console.log("USER QUERY::: ", userQuery?.data?.results?.data);
  const userData = userQuery?.data?.results?.data;

  useEffect(() => {
    if (userData) {
      setProfileData({
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        email: userData?.email || "",
        phoneNumber: userData?.phoneNumber || "",
        role: userData?.role || " ",
      });
    }
  }, [userData]);

  // Password form state
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileChange = (field: keyof ProfileFormData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (
    field: keyof PasswordFormData,
    value: string,
  ) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCancel = () => {
    // Reset forms to original values
    setProfileData({
      firstName: user?.firstName || " ",
      lastName: user?.lastName || " ",
      email: user?.email || " ",
      phoneNumber: user?.phoneNumber || " ",
      role: user?.role || " ",
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const queryClient = useQueryClient();
  const userRequest = useUserRequest();

  const passwordMutation = useMutation({
    mutationFn: async (data: any) =>
      userRequest?.patch(`/users/in-dashboard/change-password`, data),
    onError: (e: any) => {
      console.log("ERROR::: ", e?.response?.data?.message);
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Sorry an error occured. ",
        variant: "destructive",
      });
      setIsLoading(false);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setIsLoading(false);
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: any) =>
      userRequest?.put(`/users/update-business-profile/${userData?._id}`, data),
    onError: (e: any) => {
      console.log("ERROR::: ", e?.response?.data?.message);
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Sorry an error occured. ",
        variant: "destructive",
      });
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsLoading(false);
    },
  });

  const handleSaveChanges = async () => {
    // Validate password fields if any are filled
    setIsLoading(true);
    if (
      passwordData.currentPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      if (!passwordData.currentPassword) {
        toast({
          title: "Error",
          description: "Please enter your current password",
          variant: "destructive",
        });
        return;
      }
      if (passwordData.newPassword.length < 8) {
        toast({
          title: "Error",
          description: "New password must be at least 8 characters",
          variant: "destructive",
        });
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive",
        });
        return;
      }

      const data = {
        userId: userData?._id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      passwordMutation.mutate(data);
    } else {
      const data = {
        userId: userData?._id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      };
      profileMutation.mutate(data);
    }
  };

  //get administrators
  const administratorsQuery = useQuery({
    queryKey: ["administrators"],
    queryFn: () =>
      userRequest?.get(`/users/admin/list`).then((res: any) => {
        return {
          results: res.data,
        };
      }),
  });
  const administratorsData = administratorsQuery?.data?.results?.data;
  console.log("ADMINISTRATORS DATA::: ", administratorsData);

  return (
    <div className="min-h-screen pb-10">
      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-full mb-8 w-full">
        <button
          onClick={() => setActiveTab("Profile")}
          className={`cursor-pointer flex-1 py-2.5 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === "Profile"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("Administrators")}
          className={`cursor-pointer flex-1 py-2.5 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === "Administrators"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Administrators
        </button>
      </div>

      {activeTab === "Profile" && (
        <>
          {/* User Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-gray-500">{profileData.email}</p>
          </div>

          {/* Personal Info Section */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 pb-8 border-b border-gray-200">
            {/* Left - Title & Description */}
            <div className="lg:w-56 shrink-0">
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Personal Info
              </h2>
              <p className="text-sm text-gray-500">
                You can change your personal information settings here.
              </p>
            </div>

            {/* Right - Form Card */}
            <div className="flex-1 border border-gray-200 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleProfileChange("firstName", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-4xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleProfileChange("lastName", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-4xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-4xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    disabled
                    onChange={(e) =>
                      handleProfileChange("phoneNumber", e.target.value)
                    }
                    placeholder="+234 816 624 9033"
                    className="w-full px-4 py-3 border border-gray-200 rounded-4xl text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                  />
                </div>

                {/* Role */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-4xl text-gray-400 bg-gray-50 cursor-not-allowed"
                  />
                </div> */}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 py-8 border-b border-gray-200">
            {/* Left - Title & Description */}
            <div className="lg:w-56 shrink-0">
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Password
              </h2>
              <p className="text-sm text-gray-500">
                Update your account password
              </p>
            </div>

            {/* Right - Form Card */}
            <div className="flex-1 border border-gray-200 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                      placeholder="****"
                      className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-4xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      placeholder="****"
                      className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-4xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      placeholder="****"
                      className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-4xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="cursor-pointer px-8 py-3 bg-[#FF4800] text-white rounded-full text-sm font-medium hover:bg-[#E64100] transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </>
      )}

      {activeTab === "Administrators" && (
        // <div className="text-center py-12">
        //   <p className="text-gray-500">
        //     Administrators management coming soon...
        //   </p>
        // </div>
        <div className="min-h-screen">
          <Card className="rounded-3xl shadow-sm">
            <div className="pt-0 pb-2 pl-4 pr-4 border-b space-y-4 mb-[-1.5rem]">
              {/* Tabs */}
              <div className="flex ">
                {/* Search Bar */}
                <div className="flex items-center justify-between lg:w-[25%] w-full mb-2">
                  <SearchBar
                    placeholder="Search"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="w-full"
                  />
                </div>
                <CustomButton
                  children="Add Administrator"
                  onClick={() => {}}
                  className="w-fit ml-6"
                />
              </div>
            </div>

            <CustomTable
              headers={[
                { label: "First Name" },
                { label: "Last Name" },
                { label: "Email" },

                { label: "Role" },
                { label: "Action" },
              ]}
              data={administratorsData}
              renderRow={(admin: any) => (
                <TableRow key={admin?._id}>
                  <TableCell className="pl-4 pt-2 pb-2">
                    {admin?.firstName}
                  </TableCell>
                  <TableCell className="pt-6 pb-6">{admin?.lastName}</TableCell>
                  <TableCell className="pt-2 pb-2">{admin?.email}</TableCell>

                  <TableCell className="pt-2 pb-2">{admin?.role}</TableCell>
                  <TableCell className="pt-2 pb-2">
                    <div className="flex gap-2">
                      <p className="text-black font-medium">Edit</p>
                      <p className="text-kv-primary hover:text-orange-600 font-medium">
                        Deactivate
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;
