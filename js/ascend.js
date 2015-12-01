var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var asteroids,
    bad1,
    bgSound,
    bulletSound,
    bullets,
    bulletTime = 0,
    cursors,
    dangerZone,
    explodeShip,
    fireButton,
    platforms,
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
    game.load.audio('bg', 'assets/bg.mp3');
    game.load.audio('bulletSound', 'assets/bulletSound.mp3');
    game.load.audio('platformHit', 'assets/platformHit.mp3');
    game.load.audio('platformShot', 'assets/platformShot.mp3');
    game.load.audio('expl', 'assets/expl.mp3');
    

    // Load Google web font 'Audiowide'
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    ship = game.add.sprite(400, 400, 'ship');
    game.physics.arcade.enable(ship);
    ship.body.gravity.y = 140;
    ship.body.collideWorldBounds = true;
    ship.anchor.setTo(0.5, 0.5);

    ship.animations.add('rotateTurrets', [], 30, true);

    // Create bullets group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
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
    
    platforms = game.add.group();
    platforms.enableBody = true;
    platforms.physicsBodyType = Phaser.Physics.ARCADE;
    platforms.collideWorldBounds =true;
    
    platforms.setAll('anchor.x', 0.5);
    platforms.setAll('anchor.y', 0.5);
    platforms.setAll('checkWorldBounds', true);
    platforms.setAll('outOfBoundsKill', true);
    
    pOne = platforms.create(50, 1, 'platform');
    pOne.body.immovable = true;
    pOne.body.velocity.y = 30;
    
    pTwo = platforms.create(500, -45, 'platform');
    pTwo.body.immovable = true;
    pTwo.body.velocity.y = 30;
    
    badies = game.add.group();
    badies.enableBody = true;
    badies.physicsBodyType = Phaser.Physics.ARCADE;
    
    badies.setAll('anchor.x', 0.5);
    badies.setAll('anchor.y', 0.5);
    badies.setAll('checkWorldBounds', true);
    badies.setAll('outOfBoundsKill', true);
    
    bad1 = badies.create(pOne.x, pOne.y - 45, 'baddie1');
    bad1.body.velocity.y = 30;
    
    bad2 = badies.create(pOne.x + 200, pTwo.y - 25, 'baddie2');
    bad2.body.velocity.y = 30;
    
    bad3 = badies.create(pTwo.x + +25, pTwo.y - 45, 'baddie3');
    bad3.body.velocity.y = 30;
    
    bad4 = badies.create(pTwo.x + 175, pTwo.y - 40, 'baddie4');
    bad4.body.velocity.y = 30;

    dangerZone = game.add.sprite(0, game.height - 50, 'dangerZone');

    // Game controls
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    warningText = game.add.text(16, 56, '', {font: '400 20px Audiowide', fill: '#F33', align: 'center'});

    bulletSound = game.add.audio('bulletSound');
    bgSound = game.add.audio('bg');
    bgSound.play('', 0, 1, true);
    
    pHitSound = game.add.audio('platformHit');
    pShotSound = game.add.audio('platformShot');
    eBoom = game.add.audio('expl');
}

