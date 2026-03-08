export const calculateConfidenceScore = ({
  sampleSize,
  spreadPercent,
  medianPrice,
}: {
  sampleSize: number;
  spreadPercent: number;
  medianPrice: number;
}) => {
  if (sampleSize <= 0 || medianPrice <= 0) {
    return 0;
  }

  const sampleComponent = Math.min(sampleSize / 5, 1);
  const spreadComponent = Math.max(0, 1 - spreadPercent / 100);
  return Number(
    ((sampleComponent * 0.55 + spreadComponent * 0.45) * 0.99).toFixed(4),
  );
};
