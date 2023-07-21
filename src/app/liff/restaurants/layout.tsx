export default function RestaurantsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <h1>レストラン一覧</h1>
      <section>{children}</section>
    </>
  )
}
