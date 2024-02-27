const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const ball = {
    x: width / 2,
    y: height / 2,
    radius: 20,
    color: '#0095DD',
    velocityX: 5,
    velocityY: -5, 
    gravity: 0.1, 
    bounce: -0.6 
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function updateBall() {
    ball.velocityY += ball.gravity;
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > height) {
        ball.velocityY *= ball.bounce;
        ball.y = height - ball.radius;
    }

    if (ball.y - ball.radius < 0) {
        ball.velocityY *= ball.bounce;
        ball.y = ball.radius;
    }

    if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
        ball.velocityX *= ball.bounce;
    }
}


function animate() {
    ctx.clearRect(0, 0, width, height);
    drawBall();
    updateBall();
    requestAnimationFrame(animate);
}

animate();


