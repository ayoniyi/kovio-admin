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

//const TABS = ["New Bookings", "Ongoing", "Completed", "Cancelled"] as const;

const VendorRegistration = () => {
  const navigate = useNavigate();

  const [authState] = useContext<any>(AuthContext);
  const userId = authState?.user?._id;

  const userRequest = useUserRequest();
  const vendorRegistrationsQuery: any = useQuery({
    queryKey: ["vendor-registrations"],
    queryFn: () =>
      userRequest
        ?.get(`/bookings/admin/pending/vendors?page=1&limit=10`)
        .then((res: any) => {
          return {
            results: res.data,
          };
        }),
  });

  // console.log(
  //   "vendorRegistrationsQuery ??",
  //   vendorRegistrationsQuery?.data?.results,
  // );
  const vendorRegistrationsData = vendorRegistrationsQuery?.data?.results?.data;

  // Filter bookings based on selected tab
  if (vendorRegistrationsQuery?.isLoading) {
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
          </div>
        </div>

        <CustomTable
          headers={[
            { label: "Vendor Name" },
            // { label: "Business Name" },
            { label: "Vendor Type" },
            { label: "Location" },
            { label: "Action" },
          ]}
          data={vendorRegistrationsData}
          renderRow={(vendor: any) => (
            <TableRow key={vendor?._id}>
              <TableCell className="pl-4 pt-4 pb-4">
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
      </Card>
    </div>
  );
};

export default VendorRegistration;
