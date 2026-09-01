import NewClientForm from "./client-form";

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--gray-900)]">Add Client</h1>
      <p className="mt-1 text-sm text-[var(--gray-500)]">Stage 1 of the process — creates their record and a dashboard login in one step.</p>
      <NewClientForm />
    </div>
  );
}
