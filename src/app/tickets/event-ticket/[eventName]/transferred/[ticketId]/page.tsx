import TicketTransferredForm from "@/components/containers/tickets/TicketTransferredForm";

export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const { ticketId } = await params
  const transferIdNumber = Number(ticketId);
  return <TicketTransferredForm ticketId={transferIdNumber} />
}