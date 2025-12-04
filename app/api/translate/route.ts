import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint для перевода текста RU <-> KZ
 * Поддерживает автоматический перевод при вводе текста
 */

// Базовый словарь для общих фраз
const dictionary: Record<string, Record<string, string>> = {
  ru_kz: {
    "Вопрос": "Сұрақ",
    "Ответ": "Жауап",
    "Правильно": "Дұрыс",
    "Неправильно": "Дұрыс емес",
    "Балл": "Ұпай",
    "Баллы": "Ұпайлар",
    "Тест": "Тест",
    "Название": "Атауы",
    "Описание": "Сипаттама",
    "Категория": "Санат",
    "Математика": "Математика",
    "Физика": "Физика",
    "Химия": "Химия",
    "История": "Тарих",
    "Биология": "Биология",
    "География": "География",
    "Сколько": "Нешеге",
    "Что": "Не",
    "Какой": "Қандай",
    "Как": "Қалай",
  },
  kz_ru: {
    "Сұрақ": "Вопрос",
    "Жауап": "Ответ",
    "Дұрыс": "Правильно",
    "Дұрыс емес": "Неправильно",
    "Ұпай": "Балл",
    "Ұпайлар": "Баллы",
    "Тест": "Тест",
    "Атауы": "Название",
    "Сипаттама": "Описание",
    "Санат": "Категория",
    "Математика": "Математика",
    "Физика": "Физика",
    "Химия": "Химия",
    "Тарих": "История",
    "Биология": "Биология",
    "География": "География",
    "Нешеге": "Сколько",
    "Не": "Что",
    "Қандай": "Какой",
    "Қалай": "Как",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, from, to, targetLang } = body;

    // Поддержка старого формата (targetLang) и нового (from/to)
    const sourceLang = from || "ru";
    const destLang = to || targetLang || "kz";

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Если языки одинаковые, возвращаем исходный текст
    if (sourceLang === destLang) {
      return NextResponse.json({ translatedText: text });
    }

    // Проверяем словарь для точного совпадения
    const dictKey = `${sourceLang}_${destLang}`;
    if (dictionary[dictKey]?.[text]) {
      return NextResponse.json({
        translatedText: dictionary[dictKey][text],
        source: "dictionary",
      });
    }

    // TODO: Интеграция с реальным API перевода
    // Раскомментируйте и настройте один из вариантов:
    
    /* Google Translate API
    const { Translate } = require('@google-cloud/translate').v2;
    const translate = new Translate({ 
      key: process.env.GOOGLE_TRANSLATE_API_KEY 
    });
    const langCode = destLang === 'kz' ? 'kk' : 'ru';
    const [translation] = await translate.translate(text, langCode);
    return NextResponse.json({ translatedText: translation });
    */

    /* Yandex Translate API
    const response = await fetch('https://translate.api.cloud.yandex.net/translate/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`,
      },
      body: JSON.stringify({
        sourceLanguageCode: sourceLang === 'ru' ? 'ru' : 'kk',
        targetLanguageCode: destLang === 'ru' ? 'ru' : 'kk',
        texts: [text],
      }),
    });
    const data = await response.json();
    return NextResponse.json({ translatedText: data.translations[0].text });
    */

    // Временный мок-перевод для демонстрации
    const translatedText = await mockTranslate(text, sourceLang, destLang);

    return NextResponse.json({
      translatedText,
      source: "mock",
      warning: "Используется мок-перевод. Подключите реальный API!",
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed", details: String(error) },
      { status: 500 }
    );
  }
}

// Мок-функция для демонстрации (замените на реальный API)
async function mockTranslate(
  text: string,
  from: string,
  to: string
): Promise<string> {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Простой маркер для видимости перевода
  const marker = `[Переведено: ${from.toUpperCase()} → ${to.toUpperCase()}]`;
  
  return `${text} ${marker}`;
}
