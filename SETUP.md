# Подключение формы ответов

Это единственное действие, которое нельзя выполнить из файлов сайта: оно требует входа в ваш Google-аккаунт и GitHub. После настройки ответы будут автоматически попадать в `gusses` вашего репозитория.

1. Отзовите токен, который был отправлен в чат. Он больше небезопасен. В GitHub откройте `Settings` -> `Developer settings` -> `Personal access tokens` и удалите его.
2. Создайте новый fine-grained token. Дайте ему доступ только к репозиторию `ivansmirnov20151-afk/fuppy` и разрешение `Contents: Read and write`.
3. Откройте [script.google.com](https://script.google.com), создайте проект и замените содержимое файла `Code.gs` текстом из `google-apps-script/Code.gs`.
4. В Apps Script откройте `Project Settings` -> `Script properties`. Добавьте свойство `GITHUB_TOKEN` и вставьте туда новый токен. Не добавляйте токен в `index.html`.
5. Нажмите `Deploy` -> `New deployment` -> `Web app`. Выберите `Execute as: Me`, `Who has access: Anyone`, затем подтвердите разрешения и скопируйте URL веб-приложения.
6. В `index.html` найдите строку `const RSVP_ENDPOINT = '';` и вставьте URL между кавычками.
7. Загрузите в репозиторий как минимум `index.html`, `gusses`, `google-apps-script/Code.gs`, `README.md` и `SETUP.md`; затем включите GitHub Pages.

Google Apps Script безопасно хранит токен на своей стороне и при ответе формы добавляет имена в `gusses`. Публичный сайт получает список только для отображения после PIN-кода.
