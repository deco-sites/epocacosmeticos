import type { SectionProps } from "@deco/deco";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import type { ProductListingPage } from "apps/commerce/types.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import Filters from "../../components/search/Filters.tsx";
import { useId } from "../../sdk/useId.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Sort from "./Sort.tsx";
import Icon from "../ui/Icon.tsx";

export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  /** @hidden */
  partial?: "hideMore" | "hideLess";
}

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
  );
}

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};

function PageResult(props: SectionProps<typeof loader>) {
  const { url } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });

  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center">
      <div
        data-product-list
        class="grid items-center grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-10 w-full"
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
          />
        ))}
      </div>

      <button
        type="button"
        rel="next"
        hx-swap="outerHTML show:parent:top"
        hx-get={partialNext}
        class="mt-6"
      >
        <span class="[.htmx-request_&]:hidden text-white font-medium bg-[#e70d91] hover:bg-black transition-colors px-6 py-2 h-10 flex items-center">
          Carregar mais produtos
        </span>
        <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
      </button>
    </div>
  );
}
const setPageQuerystring = (page: string, id: string) => {
  const element = document.getElementById(id)?.querySelector(
    "[data-product-list]",
  );

  if (!element) {
    return;
  }

  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");
    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }
    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};

function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const isDesktop = useDevice() === "desktop";
  const { url, partial } = props;
  const page = props.page!;
  const { filters, breadcrumb, pageInfo, sortOptions } = page;
  const mobileFilterId = useId();

  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );

  return (
    <>
      <div id={container} class="w-full mt-5">
        {partial
          ? <PageResult {...props} />
          : (
            <div class="container flex flex-col gap-4">
              <Breadcrumb itemListElement={breadcrumb?.itemListElement} />

              <div class="flex gap-6">
                {isDesktop && (
                  <aside class="w-full max-w-[300px] flex flex-col gap-6">
                    <span class="text-[#333] mt-3">
                      <span class="font-black">
                        {new Intl.NumberFormat("pt-BR").format(
                          page.pageInfo.records ?? 0,
                        )}
                      </span>{" "}
                      encontrados
                    </span>

                    <div class="sticky top-2">
                      <Filters filters={filters} url={props.url} />
                    </div>
                  </aside>
                )}

                <div class="flex flex-col gap-4">
                  {isDesktop && <div class="ml-auto">{sortBy}</div>}

                  {!isDesktop && (
                    <>
                      <span class="text-[#333] mt-3 bg-[#efefef] h-12 flex items-center justify-center">
                        <span>
                          <span class="font-black">
                            {new Intl.NumberFormat("pt-BR").format(
                              page.pageInfo.records ?? 0,
                            )}
                          </span>{" "}
                          encontrados
                        </span>
                      </span>

                      <div class="flex justify-between">
                        {sortBy}

                        <input
                          type="checkbox"
                          id={mobileFilterId}
                          class="hidden peer"
                        />

                        <label
                          for={mobileFilterId}
                          class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] z-10 opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto transition-opacity"
                        />

                        <label
                          for={mobileFilterId}
                          class="h-12 px-4 flex items-center justify-center gap-3 text-[#1c1c1c] font-bold"
                        >
                          <Icon id="filter" size={20} class="text-black" />
                          Filtros
                        </label>

                        <aside class="fixed top-0 left-0 md:w-1/2 w-[80%] h-[100dvh] bg-[#f9f9f9] z-20 -translate-x-full peer-checked:translate-x-0 transition-transform overflow-y-auto overscroll-contain p-4 flex flex-col gap-4">
                          <div class="flex justify-between items-center">
                            <span class="text-[#333] font-bold text-xl">
                              Filtros
                            </span>
                            <label for={mobileFilterId}>
                              <Icon id="close" size={32} class="text-black" />
                            </label>
                          </div>

                          <div class="flex-1">
                            <Filters filters={filters} url={props.url} />
                          </div>

                          <div class="flex justify-center p-4 gap-4 shadow-[0_-1px_1px_0_rgba(0,0,0,0.1)]">
                            <a
                              href={(() => {
                                const url = new URL(props.url);

                                return url.origin + url.pathname;
                              })()}
                              type="button"
                              class="text-[#333] font-bold"
                            >
                              Limpar filtros
                            </a>
                          </div>
                        </aside>
                      </div>
                    </>
                  )}

                  <PageResult {...props} />
                </div>
              </div>
            </div>
          )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container,
          ),
        }}
      />
    </>
  );
}
function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
  if (!page) {
    return <NotFound />;
  }
  return <Result {...props} page={page} />;
}
export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};
export default SearchResult;
