# Настройка WordPress для AutoElectric Service

Это руководство поможет вам настроить WordPress для работы в качестве бекенда (Headless CMS) для вашего сайта.

## 1. Установка WordPress

Если у вас еще нет WordPress:

- **Локально**: Скачайте и установите [LocalWP](https://localwp.com/) (самый простой способ) или [XAMPP](https://www.apachefriends.org/).
- **Хостинг**: Используйте установщик приложений (Softaculous и т.д.) в панели вашего хостинга.

## 2. Настройка Типов Записей (Custom Post Types)

Чтобы сайт понимал разницу между "Услугой", "Отзывом" и обычной статьей, нужно создать специальные типы записей.

### Способ А: Использование плагина (Рекомендуемый)

1. Установите плагин **Custom Post Type UI**.
2. Создайте следующие типы записей:

#### Услуги (Services)

- **Slug**: `services`
- **Plural Label**: Услуги
- **Singular Label**: Услуга
- **Supports**: Title, Editor, Thumbnail (Featured Image), Custom Fields
- **Settings**: Show in REST API -> **True** (Обязательно!)

#### Отзывы (Testimonials)

- **Slug**: `testimonials`
- **Plural Label**: Отзывы
- **Singular Label**: Отзыв
- **Supports**: Title, Editor, Custom Fields
- **Settings**: Show in REST API -> **True**

#### Преимущества (Advantages)

- **Slug**: `advantages`
- **Plural Label**: Преимущества
- **Singular Label**: Преимущество
- **Supports**: Title, Editor, Thumbnail
- **Settings**: Show in REST API -> **True**

### Способ Б: Через `functions.php`

Добавьте этот код в файл `functions.php` вашей темы:

```php
function create_post_types() {
    // Services
    register_post_type('services', array(
        'labels' => array('name' => 'Услуги', 'singular_name' => 'Услуга'),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // Важно для API
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields')
    ));

    // Testimonials
    register_post_type('testimonials', array(
        'labels' => array('name' => 'Отзывы', 'singular_name' => 'Отзыв'),
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'custom-fields')
    ));
}
add_action('init', 'create_post_types');
```

## 3. Настройка Дополнительных Полей (Custom Fields)

Для цен, иконок и других деталей используйте плагин **Advanced Custom Fields (ACF)** (бесплатная версия подойдет).

### Группа полей: Данные Услуги (для типа `services`)

- **Цена** (`price`): Текстовое поле (например, "от 500₽")
- **Описание для карточки** (`short_description`): Текстовая область

### Группа полей: Данные Отзыва (для типа `testimonials`)

- **Оценка** (`rating`): Число (1-5)
- **Автомобиль** (`car_model`): Текст (например, "Toyota Camry")
- **Имя клиента** (`client_name`): Текст

В настройках ACF обязательно включите **Show in REST API** для каждой группы полей, если такая опция доступна (в новых версиях ACF может потребоваться дополнительный плагин "ACF to REST API" или включение соответствующей опции).
**Важно**: Установите плагин **ACF to REST API**, чтобы поля ACF были легко доступны в JSON ответах.

## 4. Настройка CORS (Если WordPress на другом домене)

Если ваш Astro сайт и WordPress находятся на разных доменах (или портах локально), нужно разрешить запросы.
Добавьте в `functions.php` или используйте плагин для CORS:

```php
add_action( 'init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
});
```

Теперь ваш WordPress готов отдавать данные для Astro!
