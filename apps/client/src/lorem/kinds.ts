import { z } from 'zod'

/** What the generator can make, each from a count. */
export const loremKinds = ['words', 'sentences', 'paragraphs', 'slug'] as const

/** One of {@link loremKinds}. */
export type LoremKind = (typeof loremKinds)[number]

/** The most of anything one request makes, so a link cannot hang the page. */
export const maxCount = 100

/** The request a page opens with. */
export const defaultRequest = { count: 10, kind: 'words' } as const

/**
 * A request the generator accepts: the old path's check and the form's
 * check. Anything out of range or unknown is refused.
 */
export const loremRequest = z.object({
  count: z.coerce.number().int().min(1).max(maxCount),
  kind: z.enum(loremKinds),
})

/** A request the generator can make. */
export type LoremRequest = z.infer<typeof loremRequest>

/**
 * The address's query, `?count=10&kind=words`. Unlike {@link loremRequest},
 * a missing or bad value falls back to its default, so any link opens a page.
 */
export const loremSearch = z.object({
  count: loremRequest.shape.count.catch(defaultRequest.count),
  kind: loremRequest.shape.kind.catch(defaultRequest.kind),
})
