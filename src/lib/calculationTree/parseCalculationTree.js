import { isLetter, isNumber } from "../util";

const isOpen = (chr) => "(" === chr;
const isClose = (chr) => ")" === chr;
const isOperator1 = (chr) => /[\+\-]/.test(chr);
const isOperator2 = (chr) => /[\*\/]/.test(chr);
const isOperator = (chr) => isOperator1(chr) || isOperator2(chr);
const isFinish = (chr) => chr === "!";

const STATE = {
  error: 0,
  leftStart: 1,
  leftReadNumber: 2,
  leftReadLetter: 3,
  leftMeetOperator: 4,
  leftMeetOpen: 5,
  leftWaitOperator: 6,
  rightStart: 101,
  rightReadNumber: 102,
  rightReadLetter: 103,
  rightMeetOperator: 104,
  rightMeetOpen: 105,
  rightWaitOperator: 106,
  rightMeetClose: 107,
};

const createNode = ({ parent, operator, left, right }) => {
  const node = {
    operator,
    parent,
    left: left === undefined ? {} : left,
    right: right === undefined ? {} : right,
  };
  return node;
};

const formatInput = (input = "") => {
  let trimed = input.trim().replace(/ /g, "");
  trimed = trimed.replace(/\[/g, "(");
  trimed = trimed.replace(/{/g, "(");
  trimed = trimed.replace(/\]/g, ")");
  trimed = trimed.replace(/}/g, ")");
  if (isOperator1(trimed[0])) {
    trimed = `0${trimed}`;
  } else if (isOperator2(trimed[0])) {
    trimed = `1${trimed}`;
  }
  let formatted = "";
  for (let i = 0; i < trimed.length; i += 1) {
    const prevCh = i > 0 ? trimed.charAt([i - 1]) : "";
    const ch = trimed.charAt([i]);
    if (
      (isLetter(ch) || isOpen(ch)) &&
      (isLetter(prevCh) || isNumber(prevCh) || isClose(prevCh))
    ) {
      formatted = `${formatted}*`;
    }
    formatted = `${formatted}${ch}`;
  }
  return formatted.endsWith(")") ? formatted : `${formatted}!`;
};

const onStateLeftReadNumber = (context, chr) => {
  if (isNumber(chr)) {
    context.value = `${context.value}${chr}`;
    return STATE.leftReadNumber;
  }
  if (isOperator(chr)) {
    context.pointer -= 1;
    context.currentNode.left = { value: context.value };
    return STATE.leftMeetOperator;
  }
  return STATE.error;
};

const onStateLeftReadLetter = (context, chr) => {
  if (isOperator(chr)) {
    context.pointer -= 1;
    context.currentNode.left = { value: context.value };
    return STATE.leftMeetOperator;
  }
  return STATE.error;
};

const onStateLeftWaitOperator = (context, chr) => {
  if (isOperator(chr)) {
    context.pointer -= 1;
    return STATE.leftMeetOperator;
  }
  return STATE.error;
};

const onStateLeftMeetOperator = (context, chr) => {
  context.currentNode.operator = chr;
  return STATE.rightStart;
};

const onStateRightReadNumber = (context, chr) => {
  if (isNumber(chr)) {
    context.value = `${context.value}${chr}`;
    return STATE.rightReadNumber;
  }
  if (isOperator(chr)) {
    context.pointer -= 1;
    context.currentNode.right = { value: context.value };
    return STATE.rightMeetOperator;
  }
  if (isClose(chr)) {
    context.pointer -= 1;
    context.currentNode.right = { value: context.value };
    return STATE.rightMeetClose;
  }
  if (isFinish(chr)) {
    context.currentNode.right = { value: context.value };
    return STATE.rightMeetClose;
  }
  return STATE.error;
};

const onStateRightReadLetter = (context, chr) => {
  if (isOperator(chr)) {
    context.pointer -= 1;
    context.currentNode.right = { value: context.value };
    return STATE.rightMeetOperator;
  }
  if (isClose(chr)) {
    context.pointer -= 1;
    context.currentNode.right = { value: context.value };
    return STATE.rightMeetClose;
  }
  if (isFinish(chr)) {
    context.currentNode.right = { value: context.value };
    return STATE.rightMeetClose;
  }
  return STATE.error;
};

