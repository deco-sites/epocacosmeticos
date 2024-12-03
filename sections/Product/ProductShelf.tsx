import type { Product } from "apps/commerce/types.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  type Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";

export interface Props extends SectionHeaderProps {
  products: Product[] | null;
}

export default function ProductShelf({ products, title }: Props) {
  if (!products?.length) return null;

  return (
    <div class="container flex flex-col gap-6 mb-8">
      <Section.Header title={title} />

      <ProductSlider products={products} />
    </div>
  );
}
export const LoadingFallback = ({ title }: Props) => (
  <Section.Container>
    <Section.Header title={title} />
    <Section.Placeholder height="471px" />
  </Section.Container>
);
