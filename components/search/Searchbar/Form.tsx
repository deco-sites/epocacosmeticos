import { useScript } from "@deco/deco/hooks";
import Icon from "../../ui/Icon.tsx";
import { useId } from "../../../sdk/useId.ts";

export default function Searchbar() {
  const id = useId();

  return (
    <div class="w-full lg:max-w-[500px] h-10 bg-[#f9f9f9] rounded">
      <form
        id={id}
        class="relative w-full"
        hx-on:submit={useScript((id) => {
          const form = document.getElementById(id) as HTMLFormElement;
          const q = form.elements.namedItem("q") as HTMLInputElement;

          event?.preventDefault();

          location.href = `/pesquisa?q=${q.value}`;
        }, id)}
      >
        <input
          placeholder="Oi, o que você procura hoje? :)"
          autocomplete="off"
          name="q"
          class="w-full bg-transparent outline-none px-3 py-2 rounded"
        />
        <Icon
          id="search"
          size={24}
          class="text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </form>
    </div>
  );
}
