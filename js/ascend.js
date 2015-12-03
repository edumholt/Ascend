var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var asteroids,
    asteroidExplosion,
    bgSound,
    bulletSound,
    bullets,
    bulletTime = 0,
    cursors,
    dangerZone,
    explodeShip,
    fireButton,
    platforms,
    score = 0,
    scoreText,
    warningText,
    shipStats,
    starfield,
    ship;

// Required to load Google web font
WebFontConfig = {

    active: function() {
        game.time.events.add(Phaser.Timer.SECOND, createText, this);
    },

    google: {
        families: ['Audiowide']
    }
};

function preload() {

    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('dangerZone', 'assets/DoNotEnter.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('platform', 'assets/platformOne.png');
    game.load.image('baddie1', 'assets/andriodShip.png');
    game.load.image('baddie2', 'assets/alien3.png'); 
    game.load.image('baddie3', 'assets/spaceShip.png'); 
    game.load.image('baddie4', 'assets/gunship.png'); 
    game.load.spritesheet('asteroid', 'assets/asteroid.png', 36, 36);
    game.load.spritesheet('ship', 'assets/ship_sprites.png', 45, 52);
    game.load.spritesheet('shipExplosion', 'assets/explosion.png', 100, 100);
    game.load.spritesheet('asteroidExplosion', 'assets/asteroidExplosion.png', 64, 64);
    game.load.audio('bg', 'assets/bg.mp3');
    game.load.audio('bulletSound', 'assets/bulletSound.mp3');
    game.load.audio('platformHit', 'assets/platformHit.mp3');
    game.load.audio('platformShot', 'assets/platformShot.mp3');
    game.load.audio('expl', 'assets/expl.mp3');
    game.load.audio('alert', 'assets/intruderAlert.mp3');
    game.load.audio('asteroidExplosion', 'assets/asteroidExplosion.mp3');
    

    // Load Google web font 'Audiowide'
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    ship = game.add.sprite(400, 300, 'ship');
    game.physics.arcade.enable(ship);
    ship.body.gravity.y = 140;
    ship.body.collideWorldBounds = true;
    ship.anchor.setTo(0.5, 0.5);
    ship.body.bounce.y = 1;

    ship.animations.add('rotateTurrets', [], 30, true);

    // Create bullets group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(300, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // Create asteroids group
    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.ARCADE;

    asteroids.setAll('anchor.x', 0.5);
    asteroids.setAll('anchor.y', 0.5);
    asteroids.setAll('outOfBoundsKill', true);
    asteroids.setAll('checkWorldBounds', true);
    
    // Create platforms group
    platforms = game.add.group();
    platforms.enableBody = true;
    platforms.physicsBodyType = Phaser.Physics.ARCADE;
    platforms.collideWorldBounds =true;
    
    platforms.setAll('anchor.x', 0.5);
    platforms.setAll('anchor.y', 0.5);
    platforms.setAll('checkWorldBounds', true);
    platforms.setAll('outOfBoundsKill', true);
    
    platformOne = platforms.create(50, 1, 'platform');
    platformOne.body.immovable = true;
    platformOne.body.velocity.y = 30;
    
    platformTwo = platforms.create(500, -45, 'platform');
    platformTwo.body.immovable = true;
    platformTwo.body.velocity.y = 30;

    // Create baddies group
    baddies = game.add.group();
    baddies.enableBody = true;
    baddies.physicsBodyType = Phaser.Physics.ARCADE;
    
    baddies.setAll('anchor.x', 0.5);
    baddies.setAll('anchor.y', 0.5);
    baddies.setAll('checkWorldBounds', true);
    baddies.setAll('outOfBoundsKill', true);
    
    badGuy1 = baddies.create(platformOne.x, platformOne.y - 45, 'baddie1');
    badGuy1.body.velocity.y = 30;
    
    badGuy2 = baddies.create(platformOne.x + 200, platformOne.y - 65, 'baddie2');
    badGuy2.body.velocity.y = 30;
    
    badGuy3 = baddies.create(platformTwo.x + +25, platformTwo.y - 45, 'baddie3');
    badGuy3.body.velocity.y = 30;
    
    badGuy4 = baddies.create(platformTwo.x + 175, platformTwo.y - 40, 'baddie4');
    badGuy4.body.velocity.y = 30;

    dangerZone = game.add.sprite(0, game.height - 50, 'dangerZone');

    // Game controls
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    warningText = game.add.text(16, 56, '', {font: '400 20px Audiowide', fill: '#F33', align: 'center'});

    // Add Sounds
    bulletSound = game.add.audio('bulletSound');
    bgSound = game.add.audio('bg');
    platformCrashSound = game.add.audio('platformHit');
    platformShotSound = game.add.audio('platformShot');
    enemyBoom = game.add.audio('expl');
    alertSound = game.add.audio('alert');
    asteroidSound = game.add.audio('asteroidExplosion');
    bgSound.play('', 0, 1, true);

}

function update() {
    
    game.physics.arcade.collide(ship, platformOne, baddieRelease, null, this);
    game.physics.arcade.collide(ship, platformTwo, baddieRelease2, null, this);
    game.physics.arcade.collide(baddies, platforms);
    game.physics.arcade.collide(bullets, platforms, platformShot, null, this);
    game.physics.arcade.collide(bullets, badGuy1, baddieOneKill, null, this);
    game.physics.arcade.collide(bullets, badGuy2, baddieTwoKill, null, this);
    game.physics.arcade.collide(bullets, badGuy3, baddieThreeKill, null, this);    
    game.physics.arcade.collide(bullets, badGuy4, baddieFourKill, null, this);
    game.physics.arcade.collide(bullets, asteroids, asteroidExplode, null, this);

    starfield.tilePosition.y += 0.4;

    createRandomAsteroid();

    if(!(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown)) {
        ship.animations.stop();
    }

    if(ship.alive){
        ship.body.velocity.x = 0;

        if(cursors.left.isDown) {
            ship.body.velocity.x = -100;
            ship.animations.play('rotateTurrets');
        } else if(cursors.right.isDown) {
            ship.body.velocity.x = 100;
            ship.animations.play('rotateTurrets');
        }

        if(cursors.up.isDown) {
            ship.body.velocity.y = -70;
            ship.animations.play('rotateTurrets');
        }

        // Fire bullets
        if(fireButton.isDown) {
            fireBullet();
        }
    }

    if(ship.y >= game.world.height - 160) {
        warningText.text = "WARNING: ACCELERATE SHIP";
    } else {
        warningText.text = '';
    }

    if(ship.y >= game.world.height - 50 ) {
        gameOver();
    }
    
    if(!platforms.countLiving() && !baddies.countLiving()) {
        
        game.tweens.removeAll();
        
        platformOne = platforms.create(50, 1, 'platform');
        platformOne.body.velocity.y = 30;
        platformOne.body.immovable = true;
        
        badGuy1 = baddies.create(platformOne.x, platformOne.y - 45, 'baddie1');
        badGuy1.body.velocity.y = 30;
    
        badGuy2 = baddies.create(platformOne.x + 200, platformOne.y - 65, 'baddie2');
        badGuy2.body.velocity.y = 30;
        
        platformTwo = platforms.create(500, -50, 'platform');
        platformTwo.body.immovable = true;
        platformTwo.body.velocity.y = 30;
        
        badGuy3 = baddies.create(platformTwo.x + +25, platformTwo.y - 45, 'baddie3');
        badGuy3.body.velocity.y = 30;
    
        badGuy4 = baddies.create(platformTwo.x + 175, platformTwo.y - 40, 'baddie4');
        badGuy4.body.velocity.y = 30;
        
    }
    
    if(platformOne.y >= game.world.height - 75 ) {
        platformOne.destroy();
   }
    
    if(platformTwo.y >= game.world.height - 75 ) {
        platformTwo.destroy();
    }
    
    if(badGuy1.y >= game.world.height - 75 ) {
        badGuy1.destroy();
   }
    
    if(badGuy2.y >= game.world.height - 75 ) {
        badGuy2.destroy();
    }
    
    if(badGuy3.y >= game.world.height - 75 ) {
        badGuy3.destroy();
    }
    
    if(badGuy4.y >= game.world.height - 75 ) {
        badGuy4.destroy();
    }

}

function createText() {
    scoreText = game.add.text(16, 16, "SCORE: 0", {font: '400 24px Audiowide', fill: '#9F9'});
}

function createRandomAsteroid() {

    if(Math.random() < .003) {
        var asteroid = asteroids.create(Math.random() * 600 + 100, 0, 'asteroid', 1);
        asteroid.body.velocity.setTo(Math.random() * 60 - 30, Math.random() * 30 + 20);
        asteroid.animations.add('spin', [], 10, true);
        asteroid.play('spin');
    }

}

function fireBullet() {
    // To prevent bullets from being fired too fast, we set a time limit
    if(game.time.now > bulletTime) {
        // Get the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);
        if(bullet) {
            //And fire it
            bullet.reset(ship.x, ship.y - 12);
            bullet.body.velocity.y = -400;
            bulletSound.play();
            bulletTime = game.time.now + 200;
        }
    }

}

function baddieRelease() {
    badGuy1.body.velocity.y = 0;
    badGuy2.body.velocity.y = 0;
    
    tween1 = game.add.tween(badGuy1).to({x: 250}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
    tween1.onLoop.add(descend1, this);
    
    tween2 = game.add.tween(badGuy2).to({x: 390}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
  
    platformCrashSound.play();
    
}

function baddieRelease2() {
    badGuy3.body.velocity.y = 0;
    badGuy4.body.velocity.y = 0;
    
    tween3 = game.add.tween(badGuy3).to({x: 405}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
    tween3.onLoop.add(descend2, this);
    
    tween4 = game.add.tween(badGuy4).to({x: 450}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
    
    platformCrashSound.play();
    
}

function descend1() {
    badGuy1.y += 1;
    badGuy2.y += 1;
}

function descend2() {
    badGuy3.y += 1;
    badGuy4.y += 1;
}

function baddieOneKill() {
    badGuy1.kill();
    bullet.kill();
    explodeBaddie = game.add.sprite(badGuy1.x, badGuy1.y, 'shipExplosion');
    explodeBaddie.anchor.setTo(0.5, 0.5);
    explodeBaddie.animations.add('expl', [], 30);
    explodeBaddie.animations.play('expl');
    enemyBoom.play();
    incrementScore(30);
}

function baddieTwoKill() {
    badGuy2.kill();
    bullet.kill();
    explodeBaddie = game.add.sprite(badGuy2.x, badGuy2.y, 'shipExplosion');
    explodeBaddie.anchor.setTo(0.5, 0.5);
    explodeBaddie.animations.add('expl', [], 30);
    explodeBaddie.animations.play('expl');
    enemyBoom.play();
    incrementScore(30);
}

function baddieThreeKill() {
    badGuy3.kill();
    bullet.kill();
    explodeBaddie = game.add.sprite(badGuy3.x, badGuy3.y, 'shipExplosion');
    explodeBaddie.anchor.setTo(0.5, 0.5);
    explodeBaddie.animations.add('expl', [], 30);
    explodeBaddie.animations.play('expl');
    enemyBoom.play();
    incrementScore(30);
}

function baddieFourKill() {
    badGuy4.kill();
    bullet.kill();
    explodeBaddie = game.add.sprite(badGuy4.x, badGuy4.y, 'shipExplosion');
    explodeBaddie.anchor.setTo(0.5, 0.5);
    explodeBaddie.animations.add('expl', [], 30);
    explodeBaddie.animations.play('expl');
    enemyBoom.play();
    incrementScore(30);
}

function asteroidExplode(bullet, asteroid) {
    bullet.kill();
    asteroid.kill();
    asteroidExplosion = game.add.sprite(asteroid.x, asteroid.y, 'asteroidExplosion');
    asteroidExplosion.anchor.setTo(0.5, 0.5);
    asteroidExplosion.animations.add('explode', [], 30);
    asteroidExplosion.animations.play('explode');
    asteroidSound.play();
    incrementScore(10);
}

function platformShot(bullet) {
    bullet.kill();
    platformShotSound.play();
}

function incrementScore(incrementAmount) {
    score += incrementAmount;
    scoreText.text = 'SCORE: ' + score;
}

function gameOver() {
    ship.alive = false;
    ship.destroy();
    alertSound.stop();
    explodeShip = game.add.sprite(ship.x, ship.y, 'shipExplosion');
    explodeShip.anchor.setTo(0.5, 0.5);
    explodeShip.animations.add('anim', [], 30);
    explodeShip.animations.play('anim');
}
