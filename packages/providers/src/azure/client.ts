import { type AzureRetailPriceItem, azureGpuSearchTerms } from './catalog';

interface AzureRetailPriceResponse {
  Items: AzureRetailPriceItem[];
  NextPageLink?: string | null;
}

const azureRetailApiBaseUrl = 'https://prices.azure.com/api/retail/prices';

const buildAzureRetailFilter = (searchTerm: string) =>
  [
    "serviceName eq 'Virtual Machines'",
    `contains(armSkuName, '${searchTerm}')`,
    "priceType eq 'Consumption'",
  ].join(' and ');

const fetchAzureRetailPage = async (
  url: string,
): Promise<AzureRetailPriceResponse> => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Azure retail API request failed with ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as AzureRetailPriceResponse;
};

export const fetchAzureRetailItems = async () => {
  const items: AzureRetailPriceItem[] = [];

  for (const searchTerm of azureGpuSearchTerms) {
    let nextUrl = `${azureRetailApiBaseUrl}?$filter=${encodeURIComponent(
      buildAzureRetailFilter(searchTerm),
    )}`;

    while (nextUrl) {
      const page = await fetchAzureRetailPage(nextUrl);
      items.push(...page.Items);
      nextUrl = page.NextPageLink ?? '';
    }
  }

  return items;
};
