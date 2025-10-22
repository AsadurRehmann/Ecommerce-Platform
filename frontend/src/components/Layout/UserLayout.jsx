import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm flex-shrink-0">
        <Header />
      </header>

      {/* Main Content - This is key for preventing scroll issues */}
      <main className="flex-1 w-full overflow-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0">
        <Footer />
      </footer>
    </div>
  )
}

export default UserLayout