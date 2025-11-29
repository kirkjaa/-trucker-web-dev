// "use client";

// import clsx from "clsx";

// import useWaitBidTable from "../../hooks/quotation-market/useWaitBidTable";
// import ModalRfqDetailById from "../../modal-by-id/ModalRfqDetailById";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableRowHead,
// } from "@/app/components/ui/data-table";
// import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
// import useAllRfq from "@/app/features/factory/rfq/hooks/useAllRfq";
// import { Icons } from "@/app/icons";
// import { useRfqStore } from "@/app/store/rfqStore";
// import { ERfqType } from "@/app/types/enum";
// import { formatISOToDate } from "@/app/utils/formatDate";
// import { formatId } from "@/app/utils/formatId";
// import { translateTruckSize } from "@/app/utils/translateTruckSize";

// export default function WaitBidTable() {
//   // Global State
//   const { getRfqSearchParams } = useRfqStore();

//   // Hook
//   const { setPage, setLimit } = useAllRfq();
//   const {
//     headerList,
//     handleSort,
//     sortedDataFromWaitBid,
//     isModalDetailOpen,
//     setIsModalDetailOpen,
//     handleClickViewIcon,
//   } = useWaitBidTable();

//   // Render Table Row
//   const renderTableRows = () => {
//     if (!sortedDataFromWaitBid) return null;

//     const rowsToFill =
//       getRfqSearchParams().limit - sortedDataFromWaitBid.length;

//     return sortedDataFromWaitBid && sortedDataFromWaitBid.length > 0 ? (
//       <>
//         {sortedDataFromWaitBid.map((data) => {
//           return (
//             <TableRow key={data.id}>
//               <TableCell className="w-[12%]">
//                 {formatId(data.displayCode)}
//               </TableCell>
//               <TableCell className="w-[12%]">
//                 {data.factoryData?.name}
//               </TableCell>
//               <TableCell className="w-[14%]">
//                 {data.rfqType === ERfqType.ONEWAY
//                   ? "ส่งเที่ยวเดียว"
//                   : data.rfqType === ERfqType.MULTIPLE
//                     ? "ส่งหลายที่"
//                     : "ส่งต่างประเทศ"}
//               </TableCell>
//               <TableCell className="w-[12%]">
//                 {data.vehicleSize ? translateTruckSize(data.vehicleSize) : "-"}
//               </TableCell>
//               <TableCell className="w-[12%]">
//                 {data?.totalRoutes > 1
//                   ? `${data?.totalRoutes} เส้นทาง`
//                   : `${data?.routes?.[0]?.origin.province}/${data?.routes?.[0]?.origin.district}`}
//               </TableCell>
//               <TableCell className="w-[12%]">
//                 {data?.totalRoutes > 1
//                   ? `${data?.totalRoutes} เส้นทาง`
//                   : `${data?.routes?.[0]?.destination.province}/${data?.routes?.[0]?.destination.district}`}
//               </TableCell>
//               <TableCell className="w-[10%]">
//                 {data?.routes?.[0]?.distance.value}
//               </TableCell>
//               <TableCell className="w-[10%]">
//                 {data?.contactStart &&
//                   formatISOToDate.calculateDaysBetween(
//                     data?.contactStart,
//                     data?.contactEnd
//                   )}
//               </TableCell>
//               <TableCell className="w-[6%] flex items-center gap-2">
//                 <Icons
//                   name="ShowPassword"
//                   className="w-6 h-6 cursor-pointer"
//                   onClick={() => handleClickViewIcon(data.id)}
//                 />
//               </TableCell>
//             </TableRow>
//           );
//         })}
//         {/* Render empty rows to fill the table */}
//         {Array.from({ length: rowsToFill }, (_, index) => (
//           <TableRow key={`empty-${index}`} className="hover:border-none">
//             <TableCell colSpan={7} className="h-[2.6rem]">
//               &nbsp;
//             </TableCell>
//           </TableRow>
//         ))}
//       </>
//     ) : (
//       <TableRow className="hover:border-none flex justify-center items-center">
//         <TableCell
//           colSpan={8}
//           className={clsx("py-40 font-semibold text-secondary-200", {
//             "py-80": getRfqSearchParams().limit === 10,
//           })}
//         >
//           <h4 className="h-10">No data found</h4>
//         </TableCell>
//       </TableRow>
//     );
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-2 w-full">
//         {/* Table */}
//         <Table>
//           <TableHeader>
//             <TableRowHead>
//               {headerList.map(({ key, label, sortable = true, width }) => (
//                 <TableHead
//                   key={key}
//                   className={`w-[${width}] flex items-center gap-1`}
//                 >
//                   {label}
//                   {sortable && key && (
//                     <Icons
//                       name="Swap"
//                       className={clsx("w-4 h-4", {
//                         "cursor-pointer": sortable,
//                       })}
//                       onClick={() => sortable && key && handleSort(key)}
//                     />
//                   )}
//                 </TableHead>
//               ))}
//             </TableRowHead>
//           </TableHeader>
//           <TableBody>{renderTableRows()}</TableBody>
//         </Table>

//         <ControlledPaginate
//           configPagination={{
//             page: getRfqSearchParams().page,
//             limit: getRfqSearchParams().limit,
//             totalPages: getRfqSearchParams().totalPages,
//             total: getRfqSearchParams().total,
//           }}
//           setPage={setPage}
//           setLimit={setLimit}
//           className="bg-white rounded-lg p-4 shadow-table"
//         />
//       </div>

//       {/* Modal Detail */}
//       <ModalRfqDetailById
//         isModalDetailOpen={isModalDetailOpen}
//         setIsModalDetailOpen={setIsModalDetailOpen}
//       />
//     </>
//   );
// }
