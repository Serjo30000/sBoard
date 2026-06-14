import * as SKIA from 'skia';

// Конвертация цветов Pixi в формат Skia
export class ColorConverter {
  // Преобразование цвета в Skia формат
  public static convertColor(
    canvasKit: SKIA.CanvasKit,
    color: number | string,
    alpha?: number,
  ): SKIA.Color {
    const numColor: number =
      typeof color === 'string'
        ? parseInt(color.startsWith('#') ? color.slice(1) : color, 16)
        : color;

    const r = (numColor >>> 16) & 0xff;
    const g = (numColor >>> 8) & 0xff;
    const b = numColor & 0xff;

    return canvasKit.Color(r, g, b, alpha);
  }
}
