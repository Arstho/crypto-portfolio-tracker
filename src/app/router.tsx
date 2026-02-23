import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { CoinDetailsPage } from '../pages/CoinDetails/CoinDetailsPage';
import { HomePage } from '../pages/Home/HomePage';

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
        element: <div>Portfolio Page (Coming Soon)</div>,
      },
    ],
  },
]);
