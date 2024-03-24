const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth - 30;
const height = canvas.height = window.innerHeight - 300;

const balls = [];
const numBalls = 20;
const startX = 10;
const startY = 10;
let animationId;
let isPaused = false;
let isRunning = false;
let gravity = 9.8;
let friction = 0.99;
let initialVelocity = 10;
let radius = 20;

const guideSteps = [
    "Bienvenido a la animación de pelota que rebota. Haz clic en 'Siguiente' para continuar.",
    "El botón 'Comenzar' inicia la animación de las pelotas.",
    "El botón 'Pausa' detiene temporalmente la animación.",
    "El botón 'Reiniciar' reinicia la animación con la configuración actual.",
    "El control deslizante 'Tamaño de la Bola' ajusta el radio de las pelotas.",
    "El control deslizante 'Gravedad' ajusta la fuerza de gravedad que actúa sobre las pelotas.",
    "El control deslizante 'Fricción' ajusta la cantidad de fricción entre las pelotas y las paredes.",
    "El control deslizante 'Velocidad inicial' ajusta la velocidad inicial de las pelotas.",
    "¡Eso es todo! Ahora puedes jugar con la animación y ajustar los controles a tu gusto."
];
let currentStep = 0;

function disableControls() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const radiusRange = document.getElementById('radiusRange');
    const gravityRange = document.getElementById('gravityRange');
    const frictionRange = document.getElementById('frictionRange');
    const velocityRange = document.getElementById('velocityRange');

    startButton.disabled = true;
    pauseButton.disabled = true;
    resetButton.disabled = true;
    radiusRange.disabled = true;
    gravityRange.disabled = true;
    frictionRange.disabled = true;
    velocityRange.disabled = true;
}

function enableControls() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const radiusRange = document.getElementById('radiusRange');
    const gravityRange = document.getElementById('gravityRange');
    const frictionRange = document.getElementById('frictionRange');
    const velocityRange = document.getElementById('velocityRange');

    startButton.disabled = false;
    pauseButton.disabled = false;
    resetButton.disabled = false;
    radiusRange.disabled = false;
    gravityRange.disabled = false;
    frictionRange.disabled = false;
    velocityRange.disabled = false;
}


