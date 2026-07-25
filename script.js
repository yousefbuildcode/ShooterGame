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

let keys = {};

// تحسين التقاط الأزرار لدعم WASD و الأسهم
document.addEventListener("keydown", (e) => { 
    keys[e.key.toLowerCase()] = true; 
    keys[e.code.toLowerCase()] = true; 
});
document.addEventListener("keyup", (e) => { 
    keys[e.key.toLowerCase()] = false; 
    keys[e.code.toLowerCase()] = false; 
});

document.addEventListener("keydown", function(e) {
    if (stageComplete && e.key === "Enter") {
        stage++;
        targetKills += 15;
        health = 100;
        enemies = [];
        bullets = [];
        particles = [];
        stageComplete = false;
        requestAnimationFrame(gameLoop);
    }
});

let bullets = [];
let enemies = [];
let particles = [];
let health = 100;
let score = 0;

let stage = 1;
let targetKills = 30;
let stageComplete = false;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// إنتاج الأعداء
setInterval(() => {
    if (!stageComplete && health > 0) {
        enemies.push({
            x: Math.random() < 0.5 ? 0 : canvas.width,
            y: Math.random() * canvas.height,
            size: 30,
            speed: 1.5 + Math.random() * 1
        });
    }
}, 1200);

// إطلاق الرصاص
canvas.addEventListener("click", (e) => {
    if (stageComplete || health <= 0) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const angle = Math.atan2(
        my - (player.y + player.height / 2),
        mx - (player.x + player.width / 2)
    );

    bullets.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        dx: Math.cos(angle) * 10,
        dy: Math.sin(angle) * 10
    });
});

// دالة الحركة المعدلة لدعم WASD والأسهم بدقة
function movePlayer() {
    if (keys["w"] || keys["keyw"] || keys["arrowup"]) player.y -= player.speed;
    if (keys["s"] || keys["keys"] || keys["arrowdown"]) player.y += player.speed;
    if (keys["a"] || keys["keya"] || keys["arrowleft"]) player.x -= player.speed;
    if (keys["d"] || keys["keyd"] || keys["arrowright"]) player.x += player.speed;

    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function drawPlayer() {
    let x = player.x;
    let y = player.y;
    let angle = Math.atan2(mouseY - (y + 15), mouseX - (x + 15));

    // ظل اللاعب
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(x + 15, y + 46, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

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

    // العيون
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + 11, y + 9, 2, 0, Math.PI * 2);
    ctx.arc(x + 19, y + 9, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x + 11, y + 9, 1, 0, Math.PI * 2);
    ctx.arc(x + 19, y + 9, 1, 0, Math.PI * 2);
    ctx.fill();

    // الجسم
    ctx.fillStyle = "#1E90FF";
    ctx.fillRect(x + 9, y + 20, 12, 16);

    // الأرجل
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 36); ctx.lineTo(x + 10, y + 46);
    ctx.moveTo(x + 18, y + 36); ctx.lineTo(x + 20, y + 46);
    ctx.stroke();

    // المسدس المتحرك
    ctx.save();
    ctx.translate(x + 15, y + 24);
    ctx.rotate(angle);

    ctx.fillStyle = "gray";
    ctx.fillRect(5, -2, 15, 5);
    ctx.restore();
}

function drawBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.x += b.dx;
        b.y += b.dy;

        ctx.shadowBlur = 8;
        ctx.shadowColor = "#FFD700";
        ctx.fillStyle = "#FFF700";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            bullets.splice(i, 1);
        }
    }
}

function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x, y: y,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            size: Math.random() * 4 + 2,
            life: 15
        });
    }
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.life--;

        ctx.fillStyle = "#7ED957";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
    }
}

function drawEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];

        let dx = (player.x + player.width / 2) - enemy.x;
        let dy = (player.y + player.height / 2) - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }

        // ظل العدو
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(enemy.x, enemy.y + 28, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // رسم العدو
        ctx.fillStyle = "#5B8C32";
        ctx.fillRect(enemy.x - 8, enemy.y, 16, 18);

        ctx.fillStyle = "#7ED957";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y - 8, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(enemy.x - 3, enemy.y - 10, 2, 0, Math.PI * 2);
        ctx.arc(enemy.x + 3, enemy.y - 10, 2, 0, Math.PI * 2);
        ctx.fill();

        // اصطدام الرصاص بالعدو
        for (let j = bullets.length - 1; j >= 0; j--) {
            let b = bullets[j];
            let bx = b.x - enemy.x;
            let by = b.y - enemy.y;

            if (Math.sqrt(bx * bx + by * by) < 18) {
                createParticles(enemy.x, enemy.y);
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score++;
                if (score >= targetKills) stageComplete = true;
                break;
            }
        }

        if (distance < 20) health -= 0.4;
    }
}

function drawBackground() {
    // السماء
    ctx.fillStyle = "#7EC8FF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // الأرض
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(0, canvas.height - 140, canvas.width, 140);

    // ظل خط الأرض
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, canvas.height - 140, canvas.width, 8);

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

    // الأشجار
    drawTree(120, canvas.height - 140);
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 2, 35, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8D6E63";
    ctx.fillRect(x, y - 60, 20, 60);

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

function drawUI() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(10, 10, 210, 130);

    ctx.fillStyle = "#333";
    ctx.fillRect(20, 20, 190, 18);
    ctx.fillStyle = health > 30 ? "#4CAF50" : "#E53935";
    ctx.fillRect(20, 20, Math.max(0, (health / 100) * 190), 18);

    ctx.fillStyle = "#FFF";
    ctx.font = "bold 14px Tahoma";
    ctx.fillText(`HP: ${Math.ceil(health)}%`, 90, 34);

    ctx.font = "16px Tahoma";
    ctx.fillText("Score: " + score, 20, 65);
    ctx.fillText("Stage: " + stage, 20, 90);
    ctx.fillText("Target: " + score + " / " + targetKills, 20, 115);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    movePlayer();
    drawPlayer();
    drawBullets();
    drawParticles();
    drawEnemies();
    drawUI();

    if (health <= 0) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FF3333";
        ctx.font = "bold 50px Tahoma";
        ctx.fillText("GAME OVER", canvas.width / 2 - 150, 250);
        return;
    }

    if (stageComplete) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 45px Tahoma";
        ctx.fillText("STAGE COMPLETE!", canvas.width / 2 - 180, 220);
        ctx.fillStyle = "#FFF";
        ctx.font = "22px Tahoma";
        ctx.fillText("Press ENTER for Next Stage", canvas.width / 2 - 130, 280);
        return;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
