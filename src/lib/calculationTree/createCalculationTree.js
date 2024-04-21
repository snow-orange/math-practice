import { randItem } from "../util";

const VARS = ["a", "b", "c", "e", "f", "m", "n"];
const UNKNOWNS = ["x", "y"];
const OPERATIONS = {
  addition: ["+", "-"],
  multiplication: ["*", "/"],
  add_multi: ["+", "-", "*", "/"],
};

const buildNode = ({ parent, branchName }, context, config) => {
  const { operations, possibleNumbers, tasks } = context;
  const { includeNumbers, includeVars, includeUnknowns, maxPower } = config;

  const node = { operator: randItem(operations) };
  parent[branchName] = node;

  context.counter -= 1;

  if (context.counter < 1) {
    node.right = { value: randItem(possibleNumbers) };
    node.left = { value: randItem(possibleNumbers) };
    return;
  }

  const childBranchName =
    context.counter === 1
      ? randItem(["left", "left", "right", "right", "right"])
      : randItem(["both", "left", "right", "right"]);

  if (childBranchName === "left") {
    context.tasks.push({ parent: node, branchName: childBranchName });
    node.right = { value: randItem(possibleNumbers) };
    context.counter -= 1;
  } else if (childBranchName === "right") {
    context.tasks.push({ parent: node, branchName: childBranchName });
    node.left = { value: randItem(possibleNumbers) };
    context.counter -= 1;
  } else {
    context.tasks.push({ parent: node, branchName: "left" });
    context.tasks.push({ parent: node, branchName: "right" });
    context.counter -= 2;
  }
};

const buildCalculationTree = ({
  operationType = "addtion",
  minOperations = 1,
  maxOperations = 8,
  includeNumbers = true,
  includeVars = false,
  includeUnknowns = false,
  maxPower = 1,
} = {}) => {
  const operations = OPERATIONS[operationType] || OPERATIONS.addition;
  const numbers = Array.from({ length: maxOperations * 2 }).map(() =>
    Math.round(Math.random() * 50 + 1)
  );
  const possibleNumbers = [
    ...(includeNumbers ? numbers : []),
    ...(includeVars ? VARS : []),
  ];
  const result = {};
  const context = {
    counter: Math.round(
      minOperations + Math.random() * (maxOperations - minOperations)
    ),
    currentPower: 0,
    possibleNumbers,
    operations,
    tasks: [
      {
        parent: result,
        branchName: "tree",
      },
    ],
    maxLevel: -1,
  };

  while (context.tasks.length > 0) {
    const currentTasks = context.tasks;
    context.tasks = [];

    currentTasks.forEach((node) =>
      buildNode(node, context, {
        includeNumbers,
        includeVars,
        includeUnknowns,
        maxPower,
      })
    );
    context.counter -= currentTasks.length;
    if (currentTasks.length > 0) {
      context.maxLevel += 1;
    }
  }
  result.tree.maxLevel = context.maxLevel;
  return result.tree;
};

export { buildCalculationTree, randItem };
