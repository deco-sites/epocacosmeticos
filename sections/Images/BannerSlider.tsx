import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, SourceWithFit } from "../../components/PictureWithFit.tsx";
import Section from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";

interface Item {
  desktop: ImageWidget;
  mobile: ImageWidget;
  href: string;
  alt: string;
}

interface Props {
  items: Item[];
  preload?: boolean;
}

export default function BannerSlider({ items, preload }: Props) {
  const id = useId();
  const isDesktop = useDevice() === "desktop";

  return (
    <div id={id} class="container relative flex flex-col gap-8 mb-20 md:mb-16">
      <Slider class="carousel w-full gap-4">
        {items.map(({ href, desktop, mobile, alt }, index) => (
          <Slider.Item
            index={index}
            class="carousel-item justify-center w-full md:w-[calc(33.333%-16px+(16px/3))] lg:w-[calc(25%-16px+(16px/4))]"
          >
            <a href={href} class="md:w-full">
              <Picture preload={preload}>
                <SourceWithFit
                  media="(max-width: 768px)"
                  fetchPriority={preload ? "high" : "auto"}
                  src={mobile}
                  width={1280}
                  height={425}
                  fit="contain"
                />
                <SourceWithFit
                  media="(min-width: 769px)"
                  fetchPriority={preload ? "high" : "auto"}
                  src={desktop}
                  width={1280}
                  height={360}
                  fit="contain"
                />
                <img
                  loading={preload ? "eager" : "lazy"}
                  src={desktop}
                  alt={alt}
                  class="max-md:w-[425px] w-full"
                />
              </Picture>
            </a>
          </Slider.Item>
        ))}
      </Slider>

      {!isDesktop && (
        <>
          <div class="flex justify-center gap-3 md:gap-2 absolute -bottom-6 md:bottom-6 left-1/2 -translate-x-1/2">
            {items.map((_, index) => (
              <Slider.Dot
                index={index}
                class="bg-black/20 size-2.5 disabled:bg-[#e70d91] rounded-full"
              />
            ))}
          </div>
          <Slider.JS rootId={id} interval={5000} infinite />
        </>
      )}
    </div>
  );
}

export const LoadingFallback = () => (
  <Section.Container>
    <Section.Placeholder height="471px" />
  </Section.Container>
);
