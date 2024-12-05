import type { BreadcrumbList } from "apps/commerce/types.ts";
import { relative } from "../../sdk/url.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "./Icon.tsx";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  return (
    <ul class="flex items-center gap-2 overflow-x-auto">
      <li class="flex items-center gap-2">
        <a href="/" class="text-[#1c1c1c] -translate-y-px">
          <Icon id="home" size={20} />
        </a>
        <span class="bg-[#e8e3e8] h-4 w-px" />
      </li>

      {itemListElement
        .filter(({ name, item }) => name && item)
        .map(({ name, item }, index) => {
          const isLast = index === itemListElement.length - 1;

          const Component = isLast ? "div" : "a";
          const Props = isLast ? {} : { href: relative(item) };

          return (
            <li class="flex items-center gap-2">
              <Component
                {...Props}
                class={clx(
                  "truncate",
                  isLast ? "text-[#706f70]" : "text-[#1c1c1c]",
                )}
              >
                {name}
              </Component>

              {!isLast && <span class="bg-[#e8e3e8] h-4 w-px" />}
            </li>
          );
        })}
    </ul>
  );
}

export default Breadcrumb;
