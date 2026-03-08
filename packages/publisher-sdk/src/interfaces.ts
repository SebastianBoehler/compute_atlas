import type {
  DevnetVerificationReport,
  MethodologyResult,
  OraclePublicationRecord,
} from '@compute-atlas/types';

export interface PublishResult {
  txSignature: string;
  slot?: number;
  status: 'submitted' | 'confirmed';
  explorerUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PublisherModule {
  chain: string;
  publishIndex: (payload: MethodologyResult) => Promise<PublishResult>;
  verifyRecentPublications: (
    limit?: number,
  ) => Promise<DevnetVerificationReport>;
  getRecentPublications: (limit?: number) => Promise<OraclePublicationRecord[]>;
}