function updateOpacity(step) {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const radiusLabel = document.getElementById('radiusRange').previousElementSibling;
    const radiusRange = document.getElementById('radiusRange');
    const radiusValue = document.getElementById('radiusValue');
    const gravityLabel = document.getElementById('gravityRange').previousElementSibling;
    const gravityRange = document.getElementById('gravityRange');
    const gravityValue = document.getElementById('gravityValue');
    const frictionLabel = document.getElementById('frictionRange').previousElementSibling;
    const frictionRange = document.getElementById('frictionRange');
    const frictionValue = document.getElementById('frictionValue');
    const velocityLabel = document.getElementById('velocityRange').previousElementSibling;
    const velocityRange = document.getElementById('velocityRange');
    const velocityValue = document.getElementById('velocityValue');

    startButton.classList.add('opaque');
    pauseButton.classList.add('opaque');
    resetButton.classList.add('opaque');
    radiusLabel.classList.add('opaque');
    radiusRange.classList.add('opaque');
    radiusValue.classList.add('opaque');
    gravityLabel.classList.add('opaque');
    gravityRange.classList.add('opaque');
    gravityValue.classList.add('opaque');
    frictionLabel.classList.add('opaque');
    frictionRange.classList.add('opaque');
    frictionValue.classList.add('opaque');
    velocityLabel.classList.add('opaque');
    velocityRange.classList.add('opaque');
    velocityValue.classList.add('opaque');

    switch (step) {
        case 1:
            startButton.classList.remove('opaque');
            break;
        case 2:
            pauseButton.classList.remove('opaque');
            break;
        case 3:
            resetButton.classList.remove('opaque');
            break;
        case 4:
            radiusLabel.classList.remove('opaque');
            radiusRange.classList.remove('opaque');
            radiusValue.classList.remove('opaque');
            break;
        case 5:
            gravityLabel.classList.remove('opaque');
            gravityRange.classList.remove('opaque');
            gravityValue.classList.remove('opaque');
            break;
        case 6:
            frictionLabel.classList.remove('opaque');
            frictionRange.classList.remove('opaque');
            frictionValue.classList.remove('opaque');
            break;
        case 7:
            velocityLabel.classList.remove('opaque');
            velocityRange.classList.remove('opaque');
            velocityValue.classList.remove('opaque');
            break;
        
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createBall() {
    const ball = {
        x: startX,
        y: startY,
        radius: radius,
        color: getRandomColor(),
        velocityX: initialVelocity,
        velocityY: initialVelocity,
        gravity: gravity,
        friction: friction
    };
    balls.push(ball);
}

for (let i = 0; i < numBalls; i++) {
    createBall();
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function updateBall(ball) {
    ball.velocityY += ball.gravity;
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > height) {
        ball.velocityY *= -ball.friction;
        ball.y = height - ball.radius;
    } else if (ball.y - ball.radius < 0) {
        ball.velocityY *= -ball.friction;
        ball.y = ball.radius;
    }

    if (ball.x + ball.radius > width) {
        ball.velocityX = -(initialVelocity / 2) * ball.friction;
        ball.x = width - ball.radius;
    } else if (ball.x - ball.radius < 0) {
        ball.velocityX = (initialVelocity / 2) * ball.friction;
        ball.x = ball.radius;
    } else {
        ball.velocityX *= ball.friction;
        if (Math.abs(ball.velocityX) < 0.1) {
            ball.velocityX = 0;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        drawBall(balls[i]);
        updateBall(balls[i]);
    }

    if (!isPaused) {
        animationId = requestAnimationFrame(animate);
    }
}

document.getElementById('startButton').addEventListener('click', function () {
    if (!isRunning) {
        animate();
        isRunning = true;
    }
});
document.getElementById('pauseButton').addEventListener('click', function () {
    isPaused = !isPaused;
    if (!isPaused && isRunning) {
        animate();
    }
});

document.getElementById('resetButton').addEventListener('click', function () {
    cancelAnimationFrame(animationId);
    isRunning = false;
    isPaused = false;
    balls.length = 0;
    for (let i = 0; i < numBalls; i++) {
        createBall();
    }
    animate();
    isRunning = true;
});

document.getElementById('radiusRange').addEventListener('input', function (e) {
    radius = parseInt(e.target.value);
    document.getElementById('radiusValue').textContent = radius;
    balls.forEach(ball => {
        ball.radius = radius;
    });
});


document.getElementById('gravityRange').addEventListener('input', function (e) {
    gravity = parseFloat(e.target.value);
    document.getElementById('gravityValue').textContent = gravity;
    balls.forEach(ball => {
        ball.gravity = gravity;
    });
});


document.getElementById('frictionRange').addEventListener('input', function (e) {
    friction = parseFloat(e.target.value);
    document.getElementById('frictionValue').textContent = friction;
    balls.forEach(ball => {
        ball.friction = friction;
    });
});

document.getElementById('velocityRange').addEventListener('input', function (e) {
    initialVelocity = parseInt(e.target.value);
    document.getElementById('velocityValue').textContent = initialVelocity;
    balls.forEach(ball => {
        ball.velocityX = initialVelocity;
        ball.velocityY = initialVelocity;
    });
});


function showGuide() {
            const guideText = document.getElementById('guideText');
            const nextButton = document.getElementById('nextStep');
            const guide = document.getElementById('guide');

            disableControls();
            updateOpacity(currentStep);

            guideText.textContent = guideSteps[currentStep];

            if (currentStep === guideSteps.length - 1) {
                nextButton.textContent = 'Finalizar';
            }

            guide.style.display = 'block';

            nextButton.addEventListener('click', nextGuideStep);
        }

        function nextGuideStep() {
            const guide = document.getElementById('guide');

            if (currentStep === guideSteps.length - 1) {
                guide.style.display = 'none';
                enableControls();
            } else {
                currentStep++;
                showGuide();
            }
        }

        window.addEventListener('load', showGuide);