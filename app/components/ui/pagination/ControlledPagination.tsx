import React from "react";
import clsx from "clsx";

import { Dropdown } from "../dropdown";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

import { Icons } from "@/app/icons";
import { IMeta } from "@/app/types/global";
import { cn } from "@/lib/utils";

interface paginateProps {
  configPagination: IMeta;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  className?: string;
  setPageAfterSetLimit?: boolean;
}

const SizeOptions: string[] = ["10", "20", "30"];

const ControlledPaginate = ({
  configPagination: { page = 1, limit = 10, totalPages = 1, total = 0 },
  setPage,
  setLimit,
  className,
  setPageAfterSetLimit = true,
}: paginateProps) => {
  const pages: number[] = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);
  // Next and previous handlers
  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleFirstPage = () => {
    setPage(1); // Navigate to the first page
  };

  const handleLastPage = () => {
    setPage(totalPages); // Navigate to the last page
  };

  // Page size change handler
  const handlePageSizeChange = (data: number) => {
    setLimit(data);
    if (setPageAfterSetLimit) setPage(1);
  };

  return (
    <div className={cn("flex gap-8 justify-between items-center", className)}>
      <div className="flex items-center gap-2">
        {/* <h6 className="text-text-tertiary whitespace-nowrap">Show</h6> */}
        <Dropdown
          options={SizeOptions}
          placeholder="Search..."
          selected={limit.toString()}
          className="w-20 border border-text-quaternary text-xs rounded-md"
          onChange={(value) => handlePageSizeChange(Number(value))}
          border={false}
        />
        <div className="secondary-dark-gray-main whitespace-nowrap w-14">
          {startIndex === endIndex
            ? `${endIndex} จาก ${total} รายการ`
            : `${startIndex} ถึง ${endIndex} จาก ${total} รายการ`}
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          {/* First Page Button */}
          <PaginationItem>
            <PaginationLink
              onClick={handleFirstPage}
              className={clsx("cursor-pointer text-text-paginate-text", {
                "text-neutral-04 cursor-default": page === 1,
              })}
            >
              <Icons name="ChevronLeftDouble" className="w-4 h-4" />
            </PaginationLink>
          </PaginationItem>

          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={handleBack}
              className={clsx("cursor-pointer text-text-paginate-text", {
                "text-neutral-04 cursor-default": page === 1,
              })}
            />
          </PaginationItem>

          {/* Render only the current page number */}
          {/* <PaginationItem>
            <PaginationLink
              className="text-sm font-normal"
              isActive
              onClick={() => setPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem> */}

          <div className=" flex items-center justify-center gap-2">
            {pages.map((pageLink, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() =>
                    typeof pageLink === "number" && setPage(pageLink)
                  }
                  isActive={pageLink === page}
                  className="cursor-pointer"

                  //   style={{
                  //     cursor: pageLink !== "..." ? "pointer" : "default",
                  //   }}
                >
                  <p
                    className={cn(
                      "body2 border border-neutral-03 text-paginate-text px-[7px] rounded-full",
                      pageLink === page
                        ? "bg-secondary-teal-green-main text-white border-secondary-teal-green-main"
                        : ""
                    )}
                  >
                    {pageLink}
                  </p>
                </PaginationLink>
              </PaginationItem>
            ))}
          </div>

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={clsx("cursor-pointer text-paginate-text", {
                "text-neutral-04 cursor-default": page === totalPages,
              })}
            />
          </PaginationItem>

          {/* Last Page Button */}
          <PaginationItem>
            <PaginationLink
              onClick={handleLastPage}
              className={clsx("cursor-pointer text-paginate-text", {
                "text-neutral-04 cursor-default": page === totalPages,
              })}
            >
              <Icons name="ChevronRightDouble" className="w-4 h-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export { ControlledPaginate };
