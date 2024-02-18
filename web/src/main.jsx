import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from './App.jsx';
import { Lobby } from './pages/Lobby/Lobby.jsx';

import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
