export type SourceAccessLevel =
  | 'official_api'
  | 'authenticated_api'
  | 'official_page'
  | 'manual_quote';

export interface ProviderSourceCoverage {
  provider: string;
  segment: string;
  accessLevel: SourceAccessLevel;
  coverage: string;
  integrationStatus: 'ready' | 'possible' | 'manual';
  referenceUrl: string;
  notes: string;
}

export const sourceCoverage: ProviderSourceCoverage[] = [
  {
    provider: 'AWS',
    segment: 'Hyperscaler',
    accessLevel: 'official_api',
    coverage: 'On-demand via Price List API, spot via EC2 spot history APIs.',
    integrationStatus: 'ready',
    referenceUrl:
      'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html',
    notes:
      'Best machine-readable source for large-scale regional coverage once filters are mapped to GPU instance families.',
  },
  {
    provider: 'Azure',
    segment: 'Hyperscaler',
    accessLevel: 'official_api',
    coverage: 'Retail VM prices across regions and SKUs.',
    integrationStatus: 'ready',
    referenceUrl:
      'https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices',
    notes:
      'Unauthenticated retail API is usable for public comparison, but spot handling and SKU normalization need care.',
  },
  {
    provider: 'Google Cloud',
    segment: 'Hyperscaler',
    accessLevel: 'official_api',
    coverage:
      'Public catalog SKUs and regional pricing through Billing Catalog API.',
    integrationStatus: 'ready',
    referenceUrl: 'https://cloud.google.com/billing/v1/how-tos/catalog-api',
    notes:
      'Strong source for public list prices, though GPU SKU mapping is more complex than VM-family vendors.',
  },
  {
    provider: 'Runpod',
    segment: 'Specialized GPU cloud',
    accessLevel: 'authenticated_api',
    coverage:
      'Current per-GPU pricing is exposed in platform docs and API payloads.',
    integrationStatus: 'possible',
    referenceUrl: 'https://docs.runpod.io/serverless/pricing',
    notes:
      'Good candidate for near-live pricing, but some views remain product-specific instead of one clean catalog endpoint.',
  },
  {
    provider: 'Vast.ai',
    segment: 'Marketplace',
    accessLevel: 'authenticated_api',
    coverage:
      'Search-offers API exposes real-time marketplace supply and pricing.',
    integrationStatus: 'possible',
    referenceUrl: 'https://docs.vast.ai/api-reference/search/search-offers',
    notes:
      'Excellent for live marketplace rates, but results are host-level offers rather than normalized cloud SKUs.',
  },
  {
    provider: 'CoreWeave',
    segment: 'Specialized GPU cloud',
    accessLevel: 'official_page',
    coverage: 'Published pricing pages exist for many instance families.',
    integrationStatus: 'possible',
    referenceUrl: 'https://www.coreweave.com/pricing',
    notes:
      'Public pricing is available, but a general public pricing API is not obvious from current docs.',
  },
  {
    provider: 'Lambda',
    segment: 'Specialized GPU cloud',
    accessLevel: 'official_page',
    coverage: 'Public GPU cloud pricing page with hourly prices.',
    integrationStatus: 'possible',
    referenceUrl: 'https://lambda.ai/pricing',
    notes:
      'Useful as a public source, but likely page-ingestion rather than stable API ingestion.',
  },
  {
    provider: 'OCI',
    segment: 'Hyperscaler',
    accessLevel: 'official_page',
    coverage:
      'Public pricing pages and estimator exist, but API-grade price discovery is not obvious.',
    integrationStatus: 'manual',
    referenceUrl: 'https://www.oracle.com/cloud/pricing/',
    notes:
      'Feasible to support later, but not first-wave if the goal is reliable automated ingestion.',
  },
];

export const sourceAccessLabels: Record<SourceAccessLevel, string> = {
  official_api: 'Official API',
  authenticated_api: 'Authenticated API',
  official_page: 'Public pricing page',
  manual_quote: 'Manual quote',
};

export const getSourceCoverageSummary = () => ({
  totalProviders: sourceCoverage.length,
  apiReadyProviders: sourceCoverage.filter(
    (entry) =>
      entry.accessLevel === 'official_api' ||
      entry.accessLevel === 'authenticated_api',
  ).length,
  launchReadyProviders: sourceCoverage.filter(
    (entry) => entry.integrationStatus !== 'manual',
  ).length,
});
