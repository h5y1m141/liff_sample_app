import FirebaseUser from './FirebaseUser'
import LineUser from './LineUser'

async function Page() {
  return (
    <>
      <h1>ダッシュボード</h1>
      <LineUser />
      <FirebaseUser />
      <hr />
      <h3>管理機能</h3>
      <ul>
        <li>
          <a href='/operation_for_reservations'>予約確認</a>
        </li>
      </ul>
    </>
  )
}
export default Page
