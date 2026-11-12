// Design-system primitives (Button, Input, Checkbox, Switch, Card shapes) rebuilt in React Native
// from the Vertex Detailing components the STACKED design imports.
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Pattern, Polygon, Rect, Stop } from 'react-native-svg';
import { C, CUT, R, eyebrow, glowOrangeSm, t } from '../lib/theme';

type Pts = (w: number, h: number) => string;

/** A view whose background is an SVG polygon: how the design's clip-path shapes are drawn natively. */
export function Shape({
  points,
  fill,
  stroke,
  bw = 1.5,
  topEdge,
  style,
  children,
}: {
  points: Pts;
  fill: string;
  stroke?: string;
  bw?: number;
  topEdge?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };
  const inset = stroke ? bw / 2 : 0;
  return (
    <View style={style} onLayout={onLayout}>
      {size.w > 0 && (
        <Svg style={StyleSheet.absoluteFill} width={size.w} height={size.h} pointerEvents="none">
          <Polygon
            points={insetPoints(points, size.w, size.h, inset)}
            fill={fill}
            stroke={stroke}
            strokeWidth={stroke ? bw : 0}
          />
          {topEdge && <Rect x={0} y={0} width={size.w} height={3} fill={topEdge} />}
        </Svg>
      )}
      {children}
    </View>
  );
}

function insetPoints(points: Pts, w: number, h: number, i: number) {
  if (!i) return points(w, h);
  return points(w - 2 * i, h - 2 * i)
    .split(' ')
    .map((p) => p.split(',').map((n) => Number(n) + i).join(','))
    .join(' ');
}

export const chamfer = (cut = CUT): Pts => (w, h) => `0,0 ${w},0 ${w},${h - cut} ${w - cut},${h} 0,${h}`;
export const parallelogram = (skew = 10): Pts => (w, h) => `${skew},0 ${w},0 ${w - skew},${h} 0,${h}`;

/** Card with the racing chamfer on the bottom-right corner. */
export function Chamfer(props: {
  fill?: string;
  stroke?: string;
  topEdge?: string;
  cut?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  return (
    <Shape
      points={chamfer(props.cut)}
      fill={props.fill ?? C.card}
      stroke={props.stroke}
      topEdge={props.topEdge}
      style={props.style}
    >
      {props.children}
    </Shape>
  );
}

/** 45° carbon-fibre stripes, used behind Welcome and the party pass screen. */
export function Carbon({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <Svg width="100%" height="100%" style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Defs>
        <Pattern id="carbon" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <Rect x={0} y={0} width={6} height={12} fill="#0e0e10" />
          <Rect x={6} y={0} width={6} height={12} fill="#121215" />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#carbon)" />
    </Svg>
  );
}

/** Horizontal bar track with an accent-gradient (or solid) fill. */
export function Bar({ pct, height = 8, color, radius = 4 }: { pct: number; height?: number; color?: string; radius?: number }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <View style={{ height, backgroundColor: C.input, borderRadius: radius, overflow: 'hidden' }}>
      {color ? (
        <View style={{ height: '100%', width: `${p}%`, backgroundColor: color }} />
      ) : (
        <Svg width={`${p}%`} height="100%">
          <Defs>
            <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FF7F33" />
              <Stop offset="0.55" stopColor="#FF6000" />
              <Stop offset="1" stopColor="#E04E00" />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#g)" />
        </Svg>
      )}
    </View>
  );
}

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';
const SIZES: Record<Size, { h: number; px: number; fs: number }> = {
  sm: { h: 34, px: 14, fs: 14 },
  md: { h: 42, px: 20, fs: 16 },
  lg: { h: 52, px: 26, fs: 18 },
  xl: { h: 60, px: 34, fs: 21 },
};
const VARIANTS: Record<Variant, { bg: string; press: string; fg: string; border: string }> = {
  primary: { bg: C.accent, press: C.accentPress, fg: C.accentFg, border: 'transparent' },
  secondary: { bg: C.elevated, press: C.input, fg: C.text, border: C.borderStrong },
  outline: { bg: 'transparent', press: C.accentWash, fg: C.accent, border: C.accent },
  ghost: { bg: 'transparent', press: 'rgba(255,255,255,0.06)', fg: C.textSecondary, border: 'transparent' },
  danger: { bg: C.danger, press: '#C92A21', fg: '#FFFFFF', border: 'transparent' },
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  cut = false,
  block = false,
  disabled = false,
  accessibilityLabel,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  cut?: boolean;
  block?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const sz = SIZES[size];
  const v = VARIANTS[variant];
  const label =
    typeof children === 'string' ? (
      <Text numberOfLines={1} style={[t('display700i', sz.fs, v.fg, undefined, 0.02), { textTransform: 'uppercase', flexShrink: 0 }]}>
        {children}
      </Text>
    ) : (
      children
    );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[block ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }, { opacity: disabled ? 0.45 : 1 }, style]}
    >
      {({ pressed }) => {
        const inner: ViewStyle = {
          height: sz.h,
          // Block buttons fill their cell; keep the label whole in narrow cells (e.g. Shuffle / Clear / Lock in).
          paddingHorizontal: block ? 4 : sz.px,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          transform: pressed ? [{ translateY: 1 }, { scale: 0.985 }] : undefined,
        };
        const bg = pressed ? v.press : v.bg;
        if (cut) {
          return (
            <Shape points={chamfer()} fill={bg} stroke={v.border === 'transparent' ? undefined : v.border} style={inner}>
              {label}
            </Shape>
          );
        }
        return (
          <View
            style={[
              inner,
              {
                backgroundColor: bg,
                borderRadius: R.sm,
                borderWidth: 1.5,
                borderColor: v.border,
                boxShadow: variant === 'primary' && !disabled ? glowOrangeSm : undefined,
              },
            ]}
          >
            {label}
          </View>
        );
      }}
    </Pressable>
  );
}

