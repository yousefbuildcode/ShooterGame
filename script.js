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
let health = 100;
let score = 0;

let stage = 1;
let targetKills = 50;
let stageComplete = false;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e) => {

    const rect = canvas.getBoundingClientRect();

    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

});
function drawPlayer() {

    let x = player.x;
    let y = player.y;

    let angle = Math.atan2(
        mouseY - (y + 15),
        mouseX - (x + 15)
    );

    // الرأس
    ctx.fillStyle = "#FFD39B";
    ctx.beginPath();
    ctx.arc(x + 15, y + 10, 10, 0, Math.PI * 2);
    ctx.fill();

    // الشعر
    ctx.fillStyle = "#3b2414";
    ctx.beginPath();
    ctx.arc(x + 15, y + 8, 10, Math.PI, 0);
    ctx.fill();

    // العينين
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(x + 11, y + 9, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 19, y + 9, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(x + 11, y + 9, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 19, y + 9, 1, 0, Math.PI * 2);
    ctx.fill();

    // الجسم
    ctx.fillStyle = "#1E90FF";
    ctx.fillRect(x + 9, y + 20, 12, 16);

    // الرجلين
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x + 12, y + 36);
    ctx.lineTo(x + 10, y + 46);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 18, y + 36);
    ctx.lineTo(x + 20, y + 46);
    ctx.stroke();

    // الذراع اليسرى
    ctx.strokeStyle = "#FFD39B";
    ctx.beginPath();
    ctx.moveTo(x + 9, y + 24);
    ctx.lineTo(x + 2, y + 28);
    ctx.stroke();

    // الذراع والمسدس المتحرك
    ctx.save();

    ctx.translate(x + 21, y + 24);
    ctx.rotate(angle);

    ctx.strokeStyle = "#FFD39B";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(10,0);
    ctx.stroke();

    ctx.strokeStyle = "gray";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(10,0);
    ctx.lineTo(22,0);
    ctx.stroke();

    ctx.restore();
}
// إنشاء عدو كل 2.5 ثانية
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

    let x = player.x;
    let y = player.y;

    // الرأس
    ctx.fillStyle = "#FFD39B";
    ctx.beginPath();
    ctx.arc(x + 15, y + 10, 10, 0, Math.PI * 2);
    ctx.fill();

    // الشعر
    ctx.fillStyle = "#3b2414";
    ctx.beginPath();
    ctx.arc(x + 15, y + 8, 10, Math.PI, 0);
    ctx.fill();

    // العين اليسرى
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + 11, y + 9, 2, 0, Math.PI * 2);
    ctx.fill();

    // العين اليمنى
    ctx.beginPath();
    ctx.arc(x + 19, y + 9, 2, 0, Math.PI * 2);
    ctx.fill();

    // بؤبؤ العين
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x + 11, y + 9, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 19, y + 9, 1, 0, Math.PI * 2);
    ctx.fill();

    // الابتسامة
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(x + 15, y + 13, 3, 0, Math.PI);
    ctx.stroke();

    // الجسم
    ctx.fillStyle = "#1E90FF";
    ctx.fillRect(x + 9, y + 20, 12, 15);

    // الذراع اليسرى
    ctx.strokeStyle = "#FFD39B";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 9, y + 23);
    ctx.lineTo(x + 2, y + 28);
    ctx.stroke();

    // الذراع اليمنى
    ctx.beginPath();
    ctx.moveTo(x + 21, y + 23);
    ctx.lineTo(x + 28, y + 28);
    ctx.stroke();

    // المسدس
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 28, y + 28);
    ctx.lineTo(x + 36, y + 28);
    ctx.stroke();

    // الرجل اليسرى
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 35);
    ctx.lineTo(x + 10, y + 45);
    ctx.stroke();

    // الرجل اليمنى
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 35);
    ctx.lineTo(x + 20, y + 45);
    ctx.stroke();
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

    for (let i = enemies.length - 1; i >= 0; i--) {

        let enemy = enemies[i];

        // حركة الزومبي نحو اللاعب
        let dx = (player.x + player.width / 2) - enemy.x;
        let dy = (player.y + player.height / 2) - enemy.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }

        // الرأس
        ctx.fillStyle = "#7ED957";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y - 8, 10, 0, Math.PI * 2);
        ctx.fill();

        // الشعر
        ctx.fillStyle = "#2E2E2E";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y - 12, 10, Math.PI, 0);
        ctx.fill();

        // العينان
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(enemy.x - 4, enemy.y - 10, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(enemy.x + 4, enemy.y - 10, 2, 0, Math.PI * 2);
        ctx.fill();

        // الفم
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(enemy.x - 4, enemy.y - 2);
        ctx.lineTo(enemy.x + 4, enemy.y - 2);
        ctx.stroke();

        // الجسم
        ctx.fillStyle = "#5B8C32";
        ctx.fillRect(enemy.x - 8, enemy.y, 16, 18);

        // الذراعين
        ctx.strokeStyle = "#7ED957";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(enemy.x - 8, enemy.y + 4);
        ctx.lineTo(enemy.x - 16, enemy.y + 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(enemy.x + 8, enemy.y + 4);
        ctx.lineTo(enemy.x + 16, enemy.y + 8);
        ctx.stroke();

        // الرجلين
        ctx.strokeStyle = "black";

        ctx.beginPath();
        ctx.moveTo(enemy.x - 4, enemy.y + 18);
        ctx.lineTo(enemy.x - 6, enemy.y + 28);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(enemy.x + 4, enemy.y + 18);
        ctx.lineTo(enemy.x + 6, enemy.y + 28);
        ctx.stroke();

        // قتل الزومبي
        for (let j = bullets.length - 1; j >= 0; j--) {

            let bullet = bullets[j];

            let bx = bullet.x - enemy.x;
            let by = bullet.y - enemy.y;

            if (Math.sqrt(bx * bx + by * by) < 18) {

                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score++;
   if (score >= targetKills) {
    stageComplete = true;
}
                break;
            }
        }

        // إصابة اللاعب
        if (distance < 20) {
            health -= 0.5;
        }
    }
} 
// رسم الخلفية
function drawBackground() {

    // السماء
    ctx.fillStyle = "#7EC8FF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // الأرض
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(0, canvas.height - 140, canvas.width, 140);

    // عشب طويل
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 2;

    for (let i = 0; i < canvas.width; i += 8) {

        let h = Math.random() * 8 + 6;

        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 140);
        ctx.lineTo(i + 2, canvas.height - 140 - h);
        ctx.stroke();
    }

    // شمس
    ctx.fillStyle = "#FFD54F";
    ctx.beginPath();
    ctx.arc(80, 80, 35, 0, Math.PI * 2);
    ctx.fill();

    // سحب
    drawCloud(180, 70);
    drawCloud(430, 100);
    drawCloud(700, 60);

    // شجرة
    drawTree(120, canvas.height - 140);

    // شجرة
    drawTree(760, canvas.height - 140);
}

