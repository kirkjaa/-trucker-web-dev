import { Request, Router } from "express";

import { authMiddleware } from "../middleware/auth";
import {
  createFreelanceDriver,
  createInternalDriver,
  deleteDriver,
  getDriverDetail,
  listFreelanceDrivers,
  listInternalDrivers,
  updateFreelanceDriver,
  updateInternalDriver,
} from "../services/driver.service";
import { upload } from "../utils/upload";

import {
  extractUserPayload,
  getFilesDictionary,
  getUploadedFilePath,
} from "./utils/userPayload";

const router = Router();
const driverUploads = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "image_id_card", maxCount: 1 },
  { name: "image_truck_registration", maxCount: 1 },
  { name: "image_driving_license_card", maxCount: 1 },
]);

function extractDriverDocuments(req: Request) {
  const files = getFilesDictionary(req);
  return {
    idCardPath: getUploadedFilePath(files, "image_id_card"),
    truckRegistrationPath: getUploadedFilePath(
      files,
      "image_truck_registration"
    ),
    drivingLicensePath: getUploadedFilePath(
      files,
      "image_driving_license_card"
    ),
  };
}

router.get("/internal", authMiddleware, async (req, res) => {
  try {
    const { page, limit, organization_id, status, search, sort, order } =
      req.query;
    const result = await listInternalDrivers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      organizationId: organization_id ? String(organization_id) : undefined,
      status: status ? String(status) : undefined,
      search: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      order: order ? String(order) : undefined,
    });

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("List internal drivers error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load drivers",
        th: "ไม่สามารถดึงข้อมูลพนักงานขับรถได้",
      },
    });
  }
});

router.post("/internal", authMiddleware, driverUploads, async (req, res) => {
  try {
    const payload = extractUserPayload(req);
    const driverId = await createInternalDriver(payload);

    res.status(201).json({
      statusCode: 201,
      message: {
        en: "Driver created successfully",
        th: "สร้างพนักงานขับรถภายในสำเร็จ",
      },
      data: { id: driverId },
    });
  } catch (error) {
    console.error("Create internal driver error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to create driver",
        th: "สร้างพนักงานขับรถไม่สำเร็จ",
      },
    });
  }
});

router.patch("/internal", authMiddleware, driverUploads, async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Driver id is required",
          th: "กรุณาระบุรหัสพนักงานขับรถ",
        },
      });
    }

    const payload = extractUserPayload(req, { requireFields: false });
    const updatedId = await updateInternalDriver(id, payload);

    if (!updatedId) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Driver not found",
          th: "ไม่พบพนักงานขับรถ",
        },
      });
    }

    const detail = await getDriverDetail(updatedId);

    res.json({
      statusCode: 200,
      message: {
        en: "Driver updated successfully",
        th: "แก้ไขข้อมูลพนักงานขับรถสำเร็จ",
      },
      data: detail ?? null,
    });
  } catch (error) {
    console.error("Update internal driver error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to update driver",
        th: "แก้ไขข้อมูลพนักงานขับรถไม่สำเร็จ",
      },
    });
  }
});

