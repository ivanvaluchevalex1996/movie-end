export default function truncate(str) {
  const text = str.slice(0, 140);
  const a = text.split(" ");
  a.splice(a.length - 1, 1);
  const res = a.join(" ");
  return `${res}...`;
}
