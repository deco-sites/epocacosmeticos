import type { ImageWidget } from "apps/admin/widgets.ts";
import Section from "../../components/ui/Section.tsx";
import { Picture, SourceWithFit } from "../../components/PictureWithFit.tsx";

export interface Props {
  mobile: ImageWidget;
  desktop: ImageWidget;
  /** @title Link */
  href: string;
  /** @title Descreva a imagem */
  alt: string;
}

export default function Banner({ desktop, mobile, href, alt }: Props) {
  return (
    <div class="mb-10 container">
      <a href={href}>
        <Picture>
          <SourceWithFit
            media="(max-width: 768px)"
            src={mobile}
            width={1280}
            height={425}
            fit="contain"
          />
          <SourceWithFit
            media="(min-width: 769px)"
            src={desktop}
            width={1280}
            height={360}
            fit="contain"
          />
          <img
            loading="lazy"
            src={desktop}
            alt={alt}
            class="max-md:w-[425px] w-full"
          />
        </Picture>
      </a>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
