import { useScript } from "@deco/deco/hooks";

export type RangeProps = {
  max: number;
  min: number;
  params: string;
};

type RangeValue = {
  max: number;
  min: number;
};

export const Range = ({ max, min, params }: RangeProps) => {
  const price = {
    max: Number.isFinite(max) ? max : 1000,
    min: Number.isFinite(min) ? min : 0,
  };

  const nearest = 0; // (max - min) / 10
  const interval = max - min;

  const format = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format;

  return (
    <>
      <div class="flex flex-col gap-4 w-full">
        <div class="flex justify-between items-center text-[#727273] text-sm">
          <div class="group/min relative">
            <div class="flex flex-col group-hover/min:opacity-0 transition-opacity">
              <span class="text-[10px] leading-tight">Mínimo</span>
              <span data-min-price class="text-sm">
                {format(price.min).replace(/,\d{2}$/, "")}
              </span>
            </div>

            <span
              data-min-price
              class="text-[#333] absolute inset-0 flex items-center justify-center opacity-0 group-hover/min:opacity-100 transition-opacity"
            >
              {format(price.max - price.min).replace(/,\d{2}$/, "")}
            </span>
          </div>

          <div class="group/max relative">
            <div class="flex flex-col group-hover/max:opacity-0 transition-opacity">
              <span class="text-[10px] leading-tight">Máximo</span>
              <span data-max-price class="text-sm">
                {format(price.max).replace(/,\d{2}$/, "")}
              </span>
            </div>

            <span
              data-max-price
              class="text-[#333] absolute inset-0 flex items-center justify-center opacity-0 group-hover/max:opacity-100 transition-opacity"
            >
              {format(price.max - price.min).replace(/,\d{2}$/, "")}
            </span>
          </div>
        </div>

        <div class="flex items-center relative w-full">
          <div class="bg-[#CCCCCC] flex h-1 items-center relative w-full">
            <div
              id="range-bar"
              class="absolute bg-[#ffcdce] h-full flex"
              style={{
                left: `${(100 * (price.min - min)) / interval}%`,
                right: `${(100 * (price.max - min)) / interval}%`,
                width: `${(100 * (price.max - price.min)) / interval}%`,
              }}
            />
          </div>

          <label class="absolute flex w-full">
            <input
              aria-label="Ranger de preço"
              id="left-range"
              class="w-full appearance-none flex items-center bg-transparent cursor-pointer h-0 outline-0"
              max={max}
              min={min}
              step={(max - min) / 100}
              type="range"
              value={price.min}
            />
          </label>

          <label class="absolute flex w-full">
            <input
              aria-label="Ranger de preço"
              id="right-range"
              class="w-full appearance-none flex items-center bg-transparent cursor-pointer h-0 outline-0"
              max={max}
              min={min}
              step={(max - min) / 100}
              type="range"
              value={price.max}
            />
          </label>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: useScript(
            (
              defaultPrice: RangeValue,
              nearest: number,
              interval: number,
              _params: string,
            ) => {
              function debounce(fn: () => void, ms: number) {
                let id: number;

                return () => {
                  clearTimeout(id);
                  id = setTimeout(fn, ms);
                };
              }

              const { min } = defaultPrice;
              const price = defaultPrice;

              let lastValue = price;
              let isDown = false;

              const leftRange = document.getElementById(
                "left-range",
              ) as HTMLInputElement;
              const rightRange = document.getElementById(
                "right-range",
              ) as HTMLInputElement;
              const rangeBar = document.getElementById(
                "range-bar",
              ) as HTMLElement;
              const minPrices = document.querySelectorAll<HTMLElement>(
                "[data-min-price]",
              );
              const maxPrices = document.querySelectorAll<HTMLElement>(
                "[data-max-price]",
              );

              const format = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format;

              const debouncedSetParam = debounce(() => {
                if (
                  (lastValue.min === price.min &&
                    lastValue.max === price.max) || isDown
                ) return;

                const params = new URLSearchParams(_params);
                params.set("filter.price", `${price.min}:${price.max}`);

                location.search = params.toString();
              }, 1500);

              function updateLastValue(e: MouseEvent | TouchEvent) {
                isDown = true;

                let x = 0;
                let y = 0;

                if (e.type === "touchstart" || e.type === "touchend") {
                  x = (e as TouchEvent).touches[0].clientX;
                  y = (e as TouchEvent).touches[0].clientY;
                } else {
                  x = (e as MouseEvent).clientX;
                  y = (e as MouseEvent).clientY;
                }

                const mouseOnElement = document.elementFromPoint(x, y);
                const wasInInputRange = mouseOnElement?.matches(
                  "input[type=range]",
                );

                if (wasInInputRange) {
                  // By passing only "price", it's passed by reference, which makes lastValue === price always true
                  lastValue = { ...price };
                }
              }

              function doSetParam() {
                isDown = false;
                debouncedSetParam();
              }

              addEventListener("mousedown", updateLastValue);
              addEventListener("touchstart", updateLastValue);
              addEventListener("mouseup", doSetParam);
              addEventListener("touchend", doSetParam);

              function update() {
                rangeBar.style.left = `${
                  (100 * (price.min - min)) / interval
                }%`;
                rangeBar.style.right = `${
                  (100 * (price.max - min)) / interval
                }%`;
                rangeBar.style.width = `${
                  (100 * (price.max - price.min)) / interval
                }%`;

                for (const minPrice of minPrices) {
                  minPrice.textContent = format(price.min).replace(
                    /,\d{2}$/,
                    "",
                  );
                }

                for (const maxPrice of maxPrices) {
                  maxPrice.textContent = format(price.max).replace(
                    /,\d{2}$/,
                    "",
                  );
                }
              }

              leftRange.addEventListener("input", () => {
                const float = Number(leftRange.value);

                if (float >= price.max - nearest) {
                  price.min = price.max - nearest;
                } else {
                  price.min = float;
                }

                leftRange.value = String(price.min);
                update();
              });
              rightRange.addEventListener("input", () => {
                const float = Number(rightRange.value);

                if (float <= price.min + nearest) {
                  price.max = price.min + nearest;
                } else {
                  price.max = float;
                }

                rightRange.value = String(price.max);
                update();
              });
            },
            price,
            nearest,
            interval,
            params,
          ),
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
/******** Chrome, Safari, Opera and Edge Chromium styles ********/
/* slider track */
input[type="range"]::-webkit-slider-runnable-track {
  background-color: transparent;
  height: 0;
}

/* slider thumb */
input[type="range"]::-webkit-slider-thumb {
  /* Override default look */
  appearance: none;
  /* Centers thumb on the track */
  background-color: #e70d91;
  border-radius: 50%;
  height: 16px;
  transform: translateY(-50%);
  width: 16px;
  transition: background-color 0.15s ease-in-out;
  cursor: col-resize;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background-color: #ffcdce;
}

input[type="range"]:focus::-webkit-slider-thumb {
  outline: none;
}

/*********** Firefox styles ***********/
/* slider track */
input[type="range"]::-moz-range-track {
  background-color: transparent;
  height: 0;
}

/* slider thumb */
input[type="range"]::-moz-range-thumb {
  /* Override default look */
  appearance: none;
  /* Centers thumb on the track */
  background-color: transparent;
  border-radius: 50%;
  box-shadow: 0 0 0.625rem #00000033;
  height: 1.25rem;
  transform: translateY(-50%);
  width: 1.25rem;
}

input[type="range"]:focus::-moz-range-thumb {
  outline: none;
}
        `,
        }}
      />
    </>
  );
};

export default Range;
