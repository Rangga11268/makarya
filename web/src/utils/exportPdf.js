import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exports an HTML element as an A4 Landscape PDF.
 * Exports an HTML certificate element as an ultra-crisp A4 Landscape PDF.
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} filename - Output file name
 */
export async function exportElementToPdf(
  element,
  filename = "Sertifikat-Makarya.pdf",
) {
  if (!element) {
    throw new Error("Element tidak ditemukan untuk ekspor PDF");
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // High resolution for crystal clear print & vectors
      scale: 3, // Ultra-high resolution for razor sharp text & vectors
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      logging: false,
      imageTimeout: 15000,
    });

    const imgData = canvas.toDataURL("image/png");

    // Standard A4 Landscape: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 297 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210 mm

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasRatio = canvasWidth / canvasHeight;
    const pageRatio = pdfWidth / pdfHeight;

    let printWidth = pdfWidth;
    let printHeight = pdfHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > pageRatio) {
      printWidth = pdfWidth;
      printHeight = pdfWidth / canvasRatio;
      offsetY = (pdfHeight - printHeight) / 2;
    } else {
      printHeight = pdfHeight;
      printWidth = pdfHeight * canvasRatio;
      offsetX = (pdfWidth - printWidth) / 2;
    }

    pdf.addImage(
      imgData,
      "PNG",
      offsetX,
      offsetY,
      printWidth,
      printHeight,
      undefined,
      "FAST",
    );
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("Gagal mengekspor PDF via html2canvas:", error);
    // Fallback: window.print()
    window.print();
    return false;
  }
}
