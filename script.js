const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// اللاعب
let player = {
    x: 450,
    y: 300,
    width: 30,
    height: 30,
    speed: 5
};

// الأزرار
let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// الرصاص
let bullets = [];

// إطلاق النار بالماوس
canvas.addEventListener("click", (e) => {

    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const angle = Math.atan2(
        mouseY - (player.y + player.height / 2),
        mouseX - (player.x + player.width / 2)
    );

    bullets.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        dx: Math.cos(angle) * 8,
        dy: Math.sin(angle) * 8
    });

});

// الحركة
function movePlayer() {

    if (keys["w"] || keys["arrowup"])
        player.y -= player.speed;

    if (keys["s"] || keys["arrowdown"])
        player.y += player.speed;

    if (keys["a"] || keys["arrowleft"])
        player.x -= player.speed;

    if (keys["d"] || keys["arrowright"])
        player.x += player.speed;

}

// رسم اللاعب
function drawPlayer() {

    ctx.fillStyle = "lime";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

}

// رسم الرصاص
function drawBullets() {

    ctx.fillStyle = "yellow";

    for (let i = 0; i < bullets.length; i++) {

        bullets[i].x += bullets[i].dx;
        bullets[i].y += bullets[i].dy;

        ctx.beginPath();

        ctx.arc(
            bullets[i].x,
            bullets[i].y,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}

// الحلقة الرئيسية
function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();

    drawPlayer();

    drawBullets();

    requestAnimationFrame(gameLoop);

}

gameLoop();
