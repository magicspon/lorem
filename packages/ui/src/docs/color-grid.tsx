import * as radix from '@radix-ui/colors'
import * as stylex from '@stylexjs/stylex'

import { Grid, Stack } from '#/layout/index.ts'
import { Text } from '#/typography/text/index.ts'
import { shadows } from '../styles/shadows.stylex'
import { colors, radii, size } from '../styles/tokens.stylex'
import { Frame, SchemePair } from './scheme-pair'

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

/** What Radix designs each step for, as the grid's column heads. */
const USES = [
  'App background',
  'Subtle background',
  'Element',
  'Element hover',
  'Element active',
  'Subtle border',
  'Border, focus',
  'Border hover',
  'Solid',
  'Solid hover',
  'Low-contrast text',
  'High-contrast text',
] as const

// The scales `scripts/radix-colors.mjs` copies into the tokens.
const SCALES = [
  'sage',
  'mint',
  'red',
  'green',
  'amber',
  'blue',
  'violet',
  'orange',
  'crimson',
] as const

// A map, so a scale is looked up by a name built at run time.
const scales = new Map<string, Record<string, string>>(Object.entries(radix))

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: `${size['16']} repeat(12, minmax(0, 1fr))`,
    gap: size['1'],
    alignItems: 'center',
  },
  swatch: (color: string) => ({
    height: size['8'],
    borderRadius: radii.md,
    backgroundColor: color,
  }),
  token: (color: string) => ({
    height: size['10'],
    borderRadius: radii.lg,
    backgroundColor: color,
    boxShadow: shadows.outline,
  }),
})

function ScaleGrid({ scheme }: { scheme: 'light' | 'dark' }) {
  const suffix = scheme === 'dark' ? 'Dark' : ''
  return (
    <div sx={styles.grid}>
      <span />
      {STEPS.map((step) => (
        <Text
          key={step}
          size="1"
          tone="muted"
          align="center"
          title={USES[step - 1]}
        >
          {step}
        </Text>
      ))}
      {SCALES.flatMap((name) => {
        const scale = scales.get(`${name}${suffix}`) ?? {}
        return [
          <Text key={name} size="1">
            {name}
          </Text>,
          ...STEPS.map((step) => {
            const value = scale[`${name}${step}`] ?? 'transparent'
            return (
              <div
                key={`${name}${step}`}
                title={`${name} ${step}: ${value}`}
                sx={styles.swatch(value)}
              />
            )
          }),
        ]
      })}
    </div>
  )
}

/** Every Radix scale the tokens use, steps 1 to 12, in both schemes. */
export function ColorScales() {
  return <SchemePair>{(scheme) => <ScaleGrid scheme={scheme} />}</SchemePair>
}

/** The step each use takes, as a legend for `ColorScales`. */
export function StepUses() {
  return (
    <Frame>
      <Grid columns={{ initial: '2', md: '4' }} gap="3">
        {USES.map((use, index) => (
          <Text key={use} size="2">
            <Text weight="semibold">{index + 1}</Text> {use}
          </Text>
        ))}
      </Grid>
    </Frame>
  )
}

/** Semantic tokens by group, as components read them. */
const GROUPS = {
  Surfaces: ['background', 'card', 'popover', 'secondary', 'muted', 'accent'],
  Text: ['foreground', 'mutedForeground', 'primaryForeground'],
  Roles: ['primary', 'destructive', 'success', 'warning'],
  Borders: ['border', 'input', 'ring', 'focusRing'],
  Charts: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'],
} as const satisfies Record<string, readonly (keyof typeof colors)[]>

/** The semantic tokens, swatched in both schemes. */
export function ColorTokens() {
  return (
    <SchemePair>
      {() =>
        Object.entries(GROUPS).map(([group, names]) => (
          <Stack key={group} gap="2">
            <Text size="2" weight="semibold">
              {group}
            </Text>
            <Grid columns={{ initial: '2', md: '3' }} gap="2">
              {names.map((name) => (
                <Stack key={name} gap="1">
                  <div sx={styles.token(colors[name])} />
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