router.delete("/internal", authMiddleware, async (req, res) => {
  router.get("/freelance", authMiddleware, async (req, res) => {
    try {
      const { page, limit, status, search, sort, order } = req.query;
      const result = await listFreelanceDrivers({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        status: status ? String(status) : undefined,
        search: search ? String(search) : undefined,
        sort: sort ? String(sort) : undefined,
        order: order ? String(order) : undefined,
      });

      res.json({
        statusCode: 200,
        message: result.message,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error("List freelance drivers error:", error);
      res.status(500).json({
        statusCode: 500,
        message: {
          en: "Failed to load drivers",
          th: "ไม่สามารถดึงข้อมูลพนักงานขับรถได้",
        },
      });
    }
  });

  router.post("/freelance", authMiddleware, driverUploads, async (req, res) => {
    try {
      const payload = extractUserPayload(req, {
        requireOrganization: false,
      });
      const documents = extractDriverDocuments(req);
      const driverId = await createFreelanceDriver(payload, documents);

      res.status(201).json({
        statusCode: 201,
        message: {
          en: "Freelance driver created successfully",
          th: "สร้างพนักงานขับรถอิสระสำเร็จ",
        },
        data: { id: driverId },
      });
    } catch (error) {
      console.error("Create freelance driver error:", error);
      res.status(400).json({
        statusCode: 400,
        message: {
          en: (error as Error).message || "Failed to create driver",
          th: "สร้างพนักงานขับรถไม่สำเร็จ",
        },
      });
    }
  });

  router.patch(
    "/freelance",
    authMiddleware,
    driverUploads,
    async (req, res) => {
      try {
        const id = req.query.id as string;
        if (!id) {
          return res.status(400).json({
            statusCode: 400,
            message: {
              en: "Driver id is required",
              th: "กรุณาระบุรหัสพนักงานขับรถ",
            },
          });
        }

        const payload = extractUserPayload(req, {
          requireOrganization: false,
          requireFields: false,
        });
        const documents = extractDriverDocuments(req);
        const driverStatus = req.body.driver_status
          ? String(req.body.driver_status)
          : undefined;
        const rejectedReason =
          req.body.rejected_reason !== undefined
            ? String(req.body.rejected_reason)
            : undefined;

        const updatedId = await updateFreelanceDriver(id, {
          payload,
          documents,
          driverStatus,
          rejectedReason,
        });

        if (!updatedId) {
          return res.status(404).json({
            statusCode: 404,
            message: {
              en: "Driver not found",
              th: "ไม่พบพนักงานขับรถ",
            },
          });
        }

        const detail = await getDriverDetail(updatedId);

        res.json({
          statusCode: 200,
          message: {
            en: "Driver updated successfully",
            th: "แก้ไขข้อมูลพนักงานขับรถสำเร็จ",
          },
          data: detail ?? null,
        });
      } catch (error) {
        console.error("Update freelance driver error:", error);
        res.status(400).json({
          statusCode: 400,
          message: {
            en: (error as Error).message || "Failed to update driver",
            th: "แก้ไขข้อมูลพนักงานขับรถไม่สำเร็จ",
          },
        });
      }
    }
  );

  router.delete("/freelance", authMiddleware, async (req, res) => {
    try {
      const id = req.query.id as string;
      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          message: {
            en: "Driver id is required",
            th: "กรุณาระบุรหัสพนักงานขับรถ",
          },
        });
      }

      const success = await deleteDriver(id);
      if (!success) {
        return res.status(404).json({
          statusCode: 404,
          message: {
            en: "Driver not found",
            th: "ไม่พบพนักงานขับรถ",
          },
        });
      }

      res.json({
        statusCode: 200,
        message: {
          en: "Driver deleted successfully",
          th: "ลบพนักงานขับรถสำเร็จ",
        },
      });
    } catch (error) {
      console.error("Delete freelance driver error:", error);
      res.status(500).json({
        statusCode: 500,
        message: {
          en: "Failed to delete driver",
          th: "ลบพนักงานขับรถไม่สำเร็จ",
        },
      });
    }
  });
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Driver id is required",
          th: "กรุณาระบุรหัสพนักงานขับรถ",
        },
      });
    }

    const success = await deleteDriver(id);
    if (!success) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Driver not found",
          th: "ไม่พบพนักงานขับรถ",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: {
        en: "Driver deleted successfully",
        th: "ลบพนักงานขับรถสำเร็จ",
      },
    });
  } catch (error) {
    console.error("Delete internal driver error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to delete driver",
        th: "ลบพนักงานขับรถไม่สำเร็จ",
      },
    });
  }
});

router.get("/byId", authMiddleware, async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Driver id is required",
          th: "กรุณาระบุรหัสพนักงานขับรถ",
        },
      });
    }

    const driver = await getDriverDetail(id);
    if (!driver) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Driver not found",
          th: "ไม่พบพนักงานขับรถ",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: {
        en: "Fetched driver successfully",
        th: "ดึงข้อมูลพนักงานขับรถสำเร็จ",
      },
      data: driver,
    });
  } catch (error) {
    console.error("Get driver detail error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load driver detail",
        th: "ไม่สามารถดึงรายละเอียดพนักงานขับรถได้",
      },
    });
  }
});

export default router;
