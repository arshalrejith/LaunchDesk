import Link from "next/link";
import BulkForm from "./bulk-form";

export default function BulkProductsPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Upload Products in Bulk</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">Add many products at once from a spreadsheet, instead of one at a time.</p>
      <BulkForm />
      <Link href="/dashboard/products" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">← Back to Products</Link>
    </div>
  );
}
