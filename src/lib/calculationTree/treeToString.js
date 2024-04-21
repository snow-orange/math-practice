const WRAPPERS = [
  ["{", "}"],
  ["[", "]"],
  ["(", ")"],
];

const getNodeString = (node, level, maxLevel) => {
  const { value, left, right, operator } = node;
  if (value !== undefined) {
    return `${value}`;
  }
  const children = `${getNodeString(
    left,
    level + 1,
    maxLevel
  )} ${operator}  ${getNodeString(right, level + 1, maxLevel)}`;
  let wrapper = ["", ""];
  if (level > 0) {
    let n = level - 1;
    if (maxLevel <= WRAPPERS.length) {
      n += WRAPPERS.length - maxLevel;
    } else if (n > WRAPPERS.length) {
      n = WRAPPERS.length - 1;
    }
    wrapper = WRAPPERS[n];
  }
  return `${wrapper[0]}${children}${wrapper[1]}`;
};

const treeToString = (tree, treeMaxLevel) => {
  return getNodeString(tree, 0, treeMaxLevel);
};

export { treeToString };
