import { useContext, useState, useMemo } from "react";
import { Card } from "../../../components/ui/card";
import { TableCell, TableRow } from "../../../components/ui/table";
import CustomTable from "../../../components/ui/custom/CustomTable";
import Loader from "../../../components/ui/custom/loader";
import SearchBar from "../../../components/ui/custom/SearchBar";
//import NoData from "@/components/ui/custom/noAavaialbleData";
import { AuthContext } from "../../../context/AuthContext";

import { cn } from "../../../lib/utils";
import { formatDate, formatTime } from "../../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUserRequest } from "@/utils/requestMethods";

//const TABS = ["New Bookings", "Ongoing", "Completed", "Cancelled"] as const;

const Transactions = () => {
  const navigate = useNavigate();

  const [authState] = useContext<any>(AuthContext);
  const userId = authState?.user?._id;
  const [searchQuery, setSearchQuery] = useState("");

  const userRequest = useUserRequest();
  const transactionsQuery: any = useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      userRequest?.get(`/transactions`).then((res: any) => {
        return {
          results: res.data,
        };
      }),
  });

  console.log("transactionsQuery ??", transactionsQuery?.data?.results?.data);
  const transactionsData = transactionsQuery?.data?.results?.data;

  // Filter bookings based on selected tab
  if (transactionsQuery?.isLoading) {
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
            { label: "Name" },
            { label: "Type" },
            { label: "Method" },
            { label: "Amount" },
            { label: "Status" },
          ]}
          data={transactionsData}
          renderRow={(transaction: any) => (
            <TableRow key={transaction?._id}>
              <TableCell className="ml-4 pl-4 pt-5 pb-5">
                {formatDate(transaction?.createdAt)}
              </TableCell>
              <TableCell>
                {transaction?.user?.firstName} {transaction?.user?.lastName}
              </TableCell>
              <TableCell className="capitalize">{transaction?.type}</TableCell>
              <TableCell className="capitalize">
                {transaction?.method}
              </TableCell>
              <TableCell>{transaction?.amount}</TableCell>
              <TableCell
                className={`capitalize ${transaction?.status === "pending" ? "text-yellow-500" : transaction?.status === "successful" ? "text-green-500" : " text-red-500"}`}
                //className="capitalize text-kv-primary"
              >
                {transaction?.status}
              </TableCell>
              {/* <TableCell>
                <button
                  onClick={() => navigate(`/transactions/${transaction?._id}`)}
                  className="text-kv-primary hover:text-orange-600 font-medium"
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
              </TableCell> */}
            </TableRow>
          )}
        />
      </Card>
    </div>
  );
};

export default Transactions;
