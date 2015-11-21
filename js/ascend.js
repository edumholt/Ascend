var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var cursors,
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
    game.load.spritesheet('ship', 'assets/ship_sprites.png', 45, 52);

    // Load Google web font 'Audiowide'
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

}

function create() {

    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    ship = game.add.sprite(400, 400, 'ship');
    game.physics.arcade.enable(ship);
    ship.body.gravity.y = 140;
    ship.body.collideWorldBounds = true;
    ship.anchor.x = ship.anchor.y = 0.5;

    ship.animations.add('left', [3, 2, 1, 0], 8, true);
    ship.animations.add('right', [0, 1, 2, 3], 8, true);

    cursors = game.input.keyboard.createCursorKeys();

    warningText = game.add.text(16, game.world.height - 40, '', {font: '400 18px Audiowide', fill: '#F33', align: 'center'});
}

function update() {

    starfield.tilePosition.y += 0.4;

    ship.body.velocity.x = 0;

    if(cursors.left.isDown) {
        ship.body.velocity.x = -100;
        ship.animations.play('left');
    } else if(cursors.right.isDown) {
        ship.body.velocity.x = 100;
        ship.animations.play('right');
    } else {
        ship.animations.stop();
        ship.frame = 2;
    }

    if(cursors.up.isDown) {
        ship.body.velocity.y = -70;
        ship.frame = 1;
    }

    if(ship.y >= game.world.height - 80) {
        warningText.text = "WARNING: ACCELERATE SHIP";
    } else {
        warningText.text = '';
    }


    if(ship.y >= game.world.height - 30 ) {
        ship.destroy();
    }

}

function createText() {
    scoreText = game.add.text(16, 16, "SCORE: 0", {font: '400 24px Audiowide', fill: '#9F9'});
}

