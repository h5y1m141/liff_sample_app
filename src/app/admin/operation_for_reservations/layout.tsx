export default function RestaurantsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
    </>
  )
}
