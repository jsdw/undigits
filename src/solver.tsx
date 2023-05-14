export function solve(numbers: number[], target: number): Value | undefined {
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
  function toS(value: Value): string {
    if (typeof value === 'number') {
      return value.toString()
    }
    let op = value.op;
    return "(" + toS(value.left) + " " + op + " " + toS(value.right) + ")"
  }
  let s = toS(value);
  return s.slice(1, s.length - 1);
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
  } else {
    return value.__opCount
  }
}
function calc(value: Value): number {
  if (typeof value === "number") {
    return value
  } else {
    return value.__calc
  }
}

enum Op {
  Add = '+',
  Minus = '-',
  Multiply = 'x',
  Divide = '/',
}