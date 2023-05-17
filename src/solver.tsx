export function solve(numbers: number[], target: number): Value | undefined {
  // Randomise the starting input a little each time:
  numbers.sort(() => Math.random() < 0.5 ? -1 : 1);

  let states: Value[][] = [numbers]
  let shortestSolutionOps = Infinity;
  let shortestSolution: Value | undefined = undefined;

  while (states.length) {
    let nextState = states.pop();
    if (!nextState) {
      break
    }

    let nextStates = moves(nextState);
    for (let state of nextStates) {
      // Stop as soon as total number of ops exceeds current best
      let opCount = currentOpCount(state);
      if (opCount > shortestSolutionOps) {
        continue
      }

      // First entry is theone that was just changed. Is it a solution?
      let firstEntry = state[0];
      if (calc(firstEntry) === target) {
        let firstEntryOps = numberOfOps(firstEntry);
        if (firstEntryOps < shortestSolutionOps) {
          shortestSolution = firstEntry
          shortestSolutionOps = firstEntryOps
        }
        continue
      }

      // Else keep searching from these states.
      states.push(state)
    }
  }

  return shortestSolution
}

export function toString(value: Value): string {
  if (typeof value === 'number') {
    return value.toString()
  }

  let op = value.op;

  // If we are reading left to right we never need brackets on the
  // left side, but for clarity let's add them if precedence of left op
  // is lower
  let leftS = typeof value.left === 'number' ? toString(value.left)
    : (value.left.op === Op.Add || value.left.op === Op.Minus)
    && (op === Op.Multiply || op === Op.Divide) ? "("+toString(value.left)+")"
    : toString(value.left)

  // By default any ops on the right hand side need brackets.
  // In some cases though we can avoid them.
  let rightS
    = typeof value.right === 'number'
    || (op == Op.Add && value.right.op == Op.Add)
    || (op == Op.Add && value.right.op == Op.Minus)
    || (op == Op.Multiply && value.right.op == Op.Multiply) ? toString(value.right)
    : "("+toString(value.right)+")";

  return leftS + " " + op + " " + rightS;
}

type Value = number | {
  left: Value,
  right: Value,
  op: Op,
  // Cached values to avoid recalculating:
  __opCount: number,
  __calc: number
}

function moves(state: Value[]): Value[][] {
  let moves: Value[][] = [];

  // pick any two numbers and apply each of the ops
  // that is valid. This gives us each next move
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state.length; j++) {
      if (i == j) continue;

      let a = state[i];
      let b = state[j];
      let rest = state.filter((v,idx) => {
        return idx !== i && idx !== j
      });

      if(canAdd(a, b)) {
        moves.push([add(a, b), ...rest])
      }
      if(canMinus(a, b)) {
        moves.push([minus(a, b), ...rest])
      }
      if(canMultiply(a, b)) {
        moves.push([multiply(a, b), ...rest])
      }
      if(canDivide(a, b)) {
        moves.push([divide(a, b), ...rest])
      }
    }
  }

  return moves
}

function currentOpCount(vs: Value[]): number {
  return vs.reduce((ops: number, value) => numberOfOps(value) + ops, 0)
}
function add(left: Value, right: Value): Value {
  return {
    left,
    right,
    op: Op.Add,
    __opCount: numberOfOps(left) + numberOfOps(right) + 1,
    __calc: calc(left) + calc(right)
  }
}
function minus(left: Value, right: Value): Value {
  return {
    left,
    right,
    op: Op.Minus,
    __opCount: numberOfOps(left) + numberOfOps(right) + 1,
    __calc: calc(left) - calc(right)
  }
}
function multiply(left: Value, right: Value): Value {
  return {
    left,
    right,
    op: Op.Multiply,
    __opCount: numberOfOps(left) + numberOfOps(right) + 1,
    __calc: calc(left) * calc(right)
  }
}
function divide(left: Value, right: Value): Value {
  return {
    left,
    right,
    op: Op.Divide,
    __opCount: numberOfOps(left) + numberOfOps(right) + 1,
    __calc: calc(left) / calc(right)
  }
}
function canAdd(left: Value, right: Value): boolean {
  return calc(left) + calc(right) < 10_000_000
}
function canMultiply(left: Value, right: Value): boolean {
  return calc(left) * calc(right) < 10_000_000
}
function canMinus(left: Value, right: Value): boolean {
  return calc(left) - calc(right) >= 0
}
function canDivide(left: Value, right: Value): boolean {
  return calc(left) % calc(right) == 0
}
function numberOfOps(value: Value): number {
  if (typeof value === 'number') {
    return 0
  }
  return value.__opCount
}
function calc(value: Value): number {
  if (typeof value === "number") {
    return value
  }
  return value.__calc
}

enum Op {
  Add = '+',
  Minus = '-',
  Multiply = 'x',
  Divide = '/',
}