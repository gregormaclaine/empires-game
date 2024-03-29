require("dotenv").config();

export const THEME = {
  blue: "#01295f",
  lightblue: "#437f97",
  green: "#849324",
  yellow: "#ffb30f",
  red: "#fd151b",
};

export const SERVER_ADDRESS =
  process?.env.REACT_APP_SERVER_ADDRESS ||
  `http://${window.location.hostname || "localhost"}:3001`;
console.log(SERVER_ADDRESS);
