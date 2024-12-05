import { useDevice, useScript } from "@deco/deco/hooks";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { clx } from "../../sdk/clx.ts";

/**
 * @titleBy desktopText
 */
export interface Alert {
  /** @title Texto desktop */
  desktopText: RichText;
  /** @title Ícone desktop */
  desktopLeftIcon?: ImageWidget;
  /** @title Texto mobile */
  mobileText: RichText;
  /** @title Ícone mobile */
  mobileLeftIcon?: ImageWidget;
}

interface Props {
  /** @title Alertas */
  alerts: Alert[];
}

export default function Alert({ alerts = [] }: Props) {
  const isDesktop = useDevice() === "desktop";

  return (
    <div class="relative bg-[#e5e3e3]">
      {alerts.map((
        { desktopText, desktopLeftIcon, mobileText, mobileLeftIcon },
        index,
      ) => (
        <div
          data-alert
          class={clx(
            "w-full text-center text-[#333] transition-opacity duration-300",
            !!index &&
              "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 pointer-events-none",
          )}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: isDesktop ? desktopText : mobileText,
            }}
            style={{
              "--left-icon": isDesktop
                ? `url(${desktopLeftIcon})`
                : `url(${mobileLeftIcon})`,
            }}
            class={clx(
              "-translate-y-[3px]",
              (isDesktop ? desktopLeftIcon : mobileLeftIcon) &&
                "[&>p:first-child]:before:content-[var(--left-icon)] [&>p:first-child]:before:inline-block [&>p:first-child]:before:size-6 [&>p:first-child]:before:translate-y-1.5 [&>p:first-child]:before:mr-1",
            )}
          />
        </div>
      ))}
      <script
        dangerouslySetInnerHTML={{
          __html: useScript(async () => {
            const alerts = document.querySelectorAll("[data-alert]");

            let n = 0;

            while (true) {
              await new Promise((resolve) => setTimeout(resolve, 5000));

              alerts[n].classList.add("opacity-0", "pointer-events-none");

              n = (n + 1) % alerts.length;
              alerts[n].classList.remove("opacity-0", "pointer-events-none");
            }
          }),
        }}
      />
    </div>
  );
}
