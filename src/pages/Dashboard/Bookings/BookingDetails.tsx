import { publicRequest, useUserRequest } from "@/utils/requestMethods";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";

const BookingDetails = () => {
  //GET Booking
  const bookingId: any = useParams().bookingId ? useParams().bookingId : "";
  const userRequest = useUserRequest();
  const bookingsQuery: any = useQuery({
    queryKey: ["singleBooking"],
    queryFn: () =>
      userRequest
        ?.get(`/bookings/admin/bookings/${bookingId}`)
        .then((res: any) => {
          return {
            results: res.data,
          };
        }),
  });
  const bookingData = bookingsQuery?.data?.results?.data;
  console.log("bookingData ??", bookingData);
  return <div>BookingDetails</div>;
};

export default BookingDetails;
