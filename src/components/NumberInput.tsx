import { Component, createMemo } from 'solid-js';

import styles from './NumberInput.module.css';

export type NumberInputProps = {
  value: number | undefined,
  onInput: (value: number | undefined) => void
  class?: string
  invalidClass?: string
  maxLength?: number
}

export const NumberInput: Component<NumberInputProps> = (props) => {

  let isValid = createMemo(() => {
    return digitIsValid(props.value) ? true : false
  });

  let onInput = (e: InputEvent | undefined) => {
    if (!e) { return }

    if (typeof props.maxLength !== 'undefined') {
        let v = (e.target as any).value;
        if (v.length > props.maxLength) {
            (e.target as any).value = v.slice(0, props.maxLength)
        }
    }

    let valueString: string = (e.target as any).value || ''
    let value = parseInt(valueString, 10);

    if (!digitIsValid(valueString)) {
      props.onInput(undefined)
    } else {
      props.onInput(value)
    }
  }

  return (
      <input
        class={`${styles.input} ${props.class} ${isValid() ? '' : props.invalidClass}`}
        value={props.value || ''}
        onInput={onInput}
        type="number"
      />
  )
}

function digitIsValid(value: string | number | undefined) {
  if (typeof value === "undefined" || value === "" || isNaN(parseInt(value.toString(), 10))) {
    return false
  } else {
    return true
  }
}
