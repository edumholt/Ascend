var game = new Phaser.Game(800, 750, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});

var alertSound,
    alertTimer = 0,
    alienExplosion,
    alienExplosionSound,
    aliens,
    asteroidCrashSound,
    asteroids,
    asteroidReleaseRate = .004,
    asteroidExplosion,
    asteroidTime = 0,
    bgSound,
    beacons,
    bellSound,
    bulletSound,
    bullets,
    bulletTime = 0,
    bumpTimer = 0,
    cameraShakeTime = 0,
    cameraView,
    counter = 0,
    cursors,
    dangerZone,
    expl,
    explodeShip,
    fireButton,
    hitText,
    lives = 3,
    livesText,
    livesTimer = 0,
    metroidSound,
    platformBumpSound,
    platformReleaseTime = 0,
    platformSet,
    platforms,
    safeFlag = true,
    score = 0,
    scoreText,
    splashScreen,
    startGameTime = 0,
    warningText,
    starfield,
    starfieldTop,
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

    ascendLoad();

    // Load Google web font 'Audiowide'
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    cameraView = new Phaser.Rectangle(0, 20, 800, 600);
    game.camera.view = cameraView;

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    // game.plugins.add(Phaser.Plugin.Inspector);

    starfield = game.add.tileSprite(0, 20, 800, 620, 'starfield');
    starfieldTop = game.add.tileSprite(0, 20, 800, 620, 'starfieldTop');

    // Create and setup ship
    ship = game.add.sprite(400, 300, 'ship');
    game.physics.arcade.enable(ship);
    ship.body.gravity.y = 140;
    ship.body.collideWorldBounds = true;
    ship.anchor.setTo(0.5, 0.5);
    ship.body.bounce.y = 0.5;

    ship.animations.add('rotateTurrets', [], 30, true);

    createGameSprites(); // in ascendGameSprites.js

    // Game controls
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    hitText = game.add.text(280, 40, '', {font: '400 28px Audiowide', fill: '#F33', align: 'center'});
    warningText = game.add.text(16, 76, '', {font: '400 20px Audiowide', fill: '#F33', align: 'center'});

    splashScreen = game.add.sprite(0, 0, 'splashScreen');

    gameStartDelay();

    game.paused = true;

    // Add Sounds
    bulletSound = game.add.audio('bulletSound');
    bgSound = game.add.audio('bg');
    platformBumpSound = game.add.audio('platformBump');
    platformShotSound = game.add.audio('platformShot');
    alienExplosionSound = game.add.audio('alienExplosion');
    enemyBoom = game.add.audio('expl');
    alertSound = game.add.audio('alert');
    asteroidCrashSound = game.add.audio('asteroidCrash');
    asteroidSound = game.add.audio('asteroidExplosion');
    alienExplosionSound = game.add.audio('alienExplosion');
    bellSound = game.add.audio('bell');
    metroidSound = game.add.audio('metroid');
    loseSound = game.add.audio('lose');
    bgSound.play('', 0, 1, true);
}

function update() {
    
    aliens.setAll('checkWorldBounds', 'true');
    aliens.setAll('outOfBoundsKill', 'true');

    // Collisions
	game.physics.arcade.collide(bullets, asteroids, asteroidExplode, null, this);
    game.physics.arcade.collide(ship, asteroids, checkLives, null, this);
    game.physics.arcade.collide(ship, aliens, checkLives, null, this);
	game.physics.arcade.overlap(ship, beacons, addLives, null, this);
    game.physics.arcade.collide(ship, platforms, bumpPlatform, null, this);
    game.physics.arcade.collide(bullets, platforms, killBulletWithThud, null, this);
    game.physics.arcade.collide(platforms, aliens, releaseAliens, null, this);
    game.physics.arcade.collide(aliens, bullets, killAlien, null, this);


    starfield.tilePosition.y += 0.20;
    starfieldTop.tilePosition.y += 0.30;

    createRandomPlatformWithAliens();
    createRandomAsteroid();
    createRandomBeacon();

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

    if(ship.y >= game.world.height - 260) {
        warningText.text = "WARNING: ACCELERATE SHIP";
        if(game.time.now > alertTimer) {
            alertSound.play();
            alertTimer = game.time.now + 2000;
        }

    } else {
        warningText.text = '';
    }

    if(ship.y >= game.world.height - 150 && safeFlag) {
        gameOver();
        safeFlag = false;
    }

    asteroidReleaseRate *= 1.00005;

}

function render() {

    // game.debug.spriteBounds(aliens);

}

