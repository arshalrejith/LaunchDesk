"use client";

import { deleteClientAction } from "./actions";

type Props = {
  clientId: string;
  clientName: string;
};

export default function DeleteClientButton({
  clientId,
  clientName,
}: Props) {
  return (
    <form
      action={deleteClientAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete ${clientName} permanently?\n\nThis will delete the client, website, products, settings, enquiries, and other associated data. This cannot be undone.`
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={clientId} />

      <button
        type="submit"
        className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}