function update() {
    
    game.physics.arcade.collide(ship, pOne, baddieRelease, null, this);
    
    game.physics.arcade.collide(ship, pTwo, baddieRelease2, null, this);    
   
    game.physics.arcade.collide(badies, platforms);
    
    game.physics.arcade.collide(bullets, platforms, hit, null, this);
    
    game.physics.arcade.collide(bullets, bad1, baddieOneKill, null, this);    
    
    game.physics.arcade.collide(bullets, bad2, baddieTwoKill, null, this);    
    
    game.physics.arcade.collide(bullets, bad3, baddieThreeKill, null, this);    
    
    game.physics.arcade.collide(bullets, bad4, baddieFourKill, null, this);    

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
    
    if(!platforms.countLiving() && !badies.countLiving()) {
        
        game.tweens.removeAll();
        
        pOne = platforms.create(50, 1, 'platform');
        pOne.body.velocity.y = 30;
        pOne.body.immovable = true;
        
        bad1 = badies.create(pOne.x, pOne.y - 45, 'baddie1');
        bad1.body.velocity.y = 30;
    
        bad2 = badies.create(pOne.x + 200, pOne.y - 65, 'baddie2');
        bad2.body.velocity.y = 30;
        
        pTwo = platforms.create(500, -50, 'platform');
        pTwo.body.immovable = true;
        pTwo.body.velocity.y = 30;
        
        bad3 = badies.create(pTwo.x + +25, pTwo.y - 45, 'baddie3');
        bad3.body.velocity.y = 30;
    
        bad4 = badies.create(pTwo.x + 175, pTwo.y - 40, 'baddie4');
        bad4.body.velocity.y = 30;
        
    }
    
    if(pOne.y >= game.world.height - 75 ) {
        pOne.destroy();
   }
    
    if(pTwo.y >= game.world.height - 75 ) {
        pTwo.destroy();
    }
    
    if(bad1.y >= game.world.height - 75 ) {
        bad1.destroy();
   }
    
    if(bad2.y >= game.world.height - 75 ) {
        bad2.destroy();
    }
    
    if(bad3.y >= game.world.height - 75 ) {
        bad3.destroy();
    }
    
    if(bad4.y >= game.world.height - 75 ) {
        bad4.destroy();
    }
    
    

}

function createText() {
    scoreText = game.add.text(16, 16, "SCORE: 0", {font: '400 24px Audiowide', fill: '#9F9'});
}

function createRandomAsteroid() {

    if(Math.random() < .001) {
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
    bad1.body.velocity.y = 0;
    bad2.body.velocity.y = 0;
    
    tween1 = game.add.tween(bad1).to({x: 250}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
    tween1.onLoop.add(descend1, this);
    
    tween2 = game.add.tween(bad2).to({x: 390}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
    tween2.onLoop.add(descend2, this);
    
    pHitSound.play();
    
}

function baddieRelease2() {
    bad3.body.velocity.y = 0;
    bad4.body.velocity.y = 0;
    
    tween3 = game.add.tween(bad3).to({x: 405}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
    tween3.onLoop.add(descend3, this);
    
    tween4 = game.add.tween(bad4).to({x: 450}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
    tween4.onLoop.add(descend4, this);
    
    pHitSound.play();
    
}

function descend1() {
    bad1.y += 1;
}

function descend2() {
    bad2.y += 1;
}

function descend3() {
    bad3.y += 1;
}

function descend4() {
    bad4.y += 1;
}

function baddieOneKill() {
    bad1.kill();
    bullet.kill();
    explodeBaddie = game.add.sprite(bad1.x, bad1.y, 'shipExplosion');
    explodeBaddie.anchor.setTo(0.5, 0.5);
    explodeBaddie.animations.add('expl', [], 30);
    explodeBaddie.animations.play('expl');
    eBoom.play();
}
function baddieTwoKill() {
    bad2.kill();
    bullet.kill();
    explodeBaddie = game.add.sprite(bad2.x, bad2.y, 'shipExplosion');
    explodeBaddie.anchor.setTo(0.5, 0.5);
    explodeBaddie.animations.add('expl', [], 30);
    explodeBaddie.animations.play('expl');
    eBoom.play();
}function baddieThreeKill() {
    bad3.kill();
    bullet.kill();
    explodeBaddie = game.add.sprite(bad3.x, bad3.y, 'shipExplosion');
    explodeBaddie.anchor.setTo(0.5, 0.5);
    explodeBaddie.animations.add('expl', [], 30);
    explodeBaddie.animations.play('expl');
    eBoom.play();
}function baddieFourKill() {
    bad4.kill();
    bullet.kill();
    explodeBaddie = game.add.sprite(bad4.x, bad4.y, 'shipExplosion');
    explodeBaddie.anchor.setTo(0.5, 0.5);
    explodeBaddie.animations.add('expl', [], 30);
    explodeBaddie.animations.play('expl');
    eBoom.play();
}

function hit(bullet) {
    bullet.kill();
    pShotSound.play();
}

function gameOver() {
    ship.alive = false;
    ship.destroy();
    explodeShip = game.add.sprite(ship.x, ship.y, 'shipExplosion');
    explodeShip.anchor.setTo(0.5, 0.5);
    explodeShip.animations.add('anim', [], 30);
    explodeShip.animations.play('anim');
}
