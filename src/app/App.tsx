import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Crypto Portfolio Tracker
            </h1>
            <nav className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Market
              </a>
              <a
                href="/portfolio"
                className="text-gray-600 hover:text-gray-900"
              >
                Portfolio
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