const onStateRightWaitOperator = (context, chr) => {
  if (isOperator(chr)) {
    context.pointer -= 1;
    return STATE.rightMeetOperator;
  }
  if (isClose(chr)) {
    context.pointer -= 1;
    return STATE.rightMeetClose;
  }
  return STATE.error;
};

const onStateRightMeetOperator = (context, chr) => {
  const node = createNode({ parent: context.currentNode });
  //if current level 1 ,chr level 2, extend right; otherwise extend left
  if (isOperator2(chr) && isOperator1(context.currentNode.operator)) {
    node.left = context.currentNode.right;
    node.left.parent = node;
    node.operator = chr;
    context.currentNode.right = node;
    context.currentNode = node;
  } else {
    node.left = context.currentNode.left;
    node.right = context.currentNode.right;
    node.operator = context.currentNode.operator;
    node.left.parent = node;
    node.right.parent = node;
    context.currentNode.operator = chr;
    context.currentNode.left = node;
    context.currentNode.right = null;
  }
  return STATE.rightStart;
};

const parseCaclulationTree = (input = "", startAfter = -1) => {
  let security = 1000;
  let state = STATE.leftStart;

  const tree = { pointerStart: startAfter + 1, pointerEnd: startAfter };
  const context = {
    currentNode: tree,
    value: "",
    pointer: startAfter,
  };
  const formatted = startAfter < 0 ? formatInput(input) : input;

  while (context.pointer < formatted.length - 1 && security > 0) {
    security -= 1;
    context.pointer += 1;
    const chr = formatted.charAt(context.pointer);

    switch (state) {
      case STATE.leftStart:
        context.value = "";
        if (isNumber(chr)) {
          context.value = `${chr}`;
          state = STATE.leftReadNumber;
        } else if (isLetter(chr)) {
          context.value = chr;
          state = STATE.leftReadLetter;
        } else if (isOpen(chr)) {
          context.currentNode.left = parseCaclulationTree(
            formatted,
            context.pointer
          );
          context.pointer = context.currentNode.left.pointerEnd + 1;
          state = STATE.leftWaitOperator;
        } else {
          state = STATE.error;
        }
        break;
      case STATE.leftReadNumber:
        state = onStateLeftReadNumber(context, chr);
        break;
      case STATE.leftReadLetter:
        state = onStateLeftReadLetter(context, chr);
        break;
      case STATE.leftMeetOperator:
        state = onStateLeftMeetOperator(context, chr);
        break;
      case STATE.leftWaitOperator:
        state = onStateLeftWaitOperator(context, chr);
        break;
      case STATE.rightStart:
        context.value = "";
        if (isNumber(chr)) {
          context.value = `${chr}`;
          state = STATE.rightReadNumber;
        } else if (isLetter(chr)) {
          context.value = chr;
          state = STATE.rightReadLetter;
        } else if (isOpen(chr)) {
          context.currentNode.right = parseCaclulationTree(
            formatted,
            context.pointer
          );
          context.pointer = context.currentNode.right.pointerEnd + 1;
          state = STATE.rightWaitOperator;
        } else {
          state = STATE.error;
        }
        break;
      case STATE.rightReadNumber:
        state = onStateRightReadNumber(context, chr);
        break;
      case STATE.rightReadLetter:
        state = onStateRightReadLetter(context, chr);
        break;
      case STATE.rightWaitOperator:
        state = onStateRightWaitOperator(context, chr);
        break;
      case STATE.rightMeetOperator:
        state = onStateRightMeetOperator(context, chr);
        break;
      case STATE.rightMeetClose:
        break;
      default:
        console.log({ state, chr }, context, tree);
        throw new Error(
          `invalid input at ${context.pointer}:'${chr}' ${formatted}`
        );
    }
    if (state === STATE.rightMeetClose) {
      break;
    } else if (state === STATE.error) {
      context.pointer -= 1;
    }
  }

  tree.pointerEnd = context.pointer;
  return tree;
};

export { parseCaclulationTree };
