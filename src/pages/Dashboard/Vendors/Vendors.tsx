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

const Vendors = () => {
    const navigate = useNavigate();
    
    const [authState] = useContext<any>(AuthContext);
    const userId = authState?.user?._id;
   

    const userRequest = useUserRequest();
    const bookingsQuery: any = useQuery({
        queryKey: ["bookings"],
        queryFn: () =>
          userRequest
            ?.get(
              `/bookings/vendor/${userId}?page=1&limit=10`
            )
            .then((res: any) => {
              return {
                results: res.data,
              };
            }),
      });

    console.log("bookingsQuery ??", bookingsQuery?.data?.results?.data);
    const bookingsData = bookingsQuery?.data?.results?.data;

    // Filter bookings based on selected tab
 ;

  if (bookingsQuery?.isLoading) {
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
        data={[]}
        renderRow={(vendor: any) => (
          <TableRow key={vendor?._id}>
            <TableCell>
              {vendor?.name}
            </TableCell>
            <TableCell>
              {vendor?.vendorType}
            </TableCell>

            <TableCell>{vendor?.location}</TableCell>
            <TableCell>
              <button
                onClick={() =>
                  navigate(`/vendor/vendors/${vendor?._id}`)
                }
                className="text-kv-primary hover:text-orange-600 font-medium"
              >
                View Vendor
              </button>
            </TableCell>
          </TableRow>
        )}
      />
    </Card>
  </div>
  )
}

export default Vendors