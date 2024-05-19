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
