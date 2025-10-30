/**
 * API optimization utilities
 * - Request batching
 * - Field filtering
 * - Pagination defaults
 * - Response transformation caching
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api'

/**
 * Build optimized API URL with query parameters
 */
export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | null>
): string {
  const url = new URL(`${API_BASE_URL}/${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Fetch with optimizations:
 * - Default timeout
 * - Automatic retry on network error
 * - Response size optimization
 */
export async function optimizedFetch<T>(
  url: string,
  options: {
    method?: string
    body?: any
    headers?: Record<string, string>
    timeout?: number
    retries?: number
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeout = 10000,
    retries = 1,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        )
      }

      return await response.json()
    } catch (error: any) {
      lastError = error
      if (attempt < retries) {
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 100)
        )
      }
    }
  }

  throw lastError || new Error('Failed to fetch data')
}

/**
 * Batch multiple API requests efficiently
 */
export async function batchFetch<T>(
  requests: Array<{ url: string; options?: any }>
): Promise<(T | { error: string })[]> {
  const promises = requests.map((req) =>
    optimizedFetch<T>(req.url, req.options).catch((error) => ({
      error: error.message,
    }))
  )

  return Promise.all(promises)
}

/**
 * Cache for transformed responses (memoization)
 */
const transformCache = new Map<string, any>()

export function getCachedTransform(key: string): any | undefined {
  return transformCache.get(key)
}

export function setCachedTransform(key: string, value: any): void {
  transformCache.set(key, value)
  // Auto-cleanup after 5 minutes
  setTimeout(() => transformCache.delete(key), 5 * 60 * 1000)
}

export function clearTransformCache(): void {
  transformCache.clear()
}

/**
 * Serialize parameters for caching
 */
export function serializeParams(params: Record<string, any>): string {
  return JSON.stringify(
    Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key]
        return acc
      }, {} as Record<string, any>)
  )
}

/**
 * Debounce search/filter requests
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * Throttle expensive operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
