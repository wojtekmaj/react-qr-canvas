import { useEffect, useMemo, useRef } from 'react';
import qrcodeGenerator from 'qrcode-generator';

export type TypeNumber =
  | 0 // Automatic type number
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QrCanvasProps = {
  /**
   * Background fill style.
   *
   * @default 'white'
   * @example 'beige'
   * @example '#fefefe'
   * @example canvasGradient
   * @example canvasPattern
   */
  bgColor?: string | CanvasGradient | CanvasPattern;
  /**
   * Foreground fill style.
   *
   * @default 'black'
   * @example 'black'
   * @example '#000000'
   * @example canvasGradient
   * @example canvasPattern
   */
  fgColor?: string | CanvasGradient | CanvasPattern;
  /**
   * [Error correction level](https://en.wikipedia.org/wiki/QR_code#Error_correction). Can be `"L"`, `"M"`, `"Q"` and `"H"`.
   *
   * @default 'L'
   * @example 'M'
   */
  level?: ErrorCorrectionLevel;
  /**
   * Margin in pixels.
   *
   * @default 0
   * @example 4
   */
  margin?: number;
  /**
   * Type (size). Can be any number from 0 to 40. Set to `0` or leave as undefined to use the smallest possible size.
   *
   * @default 0
   * @example 10
   */
  type?: TypeNumber;
  /**
   * Value to render.
   *
   * @example 'Hello world'
   */
  value: string;
};

type CanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;

export default function QrCanvas({
  bgColor = '#fff',
  fgColor = '#000',
  height,
  level = 'L',
  margin = 0,
  style,
  type = 0,
  value = '',
  width = 128,
  ...otherProps
}: QrCanvasProps & Omit<CanvasProps, keyof QrCanvasProps>): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrcode = useMemo(() => {
    const qrcode = qrcodeGenerator(type, level);
    qrcode.addData(value);
    qrcode.make();
    return qrcode;
  }, [level, type, value]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const canvasElement = canvas;

    function draw() {
      const { height: displayHeight, width: displayWidth } = canvasElement.getBoundingClientRect();

      if (!displayHeight || !displayWidth) {
        return;
      }

      const pixelRatio = window.devicePixelRatio || 1;
      const canvasHeight = Math.round(displayHeight * pixelRatio);
      const canvasWidth = Math.round(displayWidth * pixelRatio);

      if (canvasElement.height !== canvasHeight) {
        canvasElement.height = canvasHeight;
      }

      if (canvasElement.width !== canvasWidth) {
        canvasElement.width = canvasWidth;
      }

      const context = canvasElement.getContext('2d');

      if (!context) {
        return;
      }

      const scaleX = canvasWidth / displayWidth;
      const scaleY = canvasHeight / displayHeight;
      const moduleCount = qrcode.getModuleCount();
      const qrSize = moduleCount + margin * 2;
      const scale = Math.min(displayWidth, displayHeight) / qrSize;
      const offsetX = (displayWidth - qrSize * scale) / 2;
      const offsetY = (displayHeight - qrSize * scale) / 2;

      function snapX(value: number) {
        return Math.round(value * scaleX) / scaleX;
      }

      function snapY(value: number) {
        return Math.round(value * scaleY) / scaleY;
      }

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      context.fillStyle = bgColor;
      context.fillRect(0, 0, displayWidth, displayHeight);
      context.fillStyle = fgColor;

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (!qrcode.isDark(row, col)) {
            continue;
          }

          const x = snapX(offsetX + (col + margin) * scale);
          const y = snapY(offsetY + (row + margin) * scale);
          const nextX = snapX(offsetX + (col + margin + 1) * scale);
          const nextY = snapY(offsetY + (row + margin + 1) * scale);

          context.fillRect(x, y, nextX - x, nextY - y);
        }
      }
    }

    draw();

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvasElement);
    window.addEventListener('resize', draw);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', draw);
    };
  }, [bgColor, fgColor, height, margin, qrcode, width]);

  const displayHeight = height ?? width;

  return (
    <canvas
      aria-label={value}
      height={displayHeight}
      ref={canvasRef}
      role="img"
      style={{ ...style, height: style?.height ?? displayHeight, width: style?.width ?? width }}
      width={width}
      {...otherProps}
    />
  );
}
