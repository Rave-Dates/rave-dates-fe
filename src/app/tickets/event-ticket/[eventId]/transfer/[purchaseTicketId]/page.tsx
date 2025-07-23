import TicketTransferForm from "@/components/containers/tickets/TicketTransferForm";

export default async function Page({
  params,
}: {
  params: Promise<{ purchaseTicketId: string }>
}) {
  const { purchaseTicketId } = await params
  const purchaseTicketIdNumber = Number(purchaseTicketId);
  return <TicketTransferForm purchaseTicketId={purchaseTicketIdNumber} />
}