function drawCloud(x, y) {

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 20, y - 10, 22, 0, Math.PI * 2);
    ctx.arc(x + 45, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawTree(x, y) {

    // الجذع
    ctx.fillStyle = "#8D6E63";
    ctx.fillRect(x, y - 60, 20, 60);

    // أوراق الشجرة
    ctx.fillStyle = "#2E8B57";

    ctx.beginPath();
    ctx.arc(x + 10, y - 80, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x - 10, y - 60, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 30, y - 60, 24, 0, Math.PI * 2);
    ctx.fill();
}

// الحلقة الرئيسية
function gameLoop() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBackground();

    movePlayer();

    drawPlayer();

    drawBullets();

    drawEnemies();

    // الصحة
    ctx.fillStyle="red";
    ctx.fillRect(20,20,health*2,20);

    ctx.strokeStyle="white";
    ctx.strokeRect(20,20,200,20);

    // السكور
    ctx.fillStyle="white";
    ctx.font="22px Arial";
    ctx.fillText("Score : "+score,20,70);
ctx.fillText("Stage : " + stage, 20, 100);

ctx.fillText("Target : " + score + " / " + targetKills, 20, 130);
    if(health<=0){

        ctx.fillStyle="rgba(0,0,0,0.7)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle="red";
        ctx.font="60px Arial";
        ctx.fillText("GAME OVER",220,250);

        ctx.font="30px Arial";
        ctx.fillStyle="white";
        ctx.fillText("Score : "+score,330,310);

        return;
    }
if(stageComplete){

    ctx.fillStyle="rgba(0,0,0,0.75)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="gold";
    ctx.font="55px Arial";
    ctx.fillText("STAGE COMPLETE!",180,180);

    ctx.fillStyle="white";
    ctx.font="28px Arial";
    ctx.fillText("Press ENTER",340,250);

    return;
}
    requestAnimationFrame(gameLoop);

gameLoop();
