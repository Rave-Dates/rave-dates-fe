import EditUser from "@/components/roles/admin/EditUser"

export default async function Page({
  params,
}: {
  params: Promise<{ userId: number }>
}) {
  const { userId } = await params
  const userIdNumber = Number(userId);
  return <EditUser userId={userIdNumber} />
}