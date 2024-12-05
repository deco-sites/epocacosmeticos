import type { ProductListingPage } from "apps/commerce/types.ts";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";

interface Props {
  page: ProductListingPage | null;
}

export default function PLPBreadcrumb({ page }: Props) {
  if (!page) return null;

  return (
    <div class="container h-12 flex items-center">
      <Breadcrumb itemListElement={page.breadcrumb?.itemListElement ?? []} />
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="48px" />;
