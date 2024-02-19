import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Start } from './pages/Start/Start.jsx';
import { Lobby } from './pages/Lobby/Lobby.jsx';

import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Start />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/game/:uid',
    element: <Lobby />,
    errorElement: <ErrorBoundary />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
