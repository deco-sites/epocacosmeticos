import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture } from "apps/website/components/Picture.tsx";
import { SourceWithFit } from "../../components/PictureWithFit.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";

/**
 * @titleBy alt
 */
export interface Banner {
  desktop: ImageWidget;
  mobile: ImageWidget;
  alt: string;
  href: string;
}

export interface Props {
  images?: Banner[];
  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  preload?: boolean;
}

function Carousel({ images = [], preload }: Props) {
  const id = useId();
  const isDesktop = useDevice() === "desktop";

  return (
    <div id={id} class="container relative group mb-10 md:mb-6">
      <Slider class="carousel carousel-center w-full">
        {images.map(({ href, mobile, desktop, alt }, index) => {
          const lcp = index === 0 && preload;

          return (
            <Slider.Item
              index={index}
              class="carousel-item w-full flex justify-center items-center"
            >
              <a href={href} class="md:w-full">
                <Picture preload={lcp}>
                  <SourceWithFit
                    media="(max-width: 768px)"
                    fetchPriority={lcp ? "high" : "auto"}
                    src={mobile}
                    width={1280}
                    height={425}
                    fit="contain"
                  />
                  <SourceWithFit
                    media="(min-width: 769px)"
                    fetchPriority={lcp ? "high" : "auto"}
                    src={desktop}
                    width={1280}
                    height={360}
                    fit="contain"
                  />
                  <img
                    loading={lcp ? "eager" : "lazy"}
                    src={desktop}
                    alt={alt}
                    class="max-md:w-[425px] w-full"
                  />
                </Picture>
              </a>
            </Slider.Item>
          );
        })}
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

      <div class="flex justify-center gap-3 md:gap-2 absolute -bottom-4 md:bottom-6 left-1/2 -translate-x-1/2">
        {images.map((_, index) => (
          <Slider.Dot
            index={index}
            class="bg-black/20 size-2.5 disabled:bg-[#e70d91] rounded-full"
          />
        ))}
      </div>

      <Slider.JS rootId={id} interval={5000} infinite />
    </div>
  );
}

export default Carousel;
