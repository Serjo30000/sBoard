import * as PIXI from 'pixi.js-legacy';
import * as SKIA from 'skia';
import { StyleConverter } from './StyleConverter';
import { ShapeConverter } from './ShapeConverter';

// Рендеринг графических объектов Pixi в Skia canvas
export class GraphicsRenderer {
  // Основной метод отрисовки графического объекта
  static render(
    canvasKit: SKIA.CanvasKit,
    canvas: SKIA.Canvas,
    graphics: PIXI.Graphics,
  ): void {
    const graphicsDataArray = graphics.geometry.graphicsData;
    graphicsDataArray.forEach((data) => {
      this.renderGraphicsData(canvasKit, canvas, data);
    });
  }

  // Рендеринг одного графического примитива
  static renderGraphicsData(
    canvasKit: SKIA.CanvasKit,
    canvas: SKIA.Canvas,
    data: PIXI.GraphicsData,
  ) {
    const fill = StyleConverter.convertFillStyle(canvasKit, data.fillStyle);
    const stroke = StyleConverter.convertLineStyle(canvasKit, data.lineStyle);

    const draw = (fn: (p: SKIA.Paint) => void) => {
      fn(fill);
      fn(stroke);
    };

    switch (data.shape.type) {
      case PIXI.SHAPES.POLY: {
        const path = ShapeConverter.convertPolygon(canvasKit, data.shape);
        draw((p) => canvas.drawPath(path, p));
        break;
      }
      case PIXI.SHAPES.RECT: {
        const rect = ShapeConverter.convertRect(canvasKit, data.shape);
        draw((p) => canvas.drawRect(rect, p));
        break;
      }
      case PIXI.SHAPES.CIRC: {
        const oval = ShapeConverter.convertCirc(canvasKit, data.shape);
        draw((p) => canvas.drawOval(oval, p));
        break;
      }
      case PIXI.SHAPES.ELIP: {
        const oval = ShapeConverter.convertElip(canvasKit, data.shape);
        draw((p) => canvas.drawOval(oval, p));
        break;
      }
      case PIXI.SHAPES.RREC: {
        const rrect = ShapeConverter.convertRRect(canvasKit, data.shape);
        draw((p) => canvas.drawRRect(rrect, p));
        break;
      }
    }

    fill.delete();
    stroke.delete();
  }
}
