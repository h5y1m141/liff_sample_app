import FirebaseUser from './FirebaseUser'
import LineUser from './LineUser'

async function Page() {
  return (
    <>
      <h1>ダッシュボード</h1>
      <LineUser />
      <FirebaseUser />
    </>
  )
}
export default Page
