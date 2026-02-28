/**
 * Minimal ANSI terminal styling with a built-in micro template language.
 */
export default class PrintStyle {
  /** Whether ANSI codes are currently active. */
  enabled: boolean

  // Styles
  reset: string
  bold: string
  dim: string
  italic: string
  underline: string
  blink: string
  inverse: string
  hidden: string
  strikethrough: string

  // Foreground colors
  black: string
  red: string
  redBright: string
  green: string
  greenBright: string
  yellow: string
  yellowBright: string
  blue: string
  blueBright: string
  magenta: string
  magentaBright: string
  cyan: string
  cyanBright: string
  white: string
  whiteBright: string
  gray: string

  // Background colors
  bgBlack: string
  bgRed: string
  bgRedBright: string
  bgGreen: string
  bgGreenBright: string
  bgYellow: string
  bgYellowBright: string
  bgBlue: string
  bgBlueBright: string
  bgMagenta: string
  bgMagentaBright: string
  bgCyan: string
  bgCyanBright: string
  bgWhite: string
  bgWhiteBright: string
  bgGray: string

  // Other
  bell: string

  /**
   * Disable all ANSI codes. Properties become empty strings.
   * The `bell` property is preserved.
   */
  disable(): void

  /**
   * Re-enable all ANSI codes, restoring their original values.
   */
  enable(): void

  /**
   * Register custom named styles.
   * Extended styles integrate with `disable()` and `enable()` and are usable in `paint()` templates.
   * @param styles An object mapping style names to ANSI escape strings.
   */
  extend(styles: Record<string, string>): void

  /**
   * Parse a hex color string into an [R, G, B] array.
   * @param hex Hex color string (e.g. `'#ff0000'`, `'f00'`).
   * @returns An array of [red, green, blue] values (0–255).
   */
  hexToRgb(hex: string): [number, number, number]

  /**
   * Convert RGB values to a 256-color terminal index.
   * @param red Red channel (0–255).
   * @param green Green channel (0–255).
   * @param blue Blue channel (0–255).
   * @returns The terminal color index (16–231).
   */
  terminalColorIndex(red: number, green: number, blue: number): number

  /**
   * Get a 256-color foreground escape sequence for a hex color.
   * @param hex Hex color string (e.g. `'#ff0000'`, `'f00'`).
   * @returns The ANSI escape sequence, or `''` if disabled.
   */
  color(hex: string): string

  /**
   * Get a 256-color background escape sequence for a hex color.
   * @param hex Hex color string (e.g. `'#ff0000'`, `'f00'`).
   * @returns The ANSI escape sequence, or `''` if disabled.
   */
  background(hex: string): string

  /**
   * Apply styles to a string using a micro template syntax.
   *
   * **Wrap mode** (auto-reset): `{style|content}` — e.g. `'{red|error}'`
   *
   * **Spanning mode** (manual reset): `{style}...{/}` — e.g. `'{red}error{/}'`
   *
   * Styles can be dot-chained: `'{bold.red|ERROR}'`
   *
   * Hex colors: `'{#2e8b57|text}'`, `'{bg#ff5500|text}'`
   *
   * @param str The template string to process.
   * @returns The string with ANSI escape sequences applied.
   */
  paint(str: string): string

  /** Allow custom styles added via `extend()`. */
  [key: string]: string | boolean | ((...args: any[]) => any)
}
