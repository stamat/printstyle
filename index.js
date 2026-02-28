/**
 * Minimal ANSI terminal styling with a built-in micro template language.
 */
export default class PrintStyle {
  enabled = true
  reset = '\x1b[0m'
  bold = '\x1b[1m'
  dim = '\x1b[2m'
  italic = '\x1b[3m'
  underline = '\x1b[4m'
  blink = '\x1b[5m'
  inverse = '\x1b[7m'
  hidden = '\x1b[8m'
  strikethrough = '\x1b[9m'
  black = '\x1b[30m'
  red = '\x1b[31m'
  redBright = '\x1b[91m'
  green = '\x1b[32m'
  greenBright = '\x1b[92m'
  yellow = '\x1b[33m'
  yellowBright = '\x1b[93m'
  blue = '\x1b[34m'
  blueBright = '\x1b[94m'
  magenta = '\x1b[35m'
  magentaBright = '\x1b[95m'
  cyan = '\x1b[36m'
  cyanBright = '\x1b[96m'
  white = '\x1b[37m'
  whiteBright = '\x1b[97m'
  gray = '\x1b[90m'
  bgBlack = '\x1b[40m'
  bgRed = '\x1b[41m'
  bgRedBright = '\x1b[101m'
  bgGreen = '\x1b[42m'
  bgGreenBright = '\x1b[102m'
  bgYellow = '\x1b[43m'
  bgYellowBright = '\x1b[103m'
  bgBlue = '\x1b[44m'
  bgBlueBright = '\x1b[104m'
  bgMagenta = '\x1b[45m'
  bgMagentaBright = '\x1b[105m'
  bgCyan = '\x1b[46m'
  bgCyanBright = '\x1b[106m'
  bgWhite = '\x1b[47m'
  bgWhiteBright = '\x1b[107m'
  bgGray = '\x1b[100m'
  bell = '\x07'

  constructor() {
    this._defaults = {}
    for (const key of Object.keys(this)) {
      if (typeof this[key] === 'string') this._defaults[key] = this[key]
    }

    const env = typeof process !== 'undefined' && process.env ? process.env : {}
    if ('FORCE_COLOR' in env) {
      if (env.FORCE_COLOR === '0') this.disable()
    } else if ('NO_COLOR' in env) {
      this.disable()
    }
  }

  /**
   * Disable all ANSI codes. Properties become empty strings.
   * The `bell` property is preserved.
   */
  disable() {
    this.enabled = false
    for (const key of Object.keys(this._defaults)) {
      if (key === 'bell') continue
      this[key] = ''
    }
  }

  /**
   * Re-enable all ANSI codes, restoring their original values.
   */
  enable() {
    this.enabled = true
    for (const [key, value] of Object.entries(this._defaults)) {
      this[key] = value
    }
  }

  /**
   * Register custom named styles.
   * Extended styles integrate with `disable()` and `enable()` and are usable in `paint()` templates.
   * @param {Record<string, string>} styles - An object mapping style names to ANSI escape strings.
   * @example
   * ps.extend({
   *   error: ps.bold + ps.red,
   *   brand: ps.color('#ff6600'),
   * })
   * ps.paint('{error|Something failed}')
   */
  extend(styles) {
    for (const [key, value] of Object.entries(styles)) {
      this[key] = value
      this._defaults[key] = value
    }
  }

  /**
   * Parse a hex color string into an [R, G, B] array.
   * @param {string} hex - Hex color string (e.g. `'#ff0000'`, `'f00'`).
   * @returns {number[]} An array of [red, green, blue] values (0–255).
   */
  hexToRgb(hex) {
    let h = hex.replace('#', '')
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    const red = parseInt(h.substring(0, 2), 16)
    const green = parseInt(h.substring(2, 4), 16)
    const blue = parseInt(h.substring(4, 6), 16)

    return [
      isNaN(red) ? 0 : red,
      isNaN(green) ? 0 : green,
      isNaN(blue) ? 0 : blue
    ]
  }

  /**
   * Convert RGB values to a 256-color terminal index.
   * @param {number} red - Red channel (0–255).
   * @param {number} green - Green channel (0–255).
   * @param {number} blue - Blue channel (0–255).
   * @returns {number} The terminal color index (16–231).
   */
  terminalColorIndex(red, green, blue) {
    return 16 +
      Math.round(red / 255 * 5) * 36 +
      Math.round(green / 255 * 5) * 6 +
      Math.round(blue / 255 * 5)
  }

  /**
   * Get a 256-color foreground escape sequence for a hex color.
   * @param {string} hex - Hex color string (e.g. `'#ff0000'`, `'f00'`).
   * @returns {string} The ANSI escape sequence, or `''` if disabled.
   */
  color(hex) {
    if (!this.enabled) return ''
    const [red, green, blue] = this.hexToRgb(hex)

    return `\x1b[38;5;${this.terminalColorIndex(red, green, blue)}m`
  }

  /**
   * Get a 256-color background escape sequence for a hex color.
   * @param {string} hex - Hex color string (e.g. `'#ff0000'`, `'f00'`).
   * @returns {string} The ANSI escape sequence, or `''` if disabled.
   */
  background(hex) {
    if (!this.enabled) return ''
    const [red, green, blue] = this.hexToRgb(hex)

    return `\x1b[48;5;${this.terminalColorIndex(red, green, blue)}m`
  }

  /** @private */
  _resolveToken(token) {
    if (token === '/') return this.reset
    if (token.startsWith('bg#')) return this.background(token.slice(2))
    if (token.startsWith('#')) return this.color(token)
    return (typeof this[token] === 'string') ? this[token] : ''
  }

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
   * @param {string} str - The template string to process.
   * @returns {string} The string with ANSI escape sequences applied.
   */
  paint(str) {
    return str.replace(/\{([^}]+?)(?:\|([^}]*))?\}/g, (_, style, content) => {
      if (style === '/') return this.reset
      const codes = style.split('.').map(t => this._resolveToken(t)).join('')
      if (content !== undefined) return codes + content + this.reset
      return codes
    })
  }
}
