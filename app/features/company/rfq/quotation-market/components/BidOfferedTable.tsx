// "use client";

// import clsx from "clsx";

// import ModalBidDetailById from "../../../offer/modal-by-id/ModalBidDetailById";
// import useAllBidQuotationMarketTable from "../../hooks/quotation-market/useAllBidQuotationMarketTable";
// import useAllBids from "../../hooks/useAllBids";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableRowHead,
// } from "@/app/components/ui/data-table";
// import ModalNotification from "@/app/components/ui/ModalNotification";
// import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
// import { Icons } from "@/app/icons";
// import { useBidsStore } from "@/app/store/bidsStore";
// import { EBidStatus } from "@/app/types/enum";
// import { ERfqType } from "@/app/types/rfq/rfqEnum";
// import { formatISOToDate } from "@/app/utils/formatDate";
// import { formatId } from "@/app/utils/formatId";
// import { translateTruckSize } from "@/app/utils/translateTruckSize";

// export default function BidOfferedTable() {
//   // Global State
//   const { getBidsParams } = useBidsStore();

//   // Hook
//   const { setPage, setLimit } = useAllBids();
//   const {
//     headerList,
//     handleSort,
//     sortedDataForAllBid,
//     bidId,
//     displayCode,
//     isCanceledBidModalOpen,
//     setIsCanceledBidModalOpen,
//     isModalDetailOpen,
//     setIsModalDetailOpen,
//     handleClickViewIcon,
//     handleClickCanceledBid,
//     handleClickConfirmCanceledBid,
//   } = useAllBidQuotationMarketTable();

//   // Render Table Row
//   const renderTableRows = () => {
//     if (!sortedDataForAllBid) return null;

//     const rowsToFill = getBidsParams().limit - sortedDataForAllBid.length;

//     return sortedDataForAllBid && sortedDataForAllBid.length > 0 ? (
//       <>
//         {sortedDataForAllBid.map((data) => {
//           return (
//             <TableRow key={data.id}>
//               <TableCell className="w-[18%]">
//                 {formatId(data.displayCode)}
//               </TableCell>
//               <TableCell className="w-[12%]">
//                 {data?.rfqData?.factoryData?.name}
//               </TableCell>
//               <TableCell className="w-[18%]">
//                 {data.rfqData?.rfqType === ERfqType.ONEWAY
//                   ? "ส่งเที่ยวเดียว"
//                   : data.rfqData?.rfqType === ERfqType.MULTIPLE
//                     ? "ส่งหลายที่"
//                     : "ส่งต่างประเทศ"}
//               </TableCell>
//               <TableCell className="w-[12%]">
//                 {data?.rfqData?.vehicleSize
//                   ? translateTruckSize(data?.rfqData?.vehicleSize)
//                   : "-"}
//               </TableCell>
//               <TableCell className="w-[10%]">
//                 {data?.rfqData?.totalRoutes > 1
//                   ? `${data?.rfqData?.totalRoutes} เส้นทาง`
//                   : `${data?.rfqData?.routes[0]?.origin.province}/${data?.rfqData?.routes[0]?.origin.district}`}
//               </TableCell>
//               <TableCell className="w-[10%]">
//                 {data?.rfqData?.totalRoutes > 1
//                   ? `${data?.rfqData?.totalRoutes} เส้นทาง`
//                   : `${data?.rfqData?.routes[0]?.destination.province}/${data?.rfqData?.routes[0]?.destination.district}`}
//               </TableCell>
//               <TableCell className="w-[10%]">
//                 {data?.rfqData?.totalRoutes > 1
//                   ? `${data?.rfqData?.totalRoutes} เส้นทาง`
//                   : data?.rfqData?.routes[0]?.distance.value}
//               </TableCell>
//               <TableCell className="w-[12%]">
//                 {data?.rfqData?.contactStart &&
//                   formatISOToDate.calculateDaysBetween(
//                     data?.rfqData?.contactStart,
//                     data?.rfqData?.contactEnd
//                   )}
//               </TableCell>
//               <TableCell className="w-[12%]">
//                 {data?.rfqData?.totalRoutes > 1
//                   ? "ราคาตามเส้นทาง"
//                   : data?.rfqData?.routes[0]?.offerPrice}
//               </TableCell>
//               <TableCell className="w-[14%]">
//                 <p className="body2 text-process-02 bg-toast-warning-background px-4 py-1 w-fit rounded-3xl">
//                   {data.bidStatus === EBidStatus.SUBMITTED ? "• รอตอบรับ" : "-"}
//                 </p>
//               </TableCell>
//               <TableCell className="w-[8%] flex items-center gap-2">
//                 <Icons
//                   name="ShowPassword"
//                   className="w-6 h-6 cursor-pointer"
//                   onClick={() => handleClickViewIcon(data.id)}
//                 />

//                 <Icons
//                   name="PaperFailLight"
//                   className="w-6 h-6 cursor-pointer"
//                   onClick={() =>
//                     handleClickCanceledBid(data.id, data.displayCode)
//                   }
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
//             "py-80": getBidsParams().limit === 10,
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
//             page: getBidsParams().page,
//             limit: getBidsParams().limit,
//             totalPages: getBidsParams().totalPages,
//             total: getBidsParams().total,
//           }}
//           setPage={setPage}
//           setLimit={setLimit}
//           className="bg-white rounded-lg p-4 shadow-table"
//         />
//       </div>

//       {/* Modal Detail */}
//       <ModalBidDetailById
//         isModalDetailOpen={isModalDetailOpen}
//         setIsModalDetailOpen={setIsModalDetailOpen}
//       />

//       <ModalNotification
//         open={isCanceledBidModalOpen}
//         setOpen={setIsCanceledBidModalOpen}
//         title="ยืนยันการลบใบเสนอราคา"
//         description={`คุณต้องการยกเลิกใบเสนอราคา #${displayCode} หรือไม่?`}
//         description2="และข้อมูลจะถูกส่งไปที่ ยกเลิกการเสนอราคา"
//         buttonText="ยืนยัน"
//         isConfirmOnly={false}
//         icon={<Icons name="PaperFailBulkYellow" className="w-16 h-16" />}
//         onConfirm={() => {
//           handleClickConfirmCanceledBid(bidId);
//         }}
//       />
//     </>
//   );
// }
