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
    game.load.spritesheet('baddie3', 'pinkEnemy.png', 51, 51); 
    game.load.spritesheet('asteroid', 'assets/asteroid.png', 36, 36);
    game.load.spritesheet('ship', 'assets/ship_sprites.png', 45, 52);
    game.load.spritesheet('shipExplosion', 'assets/explosion.png', 100, 100);
    game.load.audio('bg', 'assets/bg.mp3');
    game.load.audio('bulletSound', 'assets/bulletSound.mp3');

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
    platforms.setAll('outOfBoundsKill', true);
    platforms.setAll('checkWorldBounds', true);  

    pOne = platforms.create(200, 200, 'platform');
    pOne.body.immovable = true;
    pOne.body.collideWorldBounds = true;
    //pOne.body.gravity.y = 10;
    
    badies = game.add.group();
    badies.enableBody = true;
    badies.physicsBodyType = Phaser.Physics.ARCADE;
    
    badies.setAll('anchor.x', 0.5);
    badies.setAll('anchor.y', 0.5);
    badies.setAll('outOfBoundsKill', true);
    badies.setAll('checkWorldBounds', true);
    
    bad1 = badies.create(pOne.x, pOne.y - 45, 'baddie1');
    
    
    pOne.body.bounce.set(1);
    
    ship.body.bounce.set(1);
    
    
    
    dangerZone = game.add.sprite(0, game.height - 50, 'dangerZone');

    // Game controls
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    warningText = game.add.text(16, 56, '', {font: '400 20px Audiowide', fill: '#F33', align: 'center'});

    bulletSound = game.add.audio('bulletSound');
    bgSound = game.add.audio('bg');
    bgSound.play('', 0, 1, true);
}

function update() {
    
    game.physics.arcade.collide(ship, platforms, baddieRelease, null, this);


    starfield.tilePosition.y += 0.4;

    createRandomAsteroid();
    
    //creatRandomPlatform();

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

function creatRandomPlatform() {

    if(Math.random() < .001) {
        var platform = platforms.create(Math.random() * 600 + 100, 0, 'platform', 1);
        platform.body.velocity.setTo(0, Math.random() * 30 + 20);
        platform.body.immovable = true;
        platform.body.bounce.y = 0.7;
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
    
        var tween = game.add.tween(bad1).to({x: bad1.x - 150}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);
    
}

function gameOver() {
    ship.alive = false;
    ship.destroy();
    explodeShip = game.add.sprite(ship.x, ship.y, 'shipExplosion');
    explodeShip.anchor.setTo(0.5, 0.5);
    explodeShip.animations.add('anim', [], 30);
    explodeShip.animations.play('anim');
}
