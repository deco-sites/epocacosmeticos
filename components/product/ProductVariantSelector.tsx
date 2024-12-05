import type { Product, ProductLeaf } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { relative } from "../../sdk/url.ts";
import { useId } from "../../sdk/useId.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import { useSection } from "@deco/deco/hooks";
import Image from "apps/website/components/Image.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import Icon from "../ui/Icon.tsx";

interface Props {
  product: Product;
}

export default function VariantSelector({ product }: Props) {
  const { url, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);
  const relativeUrl = relative(url);
  const id = useId();
  const filteredNames = Object.keys(possibilities).filter(
    (name) =>
      name.toLowerCase() !== "title" && name.toLowerCase() !== "default title",
  );

  if (filteredNames.length === 0) return null;

  return (
    <ul
      class="flex flex-col gap-2 lg:gap-4"
      hx-target="closest section"
      hx-swap="outerHTML"
      hx-sync="this:replace"
    >
      {filteredNames.map((name) => (
        <ul class="flex flex-wrap gap-4">
          {Object.entries(possibilities[name])
            .filter(([value]) => value)
            .map(([_value, link]) => {
              const relativeLink = relative(link);
              const checked = relativeLink === relativeUrl;
              const sku = isVariantOf?.hasVariant?.find(
                (variant) => relative(variant.url) === relativeLink,
              ) as ProductLeaf;

              const image = sku.image?.[1]?.url ?? "";

              const { price: skuPrice = 0, availability } = useOffer(
                sku.offers,
              );
              const { price: productPrice = 0 } = useOffer(product.offers);

              const percentageDiscount =
                ((productPrice - skuPrice) / productPrice) * 100 * -1;
              const inStock = availability === "https://schema.org/InStock";

              return (
                <li>
                  <label
                    class="cursor-pointer relative"
                    hx-get={useSection({ href: relativeLink })}
                  >
                    {/* Checkbox for radio button on the frontend */}
                    <input
                      class="hidden peer"
                      type="radio"
                      name={`${id}-${name}`}
                      checked={checked}
                    />

                    <div
                      class={clx(
                        "w-[70px] h-[80px] border flex flex-col relative [.htmx-request_&]:opacity-0 transition-opacity",
                        checked ? "border-[#e70d91]" : "border-[#8b8b8b]",
                        !inStock && "opacity-50",
                      )}
                    >
                      <div class="overflow-hidden border-2 border-white border-b-0 relative">
                        {inStock && percentageDiscount > 0 && (
                          <div class="absolute left-0 bottom-0 bg-black text-white text-[11px] flex justify-center items-center w-full h-4 z-10">
                            -{Math.round(percentageDiscount)}%
                          </div>
                        )}

                        {!inStock && (
                          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <Icon id="close" size={24} class="text-white" />
                          </div>
                        )}

                        <Image
                          src={image}
                          alt={sku.name ?? ""}
                          width={64}
                          height={55}
                          class="scale-[2] translate-x-1"
                          loading="eager"
                        />
                      </div>
                      <div
                        class={clx(
                          "text-xs py-1 flex justify-center items-center",
                          checked
                            ? "text-black bg-white"
                            : "text-[#8b8b8b] bg-[#f0f0f0]",
                        )}
                      >
                        {sku.name}
                      </div>
                    </div>

                    {/* Loading spinner */}
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 [.htmx-request_&]:opacity-100 transition-opacity flex justify-center items-center">
                      <span class="loading loading-sm loading-spinner" />
                    </div>
                  </label>
                </li>
              );
            })}
        </ul>
      ))}
    </ul>
  );
}
