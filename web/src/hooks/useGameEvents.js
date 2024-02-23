import { endpoints, eventTypes } from '../shared/constants';

export const useGameEvents = (uid) => {
  const eventSource = new EventSource(`${endpoints.events}/${uid}`);

  eventSource.addEventListener(eventTypes.start, (event) => {
    console.log(event);
  });

  eventSource.addEventListener();

  const close = () => {
    eventSource.close();
  };

  return { eventSource, close };
};
