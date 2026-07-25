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

// الرصاص والأعداء
let bullets = [];
let enemies = [];

// إنشاء عدو كل 1.5 ثانية
setInterval(() => {
    enemies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30,
        speed: 2
    });
}, 1500);

// إطلاق الرصاص بالماوس
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

// حركة اللاعب
function movePlayer() {
    if (keys["w"] || keys["arrowup"]) player.y -= player.speed;
    if (keys["s"] || keys["arrowdown"]) player.y += player.speed;
    if (keys["a"] || keys["arrowleft"]) player.x -= player.speed;
    if (keys["d"] || keys["arrowright"]) player.x += player.speed;

    // منع الخروج من الشاشة
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > canvas.width)
        player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height)
        player.y = canvas.height - player.height;
}

// رسم اللاعب
function drawPlayer() {
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// رسم الرصاص
function drawBullets() {
    ctx.fillStyle = "yellow";

    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];

        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // حذف الرصاصة إذا خرجت من الشاشة
        if (
            bullet.x < 0 ||
            bullet.x > canvas.width ||
            bullet.y < 0 ||
            bullet.y > canvas.height
        ) {
            bullets.splice(i, 1);
        }
    }
}

// رسم الأعداء
function drawEnemies() {
    ctx.fillStyle = "red";

    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];

        let dx = (player.x + player.width / 2) - enemy.x;
        let dy = (player.y + player.height / 2) - enemy.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }

        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // تصادم الرصاص مع العدو
        for (let j = bullets.length - 1; j >= 0; j--) {
            let bullet = bullets[j];

            let bx = bullet.x - enemy.x;
            let by = bullet.y - enemy.y;

            if (Math.sqrt(bx * bx + by * by) < enemy.size / 2 + 5) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                break;
            }
        }
    }
}

// الحلقة الرئيسية
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();
    drawBullets();
    drawEnemies();

    requestAnimationFrame(gameLoop);
}

gameLoop();
