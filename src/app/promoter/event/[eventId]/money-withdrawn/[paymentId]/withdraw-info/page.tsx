import WithdrawInfo from "@/components/roles/organizer/organizer-event/WithdrawInfo";

export default async function Page({ params }: { params: Promise<{ paymentId: number }>}) {
  const { paymentId } = await params
  const paymentIdNumber = Number(paymentId);

  return (
    <WithdrawInfo paymentId={paymentIdNumber} />
  );
}
