import { Component } from 'solid-js';
import { NumberInput } from './NumberInput';

import styles from './Digit.module.css';

export type DigitProps = {
  value: number | undefined,
  onChange: (value: number | undefined) => void
}

export const Digit: Component<DigitProps> = (props) => {

  let isValid = () => {
    return typeof props.value == 'number'
  }

  return (
    <div class={`${styles.digit} ${isValid() ? '' : styles.invalid}`}>
      <NumberInput
        class={styles.input}
        invalidClass={isValid() ? '' : styles.inputInvalid}
        value={props.value}
        onInput={props.onChange}
        maxLength={3}
      />
    </div>
  )
}
