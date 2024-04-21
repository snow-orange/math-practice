import { treeToString, buildCalculationTree } from "../../lib/calculationTree";

const generate = (i, config) => {
  const tree = buildCalculationTree({ ...config, operationType: "addition" });

  return { tree, body: treeToString(tree, tree.maxLevel) };
};

const check = () => true;

export { check, generate };
