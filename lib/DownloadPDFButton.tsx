'use client';

import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import jsPDF from 'jspdf';

interface DownloadPDFButtonProps {
  invoice: any; // bisa diketik sesuai struktur invoice
}

export default function DownloadPDFButton({ invoice }: DownloadPDFButtonProps) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Invoice ID: ${invoice.id}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Customer: ${invoice.customerName || invoice.name}`, 10, 30);
    doc.text(`Email: ${invoice.customerEmail || invoice.email}`, 10, 37);
    doc.text(`Phone: ${invoice.phone}`, 10, 44);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 10, 51);
    doc.text(`Total: ${invoice.total.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}`, 10, 58);

    const itemList = typeof invoice.items === "string"
      ? invoice.items.split(",").map((i: string) => i.trim())
      : [];

    itemList.forEach((item: string, index: number) => {
      doc.text(`- ${item}`, 10, 70 + index * 7);
    });

    doc.save(`Invoice-${invoice.id}.pdf`);
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleDownloadPDF}>
      <Receipt className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  );
}