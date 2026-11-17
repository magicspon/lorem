import type * as React from 'react'
import { Unstyled } from '@storybook/addon-docs/blocks'
import * as stylex from '@stylexjs/stylex'

import { Grid, Stack } from '#/layout/index.ts'
import { shadows } from '../styles/shadows.stylex'
import { darkTheme, lightTheme } from '#/styles/themes.ts'
import { utilities } from '#/styles/utilities.ts'
import { Text } from '#/typography/text/index.ts'
import { radii, space } from '../styles/tokens.stylex'

const styles = stylex.create({
  // Clear of the prose around it, which Storybook spaces with margins.
  block: { marginBlock: space['5'] },
  panel: { borderRadius: radii.xl, boxShadow: shadows.outline },
})

const SCHEMES = { light: lightTheme, dark: darkTheme } as const

/** Props for {@link Frame}. */
type FrameProps = {
  /** Forces a scheme; without one the frame follows the system's. */
  scheme?: 'light' | 'dark'
  children: React.ReactNode
}

/**
 * A panel in the page's own colours. Storybook paints its docs page white
 * whatever the system's scheme, so text set straight on it would follow the
 * system and could vanish; inside here background and text always match.
 */
function Panel({ scheme, children }: FrameProps) {
  return (
    <Stack
      gap="5"
      p="5"
      sx={[scheme && SCHEMES[scheme], utilities.page, styles.panel]}
    >
      {children}
    </Stack>
  )
}

/**
 * An example on a docs page: one panel, out of reach of Storybook's docs
 * styles, which would restyle its headings and lists.
 */
export function Frame(props: FrameProps) {
  return (
    <Unstyled>
      <div sx={styles.block}>
        <Panel {...props} />
      </div>
    </Unstyled>
  )
}

/**
 * Renders the same content twice, under `lightTheme` and `darkTheme`, so a
 * docs page shows both schemes whatever the system's.
 */
export function SchemePair({
  children,
}: {
  children: (scheme: 'light' | 'dark') => React.ReactNode
}) {
  return (
    <Unstyled>
      <Grid columns={{ initial: '1', md: '2' }} gap="4" sx={styles.block}>
        {(['light', 'dark'] as const).map((scheme) => (
          <Panel key={scheme} scheme={scheme}>
            <Text size="1" tone="muted" weight="medium">
              {scheme === 'light' ? 'Light' : 'Dark'}
            </Text>
            {children(scheme)}
          </Panel>
        ))}
      </Grid>
    </Unstyled>
  )
}
