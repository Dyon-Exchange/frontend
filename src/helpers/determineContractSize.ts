export const determineContractSize = (prodIdentifier: string) => {
  const numBottles = Number(prodIdentifier.slice(11, 13));
  const centiLitresInBottle = (Number(prodIdentifier.slice(14)) / 10).toFixed(
    0
  );

  return `${numBottles} x ${centiLitresInBottle}cL`;
};
