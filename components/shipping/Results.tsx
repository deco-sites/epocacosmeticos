import { AppContext } from "apps/vtex/mod.ts";
import type { SimulationOrderForm, SKU, Sla } from "apps/vtex/utils/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import { ComponentProps, useComponent } from "../../sections/Component.tsx";
import Icon from "../ui/Icon.tsx";
export interface Props {
  items: SKU[];
  id: string;
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  try {
    const result = (await ctx.invoke("vtex/actions/cart/simulation.ts", {
      items: props.items,
      postalCode: `${form.get("postalCode") ?? ""}`,
      country: "BRA",
    })) as SimulationOrderForm | null;

    return { result, ...props };
  } catch {
    return { result: null, ...props };
  }
}

export default function Results(
  { result, items, id }: ComponentProps<typeof action>,
) {
  const methods = result?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  if (!methods.length) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <div id="results">
      <input type="checkbox" id={id} class="hidden peer" checked />

      <div class="relative hidden peer-checked:flex flex-col gap-4 p-5 border border-[#e8e3e8]">
        <label for={id}>
          <Icon
            id="close"
            size={20}
            class="text-[#1c1c1c] hover:text-[#e70d91] cursor-pointer absolute top-5 right-5"
          />

          <span class="text-[#e70d91]">Valores e tempo de entrega</span>
        </label>

        <ul class="flex flex-col gap-1">
          {methods.map((method) => (
            <li class="border border-[#e8e3e8] p-5 flex flex-col gap-1 lg:gap-2">
              <span class="text-[#e70d91] font-bold text-[13px]">
                Entrega {method.name}
              </span>

              <div class="flex justify-between items-center">
                <div class="w-[70%] text-[#4f4f4f] text-[13px]">
                  Entrega em até{" "}
                  {formatShippingEstimate(method.shippingEstimate)}{" "}
                  após a confirmação do pagamento
                </div>
                <div class="flex-1">
                  {method.price === 0
                    ? (
                      "Grátis"
                    )
                    : (
                      <span class="text-[#4f4f4f] text-[13px] flex items-center gap-1">
                        Valor:
                        <span class="font-bold text-[#e70d91]">
                          {formatPrice(method.price / 100, "BRL", "pt-BR")}
                        </span>
                      </span>
                    )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          hx-get={useComponent(import.meta.resolve("./Form.tsx"), {
            items,
            id,
            checked: true,
          })}
          hx-target="#results"
          hx-swap="outerHTML"
          hx-select="section > *"
          class="text-[#e70d91] text-sm underline underline-offset-4 w-fit"
        >
          Buscar outro Cep
        </button>
      </div>
    </div>
  );
}
