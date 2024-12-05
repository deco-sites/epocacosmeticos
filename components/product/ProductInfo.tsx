import { asset } from "$fresh/runtime.ts";
import { useDevice } from "@deco/deco/hooks";
import type { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { slugify } from "apps/vtex/utils/slugify.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import ShippingSimulationForm from "../shipping/Form.tsx";
import Icon from "../ui/Icon.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
interface Props {
  page: ProductDetailsPage | null;
}

function ProductInfo({ page }: Props) {
  const id = useId();
  const shippingFormId = useId();
  const isDesktop = useDevice() === "desktop";

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { product, breadcrumbList } = page;
  const { productID, offers, isVariantOf, brand, gtin } = product;
  const title = isVariantOf?.name ?? product.name;

  const {
    price = 0,
    listPrice,
    seller = "1",
    availability,
    billingIncrement,
    sellerName,
  } = useOffer(offers);

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  //Checks if the variant name is "title"/"default title" and if so, the SKU Selector div doesn't render
  const hasValidVariants = isVariantOf?.hasVariant?.some(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ) ?? false;

  return (
    <div class="flex flex-col gap-2.5 p-5 border border-[#f1f1f1]" id={id}>
      {/* See brand */}
      {isDesktop && brand && (
        <span class="text-xs text-[#828282] flex items-center gap-1">
          Ver tudo da marca
          <a
            href={`/${slugify(brand.name ?? "")}`}
            class="underline text-[#e70d91]"
          >
            {brand.name}
          </a>
        </span>
      )}

      <div class="flex items-center justify-between">
        {/* Brand */}
        {brand && (
          <div class="font-bold text-[#333] uppercase">{brand.name}</div>
        )}

        {/* Rating */}
        <div class="flex items-center -translate-y-0.5">
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
      </div>

      {/* Title */}
      {title && <h3 class="text-[#4f4f4f]">{title}</h3>}

      <div class="flex flex-col gap-1">
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
              {formatPrice(price, offers?.priceCurrency)?.replace(
                /\p{Z}/gu,
                "",
              )}
            </span>
            <span class="text-xs text-[#4f4f4f] max-lg:translate-y-0.5">
              no PIX
            </span>
          </div>
        </div>

        {/* Installments */}
        {billingIncrement && (
          <span class="text-[#828282]">
            ou R${billingIncrement.toFixed(2)} no cartão
          </span>
        )}
      </div>

      {/* Sold by */}
      <div class="flex flex-col gap-1">
        {sellerName && (
          <span class="text-[#4f4f4f] text-sm flex items-center gap-1">
            Vendido e entregue por{" "}
            <a
              href={`/${slugify(sellerName)}`}
              class="text-[#e70d91] flex items-center gap-1"
            >
              <Icon id="seller-check" size={16} class="text-[#e70d91]" />
              {sellerName}
              <Icon
                id="chevron-right"
                size={16}
                class="text-[#e70d91] -translate-y-0.5"
              />
            </a>
          </span>
        )}

        <span class="text-[#4f4f4f] text-xs">
          A Época Cosméticos garante a sua compra, do pedido à entrega.
        </span>
      </div>

      {/* Sku Selector */}
      {hasValidVariants && (
        <div className="my-4">
          <ProductSelector product={product} />
        </div>
      )}

      {/* Ref */}
      {gtin && <span class="text-[#4f4f4f] text-xs">Ref: {gtin}</span>}

      {/* Add to Cart and Favorites button */}
      <div class="flex flex-col lg:flex-row gap-2">
        {availability === "https://schema.org/InStock"
          ? (
            <AddToCartButton
              seller={seller}
              item={item}
              product={product}
              class="bg-[#e70d91] text-white font-bold rounded text-lg flex justify-center items-center h-16 flex-1"
              disabled={false}
            />
          )
          : <OutOfStock productID={productID} />}

        {/* Shipping Simulation */}
        <label
          for={shippingFormId}
          class="flex justify-center items-center gap-2 text-[#1c1c1c] border border-[#1c1c1c] rounded w-full lg:w-[200px] h-16 cursor-pointer hover:text-white hover:bg-black transition-colors group"
        >
          Calcular Frete
          <Icon
            id="shipping"
            size={20}
            class="text-[#1c1c1c] group-hover:text-white transition-colors"
          />
        </label>
      </div>

      <ShippingSimulationForm
        id={shippingFormId}
        items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
      />
    </div>
  );
}

export default ProductInfo;
