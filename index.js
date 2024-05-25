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

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const hero = new Hero(centerX, centerY, 10, 'white');

let bullets = [];
let aliens = [];
let explosions = [];

function resetGame() {
    bullets = [];
    aliens = [];
    explosions = [];
    score = 0;
    currentHP = maxHP;
    scoreDisplay.innerHTML = score;
    finalScore.innerHTML = score;
    updateHP(0);
}

let animationId;
let score = 0;

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas à chaque frame

    // Dessiner le fond
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner le héros
    hero.draw();

    // Dessiner les explosions
    explosions.forEach((explosion, index) => {
        if (explosion.opacity <= 0) {
            explosions.splice(index, 1);
        } else {
            explosion.move();
            explosion.draw();
        }
    });

    // Dessiner les balles
    bullets.forEach((bullet, index) => {
        bullet.move();
        bullet.draw();

        // Collision balle-héros si la balle est ennemie
        if (bullet.isEnemy) {
            const dist = Math.hypot(hero.x - bullet.x, hero.y - bullet.y);
            if (dist - bullet.size - hero.size < 1) {
                updateHP(1); // Par exemple, 10 HP de dommages par collision avec une balle ennemie
                bullets.splice(index, 1); // Supprime la balle
            }
        }

        // Supprimer les balles hors du canvas
        if (bullet.x + bullet.size < 0 || bullet.x - bullet.size > canvas.width ||
            bullet.y + bullet.size < 0 || bullet.y - bullet.size > canvas.height) {
            bullets.splice(index, 1);
        }
    });

    // Dessiner les ennemis
    aliens.forEach((alien, index) => {
        alien.move();
        alien.draw();

        // Collision héros-ennemi
        const dist = Math.hypot(hero.x - alien.x, hero.y - alien.y);
        if (dist - alien.size - hero.size < 1) {
            updateHP(20); // Par exemple, 20 HP de dommages par collision avec un ennemi
            aliens.splice(index, 1); // Supprime l'ennemi
        }

        // Collision balle-ennemi
        bullets.forEach((bullet, bulletIndex) => {
            const dist = Math.hypot(bullet.x - alien.x, bullet.y - alien.y);
            if (dist - alien.size - bullet.size < 1 && !bullet.isEnemy) {
                // Créer une explosion
                for (let i = 0; i < alien.size * 2; i++) {
                    explosions.push(new Explosion(bullet.x, bullet.y, Math.random() * 2, alien.color, {
                        x: (Math.random() - 0.5) * 6,
                        y: (Math.random() - 0.5) * 6
                    }));
                }

                // Supprimer la balle et l'ennemi
                bullets.splice(bulletIndex, 1);
                aliens.splice(index, 1);

                // Ajouter des points au score
                if (alien.size - 10 > 5) {
                    score += 100;
                } else {
                    score += 250;
                }
                scoreDisplay.innerHTML = score;
            }
        });
    });
}


canvas.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    const speed = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
    bullets.push(new Bullet(centerX, centerY, 5, 'white', speed));
});

startButton.addEventListener('click', () => {
    resetGame();
    animate();
    generateEnemies();
    modal.style.display = 'none';
});

resetGame();
animate();
generateEnemies();