import { Component, createSignal, createEffect, createMemo } from 'solid-js';
import { Digit } from './Digit';
import { NumberInput } from './NumberInput';
import * as solver from '../solver';

import styles from './App.module.css';

export const App: Component = () => {
  let [n1, setn1] = createSignal<number | undefined>(1);
  let [n2, setn2] = createSignal<number | undefined>(2);
  let [n3, setn3] = createSignal<number | undefined>(3);
  let [n4, setn4] = createSignal<number | undefined>(5);
  let [n5, setn5] = createSignal<number | undefined>(10);
  let [n6, setn6] = createSignal<number | undefined>(25);

  let [target, setTarget] = createSignal<number | undefined>(55);

  let [solutionText, setSolutionText] = createSignal<string | undefined>(undefined);

  let isValid = (n: number | undefined) => {
    return typeof n === 'number'
  }

  let anyInvalid = createMemo(() => {
    return !isValid(n1())
        || !isValid(n2())
        || !isValid(n3())
        || !isValid(n4())
        || !isValid(n5())
        || !isValid(n6())
        || !isValid(target())
  });

  function solve() {
    if (anyInvalid()) {
      return
    }

    setSolutionText('Solving...');

    setTimeout(() => {
      let solution = solver.solve(
        [n1()!, n2()!, n3()!, n4()!, n5()!, n6()!],
        target()!
      );

      if (solution) {
        setSolutionText(`The solution is: ${solver.toString(solution)}`);
      } else {
        setSolutionText('No solution found :(');
      }
    }, 10)
  }

  return (
    <div class={styles.outer}>
      <div class={styles.inner}>
        <header class={styles.header}>
          undigits
        </header>
        <main class={styles.main}>
          <div class={styles.infoText}>
            Edit the numbers and click 'solve' to find a shortest solution.
          </div>
          <div class={styles.target}>
            <NumberInput
              class={styles.targetInput}
              invalidClass={styles.targetInputInvalid}
              value={target()}
              onInput={setTarget}
              maxLength={7}
            />
          </div>
          <div class={styles.digits}>
            <Digit
              value={n1()}
              onChange={setn1}
            />
            <Digit
              value={n2()}
              onChange={setn2}
            />
            <Digit
              value={n3()}
              onChange={setn3}
            />
          </div>
          <div class={styles.digits}>
            <Digit
              value={n4()}
              onChange={setn4}
            />
            <Digit
              value={n5()}
              onChange={setn5}
            />
            <Digit
              value={n6()}
              onChange={setn6}
            />
          </div>
          <div class={styles.solve}>
            <button
              onClick={solve}
              disabled={anyInvalid()}
            >
              Solve
            </button>
          </div>
          <div class={solutionText() ? styles.solution : styles.emptySolution}>
            {solutionText()}
          </div>
        </main>
      </div>
    </div>
  );
};

