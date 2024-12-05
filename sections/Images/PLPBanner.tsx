import type { ImageWidget } from "apps/admin/widgets.ts";
import Section from "../../components/ui/Section.tsx";
import { Picture, SourceWithFit } from "../../components/PictureWithFit.tsx";

export interface Props {
  mobile: ImageWidget;
  desktop: ImageWidget;
  /** @title Link */
  href: string;
  /** @title Título */
  title: string;
  /** @title Descrição */
  description: string;
}

export default function Banner(
  { desktop, mobile, href, title, description }: Props,
) {
  return (
    <div class="w-full shadow-md mb-4">
      <div class="sm:container flex flex-col xl:flex-row items-center gap-4">
        <div class="flex flex-col gap-3 p-4 xl:w-1/3">
          <h1 class="text-3xl font-semibold text-[#333]">{title}</h1>
          <p class="text-sm text-[#666]">{description}</p>
        </div>

        <a href={href}>
          <Picture>
            <SourceWithFit
              media="(max-width: 768px)"
              src={mobile}
              width={640}
              height={300}
              fit="contain"
            />
            <SourceWithFit
              media="(min-width: 769px)"
              src={desktop}
              width={955}
              height={290}
              fit="contain"
            />
            <img loading="lazy" src={desktop} alt={title} class="w-full" />
          </Picture>
        </a>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
