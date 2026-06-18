import Link from 'next/link'
import {
  ArrowRightIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { ResourceCounts } from '@/lib/resources/counts'

const statusCards = [
  {
    title: 'To-read',
    countKey: 'toRead',
    href: '/resources/to-read',
    description: 'Saved for later',
    icon: CircleIcon,
    accentClassName: 'text-blue-500',
    borderClassName: 'bg-blue-500',
  },
  {
    title: 'Reading',
    countKey: 'reading',
    href: '/resources/reading',
    description: 'In progress now',
    icon: CircleDotIcon,
    accentClassName: 'text-orange-500',
    borderClassName: 'bg-orange-500',
  },
  {
    title: 'Finished',
    countKey: 'finished',
    href: '/resources/finished',
    description: 'Completed resources',
    icon: CircleCheckIcon,
    accentClassName: 'text-green-500',
    borderClassName: 'bg-green-500',
  },
] as const

export function StatusSummary({
  resourceCounts,
}: {
  resourceCounts: ResourceCounts
}) {
  return (
    <section
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      aria-label="Resource status summary"
    >
      {statusCards.map((card) => {
        const Icon = card.icon
        const count = resourceCounts[card.countKey]

        return (
          <Link
            key={card.href}
            href={card.href}
            className="focus-visible:outline-ring group rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Card className="hover:bg-muted/40 relative h-full overflow-hidden transition-colors">
              <div
                className={`absolute inset-x-0 top-0 h-1 ${card.borderClassName}`}
                aria-hidden="true"
              />

              <CardHeader className="pb-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardDescription>{card.title}</CardDescription>

                    <CardTitle className="text-4xl font-semibold tracking-tight tabular-nums">
                      {count}
                    </CardTitle>
                  </div>

                  <span className="bg-background text-muted-foreground rounded-full border p-2">
                    <Icon
                      className={`size-5 ${card.accentClassName}`}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">{card.description}</p>
                  <p className="text-muted-foreground text-sm">
                    {formatResourceCount(count)}
                  </p>
                </div>

                <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors">
                  View resources
                  <ArrowRightIcon
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </section>
  )
}

function formatResourceCount(count: number) {
  return `${count} ${count === 1 ? 'resource' : 'resources'}`
}
