import * as PIXI from 'pixi.js-legacy';

// Класс для случайного преобразования объектов сцены
export class PixiObjectTransformer {
  // Размеры области отображения
  private readonly windowSize: { width: number; height: number };
  // Коэффициент масштабирования объектов
  private readonly scaleMulti: number;

  // Инициализация трансформера с параметрами сцены
  constructor(
    windowSize: { width: number; height: number },
    scaleMulti: number = 1.1,
  ) {
    this.windowSize = windowSize;
    this.scaleMulti = scaleMulti;
  }

  // Применение случайных трансформаций ко всем объектам
  public applyAllRandomTransformations(
    displayObjects: PIXI.DisplayObject[],
  ): void {
    for (const obj of displayObjects) {
      obj.position.set(
        Math.random() * this.windowSize.width,
        Math.random() * this.windowSize.height,
      );

      obj.rotation = this.randomRotation();

      const scale = this.randomScale();
      obj.scale.set(scale.x, scale.y);
    }
  }

  // Генерация случайного угла поворота
  private randomRotation(): number {
    return Math.random() * Math.PI * 2;
  }

  // Генерация случайного масштаба
  private randomScale(): { x: number; y: number } {
    const s = Math.random() * this.scaleMulti + 0.5;
    return { x: s, y: s };
  }
}
