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
	numEnemies = 2,
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
	
	platformCreate(); 

    // Create baddies group
    baddies1 = game.add.group();
    baddies1.enableBody = true;
    baddies1.physicsBodyType = Phaser.Physics.ARCADE;
    
    baddies1.setAll('anchor.x', 0.5);
    baddies1.setAll('anchor.y', 0.5);
    baddies1.setAll('checkWorldBounds', true);
    baddies1.setAll('outOfBoundsKill', true);
	
	baddies2 = game.add.group();
    baddies2.enableBody = true;
    baddies2.physicsBodyType = Phaser.Physics.ARCADE;
    
    baddies2.setAll('anchor.x', 0.5);
    baddies2.setAll('anchor.y', 0.5);
    baddies2.setAll('checkWorldBounds', true);
    baddies2.setAll('outOfBoundsKill', true);
	
	baddies3 = game.add.group();
    baddies3.enableBody = true;
    baddies3.physicsBodyType = Phaser.Physics.ARCADE;
    
    baddies3.setAll('anchor.x', 0.5);
    baddies3.setAll('anchor.y', 0.5);
    baddies3.setAll('checkWorldBounds', true);
    baddies3.setAll('outOfBoundsKill', true);
	
	createBaddies();
    
    dangerZone = game.add.sprite(0, game.height - 50, 'dangerZone');
	
	// Create a pool of explosions
    explosions = game.add.group();
    explosions.createMultiple(300, 'shipExplosion');
	
	explosions.forEach(setupBaddie, this);

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

function platformCreate() {
	
	platformOne = platforms.create(50, 1, 'platform');
    platformOne.body.immovable = true;
    platformOne.body.velocity.y = 30;
    
    platformTwo = platforms.create(500, -45, 'platform');
    platformTwo.body.immovable = true;
    platformTwo.body.velocity.y = 30;
	
	platformThree = platforms.create(275, -250, 'platform');
    platformThree.body.immovable = true;
    platformThree.body.velocity.y = 30;
}

function createBaddies() {
	for (var i = 0; i < numEnemies; i++) {
		
		badGuy1 = baddies1.create(platformOne.x + i * 175, platformOne.y - 45, 'baddie1');
    	badGuy1.body.velocity.y = 30;
		
		badGuy2 = baddies2.create(platformTwo.x + i * 200, platformTwo.y - 65, 'baddie2');
    	badGuy2.body.velocity.y = 30;
		
		badGuy3 = baddies3.create(platformThree.x + i * 175, platformThree.y - 45, 'baddie3');
    	badGuy3.body.velocity.y = 30;	
		
	}
}

function setupBaddie(baddieExplosion) {
    
    baddieExplosion.anchor.setTo(0.5, 0.5);
    baddieExplosion.animations.add('kaboomExplosion');
	
}
	
function update() {
    
    // Collisions
    game.physics.arcade.collide(ship, platformOne, baddieRelease, null, this);
    game.physics.arcade.collide(ship, platformTwo, baddieRelease2, null, this);
    game.physics.arcade.collide(ship, platformThree, baddieRelease3, null, this);
    game.physics.arcade.collide(baddies1, platforms);
    game.physics.arcade.collide(baddies2, platforms);
    game.physics.arcade.collide(baddies3, platforms);
    game.physics.arcade.collide(bullets, platforms, platformShot, null, this);
    
	// Collisions to kill enemies
	// still working on fixing this so its less code
	game.physics.arcade.collide(bullets, baddies1, baddieOneKill, null, this);
    game.physics.arcade.collide(bullets, baddies2, baddieTwoKill, null, this);
    game.physics.arcade.collide(bullets, baddies3, baddieThreeKill, null, this);    ;
   
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
    
   // Revive Platforms and enemies after they are gone
	
	
    if(!baddies1.countLiving() && !baddies2.countLiving() && !baddies3.countLiving()) {
        
        game.tweens.removeAll();
		
		// Bring back platformOne with its baddies
		
		platformCreate();
		
		createBaddies();
    }
    
/*	if(platformOne.y >= game.world.height - 50 ) {
    	platformOne.kill();
   }
	
	if(platformTwo.y >= game.world.height - 50 ) {
        platformTwo.kill();
    }
	
	if(platformThree.y >= game.world.height - 50 ) {
        platformThree.kill();
    }
	
    if(badGuy1.y >= game.world.height - 50 ) {
        badGuy1.kill();
    }
	
	if(badGuy2.y >= game.world.height - 50 ) {
        badGuy2.kill();
    }
	
	if(badGuy3.y >= game.world.height - 50 ) {
        badGuy3.kill();
    }*/

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

// Have baddies become active once platform is collided with
// And play sound for platform and ship collision
function baddieRelease() {
	platformOne.kill();
    badGuy1.body.velocity.y = 5;

    tween1 = game.add.tween(baddies1).to({x: 200}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);

    platformCrashSound.play(); 
}

function baddieRelease2() {
	platformTwo.kill();
    badGuy2.body.velocity.y = 5;

    tween2 = game.add.tween(baddies2).to({x: -250}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);

    platformCrashSound.play(); 
}

function baddieRelease3() {
	platformThree.kill();
	
    badGuy3.body.velocity.y = 5;
    
    tween3 = game.add.tween(baddies3).to({x: -75}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
	
    platformCrashSound.play();
}

// Kill baddies after collision with bullets
function baddieOneKill(bullet, badGuy1) {
    badGuy1.kill();
    bullet.kill();
	
	explosion = explosions.getFirstExists(false);
	explosion.reset(badGuy1.body.x, badGuy1.y);
	explosion.play('kaboomExplosion', 30, false, true);
	
	 incrementScore(30);
}

function baddieTwoKill(bullet, badGuy2) {
    badGuy2.kill();
    bullet.kill();
	
	explosion = explosions.getFirstExists(false);
	explosion.reset(badGuy2.body.x, badGuy2.y);
	explosion.play('kaboomExplosion', 30, false, true);
	
	 incrementScore(30);
}

function baddieThreeKill(bullet, badGuy3) {
    badGuy3.kill();
    bullet.kill();
	
	explosion = explosions.getFirstExists(false);
	explosion.reset(badGuy3.body.x, badGuy3.y);
	explosion.play('kaboomExplosion', 30, false, true);
	
	 incrementScore(30);
}

// function to shorten enemy eplosion code
function enemyExplosionAnim() {
	
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
