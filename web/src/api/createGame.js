import axios from 'axios';
import { endpoints } from '../shared/constants';

export const createGame = async () => {
  try {
    const data = await axios(endpoints.newGame);

    return data;
  } catch (error) {
    console.error(error);
  }
};
