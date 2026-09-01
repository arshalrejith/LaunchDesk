import { createCategoryAction } from "../actions";
import CategoryForm from "../category-form";

export default function NewCategoryPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Add Category</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">Give it a name customers will recognise.</p>
      <CategoryForm action={createCategoryAction} submitLabel="Save Category" />
    </div>
  );
}
