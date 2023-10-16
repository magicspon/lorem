'use-client'
import * as React from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'

const words = [
  'lines',
  'paragraph',
  'paragraphs',
  'sentence',
  'sentences',
  'slug',
  'text',
  'word',
  'words',
] as const

export function Title() {
  return (
    <h1 className="flex items-center justify-center gap-2 relative z-10">
      <span>lorem.click</span>/
      <Input className="w-12" type="text" defaultValue="50" />/
      <Select defaultValue="words">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="words" />
        </SelectTrigger>
        <SelectContent>
          {words.map((word) => (
            <SelectItem value={word} key={word}>
              {word}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </h1>
  )
}
