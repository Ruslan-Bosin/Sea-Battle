
const socket = new WebSocket('ws://127.0.0.1:8000/ws/cell_update');
socket.addEventListener('message', (event) => {
    console.log(event);
    console.log("collect_event_from_server");
    reloadGrid();
});

function create2DArray(n) {
    var array = new Array(n);
    for (var i = 0; i < n; i++) {
        array[i] = new Array(n).fill('');
    }
    return array;
}

function reloadGrid() {

    const gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = '';

    const gridSize = 5;
    getted_prizes = create2DArray(gridSize);

    const game_id = '1';
    var apiUrl = 'http://127.0.0.1:8000/api/get_cells_from_game';

    // Выполняем GET-запрос с использованием fetch
    fetch(apiUrl + '?game=' + game_id + '&shooted=True').then(response => {
        // Проверяем, успешно ли выполнен запрос (статус 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Преобразуем ответ в формат JSON
        return response.json();
    }).then(data => {
        console.log(data);
        // Перебираем значения ответа с помощью цикла
        for (var el in data) {
            console.log(data[el]["user_id"]);
            if (data[el]["used"]) {
                getted_prizes[data[el]["row"]][data[el]["column"]] = "used";
                if (data[el]["is_prize"]){
                    getted_prizes[data[el]["row"]][data[el]["column"]] = "prize";
                }
            } else {
                getted_prizes[data[el["row"]]][data[el]["column"]] = "";
            }

        }
        console.log(getted_prizes);
        // Создаем сетку клеток
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const gridItem = document.createElement("div");
                gridItem.classList.add("grid-item");
                gridItem.dataset.row = i;
                gridItem.dataset.col = j;
                gridItem.addEventListener("click", function () {
                    handleCellClick(gridItem);
                });
                gridContainer.appendChild(gridItem);
                if (getted_prizes[i][j] == "prize") {
                    gridItem.style.backgroundColor = "green";
                } else if (getted_prizes[i][j] == "used") {
                    gridItem.style.background = "red";
                }
            }
        }
    })

}

document.addEventListener("DOMContentLoaded", reloadGrid);


function handleCellClick(element) {
    const row = parseInt(element.dataset.row);
    const col = parseInt(element.dataset.col);
    const game_id = '1';
    var isPrize = false;
    var already_shoted = true;
    var apiUrl = 'http://127.0.0.1:8000/api/get_cells_from_game';

    // Выполняем GET-запрос с использованием fetch
    fetch(apiUrl + '?game=' + game_id + '&shooted=False')
    .then(response => {
        // Проверяем, успешно ли выполнен запрос (статус 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Преобразуем ответ в формат JSON
        return response.json();
    }).then(data => {
        console.log(data);
        // Перебираем значения ответа с помощью цикла
        for (var el in data) {
            console.log(((data[el]['row']) === row) && ((data[el]['column']) === col));
            if ((data[el]["row"] === row) && (data[el]["column"] === col)) {
                already_shoted = false;
                cellId = data[el]["id"];
                if (data[el]["is_prize"]) {
                    isPrize = true;
                }
            }

        }

        if (isPrize) {
            showModal(`Поздравляем, вы выиграли! Координаты клетки: (${row}, ${col})`);

            const message = {
                type: "get_prize",
                cellId: cellId
            }
            socket.send(JSON.stringify(message));

        } else if (!already_shoted) {
            showModal(`Увы, это был промах. Попробуйте еще раз. Координаты клетки: (${row}, ${col})`);
            const message = {
                type: "update_cell",
                cellId: cellId
            }
            socket.send(JSON.stringify(message));
        } else {
            showModal(`В эту клетки уже стреляли`);
        }

    }).catch(error => {
        console.error('Fetch error:', error);
    });

}

function showModal(content) {
    const modalBodyContent = document.getElementById("modal-body-content");
    modalBodyContent.innerHTML = content;

    $('#myModal').modal('show');
}
