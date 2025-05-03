/**
 * Configuration for API error handling
 */
export interface ErrorHandlerConfig {
  /**
   * Whether to log errors to console
   * @default true
   */
  logErrors?: boolean;
  /**
   * Custom logger implementation
   */
  logger?: (error: unknown) => void;
  /**
   * Map of status codes to custom messages
   */
  statusMessages?: Record<number, string>;
}

/**
 * Standardized error format for API responses
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
  isNetworkError: boolean;
  originalError: unknown;
}
