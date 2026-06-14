import * as PIXI from 'pixi.js-legacy';
import * as SKIA from 'skia';

// Конвертация геометрических фигур Pixi в примитивы Skia
export class ShapeConverter {
  // Конвертация полигона в Skia Path
  static convertPolygon(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Polygon,
  ): SKIA.Path {
    const path = new canvasKit.Path();

    const points = shape.points;

    if (!points || points.length < 2) {
      return path;
    }

    const x0 = points[0];
    const y0 = points[1];

    if (x0 === undefined || y0 === undefined) {
      return path;
    }

    path.moveTo(x0, y0);

    for (let i = 2; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];

      if (x === undefined || y === undefined) {
        continue;
      }

      path.lineTo(x, y);
    }

    path.close();
    return path;
  }

  // Конвертация прямоугольника в Skia формат
  static convertRect(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Rectangle,
  ): SKIA.RRect {
    return canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height);
  }

  // Конвертация круга в прямоугольную область
  static convertCirc(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Circle,
  ): SKIA.RRect {
    return canvasKit.XYWHRect(
      shape.x - shape.radius,
      shape.y - shape.radius,
      shape.radius * 2,
      shape.radius * 2,
    );
  }

  // Конвертация эллипса в ограничивающий прямоугольник
  static convertElip(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Ellipse,
  ): SKIA.RRect {
    return canvasKit.XYWHRect(
      shape.x - shape.width,
      shape.y - shape.height,
      shape.width * 2,
      shape.height * 2,
    );
  }

  // Конвертация скругленного прямоугольника
  static convertRRect(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.RoundedRectangle,
  ): SKIA.RRect {
    return canvasKit.RRectXY(
      canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
      shape.radius,
      shape.radius,
    );
  }
}
