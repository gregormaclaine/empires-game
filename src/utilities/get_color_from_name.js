import colors from '../assets/colors.json';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Should take in a username and return a colour that can be used in CSS.
 * A username should always point to the same colour for consistency.
 */
export default function main(username, id) {
  // Get unique array of characters from combination of username & socket id
  const unique_id = username + id;
  const characters = unique_id.split('');

  // Caculated a number based on the characters in the unique string and their placement
  const code = characters.reduce((acc, cur, i) => {
    const addition = Math.max(alphabet.indexOf(cur) + 1, 0) * i
    return acc + addition;
  }, 0);

  // Find a viable colour code depending on this caculation
  return colors[code % colors.length];
}
