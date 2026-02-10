'use client';

import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import { Receipt } from "lucide-react";

interface InvoiceItem {
  product?: {
    name?: string;
    price?: number;
  };
  quantity?: number;
}

interface Invoice {
  id: string;
  customerName?: string;
  customerEmail?: string;
  name?: string;
  email?: string;
  phone?: string;
  items: string | InvoiceItem[];
  total: number;
  status?: string;
  createdAt: string;
}

interface DownloadPDFButtonProps {
  invoice: Invoice;
}

// Helper sederhana untuk format harga dan tanggal
const formatPrice = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function DownloadPDFButton({ invoice }: DownloadPDFButtonProps) {
  const handleDownloadPDF = async () => {
    // Dynamic import jspdf-autotable untuk menghindari error Next.js SSR
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();
    const margin = 20;
    let yPosition = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INVOICE", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Invoice ID: ${invoice.id}`, 110, yPosition);
    doc.text(`Date: ${formatDate(invoice.createdAt)}`, 164, yPosition + 6);

    yPosition += 15;

    // Customer Info
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", margin, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 6;
    doc.text(`Name: ${invoice.customerName || invoice.name}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Email: ${invoice.customerEmail || invoice.email}`, margin, yPosition);
    yPosition += 6;
    if (invoice.phone) {
      doc.text(`Phone: ${invoice.phone}`, margin, yPosition);
      yPosition += 6;
    }

    yPosition += 10;

    // Parse items untuk tabel
    let tableData: (string | number)[][] = [];

    if (typeof invoice.items === "string") {
      const itemsArray: string[] = invoice.items.split(", ");
      tableData = itemsArray.map((itemStr: string, index: number) => {
        const parts = itemStr.split(" x ");
        const name = parts[0].trim();
        const qty = parts[1] ? parseInt(parts[1].trim(), 10) : 1;
        return [index + 1, name, qty, "-", "-"];
      });
    } else if (Array.isArray(invoice.items)) {
      tableData = invoice.items.map((item: InvoiceItem, index: number) => [
        index + 1,
        item.product?.name || "Unknown Product",
        item.quantity || 1,
        item.product?.price ? formatPrice(item.product.price) : "-",
        item.product?.price
          ? formatPrice(item.product.price * (item.quantity || 1))
          : "-",
      ]);
    }

    // Generate tabel
    autoTable(doc, {
      startY: yPosition,
      margin: { left: margin },
      head: [["#", "Item", "Qty", "Unit Price", "Total"]],
      body: tableData,
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [69, 123, 157], textColor: 255 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Total & Payment Info
    doc.setFont("helvetica", "bold");
    doc.text("Total:", margin, finalY);
    doc.text(formatPrice(invoice.total), 60, finalY);

    doc.setFont("helvetica", "normal");
    doc.text("Payment Method: Bank Transfer", margin, finalY + 8);
    doc.text("Bank: BCA - 1234567890 (Tech Store)", margin, finalY + 16);
    doc.text(`Payment Status: ${invoice.status || "Completed"}`, margin, finalY + 24);

    doc.save(`invoice_${invoice.id}.pdf`);
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleDownloadPDF}>
        <Receipt className="h-4 w-4 mr-2" />
        Download PDF
    </Button>

  );
}
