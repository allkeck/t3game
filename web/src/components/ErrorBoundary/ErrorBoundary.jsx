import { useRouteError } from 'react-router-dom';

export const ErrorBoundary = () => {
  let error = useRouteError();
  console.error(error);
  return <div>Dang!</div>;
};
