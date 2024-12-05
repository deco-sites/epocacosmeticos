import type { SKU } from "apps/vtex/utils/types.ts";
import { useComponent } from "../../sections/Component.tsx";
import Icon from "../ui/Icon.tsx";

export interface Props {
  id: string;
  items: SKU[];
  checked?: boolean;
}

export default function Form({ id, items, checked }: Props) {
  return (
    <div class="flex flex-col gap-2 h-full">
      <input type="checkbox" id={id} class="hidden peer" checked={checked} />

      <form
        class="relative hidden peer-checked:flex flex-col gap-5 p-5 border border-[#e8e3e8]"
        hx-target="closest div"
        hx-swap="outerHTML"
        hx-select="section > *"
        hx-sync="this:replace"
        hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
          items,
          id,
        })}
      >
        <label for={id}>
          <Icon
            id="close"
            size={20}
            class="text-[#1c1c1c] hover:text-[#e70d91] cursor-pointer absolute top-5 right-5"
          />

          <span class="text-[#e70d91]">Consultar prazo e valor do Frete.</span>
        </label>

        <div class="flex gap-2 h-8">
          <input
            as="input"
            type="text"
            class="h-full py-1 px-2 rounded border border-[#e8e3e8] w-full max-w-[200px] text-[#171a1c]"
            placeholder="00000000"
            name="postalCode"
            maxLength={8}
            size={8}
          />
          <button
            type="submit"
            class="h-full flex items-center justify-center text-[#e70d91] border border-[#e70d91] rounded px-2"
          >
            <span class="[.htmx-request_&]:hidden">Calcular</span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
          </button>
        </div>

        <a
          href="http://www.buscacep.correios.com.br/sistemas/buscacep/"
          class="text-[#4f4f4f] text-xs underline underline-offset-4"
        >
          Não sei meu CEP
        </a>
      </form>
    </div>
  );
}
