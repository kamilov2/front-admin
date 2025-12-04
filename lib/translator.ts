/**
 * Сервис автоматического перевода RU <-> KZ
 * Поддерживает двустороннюю синхронизацию текста
 */

// Простой переводчик на основе API
// В продакшене замените на реальный API перевода
export async function translateText(
  text: string,
  from: "ru" | "kz",
  to: "ru" | "kz"
): Promise<string> {
  if (!text || text.trim() === "") return "";
  if (from === to) return text;

  try {
    // TODO: Замените на ваш API переводчика
    // Например: Google Translate API, Yandex Translate, или собственный сервис
    
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        from,
        to,
      }),
    });

    if (!response.ok) {
      console.error("Translation API error:", response.statusText);
      return text; // Возвращаем оригинал при ошибке
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Возвращаем оригинал при ошибке
  }
}

// Дебаунс для оптимизации запросов к API
let debounceTimers: Map<string, NodeJS.Timeout> = new Map();

export function translateWithDebounce(
  text: string,
  from: "ru" | "kz",
  to: "ru" | "kz",
  callback: (translated: string) => void,
  delay: number = 1000
): void {
  const key = `${from}-${to}-${text}`;
  
  // Очищаем предыдущий таймер
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key)!);
  }

  // Устанавливаем новый таймер
  const timer = setTimeout(async () => {
    const translated = await translateText(text, from, to);
    callback(translated);
    debounceTimers.delete(key);
  }, delay);

  debounceTimers.set(key, timer);
}

// Определение языка текста (простая эвристика)
export function detectLanguage(text: string): "ru" | "kz" | "unknown" {
  if (!text || text.trim() === "") return "unknown";

  // Кириллические символы характерные для казахского
  const kzChars = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/;
  
  // Кириллические символы характерные для русского
  const ruChars = /[ыэъёЫЭЪЁ]/;

  if (kzChars.test(text)) return "kz";
  if (ruChars.test(text)) return "ru";
  
  // Если специфичных символов нет, считаем русским по умолчанию
  // (так как оба языка используют кириллицу)
  return "ru";
}

// Вспомогательная функция для проверки необходимости перевода
export function needsTranslation(
  sourceText: string,
  targetText: string,
  sourceLang: "ru" | "kz",
  targetLang: "ru" | "kz"
): boolean {
  // Не переводим, если исходный текст пустой
  if (!sourceText || sourceText.trim() === "") return false;

  // Переводим, если целевой текст пустой
  if (!targetText || targetText.trim() === "") return true;

  // Переводим, если исходный текст изменился значительно
  // (например, на 30% и более)
  const similarity = calculateSimilarity(sourceText, targetText);
  return similarity < 0.7;
}

// Простой расчет схожести строк (для определения нужен ли перевод)
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0 || len2 === 0) return 0;
  
  const maxLen = Math.max(len1, len2);
  const minLen = Math.min(len1, len2);
  
  return minLen / maxLen;
}

// Кэш переводов для оптимизации
const translationCache = new Map<string, string>();

export function getCachedTranslation(
  text: string,
  from: "ru" | "kz",
  to: "ru" | "kz"
): string | null {
  const key = `${from}-${to}-${text}`;
  return translationCache.get(key) || null;
}

export function setCachedTranslation(
  text: string,
  from: "ru" | "kz",
  to: "ru" | "kz",
  translation: string
): void {
  const key = `${from}-${to}-${text}`;
  translationCache.set(key, translation);
  
  // Ограничиваем размер кэша
  if (translationCache.size > 1000) {
    const firstKey = translationCache.keys().next().value;
    if (firstKey) {
      translationCache.delete(firstKey);
    }
  }
}
