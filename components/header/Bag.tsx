import { MINICART_DRAWER_ID } from "../../constants.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";

const onLoad = (id: string) =>
  window.STOREFRONT.CART.subscribe((sdk) => {
    const counter = document.getElementById(id) as HTMLDivElement;
    const count = sdk.getCart()?.items.length ?? 0;

    counter.innerText = count > 9 ? "9+" : count.toString();
  });

export default function Bag() {
  const id = useId();

  return (
    <>
      <label class="relative group" for={MINICART_DRAWER_ID}>
        <div
          id={id}
          class="h-5 min-w-5 p-1 top-0 right-0 translate-x-1/3 -translate-y-1/4 absolute rounded-full bg-[#e70d91] border-2 border-white group-hover:border-[#e70d91] transition-colors text-white font-bold flex items-center justify-center text-xs"
        >
          0
        </div>

        <Icon id="bag" size={32} class="text-[#333]" />
      </label>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </>
  );
}
