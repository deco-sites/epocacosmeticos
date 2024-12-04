import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import PriceRange from "../PriceRange.tsx";
import Icon from "../ui/Icon.tsx";

interface Props {
  filters: ProductListingPage["filters"];
  url: string;
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem({ url, selected, label, quantity }: FilterToggleValue) {
  return (
    <a
      href={url}
      rel="nofollow"
      class="flex items-center gap-2 text-[#333] group/filter"
    >
      <div
        class={clx(
          "size-5 shrink-0 flex items-center justify-center transition-colors rounded-sm",
          selected
            ? "bg-[#1c1c1c] group-hover/filter:bg-[#f9c3c9]"
            : "border border-[#a1a1a1a1] group-hover/filter:border-2 group-hover/filter:border-black bg-white group-hover/filter:bg-[#e70d91]",
        )}
      >
        {selected && <Icon id="check" size={16} class="text-white" />}
      </div>

      <span>{label}</span>
      {quantity > 0 && (
        <span class="text-xs font-bold py-1 px-3 bg-[#efefef] rounded-full">
          {quantity}
        </span>
      )}
    </a>
  );
}

function FilterValues({ key, values, url }: FilterToggle & { url: string }) {
  const params = new URL(url).searchParams;
  const filterPriceParam = params.get("filter.price");

  let min = 0;
  let max = 0;
  const isPrice = key === "price";

  if (isPrice) {
    if (filterPriceParam) {
      const v = filterPriceParam.split(":").map((value) => Number(value));

      min = v[0];
      max = v[1];
    } else {
      const v = values
        .map(({ value }) => parseRange(value) || { from: 0, to: 0 })
        .reduce(
          (acc, curr) => {
            return [Math.min(acc[0], curr.from), Math.max(acc[1], curr.to)];
          },
          [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
        );

      min = v[0];
      max = v[1];
    }

    if (Math.round(min) === Math.round(max)) {
      return null;
    }
  }

  return (
    <ul class="flex flex-col gap-4 p-6 pt-5 border border-[#cbd5e1] border-t-0">
      {isPrice ? <PriceRange min={min} max={max} params={values[0].url} /> : (
        values.map((item) => <ValueItem {...item} />)
      )}
    </ul>
  );
}

export default function Filters({ filters, url }: Props) {
  return (
    <ul class="flex flex-col gap-4 p-4 bg-[#f9fafb]">
      {filters.filter(isToggle).map((filter) => {
        const id = useId();

        if (filter.label === "sellerName") filter.label = "Vendido por";

        return (
          <li class="flex flex-col bg-white shadow-md">
            <input id={id} type="checkbox" class="hidden peer" />

            <label
              for={id}
              class="flex items-center justify-between py-4 px-6 group border border-[#cbd5e1] cursor-pointer"
            >
              {filter.label.replace(":", "")}

              <Icon
                id="chevron-down"
                size={24}
                class="text-[#333] peer-checked:group-[]:-rotate-180 peer-checked:group-[]:text-[#e70d91] transition-all"
              />
            </label>

            <div class="grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] transition-all duration-[200ms]">
              <div class="overflow-hidden">
                <FilterValues {...filter} url={url} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