function createText() {
    scoreText = game.add.text(16, 36, "SCORE: 0", {font: '400 24px Audiowide', fill: '#9F9'});
    livesText = game.add.text(620, 36, "LIVES: 3", {font: '400 24px Audiowide', fill: '#9F9'});
}

function gameStartDelay () {
    game.input.onDown.add(unpause, this);
    function unpause () {
        game.paused = false;
        splashScreen.kill();
    }
}

function killBulletWithThud(bullet, platform) {
    bullet.kill();
    platformShotSound.play();
}

function createRandomAsteroid() {

    if(Math.random() < asteroidReleaseRate) {
        // Limit the asteroid generation to once every two seconds
        if(game.time.now > asteroidTime) {
            var asteroid = asteroids.create(Math.random() * 600 + 100, 0, 'asteroid', 1);
            asteroid.body.velocity.setTo(Math.random() * 60 - 30, Math.random() * 30 + 20);
            asteroid.animations.add('spin', [], 10, true);
            asteroid.play('spin');
            asteroidTime = game.time.now + 2000;
        }
    }

}

function createRandomBeacon() {

    if(Math.random() < .0003) {
        var beacon = beacons.create(Math.random() * 700 + 50, 0, 'beacon', 1);
        beacon.body.velocity.setTo(Math.random() * 50 - 30, Math.random() * 30 + 40);
    }
}

function fireBullet() {
    // To prevent bullets from being fired too fast, we set a time limit
    if(game.time.now > bulletTime) {
        // Get the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);
        if(bullet) {
            //And fire it
            bullet.reset(ship.x - 16, ship.y - 30);
            bullet.body.velocity.y = -400;
            bulletSound.play();
            bulletTime = game.time.now + 200;
        }
    }

}

function bumpPlatform(ship, platform) {
    if(game.time.now > bumpTimer) {
        platformShake(platform);
        cameraShake();
        ship.body.velocity.y = 180;
        platform.body.velocity.y = -10;
        platformBumpSound.play();

        bumpTimer = game.time.now + 2000;
    }
}

function releaseAliens(platform, alien) {
    var alienTween = game.add.tween(alien).to({x: game.rnd.integerInRange(0, 800), y:game.rnd.integerInRange(100, 500)}, 1800, "Sine.easeInOut", true, 0, 3, true);
    alien.body.gravity.y = 5;
}

function killAlien(alien, bullet) {
    alien.kill();
    bullet.kill();
    alienExplosion = game.add.sprite(alien.x, alien.y, 'alienExplosion');
    alienExplosion.anchor.setTo(0.5, 0.5);
    alienExplosion.animations.add('alienExplode', [], 40);
    alienExplosion.animations.play('alienExplode');
    alienExplosionSound.play();
    incrementScore(40);

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

function platformShake(platform) {

    var shiftTween = game.add.tween(platform);
    var rockTween = game.add.tween(platform);
    var disappearTween = game.add.tween(platform);

    shiftTween.to({angle: -10}, 10, null, true);
    rockTween.to({angle: 10}, 60, null, false, 0, 6, true);
    disappearTween.to({alpha: .1}, 50);
    shiftTween.chain(rockTween);
    rockTween.chain(disappearTween);
    disappearTween.onComplete.add(function() {
        platform.kill();
    }, this);

}

function cameraShake() {

    game.add.tween(game.camera).to({y: game.camera.y - 20}, 40, null, true, 0, 4, true);

}

function incrementScore(incrementAmount) {
    score += incrementAmount;
    scoreText.text = 'SCORE: ' + score;
}

function addLives(ship, beacon) {
    beacon.kill();
    metroidSound.play();
    lives++;
    livesText.text = "LIVES: " + lives;
}

function checkLives(){
    // to avoid multiple short collisions
    if(game.time.now > livesTimer) {
        hitText.text = 'SHIP DAMAGE!';
        setTimeout(function() {
            hitText.text = '';
        }, 500);
        lives--;
        if(lives > 0) {
            asteroidCrashSound.play();
            livesText.text = "LIVES: " + lives;
            livesTimer = game.time.now + 500;
            cameraShake();
        } else {
            gameOver();
        }
    }
}

function gameOver() {
    bgSound.stop();
    enemyBoom.play();
    livesText.text = "GAME OVER"
    explodeShip = game.add.sprite(ship.x, ship.y, 'shipExplosion');
    explodeShip.anchor.setTo(0.5, 0.5);
    explodeShip.animations.add('anim', [], 30);
    explodeShip.animations.play('anim');
    loseSound.play();
    ship.alive = false;
    ship.kill();
}
