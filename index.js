const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreDisplay = document.querySelector('#scoreEl');
const startButton = document.querySelector('#startGameBtn');
const modal = document.querySelector('#modalEl');
const finalScore = document.querySelector('#bigScoreEl');

const maxHP = 100;
let currentHP = maxHP;

const hpDisplay = document.createElement('div');
hpDisplay.style.position = 'fixed';
hpDisplay.style.top = '30px';
hpDisplay.style.left = '10px';
hpDisplay.style.color = 'white';
hpDisplay.style.fontSize = '20px';
document.body.appendChild(hpDisplay);

function updateHP(damage) {
    currentHP -= damage;
    if (currentHP <= 0) {
        currentHP = 0;
        cancelAnimationFrame(animationId);
        modal.style.display = 'flex';
        finalScore.innerHTML = score;
    }
    hpDisplay.textContent = `HP: ${currentHP}`;
}

// Initial display
updateHP(0);

class Hero {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Bullet {
    constructor(x, y, size, color, speed, isEnemy = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.isEnemy = isEnemy;
        this.lifespan = 100;  // durée de vie en nombre de frames
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    move() {
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.lifespan--;
        if (this.lifespan <= 0 && !this.isEnemy) {
            this.isEnemy = true;
            const angle = Math.atan2(hero.y - this.y, hero.x - this.x);
            this.speed = { x: Math.cos(angle) * 3, y: Math.sin(angle) * 3 };
            this.color = 'red';  // Change la couleur pour indiquer qu'il est devenu ennemi
        }
        this.draw();
    }
}

class EnemyBullet extends Bullet {
    constructor(x, y, size, color, speed) {
        super(x, y, size, color, speed, true);
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    }
}

class Alien {
    constructor(x, y, size, color, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    }
    move() {
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
}

class Explosion {
    constructor(x, y, size, color, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.opacity = 1;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    move() {
        this.speed.x *= 0.98;
        this.speed.y *= 0.98;
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.opacity -= 0.01;
    }
}

function generateEnemies() {
    setInterval(() => {
        const size = Math.random() * (30 - 4) + 4;
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - size : canvas.width + size;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - size : canvas.height + size;
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const speed = { x: Math.cos(angle), y: Math.sin(angle) };
        aliens.push(new Alien(x, y, size, color, speed));
    }, 500);
}
