import axios from 'axios';
import { settings } from '../shared/constants';

export const createGame = async () => {
  try {
    const data = await axios(settings.newGame);

    return data;
  } catch (error) {
    console.error(error);
  }
};
