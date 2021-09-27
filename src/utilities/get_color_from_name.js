import colors from '../assets/colors.json';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Should take in a username and return a colour that can be used in CSS.
 * A username should always point to the same colour for consistency.
 */
export default function main(username, id) {
  // Get unique(ish) number for username
  const code = (username + id).split('').reduce((acc, cur, i) => acc + Math.max(alphabet.indexOf(cur), 0) * i, 0);
  return colors[code % colors.length];
}
