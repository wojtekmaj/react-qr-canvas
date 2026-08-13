import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import QrCanvas from './QrCanvas.js';

describe('<QrCanvas /> component', () => {
  it('renders a sharp square canvas element', async () => {
    const devicePixelRatio = vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(2);

    try {
      const { container, unmount } = await render(
        <QrCanvas className="qr-code" value="Hello world" width={256} />,
      );

      const firstChild = container.children[0];

      expect(firstChild).toBeInTheDocument();
      expect(firstChild).toBeInstanceOf(HTMLCanvasElement);
      expect(firstChild).toHaveClass('qr-code');
      expect(firstChild).toHaveStyle({ height: '256px', width: '256px' });
      expect(firstChild).toHaveAttribute('height', '512');
      expect(firstChild).toHaveAttribute('width', '512');

      await unmount();
    } finally {
      devicePixelRatio.mockRestore();
    }
  });

  it('draws the QR code using the requested colors', async () => {
    const { container } = await render(
      <QrCanvas bgColor="#ff0000" fgColor="#0000ff" margin={1} value="Hello world" />,
    );

    const canvas = container.querySelector('canvas');
    const context = canvas?.getContext('2d');

    expect(canvas).toBeInTheDocument();
    expect(context).not.toBeNull();

    const backgroundPixel = context?.getImageData(0, 0, 1, 1).data;
    const foregroundPixel = context?.getImageData(
      6 * window.devicePixelRatio,
      6 * window.devicePixelRatio,
      1,
      1,
    ).data;

    expect(backgroundPixel).toEqual(Uint8ClampedArray.from([255, 0, 0, 255]));
    expect(foregroundPixel).toEqual(Uint8ClampedArray.from([0, 0, 255, 255]));
  });

  it('draws the QR code using gradients and patterns', async () => {
    const fillStyleContext = document.createElement('canvas').getContext('2d');
    const patternSource = document.createElement('canvas');
    const patternSourceContext = patternSource.getContext('2d');

    if (!fillStyleContext || !patternSourceContext) {
      throw new Error('Could not create a canvas context');
    }

    const gradient = fillStyleContext.createLinearGradient(0, 0, 128, 0);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(1, '#ff0000');

    patternSource.width = 1;
    patternSource.height = 1;
    patternSourceContext.fillStyle = '#ff00ff';
    patternSourceContext.fillRect(0, 0, 1, 1);

    const pattern = fillStyleContext.createPattern(patternSource, 'repeat');

    if (!pattern) {
      throw new Error('Could not create a canvas pattern');
    }

    const { container } = await render(
      <QrCanvas bgColor={gradient} fgColor={pattern} margin={1} value="Hello world" />,
    );

    const context = container.querySelector('canvas')?.getContext('2d');
    const backgroundPixel = context?.getImageData(0, 0, 1, 1).data;
    const foregroundPixel = context?.getImageData(
      6 * window.devicePixelRatio,
      6 * window.devicePixelRatio,
      1,
      1,
    ).data;

    expect(backgroundPixel).toEqual(Uint8ClampedArray.from([255, 0, 0, 255]));
    expect(foregroundPixel).toEqual(Uint8ClampedArray.from([255, 0, 255, 255]));
  });
});
