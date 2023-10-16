'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

const words = [
  'lines',
  'paragraph',
  'paragraphs',
  'sentence',
  'sentences',
  'slug',
  'text',
  // 'word',
  'words',
] as const

type Type = (typeof words)[number]

export function Title() {
  const $count = React.useRef<HTMLInputElement>(null!)
  const type = React.useRef<Type>('lines')
  const router = useRouter()
  const { search } = useParams()

  const onSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      console.log($count.current.value)
      router.push(`/${$count.current.value}/${type.current}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center justify-center gap-2 relative z-10"
    >
      <h1>lorem.click</h1>/
      <Input
        ref={$count}
        className="w-12"
        type="text"
        defaultValue={search?.[0] ?? '10'}
      />
      /
      <Select
        onValueChange={(v) => {
          type.current = v as Type
        }}
        defaultValue={search?.[1] ?? 'words'}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="words" />
        </SelectTrigger>
        <SelectContent className="g">
          {words.map((word) => (
            <SelectItem value={word} key={word}>
              {word}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="icon" variant="outline" type="submit">
        <span className="sr-only">Go</span>
        <ArrowRight />
      </Button>
    </form>
  )
}
