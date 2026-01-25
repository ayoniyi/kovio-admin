/**
 * /src/pages/Dashboard/Vendors/VendorDetails.tsx
 * Displays detailed information about a single vendor
 * Shows Business, Contact, Service, and Documents tabs
 * RELEVANT FILES: Vendors.tsx, Routes.tsx, requestMethods.tsx
 */

import { useState } from "react";
import { useUserRequest } from "@/utils/requestMethods";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, FileText, Download } from "lucide-react";
import { formatDate, capitalizeName } from "@/utils/formatters";

type TabType = "Business" | "Contact" | "Service" | "Documents";

const VendorDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("Business");

  // GET Vendor
  const vendorId: any = useParams().vendorId ? useParams().vendorId : "";
  const userRequest = useUserRequest();
  const vendorQuery: any = useQuery({
    queryKey: ["singleVendor", vendorId],
    queryFn: () =>
      userRequest?.get(`/bookings/vendor/${vendorId}`).then((res: any) => {
        return {
          results: res.data,
        };
      }),
  });
  const vendorData: any = vendorQuery?.data;
  const isLoading = vendorQuery?.isLoading;
  console.log("vendorData ??", vendorData);

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
  if (!vendorData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 text-center">Vendor not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <h1 className="text-xl lg:text-2xl text-gray-900 font-semibold mb-2">
        Vendor Details
      </h1>

      {/* Go Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer mb-6"
      >
        <ChevronLeft size={20} className="mr-1" />
        <span className="text-sm font-medium">Go back</span>
      </button>

      {/* Vendor Header Info */}
      <div className="flex items-center gap-4 mb-8">
        {vendorData?.profileImageUrl && (
          <img
            src={vendorData.profileImageUrl}
            alt={vendorData?.businessInfo?.businessName || "Vendor"}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {vendorData?.businessInfo?.businessName ||
              `${vendorData?.firstName || ""} ${vendorData?.lastName || ""}`}
          </h2>
          <p className="text-gray-500">{vendorData?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? "text-kv-primary border-b-2 border-kv-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {activeTab === "Business" && <BusinessTab vendorData={vendorData} />}
        {activeTab === "Contact" && <ContactTab vendorData={vendorData} />}
        {activeTab === "Service" && <ServiceTab vendorData={vendorData} />}
        {activeTab === "Documents" && <DocumentsTab vendorData={vendorData} />}
      </div>
    </div>
  );
};

// Reusable Info Field Component
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
    </div>
  );
}

// Business Tab Component
function BusinessTab({ vendorData }: { vendorData: any }) {
  const businessInfo = vendorData?.businessInfo || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Social Media */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Social Media
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Instagram" value={businessInfo?.instagram} />
          <InfoField label="Facebook" value={businessInfo?.facebook} />
          <InfoField label="Twitter" value={businessInfo?.twitter} />
          <InfoField label="TikTok" value={businessInfo?.tiktok} />
          <InfoField label="Snapchat" value={businessInfo?.snapchat} />
        </div>
      </div>
    </div>
  );
}

// Contact Tab Component
function ContactTab({ vendorData }: { vendorData: any }) {
  const contactPerson = vendorData?.contactPerson || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField
          label="First Name"
          value={contactPerson?.firstName || vendorData?.firstName}
        />
        <InfoField
          label="Last Name"
          value={contactPerson?.lastName || vendorData?.lastName}
        />
        <InfoField
          label="Email Address"
          value={contactPerson?.email || vendorData?.email}
        />
        <InfoField
          label="Phone Number"
          value={contactPerson?.phoneNumber || vendorData?.phoneNumber}
        />
        <InfoField label="Role" value={contactPerson?.role} />
      </div>
    </div>
  );
}

// Service Tab Component
function ServiceTab({ vendorData }: { vendorData: any }) {
  const serviceDetails = vendorData?.serviceDetails || {};
  const venueInfo = vendorData?.venueInfo || {};
  const isVenue = vendorData?.role === "OWNER";

  if (isVenue) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField
          label="Services Offered"
          value={serviceDetails?.servicesOffered}
        />
        <InfoField label="Coverage Area" value={serviceDetails?.coverageArea} />
        <InfoField label="Availability" value={serviceDetails?.availability} />
        <InfoField
          label="Payment & Booking Policy"
          value={serviceDetails?.paymentBookingPolicy}
        />
        <InfoField
          label="Pricing Packages"
          value={serviceDetails?.pricingPackages}
        />
        <InfoField
          label="Amount"
          value={
            serviceDetails?.amount
              ? `NGN ${serviceDetails.amount.toLocaleString()}`
              : "-"
          }
        />
        <InfoField
          label="Customization Options"
          value={serviceDetails?.customizationOptions}
        />
      </div>
    </div>
  );
}

// Documents Tab Component
function DocumentsTab({ vendorData }: { vendorData: any }) {
  const portfolioImages = vendorData?.portfolioImages || [];
  const registrationDocuments = vendorData?.registrationDocuments || [];

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
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Portfolio Images (Previous Work)
        </h3>
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
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Business Registration / Permits
        </h3>
        {registrationDocuments.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {registrationDocuments.map((doc: any, index: number) => (
              <div
                key={index}
                className="w-[150px] border rounded-xl p-4 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-sm text-gray-900 text-center truncate w-full mb-2">
                  {getDocumentName(doc)}
                </p>
                <a
                  href={getImageUrl(doc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-kv-primary text-xs font-medium hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  View
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No documents available</p>
        )}
      </div>
    </div>
  );
}

export default VendorDetails;
