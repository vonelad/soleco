import { createEffect, createSignal, mergeProps } from "solid-js";
import {
  computePosition,
  type ComputePositionConfig,
  type ReferenceType,
  type UseFloatingData,
  type UseFloatingOptions,
  type UseFloatingReturn,
} from "./types";
import { getDPR, roundByDPR } from "./utils";

export function createFloating<RT extends ReferenceType = ReferenceType>(
  options: UseFloatingOptions = {}
): UseFloatingReturn<RT> {
  const placement = () => options.placement?.() ?? "bottom";
  const strategy = () => options.strategy?.() ?? "absolute";
  const middleware = () => options.middleware?.() ?? [];
  const transform = () => options.transform?.() ?? true;

  const [data, setData] = createSignal<UseFloatingData>({
    x: 0,
    y: 0,
    strategy: strategy(),
    placement: placement(),
    middlewareData: {},
    isPositioned: false,
  });

  const [reference, setReference] = createSignal<RT | null>(
    (options.elements?.reference?.() ?? null) as any
  );
  const [floating, setFloating] = createSignal<HTMLElement | null>(
    options.elements?.floating?.() ?? null
  );

  function update() {
    const _reference = reference();
    const _floating = floating();
    if (!_reference || !_floating) return;

    const config: ComputePositionConfig = {
      placement: placement(),
      strategy: strategy(),
      middleware: middleware(),
      platform: options.platform?.(),
    };

    computePosition(_reference, _floating, config).then((result) => {
      setData({ ...result, isPositioned: true });
    });
  }

  createEffect(() => {
    if (options.open?.() === false && data().isPositioned) {
      setData((prev) => ({ ...prev, isPositioned: false }));
    }
  });

  createEffect(() => {
    const _reference = reference();
    const _floating = floating();

    if (_reference && _floating) {
      if (options.whileElementsMounted) {
        options.whileElementsMounted(_reference, _floating, update);
      } else {
        update();
      }
    }
  });

  const refs = {
    reference,
    floating,
    setReference,
    setFloating,
  };

  const elements = {
    reference,
    floating,
  };

  const floatingStyles = () => {
    const initialStyles = {
      position: strategy(),
      left: "0",
      top: "0",
    };

    const _floating = floating();
    if (!_floating) return initialStyles;

    const x = roundByDPR(_floating, data().x);
    const y = roundByDPR(_floating, data().y);

    if (transform()) {
      return {
        ...initialStyles,
        transform: `translate(${x}px, ${y}px)`,
        ...(getDPR(_floating) >= 1.5 && { "will-change": "transform" }),
      };
    }

    return {
      position: strategy(),
      left: x.toString(),
      top: y.toString(),
    };
  };

  return {
    x: () => data().x,
    y: () => data().y,
    strategy: () => data().strategy,
    placement: () => data().placement,
    middlewareData: () => data().middlewareData,
    isPositioned: () => data().isPositioned,
    update,
    refs,
    elements,
    floatingStyles,
  };
}
