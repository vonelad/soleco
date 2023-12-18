import { createSignal } from "solid-js";
import {
  arrow,
  createFloating,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
} from "../src";
import { test, expect } from "vitest";
import { render, fireEvent } from "@solidjs/testing-library";

const wait = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

test("middleware is always fresh and does not cause an infinite loop", async () => {
  function InlineMiddleware() {
    let arrowRef: Element;
    const { refs } = createFloating({
      placement: () => "bottom",
      middleware: () => [
        offset(),
        offset(10),
        offset(() => 5),
        offset(() => ({ crossAxis: 10 })),
        offset({ crossAxis: 10, mainAxis: 10 }),

        flip({ fallbackPlacements: ["top", "bottom"] }),

        shift(),
        shift({ crossAxis: true }),
        shift({ boundary: document.createElement("div") }),
        shift({ boundary: [document.createElement("div")] }),
        shift({ limiter: limitShift() }),
        shift({ limiter: limitShift({ offset: 10 }) }),
        shift({ limiter: limitShift({ offset: { crossAxis: 10 } }) }),
        shift({ limiter: limitShift({ offset: () => 5 }) }),
        shift({ limiter: limitShift({ offset: () => ({ crossAxis: 10 }) }) }),

        arrow({ element: arrowRef }),

        hide(),

        size({
          apply({ availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${availableHeight}px`,
            });
          },
        }),
      ],
    });

    return (
      <>
        <div ref={refs.setReference} />
        <div ref={refs.setFloating} />
      </>
    );
  }

  function StateMiddleware() {
    let arrowRef: Element;
    const [middleware, setMiddleware] = createSignal([
      offset(),
      offset(10),
      offset(() => 5),
      offset(() => ({ crossAxis: 10 })),
      offset({ crossAxis: 10, mainAxis: 10 }),

      // should also test `autoPlacement.allowedPlacements`
      // can't have both `flip` and `autoPlacement` in the same middleware
      // array, or multiple `flip`s
      flip({ fallbackPlacements: ["top", "bottom"] }),

      shift(),
      shift({ crossAxis: true }),
      shift({ boundary: document.createElement("div") }),
      shift({ boundary: [document.createElement("div")] }),
      shift({ limiter: limitShift() }),
      shift({ limiter: limitShift({ offset: 10 }) }),
      shift({ limiter: limitShift({ offset: { crossAxis: 10 } }) }),
      shift({ limiter: limitShift({ offset: () => 5 }) }),
      shift({ limiter: limitShift({ offset: () => ({ crossAxis: 10 }) }) }),

      arrow({ element: arrowRef! }),

      hide(),

      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
    ]);
    const { x, y, refs } = createFloating({
      placement: () => "right",
      middleware,
    });

    return (
      <>
        <div ref={refs.setReference} />
        <div ref={refs.setFloating} />
        <button
          data-testid="step1"
          onClick={() => setMiddleware([offset(10)])}
        />
        <button
          data-testid="step2"
          onClick={() => setMiddleware([offset(() => 5)])}
        />
        <button data-testid="step3" onClick={() => setMiddleware([])} />
        <button data-testid="step4" onClick={() => setMiddleware([flip()])} />
        <div data-testid="x">{x()}</div>
        <div data-testid="y">{y()}</div>
      </>
    );
  }

  render(() => <InlineMiddleware />);

  const { getByTestId } = render(() => <StateMiddleware />);
  fireEvent.click(getByTestId("step1"));
  await wait();

  expect(getByTestId("x").textContent).toBe("10");

  fireEvent.click(getByTestId("step2"));
  await wait();

  expect(getByTestId("x").textContent).toBe("5");

  // No `expect` as this test will fail if a render loop occurs
  fireEvent.click(getByTestId("step3"));
  fireEvent.click(getByTestId("step4"));
});
