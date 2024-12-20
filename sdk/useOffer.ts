import type {
  AggregateOffer,
  UnitPriceSpecification,
} from "apps/commerce/types.ts";

const bestInstallment = (
  acc: UnitPriceSpecification | null,
  curr: UnitPriceSpecification,
) => {
  if (curr.priceComponentType !== "https://schema.org/Installment") {
    return acc;
  }

  if (!acc) {
    return curr;
  }

  if (acc.price > curr.price) {
    return curr;
  }

  if (acc.price < curr.price) {
    return acc;
  }

  if (
    acc.billingDuration && curr.billingDuration &&
    acc.billingDuration < curr.billingDuration
  ) {
    return curr;
  }

  return acc;
};

const installmentToString = (installment: UnitPriceSpecification) => {
  const { billingDuration, billingIncrement } = installment;

  if (!billingDuration || !billingIncrement) return "";

  return billingDuration === 1
    ? `ou R$${billingIncrement} no cartão`
    : `em até ${billingDuration}x de R$${billingIncrement} no cartão`;
};

const IGNORE_INSTALLMENTS = ["vale", "pix"];

export const useOffer = (aggregateOffer?: AggregateOffer) => {
  const offer = aggregateOffer?.offers[0];
  const listPrice = offer?.priceSpecification.find((spec) =>
    spec.priceType === "https://schema.org/ListPrice"
  );
  const installment = offer?.priceSpecification
    .filter(({ name }) =>
      !IGNORE_INSTALLMENTS.includes(name?.toLowerCase() ?? "")
    )
    .reduce(bestInstallment, null);
  const seller = offer?.seller;
  const price = offer?.price;
  const availability = offer?.availability;
  const sellerName = offer?.sellerName;

  return {
    price,
    listPrice: listPrice?.price,
    availability,
    seller,
    installments: installment ? installmentToString(installment) : null,
    billingIncrement: installment ? installment.billingIncrement : null,
    sellerName,
  };
};
