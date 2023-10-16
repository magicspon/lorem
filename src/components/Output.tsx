'use client'
import { useCopyToClipboard } from 'usehooks-ts'
import { useToast } from './ui/use-toast'

export function Output({ output }: { output: string[] }) {
  const [, copy] = useCopyToClipboard()
  const { toast } = useToast()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {output.map((w) => (
        <p className="text-2xl" key={w}>
          {w}
        </p>
      ))}
      <button
        onClick={() => {
          copy(output.join('\n\n'))
          toast({
            title: 'Copied!',
            description: 'Content added to your clipboard',
          })
        }}
        type="button"
      >
        <span className="absolute block inset-0">
          <span className="sr-only">Copy</span>
        </span>
      </button>
    </div>
  )
}
