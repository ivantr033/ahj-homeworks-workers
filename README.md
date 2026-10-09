# Домашнее задание к занятию "12. WebWorkers, ServiceWorkers" — Workers Workshop

[![Build Status](https://github.com/ivantr033/ahj-homeworks-workers/actions/workflows/deploy.yml/badge.svg)](https://github.com/ivantr033/ahj-homeworks-workers/actions/workflows/deploy.yml)

## 🌐 Ссылка на развертывание (GitHub Pages)
*   **Workers Workshop Interface:** [Открыть воркшоп](https://ivantr033.github.io/ahj-homeworks-workers/)

---

## 🛠️ Архитектура проекта и Спецификация Параллельных Вычислений

В рамках данного домашнего задания все три задачи (Loading Styling, Buggy Service и Hasher) объединены в **единый интерактивный интерфейс (Mono-project)** для минимизации избыточности кода и демонстрации продвинутых возможностей нативных Web API.

### ⚙️ Реализация многопоточности и Офлайн-режима:

1. **Loading Styling & Buggy Service (Основное задание):** Интерфейс эмулирует загрузку данных с инстабильного сервера Koa. При запросе на `/api/news` приложение сначала показывает анимированные макеты (**Skeletons**). Если сервер возвращает ошибку 500 или сеть полностью отсутствует, приложение переходит в режим ручной контраварийной маски.
   * *Меры стабильности в Dev-режиме:* Во избежание бесконечных циклов перезагрузки страницы (*эффект стробоскопа*), вызываемых конфликтами между Service Worker и Webpack Dev Server (HMR), в коде инициализации `app.js` настроена строгая проверка окружения (`window.location.hostname !== 'localhost'`). Сервис-воркер активируется исключительно на продакшн-сервере в облаке.
2. **Hasher (Задача со звездочкой):** Реализован виджет контрольных сумм файлов с поддержкой алгоритмов **MD5, SHA1, SHA256 и SHA512**. 
   * *Web Worker:* Процесс чтения файлов через `FileReader (readAsArrayBuffer)` и тяжелые криптографические калькуляции библиотеки `crypto-js (WordArray)` полностью вынесены в изолированный фоновый поток **Web Worker**. Это гарантирует, что даже при обработке массивных файлов интерфейс оператора (кнопки, выпадающие списки) остается отзывчивым на 100% и работает на частоте 60 FPS без фризов.

---

## 🚀 Инструкция по локальному запуску

### 1. Запуск Backend сервера (Koa inestable + CORS manual):
```bash
cd backend
npm install
npm start
```

### 2. Запуск Frontend части (Webpack Dev Server):
```bash
cd frontend
npm install
npm start
```
