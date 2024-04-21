import { isNumber } from "../util";

const isLeaf = (node) => node.left === undefined;
const formatValue = (value) =>
  isNumber(value)
    ? [
        {
          n: Number.parseFloat(value),
          nDenominator: 1,
          v: "",
          vDenominator: "",
        },
      ]
    : [{ n: 1, nDenominator: 1, v: value, vDenominator: "" }];

const getLetterCounts = (v) =>
  v.split("").reduce(
    (aggr, chr) => ({
      ...aggr,
      [chr]: aggr[chr] === undefined ? 1 : aggr[chr] + 1,
    }),
    {}
  );

const multiply = (a, b) => {
  const n = a.n * b.n;
  const nDenominator = a.nDenominator * b.nDenominator;
  const vCount = getLetterCounts(`${a.v}${b.v}`);
  const vDenominatorCount = getLetterCounts(
    `${a.vDenominator}${b.vDenominator}`
  );
  Object.keys(vCount).forEach((key) => {
    if (vDenominatorCount[key] !== undefined) {
      if (vCount[key] >= vDenominatorCount[key]) {
        vCount[key] -= vDenominatorCount[key];
        vDenominatorCount[key] = 0;
      } else {
        vDenominatorCount[key] = vCount[key];
        vCount[key] = 0;
      }
      if (vCount[key] < 1) {
        delete vCount[key];
      }
      if (vDenominatorCount[key] < 1) {
        delete vDenominatorCount[key];
      }
    }
  });
  const v = Object.keys(vCount).join("").sort();
  const vDenominator = Object.keys(vDenominatorCount).join("").sort();

  return { n, v, nDenominator, vDenominator };
};

const addAll = (parts) => {
  const added = parts.reduce((aggr, partB) => {
    const found = aggr.some((partA, i) => {
      if (partA.vDenominator !== partB.vDenominator || partA.v !== partB.v) {
        return false;
      }
      partA.n = partA.n * partB.nDenominator + partA.nDenominator * partB.n;
      if (partA.n !== 0) {
        partA.nDenominator *= partB.nDenominator;
      } else {
        partA.deleteMe = true;
      }
      return true;
    });
    return found ? aggr : [...aggr, partB];
  }, []);
  return added.filter(({ deleteMe }) => !deleteMe);
};

const executeNode = (node, context) => {
  const { left, right, operator } = node;

  const leftValues = isLeaf(left)
    ? formatValue(left.value)
    : executeNode(node.left, context);
  let rightValues = isLeaf(right)
    ? formatValue(right.value)
    : executeNode(node.right, context);

  let values = [];
  if (operator === "+" || operator === "-") {
    if (operator === "-") {
      rightValues.forEach((part) => {
        part.n *= -1;
      });
    }
    values = [...leftValues, ...rightValues];
  } else {
    if (operator === "/") {
      if (rightValues.length === 0) {
        throw new Error("devide_zero");
      }
      rightValues.forEach((part) => {
        let temp = part.v;
        part.v = part.vDenominator;
        part.vDenominator = temp;
        temp = part.n;
        part.n = part.nDenominator;
        part.nDenominator = temp;
      });
    }
    leftValues.forEach((leftPart) => {
      rightValues.forEach((rightPart) => {
        values.push(multiply(leftPart, rightPart));
      });
    });
  }
  const length = values.length;
  values = addAll(values);
  if (values.length < length) {
    context.isSimplest = false;
  }
  return values;
};

const executeTree = (tree) => {
  const context = { isSimplest: true };
  const result = executeNode(tree, context);
  return result.reduce((part) => {
    const key = `${part.v}/${part.vDenominator}`;
    return { ...part, [key]: `${part.n}/${part.nDenominator}` };
  }, {});
};

export { executeTree };
