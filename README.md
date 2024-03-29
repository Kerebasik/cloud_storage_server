# Cloud storage server

---

### Стек

| Технології      | Опис                                                                                                                     | Link ↘                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| JavaScript      | Динамічна, об'єктно-орієнтована, прототипна мова програмування                                                           | -------                 |
| Node.js         | Програмна платформа, заснована на двигуні V8                                                                             | https://nodejs.org      |
| Express.js      | Мінімалістичний та гнучкий фреймворк для веб-застосунків, побудованих на Node.js                                         | https://expressjs.com   |
| MongoDB         | Документоорієнтована система управління базами даних                                                                     | https://www.mongodb.com |
| Mongoose        | Інструмент моделювання об’єктів MongoDB, призначений для роботи в асинхронному середовищі                                | https://mongoosejs.com  |
| Mocha           | Багатофункціональна платформа тестування JavaScript, яка працює на Node.js і в браузері                                  | https://mochajs.org     |
| Chai, chai-http | Бібліотека тверджень BDD/TDD для вузла та браузера, яку чудово можна поєднати з будь-якою системою тестування JavaScript | https://www.chaijs.com  |

#### .env

| Настройка                | Опис                                          |
| ------------------------ | --------------------------------------------- |
| ACCESS_TOKEN_SECRET_KEY  | Пидпис для разшифрування JWT для AccessToken  |
| REFRESH_TOKEN_SECRET_KEY | Пидпис для разшифрування JWT для RefreshToken |
| SMTP_PORT                | Порт для smtp з'єднання                       |
| SMTP_HOST                | Хост smtp з'єднання                           |
| SMTP_USER                |                                               |
| SMTP_PASS                |                                               |
| STRIPE_PUBLIC_KEY        |                                               |
| STRIPE_SECRET_KEY        |                                               |
| API_URL                  |                                               |
| PORT                     |                                               |
