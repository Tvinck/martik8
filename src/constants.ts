import React from 'react';
import { Heart, Coffee, Wind, Sparkles, Music } from 'lucide-react';
import type { Level, Outfit } from './types';

export const LEVELS: Level[] = [
    {
        id: 1,
        title: "Уровень 1: Энергия",
        riddle: "Там, где спят все твои гаджеты и тянутся длинные 'хвосты' проводов. Загляни в тумбочку в моей комнате — там начало пути.",
        password: "А",
        icon: React.createElement(Sparkles, { className: "w-8 h-8 text-rose-500" }),
        hint: "Ищи в тумбе с проводами в моей комнате!",
        bonus: "Прекрасные цветы 💐",
        note: "Пусть эти цветы напоминают тебе о том, как ты расцветаешь с каждым днем."
    },
    {
        id: 2,
        title: "Уровень 2: Отражение",
        riddle: "Я вижу тебя каждый день: когда ты просыпаешься и когда уходишь. Я знаю все твои секреты, но сегодня один из них — твой. Посмотри в свое отражение...",
        password: "Я",
        icon: React.createElement(Sparkles, { className: "w-8 h-8 text-rose-500" }),
        hint: "Ищи там, где ты прихорашиваешься!",
        bonus: "Сертификат на 1 поцелуй 💋",
        note: "В этом зеркале я всегда вижу самую красивую девушку в мире."
    },
    {
        id: 3,
        title: "Уровень 3: Твой помощник",
        riddle: "Ты на нем что-то пишешь, смотришь фильмы и работаешь. Твоя подсказка притаилась где-то рядом с экраном.",
        password: "ЧТО",
        icon: React.createElement(Sparkles, { className: "w-8 h-8 text-rose-500" }),
        hint: "Ищи у ноутбука или компьютера!",
        bonus: "Сертификат на 10 поцелуев 😘",
        note: "Даже когда ты работаешь, ты выглядишь потрясающе."
    },
    {
        id: 4,
        title: "Уровень 4: Всегда рядом",
        riddle: "Он у тебя в руках евридей, ты с ним не расстаешься. Загляни под чехол или посмотри уведомления — там твоя подсказка.",
        password: "ТЕБЕ",
        icon: React.createElement(Heart, { className: "w-8 h-8 text-rose-500" }),
        hint: "Твой верный смартфон!",
        bonus: "Сертификат на 1 расслабляющий массаж 💆‍♀️",
        note: "Я всегда жду твоих сообщений больше всего на свете."
    },
    {
        id: 5,
        title: "Уровень 5: Пушистый друг",
        riddle: "Она ждет тебя каждый день, и тебе приходится наполнять её, чтобы она была довольна. Твоя подсказка спрятана там, где обедает наш пушистый друг.",
        password: "СКАЗАТЬ",
        icon: React.createElement(Heart, { className: "w-8 h-8 text-rose-500" }),
        hint: "Загляни в миску кошки!",
        bonus: "Сертификат на 1 завтрак в постель ☕️",
        note: "Твоя доброта — это то, за что я тебя так сильно люблю."
    },
    {
        id: 6,
        title: "Уровень 6: Пора гулять",
        riddle: "Ищи там, что ты надеваешь, когда мы собираемся погулять. Твоя подсказка спрятана в одном из ботинок!",
        password: ",",
        icon: React.createElement(Wind, { className: "w-8 h-8 text-rose-500" }),
        hint: "Загляни в обувь!",
        bonus: "Видео-сюрприз от меня 🎥",
        note: "Каждая прогулка с тобой — это маленькое приключение."
    },
    {
        id: 7,
        title: "Уровень 7: Разогрев",
        riddle: "Утро началось, надо покушать... Пора бы заглянуть в холодильник — там твоя подсказка!",
        password: "ЧТО",
        icon: React.createElement(Coffee, { className: "w-8 h-8 text-rose-500" }),
        hint: "Загляни в холодильник!",
        bonus: "Твоя любимая вкусняшка 🍬",
        note: "Ты — мой самый любимый десерт."
    },
    {
        id: 8,
        title: "Финальный аккорд",
        riddle: "Теперь собери все найденные слова и символы в правильном порядке. Это строчка из популярной песни. Введи её целиком (с запятой и пробелами), чтобы получить главный приз!",
        password: "А Я ЧТО ТЕБЕ СКАЗАТЬ, ЧТО",
        icon: React.createElement(Music, { className: "w-8 h-8 text-rose-500" }),
        hint: "Сложи слова из уровней 1-7 по порядку: А + Я + ЧТО + ТЕБЕ + СКАЗАТЬ + , + ЧТО"
    }
];

export const OUTFITS: Outfit[] = [
    { id: 'classic', name: 'Классика', style: '' },
    { id: 'cool', name: 'Крутой', style: 'sepia(0.5) hue-rotate(180deg)' },
    { id: 'warm', name: 'Теплый', style: 'saturate(1.5) hue-rotate(-30deg)' },
    { id: 'retro', name: 'Ретро', style: 'grayscale(0.5) contrast(1.2)' },
];

export const HINT_DELAY = 3600 * 1000; // 1 hour in ms

export const SOUNDS = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    finish: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
} as const;
