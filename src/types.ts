/**
 * @file Type definitions for documentation generation.
 */

/**
 * Options for generating documentation.
 */
interface GenerateOptions {
  /** Output directory for generated docs. */
  output?: string;
  /** Override output filename. */
  name?: string;
  /** Show verbose output. */
  verbose?: boolean;
  /** Maximum crawl depth. */
  maxDepth?: number;
  /** Glob patterns to exclude. */
  exclude?: string;
}

/**
 * Source type for documentation generation.
 */
enum SourceType {
  library = 'library',
  path = 'path',
  salesforce = 'salesforce',
  url = 'url',
}

/**
 * Metadata for documentation generation.
 */
interface DocMetadata {
  /** Source URL or path. */
  url?: string;
  /** Base domain (for URL sources). */
  baseDomain?: string;
  /** Library information (for library sources). */
  name?: string;
  repositoryUrl?: string;
  websiteUrl?: string;
  /** Salesforce search results (for Salesforce sources). */
  item?: string;
  searchResults?: { url: string; title: string }[];
  /** Directory information (for path sources). */
  directory?: string;
  fileCount?: number;
}

/**
 * Source data for documentation extraction.
 */
interface SourceData {
  /** Document name. */
  name: string;
  /** Source type. */
  sourceType: SourceType;
  /** Repository path (if cloned). */
  repositoryPath?: string | null;
  /** Website content (if crawled). */
  websiteContent?: string;
  /** File contents (for path sources). */
  fileContents?: { path: string; content: string }[];
  /** Metadata. */
  metadata?: DocMetadata;
}

export type { GenerateOptions, DocMetadata, SourceData };
export { SourceType };
