# sBoard - тестовое задание для разработчика на TypeScript

Приложение на TypeScript, объединяющее возможности **Pixi.js 7.2.4** и **Skia (CanvasKit WASM)** с поддержкой PDF Backend.

## Результат

- **GitHub:** https://github.com/Serjo30000/sBoard
- **Демо (GitHub Pages):** https://Serjo30000.github.io/sBoard/
- **Пример PDF-файла**, сгенерированного с помощью Skia с использованием векторной графики:
  https://github.com/Serjo30000/sBoard/tree/main/pdf_result/output.pdf

## Функциональность

- Обёртка для Skia.
- Поддержка `PIXI.Graphics`.
- Поддержка `PIXI.Sprite`.
- Экспорт PDF с помощью `makePDF`.
- Генерация случайных фигур и спрайтов.
- Наличие двух canvas-элементов: для Pixi и для Skia.
- Поддержка событий `pointerdown` и `pointerup` на обоих canvas.

## Запуск проекта

```bash
git clone https://github.com/Serjo30000/sBoard.git
cd sBoard
npm install
npm run dev
```

После запуска откройте в браузере:

```text
http://localhost:5173
```

## Сборка проекта

```bash
npm run build
```

## Предварительный просмотр production-сборки

```bash
npm run preview
```
