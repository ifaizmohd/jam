// src/errors/api-error-handler.ts
import { ApiError, ErrorHandlerConfig } from "../types/error/ApiError.types";
import { HttpError } from "./HttpError";

export class ApiErrorHandler {
  private config: Required<ErrorHandlerConfig>;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      logErrors: true,
      logger: console.error,
      statusMessages: {
        400: "Invalid request",
        401: "Unauthorized - Please login",
        403: "Forbidden - Insufficient permissions",
        404: "Resource not found",
        500: "Internal server error",
      },
      ...config,
    };
  }

  /**
   * Handle and process API errors
   * @param error Raw error from API call
   * @returns Standardized ApiError object
   */
  handle(error: unknown): ApiError {
    const apiError = this.normalizeError(error);

    if (this.config.logErrors) {
      this.config.logger({
        message: apiError.message,
        status: apiError.status,
        details: apiError.details,
      });
    }

    this.handleSpecialCases(apiError);

    return apiError;
  }

  /**
   * Convert various error types to standardized format
   */
  private normalizeError(error: unknown): ApiError {
    if (error instanceof HttpError) {
      return {
        status: error.status,
        message: this.getStatusMessage(error.status),
        details: error.data,
        isNetworkError: false,
        originalError: error,
      };
    }

    if (error instanceof Error) {
      return {
        status: 0,
        message: this.isNetworkError(error)
          ? "Network error - Please check your connection"
          : "Unexpected application error",
        isNetworkError: this.isNetworkError(error),
        originalError: error,
      };
    }

    return {
      status: 500,
      message: "Unknown error occurred",
      isNetworkError: false,
      originalError: error,
    };
  }

  /**
   * Handle special error cases like authentication failures
   */
  private handleSpecialCases(error: ApiError): void {
    switch (error.status) {
      case 401:
        this.handleAuthenticationFailure();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 429:
        this.handleRateLimit();
        break;
    }
  }

  private getStatusMessage(status: number): string {
    return this.config.statusMessages[status] || `HTTP Error ${status}`;
  }

  private isNetworkError(error: Error): boolean {
    return (
      error.message.includes("Network Error") ||
      error.message.includes("Failed to fetch")
    );
  }

  private handleAuthenticationFailure(): void {
    // Implement auth failure logic (e.g., logout, redirect)
    console.warn("Authentication failed - redirecting to login");
  }

  private handleForbidden(): void {
    // Implement forbidden access handling
    console.warn("Insufficient permissions");
  }

  private handleRateLimit(): void {
    // Implement rate limiting handling
    console.warn("API rate limit exceeded");
  }
}
