import type { ImageWidget } from "apps/admin/widgets.ts";
import Section from "../../components/ui/Section.tsx";
import { Picture, SourceWithFit } from "../../components/PictureWithFit.tsx";

export interface Props {
  mobile: ImageWidget;
  desktop: ImageWidget;
  /** @title Link */
  href: string;
}

export default function Banner({ desktop, mobile, href }: Props) {
  return (
    <div class="my-4 container">
      <a href={href}>
        <Picture>
          <SourceWithFit
            media="(max-width: 768px)"
            src={mobile}
            width={640}
            height={120}
            fit="contain"
          />
          <SourceWithFit
            media="(min-width: 769px)"
            src={desktop}
            width={955}
            height={290}
            fit="contain"
          />
          <img loading="lazy" src={desktop} alt="Banner" class="w-full" />
        </Picture>
      </a>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
