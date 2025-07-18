import TicketTransferForm from "@/components/containers/tickets/TicketTransferForm";

export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const { ticketId } = await params
  const transferIdNumber = Number(ticketId);
  return <TicketTransferForm ticketId={transferIdNumber} />
}