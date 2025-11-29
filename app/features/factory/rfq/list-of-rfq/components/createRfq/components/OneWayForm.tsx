import clsx from "clsx";

import useOneWayForm from "../../../../hooks/useOneWayForm";

import DetailCsvModal from "./DetailCsvModal";
import DetailModalCustomRoute from "./DetailModalCustomRoute";
import EditCustomRouteModal from "./EditCustomRouteModal";
import EditImportRouteModal from "./EditImportRouteModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import ImportButton from "@/app/components/ui/featureComponents/ImportButton";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { Icons } from "@/app/icons";
import { useMasterStore } from "@/app/store/master/masterStore";
import { useRouteStore } from "@/app/store/route/routeStore";
import { ICreateRfqRoute } from "@/app/types/rfq/rfqType";
import { IResponseCheckDupRoute, IRouteForCheck } from "@/app/types/routesType";

interface OneWayFormProps {
  routesDetails: ICreateRfqRoute[];
  setRoutesDetails: React.Dispatch<React.SetStateAction<ICreateRfqRoute[]>>;
}

export default function OneWayForm({
  routesDetails,
  setRoutesDetails,
}: OneWayFormProps) {
  // Global State
  const routes = useRouteStore((state) => state.routes);
  const unitPriceRoutes = useMasterStore((state) => state.unitPriceRoutes);

  // Hook
  const {
    // states
    duplicateRoute,
    isOpenEditImportRouteModal,
    setIsOpenEditImportRouteModal,
    editImportRouteData,
    isOpenEditCustomRouteModal,
    setIsOpenEditCustomRouteModal,
    editCustomRouteData,
    isOpenCustomRouteModal,
    setIsOpenCustomRouteModal,
    isOpenCsvTableModal,
    setIsOpenCsvTableModal,
    csvData,
    // setCsvData,
    isModalRouteNotFoundOpen,
    setIsModalRouteNotFoundOpen,
    routeNotFound,
    setDuplicateRoute,
    // setRouteNotFound,
    transformedData,
    setTransformedData,

    // functions
    handleClickDownloadCsv,
    handleImportButtonClick,
    handleFileUpload,
    fileInputRef,
    handleOpenCustomRouteModal,
    handleClickCanceledRoutes,
    handleClickEditImportRoute,
    // handleClickEditCustomRoute,
  } = useOneWayForm();

  // Function
  const handleClickCheckDuplicateRouteFactory = async (
    factoryId: string,
    routes: IRouteForCheck[]
  ) => {
    console.log(factoryId, routes);
    /* try { */
    /*   await checkDuplicateRouteFactory({ */
    /*     factoryId: factoryId, */
    /*     routes, */
    /*     type: ERfqType.ONEWAY, */
    /*   }).then((res) => { */
    /*     const duplicateRoute = res.data.filter((route) => route.isDuplicate); */
    /*     setDuplicateRoute(duplicateRoute); */
    /*     setRoutesDetails( */
    /*       duplicateRoute.map((route) => ({ */
    /*         factoryRouteId: route.id, */
    /*         offerPrice: +route.offerPrice, */
    /*         unit: route.unit, */
    /*       })) */
    /*     ); */
    /*     const nonDuplicateRoutes = res.data.filter( */
    /*       (route) => !route.isDuplicate */
    /*     ); */
    /*     setRouteNotFound(nonDuplicateRoutes); */
    /*     setIsOpenCsvTableModal(false); */
    /*     setIsModalRouteNotFoundOpen(true); */
    /*   }); */
    /* } catch (error) { */
    /*   console.error(error); */
    /* } finally { */
    /*   setCsvData([]); */
    /*   setTransformedData([]); */
    /*   fileInputRef.current!.value = ""; */
    /* } */
  };

  const handleClickDeleteImportRoute = (index: number) => {
    setDuplicateRoute((prev) => prev.filter((_, i) => i !== index));
    setRoutesDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteCustomRoute = (index: number) => {
    setRoutesDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateImportRoute = (updatedRoute: IResponseCheckDupRoute) => {
    setDuplicateRoute((prevRoutes) =>
      prevRoutes.map((route) =>
        route.id === updatedRoute.id ? updatedRoute : route
      )
    );
    /* setRoutesDetails((prevRoutes) => */
    /*   prevRoutes.map((route) => */
    /*     route.factoryRouteId === updatedRoute.id */
    /*       ? { */
    /*           factoryRouteId: updatedRoute.id, */
    /*           offerPrice: parseFloat(updatedRoute.offerPrice), */
    /*           unit: updatedRoute.unit, */
    /*         } */
    /*       : route */
    /*   ) */
    /* ); */

    setIsOpenEditImportRouteModal(false);
  };

  const handleUpdateCustomRoute = (updatedRoute: ICreateRfqRoute) => {
    console.log(updatedRoute);
    /* setRoutesDetails((prevRoutes) => */
    /*   prevRoutes.map((route) => */
    /*     route.factoryRouteId === updatedRoute.factoryRouteId */
    /*       ? { */
    /*           factoryRouteId: updatedRoute.factoryRouteId, */
    /*           offerPrice: parseFloat(updatedRoute.offerPrice), */
    /*           unit: updatedRoute.unit, */
    /*         } */
    /*       : route */
    /*   ) */
    /* ); */

    setIsOpenEditCustomRouteModal(false);
  };

  const handleAddCustomRoute = (newRoute: ICreateRfqRoute) => {
    setRoutesDetails((prev) => [
      ...prev,
      {
        organization_route_id: newRoute.organization_route_id,
        unit_price_route_id: newRoute.unit_price_route_id,
        base_price: newRoute.base_price,
      },
    ]);
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />

      <div className="flex flex-col gap-4 shadow-table w-full p-5 rounded-2xl text-secondary-indigo-main">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">กำหนดต้นทาง - ปลายทาง</p>
          <button
            className="bg-neutral-00 text-primary-blue-main px-5 py-2 rounded-3xl flex gap-2 hover:bg-secondary-indigo-main hover:text-white"
            onClick={handleClickDownloadCsv}
          >
            <Icons name="CsvDownload" className="w-5 h-5" />
            <p className="button">ดาวโหลดเทมเพลต</p>
          </button>
        </div>

        {/* Import Button */}
        <div className="flex gap-5 w-full">
          <ImportButton
            icon="ImportCsv"
            title="นำเข้า CSV"
            onClick={handleImportButtonClick}
          />
          <ImportButton
            icon="BranchIcon"
            title="กำหนดเอง"
            onClick={handleOpenCustomRouteModal}
          />
        </div>

        <div
          className={clsx(
            "relative flex flex-col gap-4 w-full h-full p-5 bg-modal-01 rounded-lg border-2 border-dashed border-neutral-03",
            {
              "flex-row justify-center items-center":
                duplicateRoute.length === 0 && routesDetails.length === 0,
            }
          )}
        >
          {duplicateRoute.length === 0 && routesDetails.length === 0 && (
            <Icons name="NoRoute" className="w-96 h-96" />
          )}
          {duplicateRoute &&
            duplicateRoute.map((route, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Line for vertical connection */}
                {index < duplicateRoute.length && (
                  <div
                    className={clsx(
                      "absolute top-8 left-4 h-full w-[2px] bg-gradient-04 z-0",
                      {
                        hidden: index === duplicateRoute.length - 1,
                      }
                    )}
                  ></div>
                )}

                {/* Numbered Circle */}
                <div className="relative z-10 flex items-center justify-center w-9 h-8 rounded-full bg-gradient-04 text-white font-bold">
                  {index + 1}
                </div>

                {/* Card Content */}
                <div className="w-full h-fit flex flex-col gap-2 shadow-card p-4 rounded-xl bg-white">
                  <div className="flex justify-between">
                    <p className="title3">
                      {`${route.origin.province}/${route.origin.district}`}{" "}
                      <span>
                        {">"}{" "}
                        <span>{`${route.destination.province}/${route.destination.district}`}</span>
                      </span>
                    </p>

                    <div className="flex gap-4">
                      <Icons
                        name="Pen"
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => handleClickEditImportRoute(route)}
                      />
                      <Icons
                        name="Bin"
                        className="w-6 h-6 cursor-pointer text-urgent-fail-02"
                        onClick={() => handleClickDeleteImportRoute(index)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="border border-neutral-04 rounded-lg py-1 px-4 w-fit">
                      <p className="body3">{`${route.distance.value} ${route.distance.unit}`}</p>
                    </div>

                    <div className="border border-neutral-04 rounded-lg py-1 px-4 w-fit">
                      <p className="body3">{`${route.offerPrice} ${route.unit}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {routesDetails &&
            routes &&
            unitPriceRoutes &&
            routesDetails.map((routeDetail, index) => {
              const route = routes.find(
                (route) =>
                  route.master_route.id === routeDetail.organization_route_id
              );

              const unit = unitPriceRoutes.find(
                (u) => u.id === Number(routeDetail.unit_price_route_id)
              )?.name_th;

              if (!route) return null;

              return (
                <div key={index} className="relative flex items-start gap-4">
                  {/* เส้นแนวตั้ง */}
                  {index < routesDetails.length - 1 && (
                    <div className="absolute top-8 left-4 h-full w-[2px] bg-gradient-04 z-0"></div>
                  )}

                  {/* วงกลมลำดับ */}
                  <div className="relative z-10 flex items-center justify-center w-9 h-8 rounded-full bg-gradient-04 text-white font-bold">
                    {index + 1}
                  </div>

                  {/* เนื้อหาการ์ด */}
                  <div className="w-full h-fit flex flex-col gap-2 shadow-card p-4 rounded-xl bg-white">
                    <div className="flex justify-between">
                      <p className="title3">
                        {`${route.master_route.origin_province.name_th}/${route.master_route.origin_district.name_th}`}{" "}
                        <span>
                          {">"}{" "}
                          <span>{`${route.master_route.destination_province.name_th}/${route.master_route.destination_district.name_th}`}</span>
                        </span>
                      </p>

                      <div className="flex gap-4">
                        <Icons
                          name="Pen"
                          className="w-6 h-6 cursor-pointer"
                          /* onClick={() => handleClickEditCustomRoute(route)} */
                        />
                        <Icons
                          name="Bin"
                          className="w-6 h-6 cursor-pointer text-urgent-fail-02"
                          onClick={() => handleDeleteCustomRoute(index)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="border border-neutral-04 rounded-lg py-1 px-4 w-fit">
                        <p className="body3">{`${route.distance_value} ${route.distance_unit}`}</p>
                      </div>

                      <div className="border border-neutral-04 rounded-lg py-1 px-4 w-fit">
                        <p className="body3">{`${routeDetail.base_price} ${unit}`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Edit Import Route By One */}
      <Dialog
        open={isOpenEditImportRouteModal}
        onOpenChange={setIsOpenEditImportRouteModal}
      >
        <DialogContent className="text-secondary-indigo-main" removeCloseBtn>
          <DialogHeader>
            <DialogTitle>
              <p className="text-xl font-bold">ข้อมูลลูกค้า / กำหนดเส้นทาง</p>
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <EditImportRouteModal
            setIsOpenEditImportRouteModal={setIsOpenEditImportRouteModal}
            editImportRouteData={editImportRouteData}
            handleUpdateImportRoute={handleUpdateImportRoute}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Custom Route */}
      <Dialog
        open={isOpenEditCustomRouteModal}
        onOpenChange={setIsOpenEditCustomRouteModal}
      >
        <DialogContent className="text-secondary-indigo-main" removeCloseBtn>
          <DialogHeader>
            <DialogTitle>
              <p className="text-xl font-bold">ข้อมูลลูกค้า / กำหนดเส้นทาง</p>
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <EditCustomRouteModal
            setIsOpenEditCustomRouteModal={setIsOpenEditCustomRouteModal}
            editCustomRouteData={editCustomRouteData}
            handleUpdateCustomRoute={handleUpdateCustomRoute}
          />
        </DialogContent>
      </Dialog>

      {/* Create Custom Route Modal */}
      <Dialog
        open={isOpenCustomRouteModal}
        onOpenChange={setIsOpenCustomRouteModal}
      >
        <DialogContent className="text-secondary-indigo-main" removeCloseBtn>
          <DialogHeader>
            <DialogTitle>
              <p className="text-xl font-bold">ข้อมูลลูกค้า / กำหนดเส้นทาง</p>
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <DetailModalCustomRoute
            routesDetails={routesDetails}
            setIsOpenCustomRouteModal={setIsOpenCustomRouteModal}
            handleAddCustomRoute={handleAddCustomRoute}
          />
        </DialogContent>
      </Dialog>

      {/* CSV Modal */}
      <Dialog open={isOpenCsvTableModal} onOpenChange={setIsOpenCsvTableModal}>
        <DialogContent
          className="text-secondary-indigo-main px-0"
          outlineCloseButton
        >
          <DialogHeader>
            <DialogTitle>
              <p className="text-xl font-medium px-5">รายการนำเข้าข้อมูล</p>
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <DetailCsvModal
            csvData={csvData}
            handleClickCheckDuplicateRouteFactory={
              handleClickCheckDuplicateRouteFactory
            }
            transformedData={transformedData}
            setTransformedData={setTransformedData}
          />
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <ModalNotification
        open={isModalRouteNotFoundOpen}
        setOpen={setIsModalRouteNotFoundOpen}
        title={
          routeNotFound.length > 0
            ? "ไม่พบเส้นทางในระบบ"
            : "ยืนยันการเพิ่มเส้นทาง"
        }
        description={
          routeNotFound.length > 0
            ? `กรุณาเพิ่มเส้นทาง ${routeNotFound.length} รายการ ดังนี้`
            : "กรุณายืนยันการเพิ่มเส้นทางอีกครั้ง"
        }
        routeData={routeNotFound.length > 0 ? routeNotFound : undefined}
        buttonText="ยืนยันการเพิ่ม"
        isConfirmOnly={false}
        icon={<Icons name="SendBulk" className="w-16 h-16 text-success-02" />}
        onConfirm={() => {
          setIsModalRouteNotFoundOpen(false);
        }}
        onCancel={handleClickCanceledRoutes}
      />
    </>
  );
}