export function Input({
  label,
  hint,
  error,
  size = 'md',
  disabled,
  style,
  ...rest
}: TextInputProps & { label?: string; hint?: string; error?: string; size?: 'md' | 'lg'; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const [focus, setFocus] = useState(false);
  const border = error ? C.danger : focus ? C.accent : C.border;
  return (
    <View style={[{ gap: 6 }, style]}>
      {label && <Text style={[t('ui600', 14, C.textSecondary, undefined, 0.02), { textTransform: 'uppercase' }]}>{label}</Text>}
      <View
        style={{
          height: size === 'lg' ? 52 : 42,
          paddingHorizontal: 14,
          backgroundColor: C.input,
          borderWidth: 1.5,
          borderColor: border,
          borderRadius: R.sm,
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          boxShadow: focus ? `0 0 0 3px ${C.focusRing}` : undefined,
        }}
      >
        <TextInput
          accessibilityLabel={label ?? rest.placeholder}
          editable={!disabled}
          placeholderTextColor={C.textMuted}
          selectionColor={C.accent}
          keyboardAppearance="dark"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={[t('body400', 16), { height: '100%', padding: 0, outlineStyle: 'none' } as unknown as TextStyle]}
          {...rest}
        />
      </View>
      {(hint || error) && <Text style={t('body400', 12, error ? C.danger : C.textMuted, 1.3)}>{error || hint}</Text>}
    </View>
  );
}

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: R.xs,
          backgroundColor: checked ? C.accent : C.input,
          borderWidth: 1.5,
          borderColor: checked ? C.accent : C.borderStrong,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && (
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path d="M2 6.2L4.8 9L10 3" stroke={C.accentFg} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        )}
      </View>
      <Text style={[t('body400', 16, C.text, 1.3), { flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}

export function Switch({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      hitSlop={9}
    >
      <View
        style={{
          width: 44,
          height: 26,
          borderRadius: R.pill,
          backgroundColor: value ? C.accent : C.input,
          borderWidth: 1.5,
          borderColor: value ? C.accent : C.borderStrong,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 1.5,
            left: value ? 18.5 : 1.5,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: value ? C.accentFg : C.textSecondary,
          }}
        />
      </View>
    </Pressable>
  );
}

export function Eyebrow({ children, color, size }: { children: React.ReactNode; color?: string; size?: number }) {
  return <Text style={eyebrow(size, color)}>{children}</Text>;
}

/** "STACK" + orange "ED". */
export function Wordmark({ size }: { size: number }) {
  return (
    <Text style={t('display900i', size, C.text, 0.9, -0.01)}>
      STACK<Text style={{ color: C.accent }}>ED</Text>
    </Text>
  );
}

export function BackButton({ onPress, style }: { onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={onPress}
      style={[{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <ChevronLeft size={22} color={C.text} strokeWidth={2} />
    </Pressable>
  );
}

/** Row of label + caption used above lists ("FREE PLAY ... Unlimited, unranked"). */
export function SectionHead({ left, right, leftColor }: { left: string; right?: string; leftColor?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Eyebrow color={leftColor ?? C.textSecondary}>{left}</Eyebrow>
      {right ? <Text style={t('ui600', 12, C.textMuted)}>{right}</Text> : null}
    </View>
  );
}

/** Card list container: 1.5px border, 10px radius. */
export function ListCard({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderRadius: R.md, overflow: 'hidden' }, style]}>
      {children}
    </View>
  );
}
