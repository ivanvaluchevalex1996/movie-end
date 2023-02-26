export default function changeColor(n) {
  if (n >= 0 && n <= 3) {
    return "#E90000";
  }
  if (n > 3 && n <= 5) {
    return "#E97E00";
  }
  if (n > 5 && n <= 7) {
    return "#E9D100";
  }
  return "#66E900";
}
