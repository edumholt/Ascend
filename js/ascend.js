var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var bgSound,
    cursors,
    dangerZone,
    explode,
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
    game.load.spritesheet('ship', 'assets/ship_sprites.png', 45, 52);
    game.load.spritesheet('explosion', 'assets/explosion.png', 100, 100);
    game.load.audio('bg', 'assets/bg.mp3');

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
    ship.anchor.x = ship.anchor.y = 0.5;

    ship.animations.add('rotate', [], 30, true);

    dangerZone = game.add.sprite(0, game.height - 50, 'dangerZone');

    cursors = game.input.keyboard.createCursorKeys();

    warningText = game.add.text(16, 40, '', {font: '400 20px Audiowide', fill: '#F33', align: 'center'});

    bgSound = game.add.audio('bg');
    bgSound.play('', 0, 1, true);
}

function update() {

    starfield.tilePosition.y += 0.4;

    if(!(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown)) {
        ship.animations.stop();
    }

    if(ship.alive){
        ship.body.velocity.x = 0;

        if(cursors.left.isDown) {
            ship.body.velocity.x = -100;
            ship.animations.play('rotate');
        } else if(cursors.right.isDown) {
            ship.body.velocity.x = 100;
            ship.animations.play('rotate');
        }

        if(cursors.up.isDown) {
            ship.body.velocity.y = -70;
            ship.animations.play('rotate');
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

    if(!ship.alive) {
        explode.animations.play('anim');
    }
}

function createText() {
    scoreText = game.add.text(16, 16, "SCORE: 0", {font: '400 24px Audiowide', fill: '#9F9'});
}

function gameOver() {

    ship.alive = false;
    ship.destroy();
    explode = game.add.sprite(ship.x, ship.y, 'explosion');
    explode.anchor.x = explode.anchor.y = 0.5;
    explode.animations.add('anim', [], 30, false);
}
