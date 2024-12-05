import { useScript } from "@deco/deco/hooks";
import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { MINICART_DRAWER_ID } from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}
const onClick = (MINICART_DRAWER_ID: string) => {
  event?.stopPropagation();

  const button = event?.currentTarget as HTMLButtonElement | null;
  const container = button!.closest<HTMLDivElement>("div[data-cart-item]")!;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!),
  );
  const minicartDrawer = document.getElementById(
    MINICART_DRAWER_ID,
  ) as HTMLInputElement;

  window.STOREFRONT.CART.addToCart(item, platformProps);

  setTimeout(() => {
    minicartDrawer.checked = true;
  }, 1000);
};
// const onChange = () => {
//     const input = event!.currentTarget as HTMLInputElement
//     const productID = input!.closest('div[data-cart-item]')!.getAttribute('data-item-id')!
//     const quantity = Number(input.value)
//     if (!input.validity.valid) {
//         return
//     }
//     window.STOREFRONT.CART.setQuantity(productID, quantity)
// }
// Copy cart form values into AddToCartButton
const onLoad = (id: string) => {
  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(id);
    const checkbox = container?.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    const input = container?.querySelector<HTMLInputElement>(
      'input[type="number"]',
    );
    const itemID = container?.getAttribute("data-item-id")!;
    const quantity = sdk.getQuantity(itemID) || 0;
    if (!input || !checkbox) {
      return;
    }
    input.value = quantity.toString();
    // checkbox.checked = quantity > 0
    // enable interactivity
    container?.querySelectorAll<HTMLButtonElement>("button").forEach(
      (node) => (node.disabled = false),
    );
    container?.querySelectorAll<HTMLButtonElement>("input").forEach(
      (node) => (node.disabled = false),
    );
  });
};
const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;
  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity: 1, seller: seller, id: productID }],
    };
  }
  if (platform === "shopify") {
    return { lines: { merchandiseId: productID } };
  }
  if (platform === "vnda") {
    return {
      quantity: 1,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "wake") {
    return {
      productVariantId: Number(productID),
      quantity: 1,
    };
  }
  if (platform === "nuvemshop") {
    return {
      quantity: 1,
      itemId: Number(productGroupID),
      add_to_cart_enhanced: "1",
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "linx") {
    return {
      ProductID: productGroupID,
      SkuID: productID,
      Quantity: 1,
    };
  }
  return null;
};
function AddToCartButton(props: Props) {
  const { product, item, class: _class } = props;
  const platformProps = useAddToCart(props);
  const id = useId();

  return (
    <div
      id={id}
      class="flex flex-1"
      data-item-id={product.productID}
      data-cart-item={encodeURIComponent(
        JSON.stringify({ item, platformProps }),
      )}
    >
      <input type="checkbox" class="hidden peer" />

      <button
        disabled
        class={clx(
          "flex-grow peer-checked:hidden relative overflow-hidden group/add-to-cart",
          _class?.toString(),
        )}
        hx-on:click={useScript(onClick, MINICART_DRAWER_ID)}
      >
        <span class="group-disabled/add-to-cart:hidden">COMPRAR</span>
        <div class="group-disabled/add-to-cart:hidden absolute top-0 -left-[4em] w-[150px] h-full opacity-30 -skew-x-[45deg] translate-x-0 animate-[add-to-cart-skew-animation_4s_infinite] bg-[linear-gradient(-90deg,hsla(0,0%,100%,0),hsla(0,0%,100%,.75)_50%,hsla(0,0%,100%,.75)_51%,hsla(0,0%,100%,0))] pointer-events-none" />
        <span class="group-disabled/add-to-cart:inline hidden loading loading-spinner" />
      </button>

      {/* Quantity Input */}
      <div class="flex-grow hidden peer-checked:flex">
        <input type="number" class="hidden" value={1} />
        {/* <QuantitySelector disabled min={0} max={100} hx-on:change={useScript(onChange)} /> */}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}
export default AddToCartButton;
