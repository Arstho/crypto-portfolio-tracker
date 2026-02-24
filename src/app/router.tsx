import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { CoinDetailsPage } from '../pages/CoinDetails/CoinDetailsPage';
import { HomePage } from '../pages/Home/HomePage';
import { PortfolioPage } from '../pages/Portfolio/PortfolioPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/coin/:id',
        element: <CoinDetailsPage />,
      },
      {
        path: '/portfolio',
        element: <PortfolioPage />,
      },
    ],
  },
]);
