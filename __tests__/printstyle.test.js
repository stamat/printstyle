import { describe, it, expect, afterEach } from '@jest/globals'
import PrintStyle from '../index.js'

const ESC = '\x1b'

// Ensure module-level instance isn't affected by CI env vars
const savedNoColor = process.env.NO_COLOR
const savedForceColor = process.env.FORCE_COLOR
delete process.env.NO_COLOR
delete process.env.FORCE_COLOR
const ps = new PrintStyle()
if (savedNoColor !== undefined) process.env.NO_COLOR = savedNoColor
if (savedForceColor !== undefined) process.env.FORCE_COLOR = savedForceColor

describe('ANSI code properties', () => {
  it('should have reset code', () => {
    expect(ps.reset).toBe(`${ESC}[0m`)
  })

  it('should have text style codes', () => {
    expect(ps.bold).toBe(`${ESC}[1m`)
    expect(ps.dim).toBe(`${ESC}[2m`)
    expect(ps.italic).toBe(`${ESC}[3m`)
    expect(ps.underline).toBe(`${ESC}[4m`)
    expect(ps.inverse).toBe(`${ESC}[7m`)
    expect(ps.hidden).toBe(`${ESC}[8m`)
    expect(ps.strikethrough).toBe(`${ESC}[9m`)
  })

  it('should have foreground color codes', () => {
    expect(ps.black).toBe(`${ESC}[30m`)
    expect(ps.red).toBe(`${ESC}[31m`)
    expect(ps.green).toBe(`${ESC}[32m`)
    expect(ps.yellow).toBe(`${ESC}[33m`)
    expect(ps.blue).toBe(`${ESC}[34m`)
    expect(ps.magenta).toBe(`${ESC}[35m`)
    expect(ps.cyan).toBe(`${ESC}[36m`)
    expect(ps.white).toBe(`${ESC}[37m`)
    expect(ps.gray).toBe(`${ESC}[90m`)
  })

  it('should have bright foreground color codes', () => {
    expect(ps.redBright).toBe(`${ESC}[91m`)
    expect(ps.greenBright).toBe(`${ESC}[92m`)
    expect(ps.yellowBright).toBe(`${ESC}[93m`)
    expect(ps.blueBright).toBe(`${ESC}[94m`)
    expect(ps.magentaBright).toBe(`${ESC}[95m`)
    expect(ps.cyanBright).toBe(`${ESC}[96m`)
    expect(ps.whiteBright).toBe(`${ESC}[97m`)
  })

  it('should have background color codes', () => {
    expect(ps.bgBlack).toBe(`${ESC}[40m`)
    expect(ps.bgRed).toBe(`${ESC}[41m`)
    expect(ps.bgGreen).toBe(`${ESC}[42m`)
    expect(ps.bgYellow).toBe(`${ESC}[43m`)
    expect(ps.bgBlue).toBe(`${ESC}[44m`)
    expect(ps.bgMagenta).toBe(`${ESC}[45m`)
    expect(ps.bgCyan).toBe(`${ESC}[46m`)
    expect(ps.bgWhite).toBe(`${ESC}[47m`)
    expect(ps.bgGray).toBe(`${ESC}[100m`)
  })

  it('should have bright background color codes', () => {
    expect(ps.bgRedBright).toBe(`${ESC}[101m`)
    expect(ps.bgGreenBright).toBe(`${ESC}[102m`)
    expect(ps.bgYellowBright).toBe(`${ESC}[103m`)
    expect(ps.bgBlueBright).toBe(`${ESC}[104m`)
    expect(ps.bgMagentaBright).toBe(`${ESC}[105m`)
    expect(ps.bgCyanBright).toBe(`${ESC}[106m`)
    expect(ps.bgWhiteBright).toBe(`${ESC}[107m`)
  })

  it('should have bell code', () => {
    expect(ps.bell).toBe('\x07')
  })
})

describe('hexToRgb', () => {
  it('should parse hex with hash', () => {
    expect(ps.hexToRgb('#ff0000')).toEqual([255, 0, 0])
  })

  it('should parse hex without hash', () => {
    expect(ps.hexToRgb('00ff00')).toEqual([0, 255, 0])
  })

  it('should parse black', () => {
    expect(ps.hexToRgb('#000000')).toEqual([0, 0, 0])
  })

  it('should parse white', () => {
    expect(ps.hexToRgb('#ffffff')).toEqual([255, 255, 255])
  })

  it('should parse mixed hex', () => {
    expect(ps.hexToRgb('#2e8b57')).toEqual([46, 139, 87])
  })

  it('should expand 3-char shorthand hex', () => {
    expect(ps.hexToRgb('#f00')).toEqual([255, 0, 0])
    expect(ps.hexToRgb('0f0')).toEqual([0, 255, 0])
    expect(ps.hexToRgb('#fff')).toEqual([255, 255, 255])
    expect(ps.hexToRgb('#000')).toEqual([0, 0, 0])
  })

  it('should fallback to 0 for invalid hex chars', () => {
    expect(ps.hexToRgb('zzzzzz')).toEqual([0, 0, 0])
    expect(ps.hexToRgb('#gg0000')).toEqual([0, 0, 0])
  })
})

