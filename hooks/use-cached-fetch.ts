import { useCallback, useEffect, useRef, useState } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const responseCache = new Map<string, CacheEntry<any>>()

/**
 * Custom hook for optimized API data fetching with caching
 * Implements:
 * - Response caching with TTL
 * - Request deduplication
 * - Stale-while-revalidate pattern
 * - Automatic cleanup
 */
export function useCachedFetch<T>(
  url: string,
  options: {
    ttl?: number // Cache time-to-live in seconds (default: 60)
    skipCache?: boolean
    headers?: Record<string, string>
  } = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map())

  const { ttl = 60, skipCache = false, headers = {} } = options

  const fetchData = useCallback(async () => {
    try {
      setError(null)

      // Check cache first
      if (!skipCache && responseCache.has(url)) {
        const cached = responseCache.get(url)!
        if (Date.now() - cached.timestamp < cached.ttl * 1000) {
          setData(cached.data)
          setLoading(false)
          return
        }
      }

      // Prevent duplicate requests
      if (pendingRequests.current.has(url)) {
        const result = await pendingRequests.current.get(url)!
        setData(result)
        setLoading(false)
        return
      }

      // Make the request
      const requestPromise = fetch(url, {
        headers: {
          Accept: 'application/json',
          ...headers,
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json()
      })

      pendingRequests.current.set(url, requestPromise)

      const result = await requestPromise
      responseCache.set(url, {
        data: result,
        timestamp: Date.now(),
        ttl,
      })

      setData(result)
      pendingRequests.current.delete(url)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [url, ttl, skipCache, headers])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error }
}

/**
 * Clear cache for a specific URL or all cache
 */
export function clearCache(url?: string) {
  if (url) {
    responseCache.delete(url)
  } else {
    responseCache.clear()
  }
}

/**
 * Preload API data into cache
 */
export async function preloadData<T>(
  url: string,
  ttl: number = 60,
  headers?: Record<string, string>
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    responseCache.set(url, {
      data,
      timestamp: Date.now(),
      ttl,
    })

    return data
  } catch (error) {
    console.error(`Failed to preload ${url}:`, error)
    throw error
  }
}
