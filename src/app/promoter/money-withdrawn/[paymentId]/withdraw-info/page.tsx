import WithdrawPromoterInfo from "@/components/roles/admin/promoter/WithdrawPromoterInfo";

export default async function Page({ params }: { params: Promise<{ paymentId: number }>}) {
  const { paymentId } = await params
  const paymentIdNumber = Number(paymentId);

  return (
    <WithdrawPromoterInfo paymentId={paymentIdNumber} />
  );
}
