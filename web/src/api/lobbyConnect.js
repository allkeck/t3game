import { settings } from '../shared/constants';

export const lobbyConnect = (uid) => {
  const eventSource = new EventSource(`${settings.events}/${uid}`);

  eventSource.addEventListener('message', (event) => {
    console.log(event);
  });

  return eventSource;
};
