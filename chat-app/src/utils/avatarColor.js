const PALETTE = [
  '#5B8DEF', '#7EA6F2', '#3E6BC4', '#8FB6F2',
  '#4C7BDB', '#A9C4F7', '#345E9E', '#6FA0EE',
];

export function colorForName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function initialsForName(name = '') {
  return name.trim().slice(0, 2).toUpperCase() || '?';
}
