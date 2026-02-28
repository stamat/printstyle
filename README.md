# PrintStyle 🌈

ANSI terminal styling with a built-in micro template language.

Most color libraries make you chain function calls or concatenate escape codes by hand. PrintStyle gives you `paint()` — a template syntax that reads like markup and just works.

```js
import PrintStyle from "printstyle";
const ps = new PrintStyle();

ps.paint("{red|Error:} Woops something went wrong!");
```

## Why PrintStyle?

- **Template syntax** — `paint()` lets you style strings inline without concatenation chains or nested calls. No other terminal color package has this built in.
- **Tiny** — ~9 KB unpacked, zero dependencies.
- **Hex colors** — use any color, not just the 16 built-in ANSI names.
- **NO_COLOR / FORCE_COLOR** — follows the standard out of the box.
- **No magic** — plain class with string properties. No Proxy, no prototype tricks, no chaining API. Easy to debug, easy to understand.

**Note:** Legacy Windows CMD (before Windows 10) does not support ANSI escape codes. Use Windows Terminal, PowerShell, or WSL instead.

## Install

```bash
npm install printstyle
```

## Template Syntax — `paint()`

### Wrap mode (auto-reset)

Style is applied and automatically reset after the content:

```js
ps.paint("{red|error message}"); // red text, then reset
ps.paint("{bold.red|ERROR}"); // bold + red, then reset
ps.paint("{bgRed.white| FAIL }"); // red background, white text
```

### Spanning mode (manual reset)

Style stays active until you close with `{/}`:

```js
ps.paint("{red}all of this is red{/}");
ps.paint("{dim}prefix {bold|inner} still dim{/}");
```

### Dot-chaining

Combine multiple styles with `.`:

```js
ps.paint("{bgRed.white.bold|FAIL}"); // background + foreground + style
ps.paint("{green.bold|✓} {dim|file.jpg}"); // multiple wraps in one string
```

### Hex colors

Use any hex color for foreground or background:

```js
ps.paint("{#2e8b57|sea green text}");
ps.paint("{bg#ff5500.white|orange background}");
ps.paint("{#f00|shorthand red}"); // 3-char hex supported
```

## Direct Property Access

Every ANSI code is also available as a string property for manual concatenation:

```js
console.log(ps.red + "error" + ps.reset);
console.log(ps.bold + ps.blue + "title" + ps.reset);
```

### Available properties

**Styles:** `reset` `bold` `dim` `italic` `underline` `blink` `inverse` `hidden` `strikethrough`

**Colors:** `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray`

**Bright colors:** `redBright` `greenBright` `yellowBright` `blueBright` `magentaBright` `cyanBright` `whiteBright`

**Backgrounds:** `bgBlack` `bgRed` `bgGreen` `bgYellow` `bgBlue` `bgMagenta` `bgCyan` `bgWhite` `bgGray`

**Bright backgrounds:** `bgRedBright` `bgGreenBright` `bgYellowBright` `bgBlueBright` `bgMagentaBright` `bgCyanBright` `bgWhiteBright`

**Other:** `bell`

## Custom Styles — `extend()`

Register your own named styles built from any combination of built-in codes or hex colors:

```js
const ps = new PrintStyle();

ps.extend({
  error: ps.bold + ps.red,
  success: ps.bold + ps.green,
  warning: ps.yellow,
  brand: ps.color("#ff6600"),
  link: ps.blue + ps.underline + ps.italic,
});

console.log(ps.paint("{error|Something failed}"));
console.log(ps.paint("{success|All good}"));
console.log(ps.paint("{brand|Acme Corp}"));
console.log(ps.paint("{link|https://github.com/stamat/printstyle}"));
```

Custom styles work everywhere built-in styles do — in `paint()` templates, dot-chaining, direct property access, and they integrate with `disable()` / `enable()`.

## Hex Color Methods

```js
ps.color("#ff0000"); // foreground escape sequence for hex
ps.background("#00ff00"); // background escape sequence for hex
```

Both accept 6-char (`#ff0000`) or 3-char (`#f00`) hex, with or without `#`.

## NO_COLOR / FORCE_COLOR

PrintStyle respects the [NO_COLOR](https://no-color.org/) and [FORCE_COLOR](https://force-color.org/) environment variables automatically:

- `NO_COLOR` (any value) — disables all color output
- `FORCE_COLOR=1` — forces color output regardless of `NO_COLOR`
- `FORCE_COLOR=0` — disables color output

You can also control it programmatically:

```js
ps.disable(); // turn off all codes
ps.enable(); // restore all codes
ps.enabled; // check current state
```

## Comparison

|                     | printstyle | chalk        | ansis     | picocolors | kleur     | ansi-colors | yoctocolors |
| ------------------- | ---------- | ------------ | --------- | ---------- | --------- | ----------- | ----------- |
| **Unpacked size**   | ~9 KB      | ~44 KB       | ~6 KB     | ~6 KB      | ~20 KB    | ~26 KB      | ~10 KB      |
| **Runtime deps**    | 0          | 0            | 0         | 0          | 0         | 0           | 0           |
| **Template syntax** | Built-in   | Separate pkg | No        | No         | No        | No          | No          |
| **Hex colors**      | Yes        | Yes          | Yes       | No         | No        | No          | No          |
| **NO_COLOR**        | Yes        | No           | Yes       | Yes        | Yes       | No          | Yes         |
| **FORCE_COLOR**     | Yes        | Yes          | Yes       | Yes        | Yes       | Partial     | Yes         |
| **TypeScript**      | Built-in   | Built-in     | Built-in  | Built-in   | Built-in  | Built-in    | Built-in    |
| **Module type**     | ESM        | ESM          | CJS + ESM | CJS + ESM  | CJS + ESM | CJS         | ESM         |
| **Legacy Win CMD**  | No         | Yes          | No        | No         | No        | No          | No          |

## License

[MIT](LICENSE)

## P.S.

> Another one - DJ Khaled

❤️, @stamat
