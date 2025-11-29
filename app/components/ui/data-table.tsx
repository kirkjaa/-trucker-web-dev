import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className={cn("relative w-full overflow-auto h-full", className)}>
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-base font-medium text-main-01 flex flex-col gap-2",
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableCustom = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className={cn("h-full", className)}>
    <table
      ref={ref}
      className={cn(
        "caption-bottom text-base font-medium text-main-01 flex flex-col gap-2",
        className
      )}
      {...props}
    />
  </div>
));
TableCustom.displayName = "TableCustom";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("flex flex-col gap-2 pb-2", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "shadow-table py-3 bg-white rounded-md flex items-center justify-between w-full hover:border-2 hover:border-secondary-caribbean-green-main",
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);
TableRow.displayName = "TableRow";

const TableRowCustom = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "shadow-table py-3 bg-white rounded-md flex items-center justify-between w-full",
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);
TableRowCustom.displayName = "TableRowCustom";

const TableRowHead = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "shadow-table rounded-md flex items-center justify-between w-full",
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);
TableRowHead.displayName = "TableRowHead";

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  isFirst?: boolean;
  isLast?: boolean;
}

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps & React.ThHTMLAttributes<HTMLTableCellElement>
>(
  (
    {
      className,
      // isFirst, isLast,
      ...props
    },
    ref
  ) => (
    <th
      ref={ref}
      className={cn(
        "p-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        // isFirst && "rounded-tl-[10px] rounded-bl-[10px]",
        // isLast && "rounded-tr-[10px] rounded-br-[10px]",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 py-2 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("text-lg font-medium rounded-b-lg", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCustom,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowCustom,
  TableRowHead,
};
