// Контрольные точки для адаптивного интерфейса
export const BREAKPOINTS = {
  LARGE: 1440,
  MEDIUM: 1024,
  SMALL: 720,
} as const;

// Универсальная функция создания DOM элементов
export function createElement(
  tag: string,
  props: Record<
    string,
    string | number | boolean | ((event: Event) => void)
  > = {},
  ...children: (HTMLElement | string)[]
): HTMLElement {
  // Создание элемента указанного типа
  const element = document.createElement(tag);

  // Обработка переданных свойств элемента
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'function' && key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value as EventListener);
      continue;
    }

    if (key === 'className') {
      element.className = String(value);
      continue;
    }

    element.setAttribute(key, String(value));
  }

  // Добавление дочерних элементов
  for (const child of children) {
    element.appendChild(
      typeof child === 'string' ? document.createTextNode(child) : child,
    );
  }

  return element;
}

// Соотношение сторон формата A4
const A4_RATIO = 1.414;

// Формирование размеров рабочей области в формате A4
const makeA4 = (width: number) => {
  return {
    width,
    height: Math.round(width * A4_RATIO),
  };
};

// Расчет размеров рабочей области с учетом ширины экрана
export const calculateViewWindow = (width: number) => {
  if (width >= BREAKPOINTS.LARGE) {
    return makeA4(500);
  }

  if (width >= BREAKPOINTS.MEDIUM) {
    return makeA4(450);
  }

  if (width >= BREAKPOINTS.SMALL) {
    return makeA4(300);
  }

  return makeA4(300);
};

// Сохранение PDF документа на устройство пользователя
export const downloadPDF = (pdfBytes: BlobPart) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'output.pdf';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
