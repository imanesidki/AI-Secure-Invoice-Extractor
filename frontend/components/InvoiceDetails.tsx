"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface InvoiceItem {
  unitPrice: number;
  quantity: number;
  tva: number;
  discount: number;
  netAmount: number;
  amount: number;
  name: string;
}

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
  invoiceItems: InvoiceItem[];
}

interface InvoiceDetailsProps {
  data: InvoiceData;
}

export default function InvoiceDetails({ data }: InvoiceDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="border-pink-100 dark:border-pink-800 shadow-lg shadow-pink-100/20 dark:shadow-pink-900/30">
        <CardHeader className="border-b border-pink-100 dark:border-pink-800">
          <CardTitle className="text-pink-600 dark:text-pink-400">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-pink-700 dark:text-pink-300">Company Details</h3>
              <p className="text-sm text-gray-600 dark:text-pink-200">{data.invoiceClient.name}</p>
              <p className="text-sm text-gray-600 dark:text-pink-200">ICE: {data.invoiceClient.ICE}</p>
              <p className="text-sm text-gray-600 dark:text-pink-200">{data.invoiceClient.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-pink-700 dark:text-pink-300">Addresses</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Invoice Address:</p>
                  <p className="text-sm text-gray-600 dark:text-pink-200">{data.invoiceClient.invoiceAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Shipping Address:</p>
                  <p className="text-sm text-gray-600 dark:text-pink-200">{data.invoiceClient.shippingAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-pink-100 dark:border-pink-800 shadow-lg shadow-pink-100/20 dark:shadow-pink-900/30">
        <CardHeader className="border-b border-pink-100 dark:border-pink-800">
          <CardTitle className="text-pink-600 dark:text-pink-400">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Invoice Date</p>
              <p className="text-sm text-gray-600 dark:text-pink-200">
                {format(new Date(data.invoiceAt), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Due Date</p>
              <p className="text-sm text-gray-600 dark:text-pink-200">
                {format(new Date(data.invoiceDueAt), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Total Amount</p>
              <p className="text-lg font-semibold text-pink-700 dark:text-pink-300">
                ${data.amount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-pink-100 dark:border-pink-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-pink-50 dark:bg-pink-950/30 hover:bg-pink-100/50 dark:hover:bg-pink-900/30">
                  <TableHead className="text-pink-600 dark:text-pink-400">Item</TableHead>
                  <TableHead className="text-right text-pink-600 dark:text-pink-400">Quantity</TableHead>
                  <TableHead className="text-right text-pink-600 dark:text-pink-400">Unit Price</TableHead>
                  <TableHead className="text-right text-pink-600 dark:text-pink-400">TVA</TableHead>
                  <TableHead className="text-right text-pink-600 dark:text-pink-400">Discount</TableHead>
                  <TableHead className="text-right text-pink-600 dark:text-pink-400">Net Amount</TableHead>
                  <TableHead className="text-right text-pink-600 dark:text-pink-400">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.invoiceItems.map((item, index) => (
                  <TableRow key={index} className="hover:bg-pink-50/50 dark:hover:bg-pink-950/30">
                    <TableCell className="text-gray-600 dark:text-pink-200">{item.name}</TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-pink-200">{item.quantity}</TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-pink-200">
                      ${item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-pink-200">{item.tva}%</TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-pink-200">
                      ${item.discount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-pink-200">
                      ${item.netAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-pink-600 dark:text-pink-400">
                      ${item.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}