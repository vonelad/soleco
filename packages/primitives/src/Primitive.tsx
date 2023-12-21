import {
  type Component,
  type ComponentProps,
  type JSX,
  type ValidComponent,
  splitProps,
} from "solid-js";

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

type Primitives = {
  [E in (typeof NODES)[number]]: Component<PrimitiveProps<E>>;
};

/* -------------------------------------------------------------------------- */
/*                                  Primitive                                 */
/* -------------------------------------------------------------------------- */

const Primitive = {
  a: (props: PrimitiveProps<"a">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <a {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  button: (props: PrimitiveProps<"button">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <button {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  div: (props: PrimitiveProps<"div">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <div {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  form: (props: PrimitiveProps<"form">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <form {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  h2: (props: PrimitiveProps<"h2">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <h2 {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  h3: (props: PrimitiveProps<"h3">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <h3 {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  img: (props: PrimitiveProps<"img">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <img {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  input: (props: PrimitiveProps<"input">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <input {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  label: (props: PrimitiveProps<"label">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <label {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  li: (props: PrimitiveProps<"li">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <li {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  nav: (props: PrimitiveProps<"nav">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <nav {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  ol: (props: PrimitiveProps<"ol">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <ol {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  p: (props: PrimitiveProps<"p">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <p {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  span: (props: PrimitiveProps<"span">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <span {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  svg: (props: PrimitiveProps<"svg">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <svg {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
  ul: (props: PrimitiveProps<"ul">) => {
    const [local, rest] = splitProps(props, ["asChild", "children"]);
    if (!local.asChild)
      return <ul {...rest} children={local.children as JSX.Element} />;
    // @ts-ignore
    return <>{local.children(rest)}</>;
  },
} as Primitives;

/* -------------------------------------------------------------------------- */

const Root = Primitive;

export {
  Primitive,
  //
  Root,
};
