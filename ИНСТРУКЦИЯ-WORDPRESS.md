# Инструкция по настройке WordPress-админки для AutoElectric

> **Статус:** WordPress выступает как **Headless CMS** — он хранит данные, а Astro-сайт их отображает.

---

## 🚀 Шаг 1: Установка WordPress на XAMPP (локально)

1. Скачайте WordPress: https://ru.wordpress.org/download/
2. Распакуйте архив в папку `C:\xampp\htdocs\wordpress`
3. Создайте базу данных:
   - Откройте: http://localhost/phpmyadmin
   - Нажмите «Новая база данных»
   - Имя: `wordpress_autoelectric`, кодировка: `utf8mb4_unicode_ci`
4. Откройте в браузере: http://localhost/wordpress
5. Следуйте мастеру установки:
   - **База данных:** `wordpress_autoelectric`
   - **Пользователь:** `root`
   - **Пароль:** *(пусто для XAMPP по умолчанию)*
   - **Адрес сервера:** `localhost`
6. Создайте администратора (запомните логин/пароль!)

---

## 🔗 Шаг 2: Подключение Astro-сайта к WordPress

1. В папке проекта `web-auto_freelance` скопируйте файл `.env.example` в `.env`:
   ```
   cp .env.example .env
   ```
2. Откройте `.env` и укажите адрес WordPress:
   ```env
   WORDPRESS_API_URL=http://localhost/wordpress/wp-json/wp/v2
   ```
3. Если WordPress на хостинге — замените `localhost/wordpress` на ваш домен.

---

## 🔌 Шаг 3: Установка необходимых плагинов

В панели WordPress (http://localhost/wordpress/wp-admin) перейдите в **Плагины → Добавить новый** и установите:

| Плагин | Зачем нужен |
|--------|-------------|
| **Custom Post Type UI** | Создаёт типы записей «Услуги» и «Отзывы» |
| **Advanced Custom Fields (ACF)** | Добавляет поля Цена, Описание, Рейтинг |
| **ACF to REST API** | Делает ACF-поля доступными через API |

---

## 📋 Шаг 4: Создание типов записей (Custom Post Type UI)

После установки плагина перейдите в **CPT UI → Add/Edit Post Types**.

### Тип 1: Услуги

| Поле | Значение |
|------|----------|
| Post Type Slug | `services` |
| Plural Label | `Услуги` |
| Singular Label | `Услуга` |
| Has Archive | ✅ True |
| Show in REST API | ✅ **True** (обязательно!) |
| Supports | Title, Editor, Thumbnail, Custom Fields |

### Тип 2: Отзывы

| Поле | Значение |
|------|----------|
| Post Type Slug | `testimonials` |
| Plural Label | `Отзывы` |
| Singular Label | `Отзыв` |
| Show in REST API | ✅ **True** (обязательно!) |
| Supports | Title, Editor, Custom Fields |

---

## 🗂 Шаг 5: Создание дополнительных полей (ACF)

Перейдите в **ACF → Field Groups → Add New**.

### Группа «Данные Услуги»
- Назначение: Post Type → `services`
- Поля:

| Имя поля | Ключ | Тип |
|----------|------|-----|
| Цена | `price` | Текст |
| Краткое описание | `short_description` | Текст |

### Группа «Данные Отзыва»
- Назначение: Post Type → `testimonials`
- Поля:

| Имя поля | Ключ | Тип |
|----------|------|-----|
| Оценка | `rating` | Число (1–5) |
| Модель авто | `car_model` | Текст |
| Имя клиента | `client_name` | Текст |

> ⚠️ В настройках каждой группы полей включите **Show in REST API → Yes**

---

## 📷 Шаг 6: Добавление услуг в WordPress

1. Перейдите в **Услуги → Добавить новую**
2. Заполните:
   - **Заголовок** — название услуги
   - **Миниатюра записи** — фотография услуги (загрузите вашу)
   - **Цена** (ACF-поле) — например: `от 800₽`
   - **Краткое описание** (ACF-поле)
3. Нажмите **Опубликовать**

После публикации услуга появится на сайте автоматически (заменит дефолтные данные).

---

## 💬 Шаг 7: Добавление отзывов в WordPress

1. Перейдите в **Отзывы → Добавить новый**
2. Заполните:
   - **Заголовок** — имя клиента
   - **Текст** — текст отзыва в редакторе
   - **Оценка** — 1 до 5
   - **Модель авто** — например: `Toyota Camry`
   - **Имя клиента** — полное имя
3. Нажмите **Опубликовать**

---

## 🌐 Шаг 8: Настройка CORS (если WordPress и сайт на разных доменах)

Добавьте в файл `functions.php` вашей темы WordPress:

```php
add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
});
```

Или установите плагин **WP CORS** для управления через интерфейс.

---

## ✅ Проверка что всё работает

Откройте в браузере:
- Услуги: http://localhost/wordpress/wp-json/wp/v2/services?_embed
- Отзывы: http://localhost/wordpress/wp-json/wp/v2/testimonials

Вы должны увидеть JSON с данными. Если видите — всё настроено правильно!

---

## 📱 WhatsApp — настройка номера телефона

В файле `src/components/CallModal.astro` найдите строку:

```javascript
const WHATSAPP_NUMBER = '79991234567'; // ← ЗАМЕНИТЕ НА СВОЙ НОМЕР
```

Замените `79991234567` на ваш реальный номер **без `+`, скобок и пробелов**.
Пример: `+7 (918) 123-45-67` → `79181234567`

---

## 📁 Куда добавить фотографии

```
web-auto_freelance/
└── public/
    └── images/
        ├── hero-bg.jpg              ← Главный баннер (1920×1080)
        └── services/
            ├── service-1-diagnostics.jpg
            ├── service-2-alarm.jpg
            ├── service-3-ac.jpg
            ├── service-4-audio.jpg
            ├── service-5-wiring.jpg
            ├── service-6-generator.jpg
            ├── service-7-start.jpg
            └── service-8-battery.jpg
```

> 💡 Рекомендованный формат: WebP или JPG. Максимальный размер файла: 200KB.

---

## 🔄 Приоритет данных

Сайт работает по такой логике:

```
WordPress API доступен?
  ✅ ДА  → показывает данные из WordPress (управляется из админки)
  ❌ НЕТ → показывает дефолтные данные из кода (всегда есть контент)
```
