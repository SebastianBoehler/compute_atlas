# Provider Sources

Verified on March 25, 2026.

## Current implementation status

- Live in the app now: Azure retail prices API.
- Next straightforward API additions: Google Cloud Billing Catalog API, Runpod,
  Vast.ai.
- Still better treated as later integrations: AWS blending, CoreWeave, Lambda,
  OCI.

## Recommended launch set

These providers are strong enough for a real v1 GPU price aggregator:

- AWS: official pricing interfaces for on-demand plus EC2 spot history.
- Azure: retail prices API for public VM pricing.
- Google Cloud: Billing Catalog API for public SKU pricing.
- Runpod: API and product surfaces expose current GPU pricing.
- Vast.ai: live marketplace offer search is available through the Vast API.

## Useful second wave

- CoreWeave: public pricing pages are available, but a broad public pricing API
  is not obvious.
- Lambda: public pricing page exists, but it appears better suited to page
  ingestion than stable API ingestion.

## Lower-priority sources

- OCI: public pricing pages exist, but API-grade automated price discovery is
  less straightforward than the first-wave providers.
- Enterprise or quote-driven GPU vendors: better handled later once the core
  tracker is stable.

## References

- AWS Price List API:
  [docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html)
- AWS EC2 spot history:
  [docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotPriceHistory.html](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotPriceHistory.html)
- Azure retail prices:
  [learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices](https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices)
- Google Cloud Billing Catalog API:
  [cloud.google.com/billing/v1/how-tos/catalog-api](https://cloud.google.com/billing/v1/how-tos/catalog-api)
- Runpod pricing:
  [docs.runpod.io/serverless/pricing](https://docs.runpod.io/serverless/pricing)
- Vast.ai offer search:
  [docs.vast.ai/api-reference/search/search-offers](https://docs.vast.ai/api-reference/search/search-offers)
- CoreWeave pricing:
  [coreweave.com/pricing](https://www.coreweave.com/pricing)
- Lambda pricing:
  [lambda.ai/pricing](https://lambda.ai/pricing)
- Oracle Cloud pricing:
  [oracle.com/cloud/pricing](https://www.oracle.com/cloud/pricing/)
