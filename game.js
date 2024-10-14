const boardSize = 20; // Tamanho do tabuleiro
const gameBoard = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const controlsDisplay = document.getElementById('controls');
const messageDisplay = document.getElementById('message');
const gameOverMessage = document.createElement('div');
gameOverMessage.id = 'game-over-message'; // Cria um novo elemento para a mensagem de Game Over
document.body.appendChild(gameOverMessage); // Adiciona a mensagem ao corpo do documento

let snake = [{ x: 10, y: 10 }]; // Começo da cobra no meio
let apple = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) }; // Maçã gerada aleatoriamente
let direction = { x: 0, y: 0 }; // Direção inicial (parada)
let score = 0; // Pontuação
let gameInterval;
let isGameRunning = false; // Verifica se o jogo está rodando

// Função para criar o tabuleiro e desenhar a cobra e a maçã
function createBoard() {
    gameBoard.innerHTML = ''; // Limpa o tabuleiro
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (isSnake(x, y)) {
                cell.classList.add('snake');
                cell.textContent = '■'; // Símbolo da cobra
            } else if (isApple(x, y)) {
                cell.classList.add('apple');
                cell.textContent = '●'; // Símbolo da maçã
            }
            gameBoard.appendChild(cell);
        }
    }
}

// Função para verificar se uma célula é parte da cobra
function isSnake(x, y) {
    return snake.some(segment => segment.x === x && segment.y === y);
}

// Função para verificar se uma célula contém uma maçã
function isApple(x, y) {
    return apple.x === x && apple.y === y;
}

// Função para mover a cobra e verificar colisões
function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }; // Nova cabeça da cobra

    // Verifica se a cobra colidiu com a parede ou consigo mesma (fim de jogo)
    if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize || isSnake(newHead.x, newHead.y)) {
        clearInterval(gameInterval); // Para o jogo
        gameOverMessage.textContent = `Game Over! Your score: ${score}`; // Exibe a mensagem de Game Over
        gameOverMessage.style.display = 'block'; // Torna a mensagem visível
        isGameRunning = false; // O jogo para
        messageDisplay.textContent = 'Press an arrow to start the game!';
        return;
    }

    snake.unshift(newHead); // Adiciona a nova cabeça no início da cobra

    // Verifica se a cobra comeu a maçã
    if (newHead.x === apple.x && newHead.y === apple.y) {
        score++; // Incrementa a pontuação
        scoreDisplay.textContent = `Pontos: ${score}`; // Atualiza a pontuação na tela
        generateApple(); // Gera uma nova maçã
    } else {
        snake.pop(); // Remove o último segmento da cobra se ela não comeu a maçã
    }

    createBoard(); // Redesenha o tabuleiro com as novas posições da cobra e da maçã
}

// Função para gerar uma nova maçã em uma posição aleatória
function generateApple() {
    apple = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    };
    if (isSnake(apple.x, apple.y)) {
        generateApple(); // Garante que a maçã não apareça dentro da cobra
    }
}

// Função para capturar as teclas de direção e mover a cobra
function handleKeyPress(event) {
    if (!isGameRunning && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        // Exclui a mensagem inicial e começa o jogo ao pressionar uma tecla de direção
        messageDisplay.textContent = '';
        gameOverMessage.style.display = 'none'; // Esconde a mensagem de Game Over ao reiniciar
        startGame();
    }

    if (!isGameRunning) return; // Ignora se o jogo não está rodando
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) { // Evita que a cobra se mova diretamente na direção oposta
                direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
}

// Função para iniciar o jogo
function startGame() {
    if (isGameRunning) return; // Impede iniciar novamente se o jogo já estiver rodando

    // Inicializa as variáveis do jogo
    isGameRunning = true;
    snake = [{ x: 10, y: 10 }]; // Reseta a cobra para o meio
    direction = { x: 0, y: 0 }; // Reseta a direção
    score = 0; // Reseta a pontuação
    scoreDisplay.textContent = `Pontos: ${score}`;
    generateApple(); // Gera uma nova maçã
    createBoard(); // Redesenha o tabuleiro

    // Inicia o intervalo do jogo (o movimento da cobra)
    gameInterval = setInterval(() => {
        if (isGameRunning) {
            moveSnake();
        }
    }, 120); // Define o intervalo de tempo para mover a cobra (a cada 200ms)
}

document.addEventListener('keydown', handleKeyPress); // Captura os eventos de tecla para controlar a cobra
