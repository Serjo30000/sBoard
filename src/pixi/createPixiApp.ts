import * as PIXI from 'pixi.js-legacy';

// Создание и настройка Pixi
export default function createPixiApp(params: {
  width: number;
  height: number;
  backgroundColor: string;
}) {
  // Инициализация основного Pixi
  const pixiApp = new PIXI.Application<HTMLCanvasElement>({
    resolution: 1,
    forceCanvas: true,
    ...params,
  });

  // Корневой контейнер для объектов сцены
  const pixiTopContainer = new PIXI.Container();
  // Добавление основного контейнера на сцену
  pixiApp.stage.addChild(pixiTopContainer);

  return { pixiApp, pixiTopContainer };
}
