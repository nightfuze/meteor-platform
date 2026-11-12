# Storybook Meteor UI

Storybook — визуальная документация и песочница компонентов библиотеки `@meteor/ui`. Истории показывают компоненты в примерах; названия компонентов и API соответствуют экспортам пакета.

## Запуск

Из корня репозитория:

```sh
bun dev:storybook
```

Либо из `apps/storybook`:

```sh
bun run dev
```

## Сборка и просмотр

Из корня репозитория:

```sh
bun build:storybook
bun preview:storybook
```

Сборка создаётся в `apps/storybook/dist`. Команда предварительного просмотра запускает Astro preview.

## Содержание историй

| Раздел Storybook | Что входит |
| --- | --- |
| `Showcase/Foundations/Design Tokens` | Обзор дизайн-токенов |
| `Showcase/Components/Display & Feedback` | Alert, AspectRatio, Avatar, Badge, Card, Item, Kbd, Progress, Prose, Separator, Skeleton и Spinner |
| `Showcase/Components/Forms` | Checkbox, Input, Label, NativeSelect, RadioGroup, Slider, Switch и Textarea |
| `Showcase/Components/Navigation` | Accordion, Breadcrumb, Collapsible, Pagination и Tabs |
| `Showcase/Components/Overlays` | AlertDialog, ContextMenu, Dialog, Dropdown, HoverCard, Popover, Sheet и Tooltip |
| `Showcase/Components/Controls & Forms/Advanced` | ButtonGroup, CheckboxGroup, ColorPicker, Combobox, Dropzone, Field, Form, InputGroup, InputOtp, Select, ThemeToggle, Toggle и ToggleGroup |
| `Showcase/Components/Navigation & Data/Patterns` | Carousel, Image, NavigationMenu, ScrollArea, Sidebar, Table, Toast и Video |
| `Showcase/Layout/Patterns` | Обзор layout-паттернов |
| `Components/<Component>/Basic` | Отдельные истории для Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, ButtonGroup, Card, Carousel, Checkbox, CheckboxGroup, Collapsible, ColorPicker, Combobox, ContextMenu, Dialog, Dropdown, Dropzone, Field, Form, HoverCard, Image, Input, InputGroup, InputOtp, Item, Kbd, Label, NativeSelect, NavigationMenu, Pagination, Popover, Progress, Prose, RadioGroup, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, ThemeToggle, Toast, Toggle, ToggleGroup, Tooltip и Video |
| `Components/Button/*` | Button: варианты, размеры, содержимое, ссылки и состояния |

Указаны фактические заголовки и состав историй в `src/stories` на момент обновления. Каталог `Showcase` объединяет несколько компонентов в обзорные примеры; истории `Components/<Component>` показывают отдельные компоненты. `Showcase/Layout/Patterns` — обзор, поэтому перечень его паттернов смотрите в самой истории.

## Добавление истории

1. По возможности импортируйте компонент из `@meteor/ui`.
2. Используйте английское API-имя компонента в заголовке Storybook и названиях разделов.
3. Покажите базовый вид и актуальные состояния: например, disabled, selected, invalid, loading или empty.
4. Используйте пример из продукта Meteor и добавляйте видимые подписи к интерактивным элементам.
5. Размещайте историю в подходящем разделе `Components`, `Foundations` или `Layout`.

Истории находятся в `src/stories`; конфигурация Storybook — в `.storybook`. Preview подключает стили `@meteor/ui/styles.css` и токены темы платформы из `apps/platform/src/styles/tokens.css`.
