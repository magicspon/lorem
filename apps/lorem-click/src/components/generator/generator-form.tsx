import { Input } from '@repo/ui/inputs/input'
import * as Select from '@repo/ui/inputs/select'
import { Flex } from '@repo/ui/layout'
import { width } from '@repo/ui/styles/sizing'
import { Heading } from '@repo/ui/typography/heading'
import { Text } from '@repo/ui/typography/text'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'

import { appName } from '#/brand.ts'
import {
  loremKinds,
  loremRequest,
  maxCount,
  type LoremKind,
  type LoremRequest,
} from '#/lorem/index.ts'
import { useAutoGenerate } from './use-auto-generate.ts'

const KIND_ITEMS = loremKinds.map((kind) => ({ label: kind, value: kind }))

/** Props for {@link GeneratorForm}. */
export type GeneratorFormProps = {
  /** The request the page shows now. The controls follow it when it changes. */
  request: LoremRequest
  /** Called with a new request once the controls rest, or on Enter. */
  onGenerate: (request: LoremRequest) => void
}

/**
 * The title as a form, read like the address it leads to:
 * `lorem.click / 10 / words`. It needs no button: a change makes new text
 * once the person stops typing.
 */
export function GeneratorForm({
  request,
  onGenerate,
}: GeneratorFormProps): ReactNode {
  const [count, setCount] = useState(String(request.count))
  const [kind, setKind] = useState<LoremKind>(request.kind)
  const [shown, setShown] = useState(request)
  // The last request these controls sent, to tell their own change from Back.
  const sent = useRef<LoremRequest | null>(null)

  function send(next: LoremRequest) {
    sent.current = next
    onGenerate(next)
  }

  // Back and Forward change the address without the controls: follow it.
  // A change the controls sent is left alone, since the person may have typed
  // on while it loaded. Set during render, React's pattern for state that
  // tracks a prop.
  if (!sameRequest(shown, request)) {
    setShown(request)
    if (!sent.current || !sameRequest(sent.current, request)) {
      setCount(String(request.count))
      setKind(request.kind)
    }
  }

  useAutoGenerate({ count, kind }, request, send)

  // Enter sends at once instead of waiting.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = loremRequest.safeParse({ count, kind })
    if (next.success) send(next.data)
  }

  return (
    <Flex
      render={<form onSubmit={submit} />}
      align="center"
      justify="center"
      wrap="wrap"
      gap="2"
    >
      <Heading level={1} size="4">
        {appName}
      </Heading>
      <Text tone="muted" aria-hidden>
        /
      </Text>
      <Input
        aria-label="How many"
        type="number"
        inputMode="numeric"
        min={1}
        max={maxCount}
        required
        value={count}
        onChange={(event) => setCount(event.target.value)}
        sx={width['20']}
      />
      <Text tone="muted" aria-hidden>
        /
      </Text>
      <Select.Root
        items={KIND_ITEMS}
        value={kind}
        onValueChange={(next) => {
          const parsed = loremRequest.shape.kind.safeParse(next)
          if (parsed.success) setKind(parsed.data)
        }}
      >
        <Select.Trigger aria-label="What to make" sx={width['36']}>
          <Select.Value />
        </Select.Trigger>
        {/* Opening below the trigger shows every kind at once. Lining the
            chosen one up with the trigger pushes the rest off the top and
            makes the person scroll. */}
        <Select.Options items={KIND_ITEMS} alignItemWithTrigger={false} />
      </Select.Root>
    </Flex>
  )
}

function sameRequest(a: LoremRequest, b: LoremRequest): boolean {
  return a.count === b.count && a.kind === b.kind
}
