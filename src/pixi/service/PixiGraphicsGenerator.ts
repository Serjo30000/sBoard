import * as PIXI from 'pixi.js-legacy';

// Фабрика генерации геометрических форм Pixi
type ShapeFactory = () => PIXI.IShape;

// Генератор случайных графических фигур Pixi
export class PixiGraphicsGenerator {
  // Ограничитель максимального размера фигур
  private readonly sizeMultiplier: number;

  // Инициализация генератора с параметром размера
  constructor(sizeMultiplier: number) {
    this.sizeMultiplier = sizeMultiplier;
  }

  // Создание массива случайных графических объектов
  public createRandomGraphics(count: number): PIXI.Graphics[] {
    const results: PIXI.Graphics[] = [];

    for (let i = 0; i < count; i++) {
      const g = this.createGraphics();
      results.push(g);
    }

    return results;
  }

  // Создание одного графического объекта
  private createGraphics(): PIXI.Graphics {
    const g = new PIXI.Graphics();

    const strokeColor = randomColor();
    const fillColor = randomColor();
    const alpha = rand(0.5, 1);
    const strokeWidth = rand(1, 6);

    g.lineStyle(strokeWidth, strokeColor, alpha);
    g.beginFill(fillColor, alpha);

    const shape = this.pickRandomShape();
    g.drawShape(shape());

    g.endFill();

    return g;
  }

  // Выбор случайного типа фигуры
  private pickRandomShape(): ShapeFactory {
    const shapes: ShapeFactory[] = [
      this.circle,
      this.rect,
      this.roundRect,
      this.ellipse,
      this.polygon,
      this.line,
    ];

    const index = Math.floor(Math.random() * shapes.length);
    const shape = shapes[index];

    if (!shape) {
      throw new Error('No shape available for selection');
    }

    return shape.bind(this);
  }

  // Круглая фигура
  private circle = (): PIXI.Circle => {
    return new PIXI.Circle(0, 0, rand(20, this.sizeMultiplier));
  };

  // Прямоугольная фигура
  private rect = (): PIXI.Rectangle => {
    return new PIXI.Rectangle(
      0,
      0,
      rand(30, this.sizeMultiplier),
      rand(30, this.sizeMultiplier),
    );
  };

  // Прямоугольник со скруглением
  private roundRect = (): PIXI.RoundedRectangle => {
    return new PIXI.RoundedRectangle(
      0,
      0,
      rand(30, this.sizeMultiplier),
      rand(30, this.sizeMultiplier),
      rand(5, this.sizeMultiplier / 2),
    );
  };

  // Эллипс
  private ellipse = (): PIXI.Ellipse => {
    return new PIXI.Ellipse(
      0,
      0,
      rand(20, this.sizeMultiplier),
      rand(20, this.sizeMultiplier),
    );
  };

  // Многоугольник с заданным числом сторон
  private polygon = (): PIXI.Polygon => {
    const sides = randInt(3, 7);
    const radius = rand(30, this.sizeMultiplier);

    return new PIXI.Polygon(buildPolygonPoints(sides, radius));
  };

  // Ломаная линия из случайных точек
  private line = (): PIXI.Polygon => {
    const points: number[] = [];
    const steps = randInt(3, 7);

    let angle = Math.random() * Math.PI * 2;

    for (let i = 0; i < steps; i++) {
      angle += rand(0, Math.PI / 2);
      const r = rand(20, this.sizeMultiplier);

      points.push(Math.cos(angle) * r, Math.sin(angle) * r);
    }

    return new PIXI.Polygon(points);
  };
}

// Генерация случайного числа в диапазоне
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Генерация целого случайного числа
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max));
}

// Генерация случайного цвета
function randomColor() {
  return Math.floor(Math.random() * 0xffffff);
}

// Построение координат многоугольника
function buildPolygonPoints(sides: number, radius: number) {
  const points: number[] = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }

  return points;
}
