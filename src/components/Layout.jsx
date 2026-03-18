import Navbar from './Navbar'
import BottomTabs from './BottomTabs'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-0 md:pt-20 pb-20 md:pb-0 min-h-screen">
        <div className="page-enter">
          {children}
        </div>
      </main>
      <BottomTabs />
    </>
  )
}
