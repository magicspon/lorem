import { faker } from '@faker-js/faker'
import { z } from 'zod'

const possibleLorem = z
  .union([
    z.literal('lines'),
    z.literal('paragraph'),
    z.literal('paragraphs'),
    z.literal('sentence'),
    z.literal('sentences'),
    z.literal('slug'),
    z.literal('text'),
    z.literal('word'),
    z.literal('words'),
  ])
  .default('words')

const defaultData = z.tuple([
  z.preprocess((val) => Number(val), z.number()),
  possibleLorem.nullable().optional(),
])

export default function Page({ params }: { params: { search: string[] } }) {
  const schema = defaultData.safeParse(params.search ?? ['10', 'words'])
  let output = ['cp.lo']

  if (schema.success) {
    const method = schema.data[1] as keyof typeof faker.lorem
    if (faker.lorem[method]) {
      // @ts-ignore this is an arse
      output = faker.lorem[method](schema.data[0]).split('\n')
    }
  } else {
    output = ['Invalid']
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col gap-6">
        {output.map((w) => (
          <p className="text-2xl" key={w}>
            {w}
          </p>
        ))}
      </div>
    </main>
  )
}
