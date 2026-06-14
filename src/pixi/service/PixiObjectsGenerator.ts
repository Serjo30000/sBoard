import * as Pixi from 'pixi.js-legacy';
import { PixiSpriteGenerator } from './PixiSpriteGenerator';
import { PixiGraphicsGenerator } from './PixiGraphicsGenerator';
import { PixiObjectTransformer } from './PixiObjectTransformer';
import { PixiListenersApplier } from './PixiListenersApplier';
import type { ContainerRenderer } from '../../skia/service/ContainerRenderer';

// Главный генератор объектов Pixi сцены
export class PixiObjectsGenerator {
  // Генератор спрайтов
  private readonly spriteGenerator: PixiSpriteGenerator;
  // Генератор графических фигур
  private readonly graphicsGenerator: PixiGraphicsGenerator;
  // Трансформатор объектов (позиция, масштаб, поворот)
  private readonly objectTransformer: PixiObjectTransformer;
  // Применение событий к объектам сцены
  private readonly listenersApplier: PixiListenersApplier;
  // Вероятность выбора спрайта
  private readonly spriteChance: number;

  // Инициализация всех подсистем генерации объектов
  constructor(
    imagesForSprite: Pixi.SpriteSource[],
    skiaRenderer: ContainerRenderer,
    windowSize: { width: number; height: number },
    shapeSizeMulti = 50,
    scaleMulti = 1.1,
    spriteChance = 0.1,
  ) {
    this.spriteGenerator = new PixiSpriteGenerator(imagesForSprite);
    this.graphicsGenerator = new PixiGraphicsGenerator(shapeSizeMulti);
    this.objectTransformer = new PixiObjectTransformer(windowSize, scaleMulti);
    this.listenersApplier = new PixiListenersApplier(scaleMulti, () => {
      skiaRenderer.renderOnScreen();
    });
    this.spriteChance = spriteChance;
  }

  // Генерация случайного набора объектов сцены
  public createRandomObjects(count = 1): Pixi.DisplayObject[] {
    const objects: Pixi.DisplayObject[] = [];

    for (let i = 0; i < count; i++) {
      const obj = this.createSingleObject();

      this.objectTransformer.applyAllRandomTransformations([obj]);
      this.listenersApplier.applyEventListeners([obj]);

      objects.push(obj);
    }

    return objects;
  }

  // Создание одного случайного объекта
  private createSingleObject(): Pixi.DisplayObject {
    const isSprite = Math.random() < this.spriteChance;

    if (isSprite) {
      const sprite = this.spriteGenerator.createRandomSprites(1)[0];

      if (!sprite) {
        throw new Error('Failed to create sprite');
      }

      return sprite;
    }

    const graphics = this.graphicsGenerator.createRandomGraphics(1)[0];

    if (!graphics) {
      throw new Error('Failed to create graphics object');
    }

    return graphics;
  }
}
