import * as React from 'react'
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { Flex } from '#/layout/index.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const CHILD_SVG = ':where(*) > svg'

// Avatars and avatar groups carry the default marker.
const styles = stylex.create({
  avatar: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    borderRadius: radii.full,
    userSelect: 'none',
    boxShadow: {
      default: null,
      [stylex.when.ancestor(':is([data-slot=avatar-group])')]:
        shadows.backgroundRing,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: radii.full,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.border,
      mixBlendMode: 'darken',
    },
  },
  default: { width: size['8'], height: size['8'] },
  sm: { width: size['6'], height: size['6'] },
  lg: { width: size['10'], height: size['10'] },
  image: {
    aspectRatio: '1',
    width: '100%',
    height: '100%',
    borderRadius: radii.full,
    objectFit: 'cover',
  },
  fallback: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
  },
  badgeSuccess: { backgroundColor: colors.success },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 10,
    display: {
      default: 'inline-flex',
      [stylex.when.ancestor(':is([data-slot=avatar][data-size=sm])')]: {
        default: 'inline-flex',
        [CHILD_SVG]: 'none',
      },
    },
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    backgroundBlendMode: 'color',
    boxShadow: shadows.backgroundRing,
    userSelect: 'none',
    width: {
      default: null,
      [stylex.when.ancestor(':is([data-slot=avatar][data-size=sm])')]:
        size['2'],
      [stylex.when.ancestor(':is([data-slot=avatar][data-size=default])')]: {
        default: size['2.5'],
        [CHILD_SVG]: size['2'],
      },
      [stylex.when.ancestor(':is([data-slot=avatar][data-size=lg])')]: {
        default: size['3'],
        [CHILD_SVG]: size['2'],
      },
    },
    height: {
      default: null,
      [stylex.when.ancestor(':is([data-slot=avatar][data-size=sm])')]:
        size['2'],
      [stylex.when.ancestor(':is([data-slot=avatar][data-size=default])')]: {
        default: size['2.5'],
        [CHILD_SVG]: size['2'],
      },
      [stylex.when.ancestor(':is([data-slot=avatar][data-size=lg])')]: {
        default: size['3'],
        [CHILD_SVG]: size['2'],
      },
    },
  },
  group: {
    marginInlineEnd: {
      default: null,
      ':where(*) > :not(:last-child)': `-${space['2']}`,
    },
  },
  groupCount: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    boxShadow: shadows.backgroundRing,
    width: {
      default: size['8'],
      [CHILD_SVG]: size['4'],
      [stylex.when.ancestor(
        ':is([data-slot=avatar-group]):has([data-size=lg])',
      )]: { default: size['10'], [CHILD_SVG]: size['5'] },
      [stylex.when.ancestor(
        ':is([data-slot=avatar-group]):has([data-size=sm])',
      )]: { default: size['6'], [CHILD_SVG]: size['3'] },
    },
    height: {
      default: size['8'],
      [CHILD_SVG]: size['4'],
      [stylex.when.ancestor(
        ':is([data-slot=avatar-group]):has([data-size=lg])',
      )]: { default: size['10'], [CHILD_SVG]: size['5'] },
      [stylex.when.ancestor(
        ':is([data-slot=avatar-group]):has([data-size=sm])',
      )]: { default: size['6'], [CHILD_SVG]: size['3'] },
    },
  },
})

/** A round user image with a fallback. */
function Avatar({
  style,
  sx,
  size = 'default',
  ...props
}: WithSx<AvatarPrimitive.Root.Props> & {
  size?: 'default' | 'sm' | 'lg'
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      {...styleProps(
        [
          stylex.defaultMarker(),
          // The fallback's initials inherit this.
          size === 'sm' ? textStyles['1'] : textStyles['2'],
          styles.avatar,
          styles[size],
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

/** The avatar's image. */
function AvatarImage({
  style,
  sx,
  ...props
}: WithSx<AvatarPrimitive.Image.Props>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      {...styleProps([styles.image, sx], style)}
      {...props}
    />
  )
}

/** Shown until the image loads, or when it fails. */
function AvatarFallback({
  style,
  sx,
  ...props
}: WithSx<AvatarPrimitive.Fallback.Props>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      {...styleProps([styles.fallback, sx], style)}
      {...props}
    />
  )
}

/** A status dot on the avatar's corner. `success` marks someone online. */
function AvatarBadge({
  style,
  sx,
  tone = 'primary',
  ...props
}: WithSx<React.ComponentProps<'span'>> & { tone?: 'primary' | 'success' }) {
  return (
    <span
      data-slot="avatar-badge"
      {...styleProps(
        [styles.badge, tone === 'success' && styles.badgeSuccess, sx],
        style,
      )}
      {...props}
    />
  )
}

/** Overlapping avatars. */
function AvatarGroup({ sx, ...props }: WithSx<React.ComponentProps<'div'>>) {
  return (
    <Flex
      data-slot="avatar-group"
      sx={[stylex.defaultMarker(), styles.group, sx]}
      {...props}
    />
  )
}

/** The count of avatars left out of a group. */
function AvatarGroupCount({
  style,
  sx,
  ...props
}: WithSx<React.ComponentProps<'div'>>) {
  return (
    <div
      data-slot="avatar-group-count"
      {...styleProps([textStyles['2'], styles.groupCount, sx], style)}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
