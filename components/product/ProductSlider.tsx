import type { Product } from "apps/commerce/types.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useDevice } from "@deco/deco/hooks";

interface Props {
  products: Product[];
}

function ProductSlider({ products }: Props) {
  const id = useId();
  const isDesktop = useDevice() === "desktop";

  return (
    <div id={id} class="relative group">
      <Slider class="carousel gap-4 w-full pb-2">
        {products?.map((product, index) => (
          <Slider.Item
            index={index}
            class="carousel-item w-[calc(50%-16px+(16px/2))] md:w-[calc(33.333%-16px+(16px/3))] lg:w-[calc(25%-16px+(16px/4))] xl:w-[calc(20%-16px+(16px/5))]"
          >
            <ProductCard product={product} />
          </Slider.Item>
        ))}
      </Slider>

      {isDesktop && (
        <>
          <Slider.PrevButton
            class="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={false}
          >
            <Icon
              id="really-large-chevron-right"
              class="rotate-180"
              width={47}
              height={91}
            />
          </Slider.PrevButton>

          <Slider.NextButton
            class="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={false}
          >
            <Icon id="really-large-chevron-right" width={47} height={91} />
          </Slider.NextButton>
        </>
      )}

      {!isDesktop && (
        <div class="flex justify-center gap-2 mt-2 mx-auto">
          {products.map((_, index) => (
            <Slider.Dot
              index={index}
              class="bg-black/20 size-2.5 disabled:bg-[#e70d91] rounded-full"
            />
          ))}
        </div>
      )}

      <Slider.JS rootId={id} />
    </div>
  );
}

export default ProductSlider;
