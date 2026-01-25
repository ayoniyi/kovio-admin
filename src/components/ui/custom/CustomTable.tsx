import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TableHeader {
  label: string;
  className?: string;
  align?: "left" | "center" | "right";
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface CustomTableProps<T> {
  headers: TableHeader[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  pagination?: PaginationProps;
  maxHeight?: string;
  emptyState?: React.ReactNode;
  className?: string;
  rowClassName?: string | ((item: T, index: number) => string);
}

export default function CustomTable<T>({
  headers,
  data,
  renderRow,
  maxHeight = "80vh",
  emptyState,
  className = "",
}: CustomTableProps<T>) {
  const defaultEmptyState = (
    <TableRow>
      <TableCell
        colSpan={headers.length}
        className="h-24 text-center text-gray-500"
      >
        No data available
      </TableCell>
    </TableRow>
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const totalPages = data ? Math.ceil(data?.length / itemsPerPage) : 0;

  // Get current page data
  const currentData = data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max to show, display all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at start or end
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push("...");
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const navigate = useNavigate();

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div
        className="w-full border shadow-sm bg-white 
           overflow-x-auto overflow-y-auto table-container"
        style={{
          maxHeight,
          WebkitOverflowScrolling: "touch", // smooth scrolling on iOS
        }}
      >
        <Table className="w-full min-w-[600px]">
          <TableHeader className="sticky top-0 z-10  ">
            <TableRow className="hover:bg-transparent">
              {headers.map((header, index) => (
                <TableHead
                  key={`header-${index}`}
                  className={`pl-4 bg-gray-50 font-semibold text-gray-700 font-gabaritoHeading whitespace-nowrap sm:whitespace-normal ${
                    header.className || ""
                  } ${
                    header.align === "center"
                      ? "text-center"
                      : header.align === "right"
                        ? "text-right"
                        : "text-left"
                  }`}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData?.length > 0
              ? currentData.map((item, index) => (
                  <React.Fragment key={`row-${index}`}>
                    {renderRow(item, index)}
                  </React.Fragment>
                ))
              : emptyState || defaultEmptyState}
          </TableBody>
        </Table>
      </div>

      {/*pagination */}
      {totalPages > 1 && (
        <div className="px-3 sm:px-5 py-4 bg-gray-50 rounded-b-3xl flex items-center justify-center space-x-1 overflow-x-auto">
          <div className="flex items-center space-x-1 min-w-max">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="p-2 rounded-xl hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              style={{ minWidth: "40px", minHeight: "40px" }}
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((number, index) =>
              number === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-500 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${number}`}
                  onClick={() => setCurrentPage(Number(number))}
                  aria-label={`Page ${number}`}
                  aria-current={currentPage === number ? "page" : undefined}
                  className={`min-w-[35px] min-h-[35px] text-base rounded-3xl flex items-center justify-center text-sm touch-manipulation ${
                    currentPage === number
                      ? "bg-kv-secondary hover:bg-kv-secondary text-kv-primary"
                      : "text-gray-700 hover:bg-kv-secondary active:bg-gray-300"
                  }`}
                >
                  {number}
                </button>
              ),
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="p-2 rounded-md hover:bg-kv-secondary active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              style={{ minWidth: "40px", minHeight: "40px" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
