import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";
import Section from "../../components/ui/Section.tsx";
import Icon from "../../components/ui/Icon.tsx";

/**
 * @titleBy href
 */
interface Brand {
  /** @title Imagem */
  image: ImageWidget;
  /** @title Link */
  href: string;
}

interface Props {
  /** @title Marcas */
  brands: Brand[];
  /** @title Título */
  title: string;
}

export default function BrandSlider({ brands, title }: Props) {
  const id = useId();
  const isDesktop = useDevice() === "desktop";

  return (
    <div id={id} class="container flex flex-col gap-8 mb-16">
      <Section.Header title={title} />

      <div class="relative group">
        <Slider class="carousel w-full gap-3">
          {brands.map(({ href, image }, index) => (
            <Slider.Item
              index={index}
              class="carousel-item w-[calc(50%-12px+(12px/2))] md:w-[calc(33.333%-12px+(12px/3))] lg:w-[calc(25%-12px+(12px/4))] xl:w-[calc(20%-12px+(12px/5))]"
            >
              <a
                href={href}
                class="hover:bg-[#f7f7f7] border border-[#e8e3e8] w-full flex justify-center items-center"
              >
                <Image src={image} width={244} height={140} fit="contain" />
              </a>
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
      </div>

      <Slider.JS rootId={id} infinite />
    </div>
  );
}

export const LoadingFallback = ({ title }: Props) => (
  <Section.Container>
    <Section.Header title={title} />
    <Section.Placeholder height="471px" />
  </Section.Container>
);
