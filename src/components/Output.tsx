'use client'
import { useCopyToClipboard } from 'usehooks-ts'

export function Output({ output }: { output: string[] }) {
  const [, copy] = useCopyToClipboard()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto relative">
      {output.map((w) => (
        <p className="text-2xl" key={w}>
          {w}
        </p>
      ))}
      <button onClick={() => copy(output.join('\n\n'))} type="button">
        <span className="absolute block inset-0">
          <span className="sr-only">Copy</span>
        </span>
      </button>
    </div>
  )
}