describe('terminalColorIndex', () => {
  it('should return 16 for black (0,0,0)', () => {
    expect(ps.terminalColorIndex(0, 0, 0)).toBe(16)
  })

  it('should return 231 for white (255,255,255)', () => {
    expect(ps.terminalColorIndex(255, 255, 255)).toBe(231)
  })

  it('should return 196 for pure red (255,0,0)', () => {
    expect(ps.terminalColorIndex(255, 0, 0)).toBe(196)
  })

  it('should return 46 for pure green (0,255,0)', () => {
    expect(ps.terminalColorIndex(0, 255, 0)).toBe(46)
  })

  it('should return 21 for pure blue (0,0,255)', () => {
    expect(ps.terminalColorIndex(0, 0, 255)).toBe(21)
  })
})

describe('color', () => {
  it('should return 256-color foreground escape for hex', () => {
    const result = ps.color('#ff0000')
    expect(result).toBe(`${ESC}[38;5;196m`)
  })

  it('should work without hash prefix', () => {
    const result = ps.color('00ff00')
    expect(result).toBe(`${ESC}[38;5;46m`)
  })
})

describe('background', () => {
  it('should return 256-color background escape for hex', () => {
    const result = ps.background('#ff0000')
    expect(result).toBe(`${ESC}[48;5;196m`)
  })

  it('should work without hash prefix', () => {
    const result = ps.background('00ff00')
    expect(result).toBe(`${ESC}[48;5;46m`)
  })
})

describe('_resolveToken', () => {
  it('should resolve "/" to reset', () => {
    expect(ps._resolveToken('/')).toBe(ps.reset)
  })

  it('should resolve named styles', () => {
    expect(ps._resolveToken('red')).toBe(ps.red)
    expect(ps._resolveToken('bold')).toBe(ps.bold)
    expect(ps._resolveToken('bgRed')).toBe(ps.bgRed)
  })

  it('should resolve hex foreground', () => {
    expect(ps._resolveToken('#ff0000')).toBe(ps.color('#ff0000'))
  })

  it('should resolve hex background with bg# prefix', () => {
    expect(ps._resolveToken('bg#ff0000')).toBe(ps.background('#ff0000'))
  })

  it('should return empty string for unknown tokens', () => {
    expect(ps._resolveToken('nonexistent')).toBe('')
  })
})

