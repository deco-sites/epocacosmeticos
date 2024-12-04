import { asset } from "$fresh/runtime.ts";
import type { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { formatPrice } from "../../sdk/format.ts";
import Print from "../../sdk/Print.tsx";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;
}

const WIDTH = 200;
const HEIGHT = 200;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard({ product, preload }: Props) {
  const { url, image: images, offers, isVariantOf, brand } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front] = images ?? [];

  const { listPrice, price, availability, installments } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const epocaIndica = product.additionalProperty?.some((p) =>
    p.propertyID === "330"
  );
  const freteGratis = product.additionalProperty?.some((p) =>
    p.propertyID === "2555"
  );

  // Plus current product
  const skusCount = (isVariantOf?.hasVariant?.length ?? 0) + 1;

  return (
    <div class="shadow-md px-2 pb-5 pt-0 relative w-full lg:group/card">
      <Print data={product} />

      <a
        href={relativeUrl}
        class="absolute size-full z-10 flex items-center justify-center font-bold opacity-0 pointer-events-none group-hover/card:opacity-100 group-hover/card:pointer-events-auto transition-opacity bg-white/30"
      >
        <div class="text-white bg-[#e70d91] w-full h-[72px] px-2 flex items-center justify-center">
          COMPRAR
        </div>
      </a>

      <figure class="relative" style={{ aspectRatio: ASPECT_RATIO }}>
        {/* Product Images */}
        <a href={relativeUrl} class="">
          <Image
            src={front.url!}
            alt={title}
            width={WIDTH}
            height={HEIGHT}
            class="w-full h-full object-cover"
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
          />
        </a>

        {/* Discounts */}
        {percent >= 1 && inStock && (
          <div class="absolute top-2 left-2 flex flex-col items-center justify-center size-11 bg-[#bf048d] text-xs font-black text-white rounded-full leading-none">
            <span>{percent}%</span>
            <span>OFF</span>

            <div class="size-10 border border-white/80 rounded-full absolute inset-0.5" />
          </div>
        )}

        {/* Epoca Indica e Frete Grátis */}
        {(epocaIndica || freteGratis) && (
          <div class="flex flex-col gap-1 absolute top-2 right-2">
            {epocaIndica && (
              <div class="flex items-center justify-center border px-1 py-0.5 border-[#e70d91] bg-white text-[10px] text-[#e70d91] rounded">
                EPOCA INDICA
              </div>
            )}
            {freteGratis && (
              <div class="flex items-center justify-center border px-1 py-0.5 border-[#e70d91] bg-white text-[10px] text-[#e70d91] rounded">
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
          />
        </div>
      </figure>

      {/* Skus count */}
      {skusCount > 1 && (
        <div class="text-[#4f4f4f] bg-[#f1f1f1] text-center flex items-center justify-center h-[30px]">
          +{skusCount} opções
        </div>
      )}

      {/* Brand */}
      {brand && (
        <div class="font-bold text-[#333] uppercase mt-2 truncate">
          {brand.name}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 class="text-[#4f4f4f] mt-0.5 mb-2 text-xs lg:text-sm h-[14px] md:h-[35px] lg:h-[43px] line-clamp-3">
          {title}
        </h3>
      )}

      <div class="flex-grow" />

      {/* Rating */}
      <div class="flex items-center mb-1">
        <div
          class="w-[105px] h-[22px] relative mr-[3px]"
          style={{
            backgroundPosition: "0px 0px",
            backgroundImage: `url(${asset("/image/rating.png")})`,
          }}
        >
          <div
            class="absolute h-[22px] block"
            style={{
              width: "90%",
              backgroundPosition: "0px -23px",
              backgroundImage: `url(${asset("/image/rating.png")})`,
            }}
          />
        </div>
        <span class="text-xs text-[#333]">(129)</span>
      </div>

      {/* Price */}
      <div class="flex flex-col gap-0.5">
        {listPrice && (
          <span class="text-sm line-through text-[#5e5e5e]">
            {formatPrice(listPrice, offers?.priceCurrency)}
          </span>
        )}
        <div class="flex items-center gap-1">
          <span class="font-bold text-2xl text-[#333]">
            {/* When price is formatted, the space become a &nbsp; */}
            {formatPrice(price, offers?.priceCurrency)?.replace(/\p{Z}/gu, "")}
          </span>
          <span>no PIX</span>
        </div>
      </div>

      {/* Installments */}
      {installments && (
        <span class="text-[#4f4f4f] text-sm">{installments}</span>
      )}
    </div>
  );
}

export default ProductCard;
