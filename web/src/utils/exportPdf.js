import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exports an HTML element as an A4 Landscape PDF.
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} filename - Output file name
 */
export async function exportElementToPdf(element, filename = "Sertifikat-Makarya.pdf") {
  if (!element) {
    throw new Error("Element tidak ditemukan untuk ekspor PDF");
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // High resolution for crystal clear print & vectors
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      logging: false,
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

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("Gagal mengekspor PDF via html2canvas:", error);
    // Fallback: window.print()
    window.print();
    return false;
  }
}
