/**
 * /src/pages/Dashboard/Bookings/BookingDetails.tsx
 * Displays detailed information about a single booking
 * Shows customer info, event info, vendor info, services, and payment details
 * RELEVANT FILES: Bookings.tsx, Routes.tsx, requestMethods.tsx
 */

import { useUserRequest } from "@/utils/requestMethods";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { formatDate, formatPrice, formatTime } from "@/utils/formatters";

import Step0 from "./assets/booksteps0.svg";
import Step1 from "./assets/booksteps1.svg";
import Step2 from "./assets/booksteps1.5.svg";
import Step3 from "./assets/booksteps2.svg";

type BookingData = {
  customerinformation: {
    fullName?: string;
    email?: string;
  };
  bookingInformation: {
    bookingCode?: string;
    customerName?: string;
    dateTime?: string;
    bookingId?: number;
    status?: string;
  };
  servicesNeeded: Record<string, string>;
  vendorInformation: {
    businessName?: string;
    businessType?: string;
    businessStreet?: string;
    businessCity?: string;
    businessCountry?: string;
  };
  paymentResponse: {
    amount?: number;
    status?: string;
    method?: string;
  };
  isdeclined?: boolean;
  vendorDeclineReason?: string;
};

const BookingDetails = () => {
  const navigate = useNavigate();

  // GET Booking
  const bookingId: any = useParams().bookingId ? useParams().bookingId : "";
  const userRequest = useUserRequest();
  const bookingsQuery: any = useQuery({
    queryKey: ["singleBooking", bookingId],
    queryFn: () =>
      userRequest?.get(`/bookings/${bookingId}`).then((res: any) => {
        return {
          results: res.data,
        };
      }),
  });
  const bookingData: any = bookingsQuery?.data?.results;
  const isLoading = bookingsQuery?.isLoading;
  console.log("bookingData ??", bookingData);

  // Helper functions for safe data extraction
  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return { date: "N/A", time: "N/A" };

    try {
      const dt = new Date(dateTime);
      const date = dt.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = dt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { date, time };
    } catch {
      return { date: dateTime, time: "N/A" };
    }
  };

  const getServicesArray = (services: Record<string, string>) => {
    if (!services || Object.keys(services).length === 0) return [];
    return Object.values(services).filter(
      (service) => service && service.trim() !== "",
    );
  };

  const getFullAddress = (vendorInfo: BookingData["vendorInformation"]) => {
    if (!vendorInfo) return "N/A";
    const parts = [];
    if (vendorInfo.businessStreet) parts.push(vendorInfo.businessStreet);
    if (vendorInfo.businessCity) parts.push(vendorInfo.businessCity);
    if (vendorInfo.businessCountry) parts.push(vendorInfo.businessCountry);
    return parts.join(", ") || "N/A";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-kv-primary" />
      </div>
    );
  }

  // Not found state
  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 text-center">Booking not found.</p>
      </div>
    );
  }

  // Extract data safely
  const { date, time } = formatDateTime(
    bookingData?.eventday + " " + bookingData?.eventtime,
  );
  const services = getServicesArray(bookingData.servicesNeeded || {});
  const fullAddress = getFullAddress(bookingData.vendorInformation || {});
  const amount = bookingData.paymentResponse?.amount
    ? `NGN ${bookingData.paymentResponse.amount.toLocaleString()}`
    : "N/A";

  // Styles
  const labelClass = "text-sm text-gray-500 leading-5 mb-1";
  const valueClass = "text-sm font-semibold leading-5 text-gray-900";
  const sectionTitleClass =
    "text-base font-medium text-gray-900 border-b border-gray-200 leading-6 mb-4 p-4";
  const cardClass = "border border-gray-200 rounded-3xl shadow-sm bg-white";

  // Status color helper
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "INITIATED":
        return "text-orange-600";
      case "CONFIRMED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      case "COMPLETED":
        return "text-green-600";
      case "FAILED":
        return "text-red-600";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div>
      <h1 className="text-xl lg:text-2xl text-gray-900 font-semibold mb-6">
        Booking Details
      </h1>

      {/* Go Back Link */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span className="text-sm font-medium">Go back</span>
        </button>
      </div>

      <div className="mb-6 p-4 rounded-lg lg:flex items-end gap-6">
        <img
          className="rounded-full object-cover w-[15%]"
          src={bookingData?.userid?.profileImageUrl}
          alt={
            bookingData?.userid?.firstName + " " + bookingData.userid?.lastName
          }
          //   width={100}
          //   height={100}
        />
      </div>

      {/* Booking Code Display */}
      {/* {bookingData.bookingInformation?.bookingCode && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Booking Code</p>
          <p className="text-lg font-semibold text-blue-800">
            {bookingData.bookingInformation.bookingCode}
          </p>
        </div>
      )} */}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Customer Information */}
        <div className={cardClass}>
          <h2 className={sectionTitleClass}>Customer Information</h2>
          <div className="px-4 pb-4">
            <div className="mb-3">
              <p className={labelClass}>Full Name</p>
              <p className={valueClass}>
                {bookingData?.userid?.firstName +
                  " " +
                  bookingData.userid?.lastName || "N/A"}
              </p>
            </div>
            <div className="mb-3">
              <p className={labelClass}>Email</p>
              <p className={valueClass}>
                {bookingData?.userid?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Event Information */}
        <div className={cardClass}>
          <h2 className={sectionTitleClass}>Event Information</h2>
          <div className="px-4 pb-4">
            <div className="mb-3">
              <p className={labelClass}>Date</p>
              <p className={valueClass}>{formatDate(bookingData?.eventday)}</p>
            </div>
            <div className="mb-3">
              <p className={labelClass}>Time</p>
              <p className={valueClass}>{formatTime(bookingData?.eventtime)}</p>
            </div>
            <div className="mb-3">
              <p className={labelClass}>Location</p>
              <p className={valueClass}>{bookingData?.eventLocation}</p>
            </div>
            {/* <div className="mb-3">
              <p className={labelClass}>Status</p>
              <p
                className={`${valueClass} ${getStatusColor(
                  bookingData?.status,
                )}`}
              >
                {bookingData?.status?.toUpperCase() || "N/A"}
              </p>
            </div> */}
          </div>
        </div>

        {/* Vendor Information */}
        <div className={cardClass}>
          <h2 className={sectionTitleClass}>Vendor Information</h2>
          <div className="px-4 pb-4">
            <div className="mb-3">
              <p className={labelClass}>Business Name</p>
              <p className={valueClass}>
                {bookingData.vendorid?.businessInfo?.businessName || "N/A"}
              </p>
            </div>
            <div className="mb-3">
              <p className={labelClass}>Business Type</p>
              <p className={valueClass}>
                {bookingData.vendorid?.businessInfo?.businessType || "N/A"}
              </p>
            </div>
            <div className="mb-3">
              <p className={labelClass}>Address</p>
              <p className={valueClass}>
                {bookingData.vendorid?.businessInfo?.businessStreet +
                  ", " +
                  bookingData.vendorid?.businessInfo?.city}
              </p>
            </div>
          </div>
        </div>

        {/* Services Needed */}
        {/* <div className={cardClass}>
          <h2 className={sectionTitleClass}>Services Needed</h2>
          <div className="px-4 pb-4">
            {bookingData.servicesNeeded.length > 0 ? (
              <ol className="list-decimal pl-5 text-gray-900 text-sm font-medium leading-5">
                {bookingData.servicesNeeded.map(
                  (service: any, index: number) => (
                    <li key={index} className="mb-2">
                      {service}
                    </li>
                  ),
                )}
              </ol>
            ) : (
              <p className={valueClass}>No services specified</p>
            )}
          </div>
        </div> */}

        <div className={cardClass}>
          <h2 className={sectionTitleClass}> Services Needed</h2>
          <div className="px-4 pb-4">
            <p className={valueClass}>{bookingData.servicesNeeded}</p>
          </div>
        </div>

        {/* Payment Information */}
        {/* {!bookingData?.isdeclined && (
          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Payment Information</h2>
            <div className="px-4 pb-4">
              <div className="mb-3">
                <p className={labelClass}>Amount</p>
                <p className={valueClass}>{amount}</p>
              </div>
              <div className="mb-3">
                <p className={labelClass}>Payment Method</p>
                <p className={valueClass}>
                  {bookingData.paymentResponse?.method === "NA"
                    ? "Not Available"
                    : bookingData.paymentResponse?.method || "N/A"}
                </p>
              </div>
              <div className="mb-3">
                <p className={labelClass}>Payment Status</p>
                <p
                  className={`${valueClass} ${getStatusColor(
                    bookingData.paymentResponse?.status,
                  )}`}
                >
                  {bookingData.paymentResponse?.status || "N/A"}
                </p>
              </div>
              {bookingData.paymentResponse?.status === "COMPLETED" && (
                <div className="mb-3">
                  <p className={labelClass}>Receipt</p>
                  <div className="flex gap-5 items-center text-kv-primary text-sm font-semibold leading-5">
                    <button className="hover:underline cursor-pointer">
                      View
                    </button>
                    <button className="hover:underline cursor-pointer">
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Status History */}
        {!bookingData?.isdeclined ? (
          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Status History</h2>
            <div className="px-4 pb-4">
              {bookingData?.amountToPay === 0 ? (
                <img src={Step0} alt="step0" />
              ) : bookingData?.amountToPay != 0 && !bookingData?.paymentmade ? (
                <div className="flex">
                  <div>
                    <img src={Step2} alt="step2" />
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <div>
                      <p className="text-regular font-normal text-kv-semi-black">
                        Booking Accepted
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(bookingData?.sendAmount?.date)}
                      </p>
                    </div>
                    <div className="mt-5">
                      <p className="text-regular font-normal text-kv-semi-black">
                        Send Amount
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(bookingData?.sendAmount?.date)}
                      </p>
                    </div>
                    <div className="mt-5">
                      <p className="text-regular font-normal text-kv-semi-black">
                        Payment Made
                      </p>
                      <p className="text-sm text-gray-500 mt-1">-</p>
                    </div>
                  </div>
                </div>
              ) : bookingData?.amountToPay != 0 && bookingData?.paymentmade ? (
                <div className="flex">
                  <div>
                    <img src={Step3} alt="step2" />
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <div>
                      <p className="text-regular font-normal text-kv-semi-black">
                        Booking Accepted
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(bookingData?.sendAmount?.date)}
                      </p>
                    </div>
                    <div className="mt-5">
                      <p className="text-regular font-normal text-kv-semi-black">
                        Send Amount
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(bookingData?.sendAmount?.date)}
                      </p>
                    </div>
                    <div className="mt-5">
                      <p className="text-regular font-normal text-kv-semi-black">
                        Payment Made
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(bookingData?.paymentMade?.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          //   <div className={cardClass}>
          //     <h2 className={sectionTitleClass}>Decline Reason</h2>
          //     <div className="px-4 pb-4">
          //       <p className={valueClass}>{bookingData?.vendorDeclineReason}</p>
          //     </div>
          //   </div>
          ""
        )}

        {/* Payment Information */}
        {!bookingData?.isdeclined && bookingData?.paymentmade && (
          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Payment Information</h2>
            <div className="px-4 pb-4">
              <div className="mb-3">
                <p className={labelClass}>Amount</p>
                <p>NGN {formatPrice(bookingData?.amountToPay)}</p>
              </div>
              {/* <div className="mb-3">
                <p className={labelClass}>Payment Method</p>
                <p>N/A</p>
              </div> */}
              <div className="mb-3">
                <p className={labelClass}>Payment Status</p>
                <p
                  className={`${valueClass} ${
                    bookingData.paymentmade === false
                      ? "text-orange-600"
                      : bookingData.paymentmade === true
                        ? "text-green-600"
                        : bookingData.paymentmade === false
                          ? "text-red-600"
                          : ""
                  }`}
                >
                  {bookingData.paymentmade ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Decline Reason */}
        {bookingData?.isdeclined && (
          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Vendor Decline Reason</h2>
            <div className="px-4 pb-4">
              <p className={valueClass}>{bookingData?.vendorDeclineReason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
