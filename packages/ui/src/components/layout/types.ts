import type { HTMLAttributes } from "astro/types";

export type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
export type GridColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full";
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
export type LayoutAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type LayoutJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type LayoutDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type SidebarWidth = "sm" | "md" | "lg" | "xl";
export type HeaderHeight = "sm" | "md" | "lg";
export type AutoGridWidth = "xs" | "sm" | "md" | "lg";

export interface BaseLayoutProps extends Omit<HTMLAttributes<"div">, "class" | "style"> {
  as?: keyof HTMLElementTagNameMap;
  class?: string;
}

export interface FlexLayoutProps extends BaseLayoutProps {
  direction?: LayoutDirection;
  gap?: Spacing;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  wrap?: boolean;
}

export interface GridLayoutProps extends BaseLayoutProps {
  columns?: GridColumnCount;
  rows?: GridColumnCount;
  gap?: Spacing;
  rowGap?: Spacing;
  columnGap?: Spacing;
  align?: LayoutAlign;
  justify?: LayoutJustify;
}

export interface SurfaceProps extends BaseLayoutProps {
  padding?: Spacing;
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  border?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
}

export interface ContainerProps extends BaseLayoutProps {
  size?: ContainerSize;
  centered?: boolean;
  padding?: Spacing;
}

export const gapClass: Record<Spacing, string> = {
  0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4",
  5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12",
  16: "gap-16", 20: "gap-20", 24: "gap-24",
};

export const rowGapClass: Record<Spacing, string> = {
  0: "gap-y-0", 1: "gap-y-1", 2: "gap-y-2", 3: "gap-y-3", 4: "gap-y-4",
  5: "gap-y-5", 6: "gap-y-6", 8: "gap-y-8", 10: "gap-y-10", 12: "gap-y-12",
  16: "gap-y-16", 20: "gap-y-20", 24: "gap-y-24",
};

export const columnGapClass: Record<Spacing, string> = {
  0: "gap-x-0", 1: "gap-x-1", 2: "gap-x-2", 3: "gap-x-3", 4: "gap-x-4",
  5: "gap-x-5", 6: "gap-x-6", 8: "gap-x-8", 10: "gap-x-10", 12: "gap-x-12",
  16: "gap-x-16", 20: "gap-x-20", 24: "gap-x-24",
};

export const gridColumnClass: Record<GridColumnCount, string> = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4",
  5: "grid-cols-5", 6: "grid-cols-6", 7: "grid-cols-7", 8: "grid-cols-8",
  9: "grid-cols-9", 10: "grid-cols-10", 11: "grid-cols-11", 12: "grid-cols-12",
};

export const gridRowClass: Record<GridColumnCount, string> = {
  1: "grid-rows-1", 2: "grid-rows-2", 3: "grid-rows-3", 4: "grid-rows-4",
  5: "grid-rows-5", 6: "grid-rows-6", 7: "grid-rows-7", 8: "grid-rows-8",
  9: "grid-rows-9", 10: "grid-rows-10", 11: "grid-rows-11", 12: "grid-rows-12",
};

export const columnSpanClass: Record<GridSpan, string> = {
  1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4",
  5: "col-span-5", 6: "col-span-6", 7: "col-span-7", 8: "col-span-8",
  9: "col-span-9", 10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
  full: "col-span-full",
};

export const rowSpanClass: Record<GridSpan, string> = {
  1: "row-span-1", 2: "row-span-2", 3: "row-span-3", 4: "row-span-4",
  5: "row-span-5", 6: "row-span-6", 7: "row-span-7", 8: "row-span-8",
  9: "row-span-9", 10: "row-span-10", 11: "row-span-11", 12: "row-span-12",
  full: "row-span-full",
};

export const alignClasses: Record<LayoutAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

