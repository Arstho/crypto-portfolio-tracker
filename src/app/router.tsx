import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { CoinDetailsPage } from '../pages/CoinDetails/CoinDetailsPage';
import { HomePage } from '../pages/Home/HomePage';
import { PortfolioPage } from '../pages/Portfolio/PortfolioPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { ToolsPage } from '../pages/Tools/ToolsPage';
import { PageTransition } from '../shared/components/PageTransition/PageTransition';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <HomePage />
          </PageTransition>
        ),
      },
      {
        path: '/coin/:id',
        element: (
          <PageTransition>
            <CoinDetailsPage />
          </PageTransition>
        ),
      },
      {
        path: '/portfolio',
        element: (
          <PageTransition>
            <PortfolioPage />
          </PageTransition>
        ),
      },
      {
        path: '/tools',
        element: (
          <PageTransition>
            <ToolsPage />
          </PageTransition>
        ),
      },
      {
        path: '/settings',
        element: (
          <PageTransition>
            <SettingsPage />
          </PageTransition>
        ),
      },
    ],
  },
]);
