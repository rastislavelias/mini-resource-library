'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon, XIcon } from 'lucide-react'

import { getCategoryColor } from '@/lib/category-colors'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Item } from '@/components/ui/item'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FilterCategory = {
  id: string
  name: string
  color: string
}

const SEARCH_DELAY = 500

export function Toolbar({ categories }: { categories: FilterCategory[] }) {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchParamsString = searchParams.toString()
  const urlQuery = searchParams.get('q') ?? ''
  const selectedCategory = searchParams.get('category') ?? 'all'

  const [query, setQuery] = useState(urlQuery)
  const [, startTransition] = useTransition()
  const searchTimeoutRef = useRef<number | null>(null)

  const hasFilters = Boolean(
    searchParams.get('q') || searchParams.get('category')
  )

  useEffect(() => {
    function handlePopState() {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get('q') ?? '')
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)

      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  function clearSearchTimeout() {
    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
  }

  function navigate(params: URLSearchParams, method: 'push' | 'replace') {
    const queryString = params.toString()
    const href = queryString ? `${pathname}?${queryString}` : pathname

    startTransition(() => {
      router[method](href, {
        scroll: false,
      })
    })
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value

    // Update the field immediately.
    setQuery(nextQuery)
    clearSearchTimeout()

    searchTimeoutRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(searchParamsString)
      const trimmedQuery = nextQuery.trim()

      if (trimmedQuery) {
        params.set('q', trimmedQuery)
      } else {
        params.delete('q')
      }

      params.delete('page')

      navigate(params, 'replace')
      searchTimeoutRef.current = null
    }, SEARCH_DELAY)
  }

  function handleCategoryChange(value: string) {
    clearSearchTimeout()

    const params = new URLSearchParams(searchParamsString)
    const trimmedQuery = query.trim()

    // Preserve the current input, including a search that has not yet fired.
    if (trimmedQuery) {
      params.set('q', trimmedQuery)
    } else {
      params.delete('q')
    }

    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }

    params.delete('page')

    navigate(params, 'push')
  }

  function handleClear() {
    clearSearchTimeout()
    setQuery('')

    const params = new URLSearchParams(searchParamsString)

    params.delete('q')
    params.delete('category')
    params.delete('page')

    navigate(params, 'push')

    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  return (
    <Item variant="outline">
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-start">
        <div className="relative">
          <SearchIcon
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />

          <Input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search resources"
            aria-label="Search resources"
            className="pl-9 lg:w-56"
          />
        </div>

        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger
            className="w-full lg:w-42"
            aria-label="Filter by category"
          >
            <SelectValue placeholder="All categories" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All categories</SelectItem>

              {categories.map((category) => {
                const categoryColor = getCategoryColor(category.color)

                return (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-2.5 rounded-full ${categoryColor.bulletClassName}`}
                        aria-hidden="true"
                      />
                      {category.name}
                    </span>
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            className="me-auto"
            type="button"
            variant="secondary"
            onClick={handleClear}
          >
            <XIcon aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>
    </Item>
  )
}
