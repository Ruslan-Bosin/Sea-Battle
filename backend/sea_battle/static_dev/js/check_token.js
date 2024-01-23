function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          // Имя куки - csrfmiddlewaretoken
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

var csrfToken = getCookie('csrftoken');

// Теперь csrfToken содержит значение CSRF-токена, которое вы можете использовать при отправке AJAX-запросов



const apiUrl = 'http://127.0.0.1:8000/api/send_email';

// Замените на свои учетные данные
const data = {
  "message": "test",
  "subject": "test",
  "email": "glev.shooter06@gmail.com",
  "text": "test"
};

// Отправка POST запроса
fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  },
  body: JSON.stringify(data),
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // console.log('Токен получен:', data.access);
    // // Ваш JWT токен
    // const token = data.access;

    // // Декодирование токена
    // const decodedToken = atob(token.split('.')[1]);

    // // Преобразование строкового представления JSON в объект
    // const tokenData = JSON.parse(decodedToken);

    // // Теперь у вас есть доступ к данным в токене
    // console.log(tokenData.id);   // ID пользователя
    // console.log(tokenData.role); // Роль пользовател
  })
  .catch(error => {
    console.error('Ошибка при запросе:', error);
  });
