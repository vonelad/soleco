import { type Accessor, createSignal, untrack, Setter } from "solid-js";

export interface CreateControllableSignalProps<T> {
  value?: Accessor<T | undefined>;
  defaultValue?: Accessor<T | undefined>;
  onChange?: (value: T) => void;
}

export function createControllableSignal<T>(
  props: CreateControllableSignalProps<T>
) {
  const [uncontrolledValue, setUncontrolledValue] = createSignal(
    props.defaultValue?.()
  );
  const isControlled = () => props.value?.() !== undefined;
  const value = () => (isControlled() ? props.value!() : uncontrolledValue());

  const setValue = (next: Exclude<T, Function> | ((prev: T) => T)) => {
    untrack(() => {
      const nextValue = isCallable(next) ? next(value()!) : next;
      if (!Object.is(nextValue, value())) {
        if (!isControlled()) setUncontrolledValue(nextValue as any);
        props.onChange?.(nextValue);
      }
      return nextValue;
    });
  };

  return [value, setValue] as [Accessor<T>, Setter<T>];
}

const isCallable = (value: any): value is Function =>
  typeof value === "function";