export const justifyClasses: Record<LayoutJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export const paddingClass: Record<Spacing, string> = {
  0: "p-0", 1: "p-1", 2: "p-2", 3: "p-3", 4: "p-4",
  5: "p-5", 6: "p-6", 8: "p-8", 10: "p-10", 12: "p-12",
  16: "p-16", 20: "p-20", 24: "p-24",
};

export const containerSizeClass: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-none",
};

export const radiusClass = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const shadowClass = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export const widthClass = {
  full: "w-full",
  screen: "w-screen",
  auto: "w-auto",
  fit: "w-fit",
};

export const heightClass = {
  full: "h-full",
  screen: "h-screen",
  auto: "h-auto",
  fit: "h-fit",
};

export const minHeightClass: Record<Spacing, string> = {
  0: "min-h-0", 1: "min-h-1", 2: "min-h-2", 3: "min-h-3", 4: "min-h-4",
  5: "min-h-5", 6: "min-h-6", 8: "min-h-8", 10: "min-h-10", 12: "min-h-12",
  16: "min-h-16", 20: "min-h-20", 24: "min-h-24",
};

export const minWidthClass: Record<Spacing, string> = {
  0: "min-w-0", 1: "min-w-1", 2: "min-w-2", 3: "min-w-3", 4: "min-w-4",
  5: "min-w-5", 6: "min-w-6", 8: "min-w-8", 10: "min-w-10", 12: "min-w-12",
  16: "min-w-16", 20: "min-w-20", 24: "min-w-24",
};

export const spacerSizeClass: Record<Spacing, string> = {
  0: "basis-0", 1: "basis-1", 2: "basis-2", 3: "basis-3", 4: "basis-4",
  5: "basis-5", 6: "basis-6", 8: "basis-8", 10: "basis-10", 12: "basis-12",
  16: "basis-16", 20: "basis-20", 24: "basis-24",
};

export const insetPaddingClass: Record<Spacing, string> = paddingClass;

export const bleedMarginClass: Record<Spacing, string> = {
  0: "-m-0", 1: "-m-1", 2: "-m-2", 3: "-m-3", 4: "-m-4",
  5: "-m-5", 6: "-m-6", 8: "-m-8", 10: "-m-10", 12: "-m-12",
  16: "-m-16", 20: "-m-20", 24: "-m-24",
};

export const dividerSpacingClass: Record<Spacing, string> = {
  0: "my-0", 1: "my-1", 2: "my-2", 3: "my-3", 4: "my-4",
  5: "my-5", 6: "my-6", 8: "my-8", 10: "my-10", 12: "my-12",
  16: "my-16", 20: "my-20", 24: "my-24",
};

export const sidebarWidthClass = {
  sm: "w-48",
  md: "w-60",
  lg: "w-72",
  xl: "w-80",
};

export const headerHeightClass = {
  sm: "h-12",
  md: "h-14",
  lg: "h-16",
};

export const stickyTopClass: Record<Spacing, string> = {
  0: "top-0", 1: "top-1", 2: "top-2", 3: "top-3", 4: "top-4",
  5: "top-5", 6: "top-6", 8: "top-8", 10: "top-10", 12: "top-12",
  16: "top-16", 20: "top-20", 24: "top-24",
};

export const stickyBottomClass: Record<Spacing, string> = {
  0: "bottom-0", 1: "bottom-1", 2: "bottom-2", 3: "bottom-3", 4: "bottom-4",
  5: "bottom-5", 6: "bottom-6", 8: "bottom-8", 10: "bottom-10", 12: "bottom-12",
  16: "bottom-16", 20: "bottom-20", 24: "bottom-24",
};

export const autoGridWidthClass = {
  xs: "[--auto-grid-min:12rem]",
  sm: "[--auto-grid-min:16rem]",
  md: "[--auto-grid-min:20rem]",
  lg: "[--auto-grid-min:24rem]",
};

export function pickClass(
  map: object,
  key: string | number | undefined,
): string | undefined {
  return key === undefined
    ? undefined
    : (map as Record<string, string>)[String(key)];
}
