import * as PIXI from 'pixi.js-legacy';

// Генератор случайных Pixi спрайтов
export class PixiSpriteGenerator {
  // Набор источников изображений для генерации
  private readonly images: PIXI.SpriteSource[];

  // Инициализация генератора с доступными изображениями
  constructor(images: PIXI.SpriteSource[]) {
    this.images = images;
  }

  // Создание массива случайных спрайтов
  public createRandomSprites(count: number): PIXI.Sprite[] {
    if (this.images.length === 0) {
      throw new Error('PixiSpriteGenerator: images array is empty');
    }

    const source = this.pickRandomSource();

    const sprites: PIXI.Sprite[] = [];
    for (let i = 0; i < count; i++) {
      sprites.push(PIXI.Sprite.from(source));
    }

    return sprites;
  }

  // Выбор случайного изображения из списка
  private pickRandomSource(): PIXI.SpriteSource {
    if (!this.images.length) {
      throw new Error('No sprite sources available');
    }

    const index = Math.floor(Math.random() * this.images.length);
    const source = this.images[index];

    if (!source) {
      throw new Error('Failed to pick sprite source');
    }

    return source;
  }
}
