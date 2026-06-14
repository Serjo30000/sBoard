import * as PIXI from 'pixi.js-legacy';
import * as SKIA from 'skia';

// Рендеринг Pixi спрайта в Skia canvas
export class SpriteRenderer {
  // Отрисовка одного спрайта на канвасе
  static render(
    canvasKit: SKIA.CanvasKit,
    canvas: SKIA.Canvas,
    sprite: PIXI.Sprite,
  ) {
    const paint = new canvasKit.Paint();

    const resource = sprite.texture.baseTexture.resource as PIXI.ImageResource;
    const source = resource.source as CanvasImageSource;

    const img = canvasKit.MakeImageFromCanvasImageSource(source);

    if (img) {
      canvas.drawImage(
        img,
        -sprite.anchor.x * sprite.width,
        -sprite.anchor.y * sprite.height,
        paint,
      );
      img.delete();
    }

    paint.delete();
  }
}
