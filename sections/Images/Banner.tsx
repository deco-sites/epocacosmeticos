import type { ImageWidget } from "apps/admin/widgets.ts";
import Section from "../../components/ui/Section.tsx";

export interface Props {
  mobile: ImageWidget;
  desktop: ImageWidget;
}

export default function Banner(_props: Props) {
  return null;
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
