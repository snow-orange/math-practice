const isNumber = (chr) => /[0-9]/.test(chr);
const isLetter = (chr) => /[a-z]/.test(chr);
const isUnknown = (chr) => /[xyz]/.test(chr);

const randItem = (items) => {
  const r = Math.floor(Math.random() * items.length);
  return items[r];
};

export { isUnknown, isNumber, isLetter, randItem };
