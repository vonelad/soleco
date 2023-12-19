import { ComponentProps, JSX, ValidComponent, splitProps } from "solid-js";

const NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul",
] as const;

// Base type for Props without asChild and children
type BaseProps<E extends ValidComponent> = Omit<
  ComponentProps<E>,
  "asChild" | "children"
>;

// Props when asChild is true
type AsChildProps<E extends ValidComponent> = {
  asChild: true;
  children: (props: BaseProps<E>) => JSX.Element;
};

// Props when asChild is not true
type RegularProps = {
  asChild?: false;
  children?: JSX.Element;
};

// Unified Props type with conditional types
export type PrimitiveProps<E extends ValidComponent> = BaseProps<E> &
  (AsChildProps<E> | RegularProps);

type Primitives = { [E in (typeof NODES)[number]]: PrimitiveProps<E> };

/* -------------------------------------------------------------------------- */
/*                                  Primitive                                 */
/* -------------------------------------------------------------------------- */

const Primitive = NODES.reduce((acc, node) => {
  const Node = (props: PrimitiveProps<typeof node>) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    const Comp = node;
    if (!local.asChild) return <Comp {...rest} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  };
  return { ...acc, [node]: Node };
}, {} as Primitives);

/* -------------------------------------------------------------------------- */

const Root = Primitive;

export {
  Primitive,
  //
  Root,
};
