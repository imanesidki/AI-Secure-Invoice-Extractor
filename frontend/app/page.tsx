"use client";

import { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import InvoiceDetails from "@/components/InvoiceDetails";

interface InvoiceData {
  invoiceClient: {
    name: string;
    ICE: number;
    email: string;
    invoiceAddress: string;
    shippingAddress: string;
  };
  invoiceAt: string;
  invoiceDueAt: string;
  amount: number;
  invoiceItems: Array<{
    unitPrice: number;
    quantity: number;
    tva: number;
    discount: number;
    netAmount: number;
    amount: number;
    name: string;
  }>;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError("Please upload a valid image (JPEG, PNG) or PDF file");
      setSelectedFile(null);
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "application/pdf"
    ) {
      setError("Please upload a valid image (JPEG, PNG) or PDF file");
      setSelectedFile(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedFile(file);

    getInvoiceDataAPI(file).then((data) => {
      if (data.status) {
        setInvoiceData(data.data);
        setLoading(false);
      } else {
        setError("Oups! Failed to extract invoice data due to: " + data.message);
        setSelectedFile(null);
        setLoading(false);
      }
    });
  };

  const getInvoiceDataAPI = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8000/extract_invoice", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa("user:pass"),
        },
        body: formData,
      });

      if (!response.ok) {
        return {
          status: false,
          message: response,
        };
      }
      const data = await response.json();
      return {
        status: true,
        data: data,
      };
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-pink-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
            InvoiceAI
          </h1>
          <p className="text-gray-600 dark:text-pink-200">
            Upload your invoice or receipt to extract information automatically
          </p>
        </div>

        <Card className="p-6 mb-8 border-pink-100 dark:border-pink-800 shadow-lg shadow-pink-100/20 dark:shadow-pink-900/30">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-pink-200 dark:border-pink-700 rounded-lg cursor-pointer bg-pink-50/50 dark:bg-pink-950/30 hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-4 text-pink-400 dark:text-pink-500" />
                  <p className="mb-2 text-sm text-pink-600 dark:text-pink-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-pink-500 dark:text-pink-500">
                    PNG, JPG or PDF (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </label>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </Alert>
              )}

              {selectedFile && (
                <div className="mt-4 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border border-pink-100 dark:border-pink-800">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-pink-500 dark:text-pink-400" />
                    <span className="text-sm text-pink-700 dark:text-pink-300">
                      {selectedFile.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 dark:border-pink-400"></div>
          </div>
        )}

        {invoiceData && <InvoiceDetails data={invoiceData} />}
      </div>
    </div>
  );
}
