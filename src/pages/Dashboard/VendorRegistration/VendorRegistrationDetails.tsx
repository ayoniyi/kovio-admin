/**
 * /src/pages/Dashboard/Vendors/VendorDetails.tsx
 * Displays detailed information about a single vendor
 * Shows Business, Contact, Service, and Documents tabs
 * RELEVANT FILES: Vendors.tsx, Routes.tsx, requestMethods.tsx
 */

import { useState } from "react";
import { useUserRequest } from "@/utils/requestMethods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, FileText, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type TabType = "Business" | "Contact" | "Service" | "Documents";

const VendorRegistrationDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("Business");
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  // GET Vendor
  const vendorRegistrationId: string = useParams().vendorRegistrationId || "";
  const userRequest = useUserRequest();

  const vendorQuery = useQuery({
    queryKey: ["singleVendorRegistration", vendorRegistrationId],
    queryFn: () =>
      userRequest
        ?.get(`/users/find-user-by-id/${vendorRegistrationId}`)
        .then((res: any) => {
          return res.data;
        }),
  });

  const vendorRegistrationData: any =
    vendorQuery?.data?.data || vendorQuery?.data;
  const isLoading = vendorQuery?.isLoading;

  const tabs: TabType[] = ["Business", "Contact", "Service", "Documents"];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-kv-primary" />
      </div>
    );
  }

  // Not found state
  if (!vendorRegistrationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 text-center">
          Vendor Registration not found.
        </p>
      </div>
    );
  }

  const queryClient = useQueryClient();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const vendorApprovalMutation = useMutation({
    mutationFn: async () =>
      userRequest?.patch(
        `/bookings/admin/vendors/${vendorRegistrationId}/approve`,
      ), // TODO: Add approve endpoint here
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to approve vendor registration",
        variant: "destructive",
      });
      setIsActionLoading(false);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({
        title: "Success",
        description: "Vendor registration approved successfully",
      });
      setIsActionLoading(false);
      console.log("DATA::: ", data);
    },
  });

  const handleApprove = () => {
    setIsActionLoading(true);
    vendorApprovalMutation.mutate();
  };

  const vendorDeclineMutation = useMutation({
    mutationFn: async () =>
      userRequest?.patch(
        `/bookings/admin/vendors/${vendorRegistrationId}/decline`,
      ),
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to decline vendor registration",
        variant: "destructive",
      });
      setIsActionLoading(false);
      console.log("Decline reason:", declineReason);
      setIsDeclineModalOpen(false);
      setDeclineReason("");
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({
        title: "Success",
        description: "Vendor registration declined successfully",
      });
      setIsActionLoading(false);
      console.log("DATA::: ", data);
      console.log("Decline reason:", declineReason);
      setIsDeclineModalOpen(false);
      setDeclineReason("");
      navigate(-1);
    },
  });

  const handleDecline = () => {
    setIsActionLoading(true);
    vendorDeclineMutation.mutate();
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Page Header */}
      <h1 className="text-xl lg:text-2xl text-gray-900 font-semibold mb-4">
        Vendor Registration details
      </h1>

      {/* Go Back Link */}
      <div className="flex  justify-between">
        <button
          onClick={() => navigate(-1)}
          className=" flex items-center text-gray-500 hover:text-gray-700 cursor-pointer mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span className="text-sm">Go back</span>
        </button>

        {/* Approve/Decline Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setIsDeclineModalOpen(true)}
            className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={handleApprove}
            disabled={isActionLoading}
            className="px-6 py-2 text-sm font-medium text-white bg-[#FF4800] rounded-full hover:bg-[#E64100] transition-colors cursor-pointer"
          >
            {isActionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Approve"
            )}
          </button>
        </div>
      </div>

      {/* Tabs - Pill style with gray background */}
      <div className=" bg-[#F1F5F9] rounded-full p-1 inline-flex mb-8 w-full justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-[25%] px-8 py-3 text-sm font-medium rounded-full transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "Business" && (
          <BusinessTab vendorRegistrationData={vendorRegistrationData} />
        )}
        {activeTab === "Contact" && (
          <ContactTab vendorRegistrationData={vendorRegistrationData} />
        )}
        {activeTab === "Service" && (
          <ServiceTab vendorRegistrationData={vendorRegistrationData} />
        )}
        {activeTab === "Documents" && (
          <DocumentsTab vendorRegistrationData={vendorRegistrationData} />
        )}
      </div>

      {/* Decline Modal */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsDeclineModalOpen(false);
                setDeclineReason("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6 cursor-pointer">
              Decline Application
            </h2>

            {/* Reason Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 ">
                Reason
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter"
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF4800]/20 focus:border-[#FF4800]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeclineModalOpen(false);
                  setDeclineReason("");
                }}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Call decline API - /bookings/admin/vendors/{vendorId}/decline
                  handleDecline();
                }}
                disabled={isActionLoading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#FF4800] rounded-full hover:bg-[#E64100] transition-colors cursor-pointer"
              >
                {isActionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Info Field Component - Vertical layout
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
    </div>
  );
}

// Business Tab Component
function BusinessTab({
  vendorRegistrationData,
}: {
  vendorRegistrationData: any;
}) {
  const businessInfo = vendorRegistrationData?.businessInfo || {};

  return (
    <div className="space-y-0">
      <InfoField label="Business Name" value={businessInfo?.businessName} />
      <InfoField label="Vendor Type" value={businessInfo?.businessType} />
      <InfoField label="Business Email" value={businessInfo?.businessEmail} />
      <InfoField
        label="Business Phone Number"
        value={businessInfo?.businessPhoneNumber}
      />
      <InfoField label="Website" value={businessInfo?.website} />
      <InfoField
        label="Business Address"
        value={
          businessInfo?.businessStreet
            ? `${businessInfo.businessStreet}, ${businessInfo.city || ""}, ${businessInfo.state || ""}`
            : "-"
        }
      />
      <InfoField label="Country" value={businessInfo?.country} />
      <InfoField label="Instagram" value={businessInfo?.instagram} />
      <InfoField label="Facebook" value={businessInfo?.facebook} />
      <InfoField label="Twitter" value={businessInfo?.twitter} />
      <InfoField label="Tiktok" value={businessInfo?.tiktok} />
      <InfoField label="Snapcat" value={businessInfo?.snapchat} />
    </div>
  );
}

// Contact Tab Component
function ContactTab({
  vendorRegistrationData,
}: {
  vendorRegistrationData: any;
}) {
  const contactPerson = vendorRegistrationData?.contactPerson || {};

  return (
    <div className="space-y-0">
      <InfoField
        label="First Name"
        value={contactPerson?.firstName || vendorRegistrationData?.firstName}
      />
      <InfoField
        label="Last Name"
        value={contactPerson?.lastName || vendorRegistrationData?.lastName}
      />
      <InfoField
        label="Email"
        value={contactPerson?.email || vendorRegistrationData?.email}
      />
      <InfoField label="Role" value={contactPerson?.role} />
    </div>
  );
}

// Service Tab Component
function ServiceTab({
  vendorRegistrationData,
}: {
  vendorRegistrationData: any;
}) {
  const serviceDetails = vendorRegistrationData?.serviceDetails || {};
  const venueInfo = vendorRegistrationData?.venueInfo || {};
  const isVenue = vendorRegistrationData?.role === "OWNER";

  // Venue owner view
  if (isVenue) {
    return (
      <div className="space-y-0">
        <InfoField
          label="Venue Capacity"
          value={venueInfo?.venueCapacity?.toString()}
        />
        <InfoField label="Venue Type" value={venueInfo?.venueType} />
        <InfoField
          label="Parking Availability"
          value={venueInfo?.parkingAvailability}
        />
        <InfoField
          label="Available Amenities"
          value={venueInfo?.availableAmenities}
        />
        <InfoField
          label="Catering Options"
          value={venueInfo?.cateringOptions}
        />
        <InfoField label="Alcohol Policy" value={venueInfo?.alcoholPolicy} />
        <InfoField
          label="Decoration Restrictions"
          value={venueInfo?.decorationRestrictions}
        />
        <InfoField label="Power Supply" value={venueInfo?.powerSupply} />
        <InfoField
          label="Security Services"
          value={venueInfo?.securityServices}
        />
        <InfoField
          label="Payment & Booking Policy"
          value={venueInfo?.paymentBookingPolicy}
        />
      </div>
    );
  }

  // Vendor view
  return (
    <div className="space-y-0">
      <InfoField
        label="Services Offered"
        value={serviceDetails?.servicesOffered}
      />
      <InfoField label="Areas Covered" value={serviceDetails?.coverageArea} />
      <InfoField label="Availability" value={serviceDetails?.availability} />
      <InfoField
        label="Payment & Booking Policy"
        value={serviceDetails?.paymentBookingPolicy}
      />

      {/* Pricing Packages and Amount side by side */}
      <div className="flex gap-16 mb-5">
        <div>
          <p className="text-xs text-gray-400 mb-1">Pricing Packages</p>
          <p className="text-sm font-medium text-gray-900">
            {serviceDetails?.pricingPackages || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Amount</p>
          <p className="text-sm font-medium text-gray-900">
            {serviceDetails?.amount
              ? serviceDetails.amount.toLocaleString()
              : "-"}
          </p>
        </div>
      </div>

      <InfoField
        label="Customization Options (Do they take special request?)"
        value={serviceDetails?.customizationOptions}
      />
    </div>
  );
}

// Documents Tab Component
function DocumentsTab({
  vendorRegistrationData,
}: {
  vendorRegistrationData: any;
}) {
  const portfolioImages = vendorRegistrationData?.portfolioImages || [];
  const registrationDocuments =
    vendorRegistrationData?.registrationDocuments || [];

  // Helper function to get image URL
  const getImageUrl = (image: any): string => {
    if (typeof image === "string") return image;
    if (image && typeof image === "object" && image.url) return image.url;
    return "";
  };

  // Helper function to get document name
  const getDocumentName = (doc: any): string => {
    if (typeof doc === "string") {
      // Extract filename from URL
      const parts = doc.split("/");
      return parts[parts.length - 1] || "Document";
    }
    if (doc && typeof doc === "object" && doc.name) return doc.name;
    return "Document";
  };

  return (
    <div className="space-y-8">
      {/* Portfolio Images Section */}
      <div>
        <p className="text-xs text-gray-400 mb-4">
          Portfolio Images (Previous Work)
        </p>
        {portfolioImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {portfolioImages.map((image: any, index: number) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Portfolio ${index + 1}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x300?text=Image";
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No portfolio images available</p>
        )}
      </div>

      {/* Business Registration Documents Section */}
      <div>
        <p className="text-xs text-gray-400 mb-4">
          Business Registration or Permits
        </p>
        {registrationDocuments.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {registrationDocuments.map((doc: any, index: number) => (
              <a
                key={index}
                href={getImageUrl(doc)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[120px] h-[140px] border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-xs text-gray-900 text-center break-words w-full">
                  {getDocumentName(doc)}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No documents available</p>
        )}
      </div>
    </div>
  );
}

export default VendorRegistrationDetails;
