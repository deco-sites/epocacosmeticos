import { useDevice } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
/**
 * @titleBy name
 */
interface InnerItem {
  name: string;
  link: string;
}

/**
 * @titleBy title
 */
interface Item {
  title: string;
  link: string;
  items: InnerItem[];
}

export interface Props {
  items: Item[];
}

function Desktop({ items }: Props) {
  const ALL_ITEMS = {
    title: "Ver tudo",
    link: "",
    items: items.map(({ title, link }) => ({ name: title, link })),
  };

  return (
    <nav class="flex h-12">
      <ul class="flex w-full">
        {[ALL_ITEMS, ...items].map(({ title, link, items }, index) => {
          const Name = link ? "a" : "div";
          const NameProps = link ? { href: link } : {};

          return (
            <li class="flex-1">
              <Name
                {...NameProps}
                class={clx(
                  "h-12 text-[#333] hover:text-[#e70d91] relative group flex gap-2 justify-center items-center whitespace-nowrap peer",
                  !!index && "px-3",
                )}
              >
                {index === 0 && <Icon id="menu" size={20} />}
                <div class="absolute left-0 bottom-1 w-0 h-0.5 bg-[#e70d91] group-hover:w-full transition-all duration-300" />
                {title}
              </Name>

              {items.length > 0 && (
                <div class="absolute left-0 top-full bg-[#f9f9f9] w-screen min-h-[250px] py-3 z-10 hidden peer-hover:flex hover:flex">
                  <ul class="grid grid-cols-3 auto-rows-max items-center container">
                    {items.map(({ name, link }) => (
                      <li class="flex items-center h-10">
                        <a href={link} class="text-[#333] hover:text-[#e70d91]">
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Mobile({ items }: Props) {
  const id = useId();

  const LAST_ASIDE_ITEMS = [
    {
      title: "Minha conta",
      link: "#/",
    },
    {
      title: "Meus pedidos",
      link: "#/",
    },
    {
      title: "Rastrear meus pedidos",
      link: "#/",
    },
    {
      title: "Atendimento",
      link: "#/",
    },
    {
      title: "Acessibilidade",
      link: "#/",
    },
  ];
  const ALL_ITEMS = {
    title: "Ver tudo",
    link: "",
    items: items.map(({ title, link }) => ({ name: title, link })),
  };

  return (
    <div>
      <input type="checkbox" id={id} class="hidden peer" />
      <label
        for={id}
        class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] z-10 opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto transition-opacity"
      />

      <label for={id}>
        <Icon id="menu" size={32} />
      </label>

      <aside class="fixed top-0 left-0 md:w-1/2 w-[80%] h-[100dvh] bg-[#f9f9f9] z-20 -translate-x-full peer-checked:translate-x-0 transition-transform overflow-y-auto overscroll-contain">
        <div class="p-6 flex items-center justify-between bg-[#e70d91]">
          <div class="flex flex-col gap-1 text-white">
            <span class="text-lg leading-none">Oie!</span>
            <div class="text-sm flex items-center gap-1">
              Vem fazer seu login ;)
            </div>
          </div>

          <Icon id="chevron-right" size={20} class="text-white" />
        </div>

        <ul class="flex flex-col divide-y divide-[#e8e3e8]">
          {[ALL_ITEMS, ...items].map(({ title, link, items }) => {
            const id = useId();
            const hasItems = items.length > 0;

            const Name = link ? "a" : "div";
            const NameProps = link ? { href: link } : {};

            return (
              <li class="flex flex-col">
                <input type="checkbox" id={id} class="hidden peer" />

                <div class="flex items-center h-[72px] group/item">
                  <Name
                    {...NameProps}
                    class="text-[#333] flex-1 flex items-center pl-6 whitespace-nowrap h-full"
                  >
                    {title}
                  </Name>

                  {hasItems && (
                    <label
                      for={id}
                      class={clx(
                        "pr-6 flex items-center justify-end h-full",
                        link ? "w-1/4" : "w-full",
                      )}
                    >
                      <Icon
                        id="chevron-right"
                        size={20}
                        class="text-[#333] peer-checked:group-[]/item:rotate-90 transition-transform"
                      />
                    </label>
                  )}
                </div>

                {hasItems && (
                  <div class="grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] transition-all duration-[200ms]">
                    <ul class="overflow-hidden divide-y divide-[#e8e3e8]">
                      {items.map(({ name, link }) => (
                        <li>
                          <a
                            href={link}
                            class="text-[#333] bg-[#efefef] flex h-[72px] items-center pl-6"
                          >
                            {name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}

          <div class="divide-y divide-white">
            {LAST_ASIDE_ITEMS.map(({ title, link }) => (
              <a
                href={link}
                class="bg-[#333] text-white flex h-[72px] items-center pl-6"
              >
                {title}
              </a>
            ))}
          </div>
        </ul>
      </aside>
    </div>
  );
}

export default function Navbar({ items }: Props) {
  return useDevice() === "desktop"
    ? <Desktop items={items} />
    : <Mobile items={items} />;
}
