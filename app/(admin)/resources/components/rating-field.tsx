'use client'
import { useRef } from 'react'
import { StarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'

type RatingFieldProps = {
  value: number
  onValueChange: (value: number) => void
}

const RATINGS = [1, 2, 3, 4, 5] as const

export function RatingField({ value, onValueChange }: RatingFieldProps) {
  const firstRatingRef = useRef<HTMLInputElement>(null)

  function handleClear() {
    onValueChange(0)

    requestAnimationFrame(() => {
      firstRatingRef.current?.focus()
    })
  }

  return (
    <Field>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Rating</legend>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {RATINGS.map((rating) => {
              const isSelected = value === rating
              const isFilled = rating <= value

              return (
                <label key={rating} className="cursor-pointer">
                  <input
                    ref={rating === 1 ? firstRatingRef : undefined}
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={isSelected}
                    onChange={() => onValueChange(rating)}
                    className="peer sr-only"
                  />

                  <span className="peer-focus-visible:ring-ring/70 flex rounded-md p-1 peer-focus-visible:ring-2 peer-focus-visible:outline-none">
                    <StarIcon
                      className={
                        isFilled
                          ? 'size-6 fill-current text-yellow-500'
                          : 'text-muted-foreground size-6'
                      }
                      aria-hidden="true"
                    />
                  </span>
                </label>
              )
            })}
          </div>

          {value > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              aria-label="Clear rating"
              className="-my-0.5"
            >
              Clear
            </Button>
          )}
        </div>
      </fieldset>
    </Field>
  )
}
