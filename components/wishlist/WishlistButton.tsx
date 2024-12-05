import { useScript } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";

interface Props {
  productID: string;
  productGroupID: string;
  variant?: "big";
}

const onLoad = (id: string, productID: string) =>
  window.STOREFRONT.WISHLIST.subscribe((sdk) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    const inWishlist = sdk.inWishlist(productID);
    button.disabled = false;
    button.classList.remove("htmx-request");
    button.querySelector("svg")?.setAttribute(
      "fill",
      inWishlist ? "black" : "none",
    );
    const span = button.querySelector("span");
    if (span) {
      span.innerHTML = inWishlist ? "Remove from wishlist" : "Add to wishlist";
    }
  });

const onClick = (productID: string, productGroupID: string) => {
  const button = event?.currentTarget as HTMLButtonElement;
  const user = window.STOREFRONT.USER.getUser();

  if (user?.email) {
    button.classList.add("htmx-request");
    window.STOREFRONT.WISHLIST.toggle(productID, productGroupID);
  } else {
    alert("Please login to add the product to your wishlist");
  }
};

function WishlistButton({ productID, productGroupID, variant }: Props) {
  const id = useId();

  return (
    <>
      <button
        id={id}
        type="button"
        data-wishlist-button
        disabled
        hx-on:click={useScript(onClick, productID, productGroupID)}
        class={clx(
          "rounded-full bg-[#f7f7f7] border border-transparent hover:border-[#E70D91] group/wishlist flex items-center justify-center transition-colors",
          variant === "big" ? "size-10" : "size-8",
        )}
      >
        <Icon
          id="heart-wishlist"
          class="[.htmx-request_&]:hidden text-[#E70D91] group-hover/wishlist:fill-[#E70D91] transition-colors"
          size={variant === "big" ? 32 : undefined}
        />
        <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
      </button>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id, productID) }}
      />
    </>
  );
}
export default WishlistButton;
