import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { getOrganizationAdmins } from "../../services/organization.service";

const router = Router();

router.get("/:organizationId", authMiddleware, async (req, res) => {
  try {
    const { organizationId } = req.params;
    if (!organizationId) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Company id is required",
          th: "กรุณาระบุรหัสบริษัท",
        },
      });
    }

    const admins = await getOrganizationAdmins(organizationId);

    res.json({
      statusCode: 200,
      message: {
        en: "Fetched admin users successfully",
        th: "ดึงข้อมูลผู้ดูแลสำเร็จ",
      },
      data: admins,
    });
  } catch (error) {
    console.error("List company admins error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load admin users",
        th: "ไม่สามารถดึงข้อมูลผู้ดูแลได้",
      },
    });
  }
});

export default router;

