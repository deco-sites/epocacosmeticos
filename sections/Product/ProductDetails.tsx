import type { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";
import Slider from "../../components/ui/Slider.tsx";
import { useDevice } from "@deco/deco/hooks";
import Icon from "../../components/ui/Icon.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import WishlistButton from "../../components/wishlist/WishlistButton.tsx";
import Print from "../../sdk/Print.tsx";
import { slugify } from "apps/vtex/utils/slugify.ts";

export interface Props {
  /** @title Integração	 */
  page: ProductDetailsPage | null;
}

function Gallery({ product }: { product: Product }) {
  const images = product.image ?? [];
  const id = useId();
  const isDesktop = useDevice() === "desktop";

  const { offers } = product;

  const { listPrice, price, availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";

  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const epocaIndica = product.additionalProperty?.some((p) =>
    p.propertyID === "330"
  );
  const freteGratis = product.additionalProperty?.some((p) =>
    p.propertyID === "2555"
  );

  return (
    <div id={id} class="flex gap-4">
      <Print data={product} />

      {isDesktop && (
        <div class="flex flex-col gap-1 h-[450px] overflow-y-auto overscroll-contain carousel carousel-vertical">
          {images.map((image) => (
            <Image
              src={image.url ?? ""}
              alt={image.alternateName}
              width={96}
              height={96}
            />
          ))}
        </div>
      )}

      <div class="flex-1 relative">
        {/* Discounts */}
        {percent >= 1 && inStock && (
          <div class="absolute top-2 right-2 flex flex-col items-center justify-center size-[70px] bg-[#bf048d] font-black text-white rounded-full leading-none">
            <span class="text-2xl/none">{percent}%</span>
            <span>OFF</span>

            <div class="size-[65px] border border-white/80 rounded-full absolute inset-0.5" />
          </div>
        )}

        {/* Epoca Indica e Frete Grátis */}
        {(epocaIndica || freteGratis) && (
          <div class="flex flex-col gap-1 absolute top-2 left-2">
            {epocaIndica && (
              <div class="flex items-center justify-center border px-1.5 py-1 border-[#e70d91] bg-white text-xs text-[#e70d91] rounded">
                EPOCA INDICA
              </div>
            )}
            {freteGratis && (
              <div class="flex items-center justify-center border px-1.5 py-1 border-[#e70d91] bg-white text-xs text-[#e70d91] rounded">
                FRETE GRÁTIS
              </div>
            )}
          </div>
        )}

        {/* Wishlist button */}
        <div class="absolute bottom-2 left-2">
          <WishlistButton
            productID={product.productID}
            productGroupID={product.isVariantOf?.productGroupID ?? ""}
            variant="big"
          />
        </div>

        <Slider class="carousel">
          {images.map((image, index) => (
            <Slider.Item
              index={index}
              class="carousel-item w-full flex justify-center items-center"
            >
              <Image
                src={image.url ?? ""}
                alt={image.alternateName}
                width={450}
                height={450}
                fit="contain"
              />
            </Slider.Item>
          ))}
        </Slider>

        <Slider.PrevButton
          class="absolute top-1/2 -translate-y-1/2 left-2 group"
          disabled={false}
        >
          <Icon
            id="chevron-right"
            class="rotate-180 text-[#999] group-hover:text-[#e70d91]"
            size={40}
          />
        </Slider.PrevButton>

        <Slider.NextButton
          class="absolute top-1/2 -translate-y-1/2 right-2 group"
          disabled={false}
        >
          <Icon
            id="chevron-right"
            size={40}
            class="text-[#999] group-hover:text-[#e70d91]"
          />
        </Slider.NextButton>

        {!isDesktop && (
          <div class="flex justify-center gap-3 absolute -bottom-2 left-1/2 -translate-x-1/2">
            {images.map((_, index) => (
              <Slider.Dot
                index={index}
                class="bg-[#f1f1f1] size-4 disabled:bg-[#e70d91] rounded-full shadow-[0_2px_2px_#1a1a1a]"
              />
            ))}
          </div>
        )}

        <Slider.JS rootId={id} infinite />
      </div>
    </div>
  );
}

export default function ProductDetails({ page }: Props) {
  /**
   * Rendered when a not found is returned by any of the loaders run on this page
   */
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Page not found</span>
          <a href="/" class="btn no-animation">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  const isDesktop = useDevice() === "desktop";
  const { product } = page;
  const { description, brand } = product;

  return (
    <div class="container flex flex-col gap-4 mb-8">
      <div class="my-4">
        <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
      </div>

      <div class="flex gap-4">
        <div class="w-full lg:w-[55%] flex flex-col gap-8">
          <Gallery product={page.product} />

          {!isDesktop && (
            <div class="flex flex-col gap-2">
              {brand && (
                <span class="text-xs text-[#828282] flex justify-center items-center gap-1">
                  Ver tudo da marca
                  <a
                    href={`/${slugify(brand.name ?? "")}`}
                    class="underline text-[#e70d91]"
                  >
                    {brand.name}
                  </a>
                </span>
              )}
              <ProductInfo page={page} />
            </div>
          )}

          <div class="p-4 pt-6 border border-[#d1d1d1] border-t-0 relative">
            <div class="absolute top-0 left-0 w-full h-2 bg-[#f9c3c9]" />
            <div class="absolute top-1 left-4 bg-white px-2 text-[#1c1c1c] font-medium -translate-y-1/2">
              DESCRIÇÃO
            </div>

            <div
              class="whitespace-pre-line text-[#333]"
              dangerouslySetInnerHTML={{ __html: description ?? "" }}
            />
          </div>
        </div>

        {isDesktop && (
          <div class="flex-1 flex flex-col gap-4">
            <ProductInfo page={page} />
          </div>
        )}
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
