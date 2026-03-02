import { Link, Outlet } from 'react-router-dom';
import { useTheme } from './shared/context/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-200"
      data-theme={theme}
    >
      <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              Crypto Portfolio Tracker
            </Link>
            <nav className="space-x-4">
              <Link
                to="/"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Market
              </Link>
              <Link
                to="/portfolio"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Portfolio
              </Link>
              <Link
                to="/tools"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Tools
              </Link>
              <Link
                to="/settings"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                ⚙️ Settings
              </Link>
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
