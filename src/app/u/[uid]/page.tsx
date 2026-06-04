import ProfileView from "@/components/profile/ProfileView"

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params

  return <ProfileView profileUserId={uid} />
}
