import type { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  title: string;
}

function Header({ title }: Props) {
  return (
    <h2 class="text-xl md:text-[32px] text-[#333] relative isolate w-fit mx-auto px-4 leading-none">
      {title}
      <div class="w-full bg-[#f598a394] h-4 -bottom-1 md:-bottom-0.5 left-0 absolute -z-10" />
    </h2>
  );
}

interface Tab {
  title: string;
}

function Tabbed({
  children,
}: {
  children: JSX.Element;
}) {
  return <>{children}</>;
}

function Container({ class: _class, ...props }: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      class={clx(
        "container flex flex-col gap-4 sm:gap-6 w-full py-5 sm:py-10",
        _class?.toString(),
      )}
    />
  );
}

function Placeholder(
  { height, class: _class }: { height: string; class?: string },
) {
  return (
    <div
      style={{
        height,
        containIntrinsicSize: height,
        contentVisibility: "auto",
      }}
      class={clx("flex justify-center items-center", _class)}
    >
      <span class="loading loading-spinner" />
    </div>
  );
}

function Section() {}

Section.Container = Container;
Section.Header = Header;
Section.Tabbed = Tabbed;
Section.Placeholder = Placeholder;

export default Section;
