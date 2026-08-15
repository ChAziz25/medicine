'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Minimal data-fetching hook for consuming the REST API from client components.
 *
 * Returns loading / error / data plus a `reload` function. It intentionally
 * swallows errors into state (rather than throwing) so pages can render an
 * error or empty state. Swap for SWR/React Query later if desired.
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  const stableFetcher = useCallback(fetcher, deps)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await stableFetcher()
      setData(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Une erreur est survenue.',
      )
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [stableFetcher])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  return { data, loading, error, reload: load }
}
