import type * as React from 'react'

import { SelectContent, SelectItem } from './select'

/** One option of a {@link SelectOptions}: what a person reads, and its value. */
type SelectOption = { label: React.ReactNode; value: string }

/** Props for {@link SelectOptions}. */
type SelectOptionsProps = Omit<
  React.ComponentProps<typeof SelectContent>,
  'children'
> & {
  /** The options, in order. Usually the same list given to `Select.Root`. */
  items: readonly SelectOption[]
}

/**
 * The floating list with one item per option: the whole popup of a select
 * whose options are a flat list, so a caller does not map its items by hand.
 */
function SelectOptions({ items, ...props }: SelectOptionsProps) {
  return (
    <SelectContent {...props}>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectContent>
  )
}

export { SelectOptions, type SelectOption, type SelectOptionsProps }
