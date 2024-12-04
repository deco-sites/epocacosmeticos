import { useScript } from "@deco/deco/hooks";
import type { ProductListingPage } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "../ui/Icon.tsx";

const SORT_QUERY_PARAM = "sort";
const PAGE_QUERY_PARAM = "page";

export type Props = Pick<ProductListingPage, "sortOptions"> & {
  url: string;
};

const getUrl = (href: string, value: string) => {
  const url = new URL(href);
  url.searchParams.delete(PAGE_QUERY_PARAM);
  url.searchParams.set(SORT_QUERY_PARAM, value);
  return url.href;
};

const labels: Record<string, string> = {
  "relevance:desc": "Relevância",
  "price:desc": "Maior Preço",
  "price:asc": "Menor Preço",
  "orders:desc": "Mais vendidos",
  "name:desc": "Nome - de Z a A",
  "name:asc": "Nome - de A a Z",
  "release:desc": "Lançamento",
  "discount:desc": "Maior desconto",
};

export default function Sort({ sortOptions, url }: Props) {
  const current = getUrl(
    url,
    new URL(url).searchParams.get(SORT_QUERY_PARAM) ?? "",
  );
  const options = sortOptions?.map(({ value, label }) => ({
    value: getUrl(url, value),
    label,
  }));
  const currentLabel = options?.find(({ value }) => value === current)?.label;

  return (
    <div class="relative">
      <div
        tabindex={-1}
        class="pl-3 pr-2 text-[#333] border border-[#e70d91] rounded flex items-center justify-between h-9 w-[200px] cursor-pointer peer"
      >
        {currentLabel ? labels[currentLabel] : "Relevância"}
        <div class="flex items-center gap-3">
          <div class="w-px h-5 bg-[#ccc] shrink-0" />
          <Icon id="chevron-right" size={16} class="rotate-90 text-[#ccc]" />
        </div>
      </div>

      <div class="absolute w-full left-0 top-[calc(100%+8px)] grid grid-rows-[0fr] peer-focus-within:grid-rows-[1fr] transition-all duration-300 z-10">
        <div class="overflow-hidden flex flex-col bg-white overflow-y-auto max-h-[300px]">
          {options.map(({ value, label }) => (
            <a
              href={value}
              class={clx(
                "p-2 text-[#333] hover:text-white hover:bg-[#ed97a2] h-10 transition-colors duration-[200ms]",
                value === current && "text-white bg-[#e70d91]",
              )}
              hx-on:mousedown={useScript((value) => {
                location.href = value;
              }, value)}
            >
              {labels[label] ?? label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
