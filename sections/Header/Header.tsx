import type { LoadingFallbackProps } from "@deco/deco";
import { useDevice } from "@deco/deco/hooks";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Alert, {
  type Alert as AlertType,
} from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import Navbar, {
  type Props as NavbarProps,
} from "../../components/header/Navbar.tsx";
import Searchbar from "../../components/search/Searchbar/Form.tsx";
import Icon from "../../components/ui/Icon.tsx";

interface Props {
  /** @title Alertas */
  alerts?: AlertType[];
  /** @title Logo */
  logo: ImageWidget;
  /** @title Barra de navegação */
  navBar: NavbarProps;
}

const Desktop = ({ logo, navBar }: Props) => (
  <div class="flex flex-col">
    <div class="flex items-center justify-between p-3 pt-2 border-b border-[#e2e8f0]">
      <a href="/">
        <Image src={logo} alt="Logo" width={220} height={60} />
      </a>
      <Searchbar />

      <div class="flex items-center gap-1 text-[#333333] p-2">
        <Icon id="user" size={32} />
        <div class="flex flex-col">
          <span class="text-lg leading-none">Oie!</span>
          <div class="text-xs flex items-center gap-1">
            Vem fazer seu login ;)
            <Icon
              id="chevron-right"
              size={14}
              class="text-[#b3b3b3] rotate-90"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <a
          href="/institucional/acessibilidade"
          class="flex items-center gap-2.5 text-xs rounded-full border border-[#f1f1f1] p-2.5 hover:text-[#e70d91] hover:border-[#e70d91]"
        >
          Acessibilidade
          <img
            src="/image/acessibilidade-40-40.webp"
            alt="Acessibilidade"
            width={28}
            height={28}
          />
        </a>

        <a href="/favoritos" class="flex items-center gap-4 relative">
          <div class="h-5 min-w-5 p-1 top-0 right-0 translate-x-1/3 -translate-y-1/4 absolute rounded-full bg-[#e70d91] text-white font-semibold flex items-center justify-center text-[11px]">
            0
          </div>

          <Icon id="heart" size={32} class="text-[#e70d91]" />
        </a>

        <Bag />
      </div>
    </div>

    <Navbar {...navBar} />
  </div>
);
const Mobile = ({ logo, navBar }: Props) => (
  <div class="flex flex-col gap-3 p-3 pt-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Navbar {...navBar} />
        <a href="/">
          <Image src={logo} alt="Logo" width={112} height={60} />
        </a>
      </div>

      <div class="flex items-center gap-2.5">
        <a
          href="/institucional/acessibilidade"
          class="flex items-center gap-2.5 text-xs rounded-full border border-[#f1f1f1] p-2.5 hover:text-[#e70d91] hover:border-[#e70d91]"
        >
          <span class="hidden lg:block">Acessibilidade</span>
          <img
            src="/image/acessibilidade-40-40.webp"
            alt="Acessibilidade"
            width={28}
            height={28}
          />
        </a>

        <a href="/favoritos" class="flex items-center gap-4 relative">
          <div class="h-5 min-w-5 p-1 top-0 right-0 translate-x-1/3 -translate-y-1/4 absolute rounded-full bg-[#e70d91] text-white font-semibold flex items-center justify-center text-[11px]">
            0
          </div>

          <Icon id="heart" size={32} class="text-[#e70d91]" />
        </a>

        <Bag />
      </div>
    </div>

    <Searchbar />
  </div>
);
function Header({ logo, ...rest }: Props) {
  const isDesktop = useDevice() === "desktop";

  rest.alerts ??= [];

  return (
    <header class="relative shadow-md">
      {rest.alerts.length > 0 && <Alert alerts={rest.alerts} />}
      <div class="container">
        {isDesktop
          ? <Desktop logo={logo} {...rest} />
          : <Mobile logo={logo} {...rest} />}
      </div>
    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...(props as any)} loading="lazy" />
);
export default Header;
