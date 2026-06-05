import {
  IconMessageCircleFilled,
  IconCircleCheckFilled,
  IconStarFilled,
  type TablerIcon,
} from '@tabler/icons-react'

const features: { title: string; description: string; icon: TablerIcon }[] = [
  {
    title: 'Capture the reason',
    description:
      'Save more than a URL. Add a short note about why the resource mattered when you found it.',
    icon: IconMessageCircleFilled,
  },
  {
    title: 'Separate intent from progress',
    description:
      'Use to-read, reading, and finished to tell the difference between interesting links and resources you are actively working through.',
    icon: IconCircleCheckFilled,
  },
  {
    title: 'Review what was useful',
    description:
      'Add a simple rating after finishing something so your best learning material is easier to find later.',
    icon: IconStarFilled,
  },
]

export function FeatureSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-xl px-6 sm:max-w-6xl">
        <p className="text-muted-foreground text-sm font-medium">
          Built around the real habit
        </p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Most saved links get lost. This app gives them a simple next step.
        </h2>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-8 text-pretty">
          Mini Resource Library is intentionally small: every resource has a
          category, a status, optional notes, and an optional rating. That is
          enough to decide what to read next without turning the app into
          another productivity system.
        </p>
      </div>
      <div className="mx-auto mt-10 flex flex-col gap-8 px-6 lg:max-w-6xl lg:flex-row">
        {features.map((feature) => (
          <div key={feature.title} className="flex-1">
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-balance">
              <feature.icon className="size-5" />
              {feature.title}
            </h3>
            <p className="text-muted-foreground mt-3 max-w-lg text-base leading-8 text-pretty">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
