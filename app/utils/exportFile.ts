import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const handleExportImage = async (
  elementId: string,
  imageName: string
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/jpg");
    const link = Object.assign(document.createElement("a"), {
      href: data,
      download: imageName,
    });

    link.click();
  } catch (error) {
    console.error("Error downloading image", error);
  }
};

export const handleExportPdf = async (elementId: string, pdfName: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    const canvas = await html2canvas(element);

    const contentWidth = canvas.width;
    const contentHeight = canvas.height;

    const contentWidthInPoints = contentWidth * 0.75;
    const contentHeightInPoints = contentHeight * 0.75;

    const pdf = new jsPDF({
      orientation: contentWidth > contentHeight ? "landscape" : "portrait",
      unit: "pt",
      format: [contentWidthInPoints, contentHeightInPoints],
    });

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      contentWidthInPoints,
      contentHeightInPoints
    );

    pdf.save(pdfName);
  } catch (error) {
    console.error("Error generating PDF", error);
  }
};
