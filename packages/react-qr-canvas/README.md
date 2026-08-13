[![npm](https://img.shields.io/npm/v/@wojtekmaj/react-qr-canvas.svg)](https://www.npmjs.com/package/@wojtekmaj/react-qr-canvas) ![downloads](https://img.shields.io/npm/dt/@wojtekmaj/react-qr-canvas.svg) [![CI](https://github.com/wojtekmaj/react-qr-canvas/actions/workflows/ci.yml/badge.svg)](https://github.com/wojtekmaj/react-qr-canvas/actions)

# React-QR-Canvas

Render QR codes on an HTML canvas in your React app.

## tl;dr

- Install by executing `npm install @wojtekmaj/react-qr-canvas` or `yarn add @wojtekmaj/react-qr-canvas`.
- Import by adding `import QrCanvas from '@wojtekmaj/react-qr-canvas'`.
- Use by adding `<QrCanvas margin={4} value="Hello world" />`.

## Demo

A minimal demo page can be found in `sample` directory.

## Getting started

### Compatibility

Your project needs to use React 16.8 or later.

Need library for React Native? Check out [React-Native-QR-SVG](https://github.com/wojtekmaj/react-native-qr-svg).

### Installation

Add React-QR-Canvas to your project by executing `npm install @wojtekmaj/react-qr-canvas` or `yarn add @wojtekmaj/react-qr-canvas`.

### Usage

Here's an example of basic usage:

```tsx
import QrCanvas from '@wojtekmaj/react-qr-canvas';

function MyApp() {
  return (
    <div>
      <QrCanvas margin={4} value="Hello world" />
    </div>
  );
}
```

Check the [sample directory](https://github.com/wojtekmaj/react-qr-canvas/tree/main/sample) in this repository for a full working example.

## User guide

### QrCanvas

Renders a QR code on an HTML canvas.

#### Props

| Prop name | Description                                                                                                             | Default value | Example values                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| bgColor   | Background fill style. Accepts a string, `CanvasGradient`, or `CanvasPattern`.                                          | `"white"`     | `"beige"`, `gradient`, `pattern`                                        |
| fgColor   | Foreground fill style. Accepts a string, `CanvasGradient`, or `CanvasPattern`.                                          | `"black"`     | `"black"`, `gradient`, `pattern`                                        |
| level     | [Error correction level](https://en.wikipedia.org/wiki/QR_code#Error_correction). Can be `"L"`, `"M"`, `"Q"` and `"H"`. | `"L"`         | `"M"`                                                                  |
| margin    | Quiet zone around the QR code, in modules. A value of 4 is recommended.                                                 | `0`           | `4`                                                                    |
| type      | Type (size). Can be any number from 0 to 40. Set to `0` or leave as undefined to use the smallest possible size.        | `0`           | `10`                                                                   |
| value     | Value to render.                                                                                                        | n/a           | `"Hello world"`                                                        |

You can also specify all the props that are valid for the `<canvas>` React element (e.g. `style`, `className`, `width`, or `height`). The canvas defaults to 128 × 128 CSS pixels. When only `width` is provided, `height` defaults to the same value. The backing bitmap automatically scales with `window.devicePixelRatio` to remain sharp on HiDPI screens.

## License

The MIT License.

## Author

<table>
  <tr>
    <td >
      <img src="https://avatars.githubusercontent.com/u/5426427?v=4&s=128" width="64" height="64" alt="Wojciech Maj">
    </td>
    <td>
      <a href="https://github.com/wojtekmaj">Wojciech Maj</a>
    </td>
  </tr>
</table>

## Thank you

This project wouldn't be possible without the awesome work of Dan Homola <dan.homola@hotmail.cz> who created its original version.
