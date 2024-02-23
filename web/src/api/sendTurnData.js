import axios from 'axios';
import { endpoints } from '../shared/constants';

export const sendTurnData = async (uid, XPlayer, row, col) => {
  try {
    await axios({
      method: 'post',
      url: endpoints.turn,
      data: {
        uid,
        XPlayer,
        row,
        col,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
  }
};