describe('paint', () => {
  describe('spanning mode (manual reset)', () => {
    it('should apply a single style', () => {
      expect(ps.paint('{red}hello{/}')).toBe(`${ESC}[31mhello${ESC}[0m`)
    })

    it('should apply bold', () => {
      expect(ps.paint('{bold}text{/}')).toBe(`${ESC}[1mtext${ESC}[0m`)
    })

    it('should apply dot-chained styles', () => {
      expect(ps.paint('{red.bold}error{/}')).toBe(`${ESC}[31m${ESC}[1merror${ESC}[0m`)
    })

    it('should handle multiple spans', () => {
      const result = ps.paint('{red}err{/} {green}ok{/}')
      expect(result).toBe(`${ESC}[31merr${ESC}[0m ${ESC}[32mok${ESC}[0m`)
    })

    it('should apply hex foreground color', () => {
      const hex = ps.color('#2e8b57')
      expect(ps.paint('{#2e8b57}text{/}')).toBe(`${hex}text${ESC}[0m`)
    })

    it('should apply hex background color', () => {
      const bg = ps.background('#2e8b57')
      expect(ps.paint('{bg#2e8b57}text{/}')).toBe(`${bg}text${ESC}[0m`)
    })

    it('should apply named background', () => {
      expect(ps.paint('{bgRed}text{/}')).toBe(`${ESC}[41mtext${ESC}[0m`)
    })
  })

  describe('wrap mode (auto-reset)', () => {
    it('should apply style and auto-reset', () => {
      expect(ps.paint('{red|hello}')).toBe(`${ESC}[31mhello${ESC}[0m`)
    })

    it('should apply dot-chained styles with auto-reset', () => {
      expect(ps.paint('{red.bold|error}')).toBe(`${ESC}[31m${ESC}[1merror${ESC}[0m`)
    })

    it('should handle empty content', () => {
      expect(ps.paint('{red|}')).toBe(`${ESC}[31m${ESC}[0m`)
    })

    it('should handle content with spaces', () => {
      expect(ps.paint('{bgRed.white| FAIL }')).toBe(`${ESC}[41m${ESC}[37m FAIL ${ESC}[0m`)
    })

    it('should apply hex foreground with wrap', () => {
      const hex = ps.color('#2e8b57')
      expect(ps.paint('{#2e8b57|ok}')).toBe(`${hex}ok${ESC}[0m`)
    })

    it('should apply hex background with wrap', () => {
      const bg = ps.background('#ff5500')
      expect(ps.paint('{bg#ff5500|warn}')).toBe(`${bg}warn${ESC}[0m`)
    })

    it('should handle multiple wraps in one string', () => {
      const result = ps.paint('{green.bold|✓} {dim|file.jpg} {green|12KB}')
      expect(result).toBe(
        `${ESC}[32m${ESC}[1m✓${ESC}[0m ${ESC}[2mfile.jpg${ESC}[0m ${ESC}[32m12KB${ESC}[0m`
      )
    })
  })

  describe('mixed mode', () => {
    it('should handle spanning and wraps together', () => {
      const result = ps.paint('{dim}prefix {red.bold|ERROR} still dim{/}')
      expect(result).toBe(
        `${ESC}[2mprefix ${ESC}[31m${ESC}[1mERROR${ESC}[0m still dim${ESC}[0m`
      )
    })

    it('should handle wrap inside a span', () => {
      const result = ps.paint('{gray}[{green|info}] message{/}')
      expect(result).toBe(
        `${ESC}[90m[${ESC}[32minfo${ESC}[0m] message${ESC}[0m`
      )
    })
  })

  describe('edge cases', () => {
    it('should return string unchanged when no tokens', () => {
      expect(ps.paint('hello world')).toBe('hello world')
    })

    it('should return empty string for empty input', () => {
      expect(ps.paint('')).toBe('')
    })

    it('should ignore unknown style names', () => {
      expect(ps.paint('{nope|text}')).toBe(`text${ESC}[0m`)
    })

    it('should handle multiple unknown tokens in chain', () => {
      expect(ps.paint('{nope.also_nope|text}')).toBe(`text${ESC}[0m`)
    })

    it('should handle reset-only token', () => {
      expect(ps.paint('{/}')).toBe(`${ESC}[0m`)
    })

    it('should handle adjacent tokens', () => {
      expect(ps.paint('{red|a}{blue|b}')).toBe(
        `${ESC}[31ma${ESC}[0m${ESC}[34mb${ESC}[0m`
      )
    })

    it('should handle triple dot-chain', () => {
      expect(ps.paint('{bgRed.white.bold|FAIL}')).toBe(
        `${ESC}[41m${ESC}[37m${ESC}[1mFAIL${ESC}[0m`
      )
    })

    it('should handle hex with dot-chain', () => {
      const hex = ps.color('#2e8b57')
      expect(ps.paint('{#2e8b57.bold|ok}')).toBe(`${hex}${ESC}[1mok${ESC}[0m`)
    })

    it('should handle bg hex with dot-chain', () => {
      const bg = ps.background('#2e8b57')
      expect(ps.paint('{bg#2e8b57.white.bold|ok}')).toBe(
        `${bg}${ESC}[37m${ESC}[1mok${ESC}[0m`
      )
    })

    it('should not match escaped-looking but valid braces', () => {
      expect(ps.paint('literal {}')).toBe('literal {}')
    })

    it('should handle pipe in spanning mode as style name', () => {
      // {style|} is wrap with empty content, not spanning
      expect(ps.paint('{red|}')).toBe(`${ESC}[31m${ESC}[0m`)
    })
  })
})

