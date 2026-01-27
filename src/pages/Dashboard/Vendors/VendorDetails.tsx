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
import { ArrowLeft, Loader2, FileText } from "lucide-react";

type TabType = "Business" | "Contact" | "Service" | "Documents";

const VendorDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("Business");

  // GET Vendor
  const vendorId: string = useParams().vendorId || "";
  const userRequest = useUserRequest();

  const vendorQuery = useQuery({
    queryKey: ["singleVendor", vendorId],
    queryFn: () =>
      userRequest
        ?.get(`/users/find-user-by-id/${vendorId}`)
        .then((res: any) => {
          return res.data;
        }),
  });

  const vendorData: any = vendorQuery?.data?.data || vendorQuery?.data;
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
  if (!vendorData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 text-center">Vendor not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Page Header */}
      <h1 className="text-xl lg:text-2xl text-gray-900 font-semibold mb-4">
        Vendor details
      </h1>

      {/* Go Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        <span className="text-sm">Go back</span>
      </button>

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
        {activeTab === "Business" && <BusinessTab vendorData={vendorData} />}
        {activeTab === "Contact" && <ContactTab vendorData={vendorData} />}
        {activeTab === "Service" && <ServiceTab vendorData={vendorData} />}
        {activeTab === "Documents" && <DocumentsTab vendorData={vendorData} />}
      </div>
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
function BusinessTab({ vendorData }: { vendorData: any }) {
  const businessInfo = vendorData?.businessInfo || {};

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
function ContactTab({ vendorData }: { vendorData: any }) {
  const contactPerson = vendorData?.contactPerson || {};

  return (
    <div className="space-y-0">
      <InfoField
        label="First Name"
        value={contactPerson?.firstName || vendorData?.firstName}
      />
      <InfoField
        label="Last Name"
        value={contactPerson?.lastName || vendorData?.lastName}
      />
      <InfoField
        label="Email"
        value={contactPerson?.email || vendorData?.email}
      />
      <InfoField label="Role" value={contactPerson?.role} />
    </div>
  );
}

// Service Tab Component
function ServiceTab({ vendorData }: { vendorData: any }) {
  const serviceDetails = vendorData?.serviceDetails || {};
  const venueInfo = vendorData?.venueInfo || {};
  const isVenue = vendorData?.role === "OWNER";

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

export default VendorDetails;
