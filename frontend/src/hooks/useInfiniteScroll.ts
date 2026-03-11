import { useEffect, useRef, useCallback, useState } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.5, rootMargin = '0px', enabled = true } = options

  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  const handleIntersect = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      if (entry.isIntersecting && enabled && !isLoading) {
        setIsLoading(true)
        try {
          await onLoadMore()
        } finally {
          setIsLoading(false)
        }
      }
    },
    [enabled, isLoading, onLoadMore]
  )

  useEffect(() => {
    const target = targetRef.current
    if (!target || !enabled) return

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    })

    observerRef.current.observe(target)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enabled, handleIntersect, threshold, rootMargin])

  return { targetRef, isLoading }
}
