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
let gravity = 0.5;
let friction = 0.99;
let initialVelocity = 10;
let radius = 20;

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
    balls.forEach(ball => {
        ball.radius = radius;
    });
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    balls.forEach(ball => {
        const dx = x - ball.x;
        const dy = y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= ball.radius) {
            ball.color = getRandomColor();
        }
    });
});

document.getElementById('gravityRange').addEventListener('input', function (e) {
    gravity = parseFloat(e.target.value);
    balls.forEach(ball => {
        ball.gravity = gravity;
    });
});

document.getElementById('frictionRange').addEventListener('input', function (e) {
    friction = parseFloat(e.target.value);
    balls.forEach(ball => {
        ball.friction = friction;
    });
});

document.getElementById('velocityRange').addEventListener('input', function (e) {
    initialVelocity = parseInt(e.target.value);
    balls.forEach(ball => {
        ball.velocityX = initialVelocity;
        ball.velocityY = initialVelocity;
    });
});