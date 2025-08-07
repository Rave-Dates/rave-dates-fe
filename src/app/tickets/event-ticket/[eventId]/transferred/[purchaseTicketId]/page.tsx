import TicketTransferredForm from "@/components/containers/tickets/TicketTransferredForm";

export default async function Page({
  params,
}: {
  params: Promise<{ purchaseTicketId: string }>
}) {
  const { purchaseTicketId } = await params
  const purchaseTicketIdNumber = Number(purchaseTicketId);
  return <TicketTransferredForm purchaseTicketId={purchaseTicketIdNumber} />
}