describe('NO_COLOR / FORCE_COLOR', () => {
  let savedNoColor
  let savedForceColor

  afterEach(() => {
    delete process.env.NO_COLOR
    delete process.env.FORCE_COLOR
    if (savedNoColor !== undefined) process.env.NO_COLOR = savedNoColor
    if (savedForceColor !== undefined) process.env.FORCE_COLOR = savedForceColor
  })

  it('should disable all codes when NO_COLOR is set', () => {
    process.env.NO_COLOR = '1'
    const noColor = new PrintStyle()
    expect(noColor.enabled).toBe(false)
    expect(noColor.red).toBe('')
    expect(noColor.bold).toBe('')
    expect(noColor.reset).toBe('')
    expect(noColor.bgRed).toBe('')
    expect(noColor.bell).toBe('\x07')
  })

  it('should disable when NO_COLOR is empty string', () => {
    process.env.NO_COLOR = ''
    const noColor = new PrintStyle()
    expect(noColor.enabled).toBe(false)
    expect(noColor.red).toBe('')
  })

  it('should keep colors when FORCE_COLOR is set', () => {
    process.env.FORCE_COLOR = '1'
    const forced = new PrintStyle()
    expect(forced.enabled).toBe(true)
    expect(forced.red).toBe(`${ESC}[31m`)
  })

  it('should disable when FORCE_COLOR=0', () => {
    process.env.FORCE_COLOR = '0'
    const forced = new PrintStyle()
    expect(forced.enabled).toBe(false)
    expect(forced.red).toBe('')
  })

  it('FORCE_COLOR should override NO_COLOR', () => {
    process.env.NO_COLOR = '1'
    process.env.FORCE_COLOR = '1'
    const forced = new PrintStyle()
    expect(forced.enabled).toBe(true)
    expect(forced.red).toBe(`${ESC}[31m`)
  })

  it('should return plain text from paint() when disabled', () => {
    process.env.NO_COLOR = '1'
    const noColor = new PrintStyle()
    expect(noColor.paint('{red.bold|Error:} message')).toBe('Error: message')
  })

  it('should return plain text from color() when disabled', () => {
    process.env.NO_COLOR = '1'
    const noColor = new PrintStyle()
    expect(noColor.color('#ff0000')).toBe('')
  })

  it('should return plain text from background() when disabled', () => {
    process.env.NO_COLOR = '1'
    const noColor = new PrintStyle()
    expect(noColor.background('#ff0000')).toBe('')
  })

  it('should work with manual disable()', () => {
    const ps2 = new PrintStyle()
    expect(ps2.enabled).toBe(true)
    ps2.disable()
    expect(ps2.enabled).toBe(false)
    expect(ps2.red).toBe('')
    expect(ps2.paint('{red|text}')).toBe('text')
  })

  it('should re-enable with enable()', () => {
    const ps2 = new PrintStyle()
    ps2.disable()
    expect(ps2.enabled).toBe(false)
    expect(ps2.red).toBe('')
    ps2.enable()
    expect(ps2.enabled).toBe(true)
    expect(ps2.red).toBe(`${ESC}[31m`)
    expect(ps2.bold).toBe(`${ESC}[1m`)
    expect(ps2.paint('{red|text}')).toBe(`${ESC}[31mtext${ESC}[0m`)
  })

  it('should preserve bell when disabled', () => {
    const ps2 = new PrintStyle()
    ps2.disable()
    expect(ps2.bell).toBe('\x07')
  })
})

describe('extend', () => {
  it('should add custom styles as properties', () => {
    const ps2 = new PrintStyle()
    ps2.extend({
      error: ps2.bold + ps2.red,
      success: ps2.bold + ps2.green,
    })
    expect(ps2.error).toBe(`${ESC}[1m${ESC}[31m`)
    expect(ps2.success).toBe(`${ESC}[1m${ESC}[32m`)
  })

  it('should make custom styles usable in paint()', () => {
    const ps2 = new PrintStyle()
    ps2.extend({ error: ps2.bold + ps2.red })
    expect(ps2.paint('{error|fail}')).toBe(`${ESC}[1m${ESC}[31mfail${ESC}[0m`)
    expect(ps2.paint('{error}fail{/}')).toBe(`${ESC}[1m${ESC}[31mfail${ESC}[0m`)
  })

  it('should clear custom styles on disable()', () => {
    const ps2 = new PrintStyle()
    ps2.extend({ error: ps2.bold + ps2.red })
    ps2.disable()
    expect(ps2.error).toBe('')
    expect(ps2.paint('{error|fail}')).toBe('fail')
  })

  it('should restore custom styles on enable() after disable()', () => {
    const ps2 = new PrintStyle()
    const errorCode = ps2.bold + ps2.red
    ps2.extend({ error: errorCode })
    ps2.disable()
    expect(ps2.error).toBe('')
    ps2.enable()
    expect(ps2.error).toBe(errorCode)
    expect(ps2.paint('{error|fail}')).toBe(`${errorCode}fail${ESC}[0m`)
  })

  it('should allow extending with hex color values', () => {
    const ps2 = new PrintStyle()
    ps2.extend({ brand: ps2.color('#ff6600') })
    expect(ps2.brand).toBe(ps2.color('#ff6600'))
    expect(ps2.paint('{brand|logo}')).toBe(`${ps2.color('#ff6600')}logo${ESC}[0m`)
  })
})
