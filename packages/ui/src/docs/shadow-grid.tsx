import * as stylex from '@stylexjs/stylex'

import { Grid, Stack } from '#/layout/index.ts'
import { Text } from '#/typography/text/index.ts'
import { shadows } from '../styles/shadows.stylex'
import { colors, radii, size } from '../styles/tokens.stylex'
import { SchemePair } from './scheme-pair'

/** Every shadow token, grouped by what it is for. */
const GROUPS = {
  Elevation: ['raised', 'floating', 'popup', 'menu', 'tooltip'],
  Outlines: ['outline', 'cardOutline', 'cardOutlineHover', 'selected'],
  Focus: ['focusRing', 'invalidRing', 'cardFocus', 'backgroundRing'],
  Edges: ['edgeBottom', 'edgeLeft', 'edgeRight'],
} as const satisfies Record<string, readonly (keyof typeof shadows)[]>

const styles = stylex.create({
  card: {
    height: size['20'],
    borderRadius: radii.lg,
    backgroundColor: colors.card,
  },
  // `raised` and `floating` go with a border wherever they are used.
  bordered: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
  },
})

// One style per token: the lint rule takes a shadow only as a token, so it
// can't be passed in as a value.
const cards = stylex.create({
  raised: { boxShadow: shadows.raised },
  floating: { boxShadow: shadows.floating },
  popup: { boxShadow: shadows.popup },
  menu: { boxShadow: shadows.menu },
  tooltip: { boxShadow: shadows.tooltip },
  outline: { boxShadow: shadows.outline },
  cardOutline: { boxShadow: shadows.cardOutline },
  cardOutlineHover: { boxShadow: shadows.cardOutlineHover },
  selected: { boxShadow: shadows.selected },
  focusRing: { boxShadow: shadows.focusRing },
  invalidRing: { boxShadow: shadows.invalidRing },
  cardFocus: { boxShadow: shadows.cardFocus },
  backgroundRing: { boxShadow: shadows.backgroundRing },
  edgeBottom: { boxShadow: shadows.edgeBottom },
  edgeLeft: { boxShadow: shadows.edgeLeft },
  edgeRight: { boxShadow: shadows.edgeRight },
})

/** Each shadow token on an empty card, in both schemes. */
export function ShadowGrid() {
  return (
    <SchemePair>
      {() =>
        Object.entries(GROUPS).map(([group, names]) => (
          <Stack key={group} gap="3">
            <Text size="2" weight="semibold">
              {group}
            </Text>
            <Grid columns={{ initial: '2', md: '3' }} gap="5">
              {names.map((name) => (
                <Stack key={name} gap="2">
                  <div
                    sx={[
                      styles.card,
                      (name === 'raised' || name === 'floating') &&
                        styles.bordered,
                      cards[name],
                    ]}
                  />
                  <Text size="1" tone="muted">
                    {name}
                  </Text>
                </Stack>
              ))}
            </Grid>
          </Stack>
        ))
      }
    </SchemePair>
  )
}
