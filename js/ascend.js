var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var cursors,
    starfield,
    ship;

function preload() {

    game.load.image('starfield', 'assets/starfield.png');
    game.load.spritesheet('ship', 'assets/ship_sprites.png', 45, 52);

}

function create() {

    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    ship = game.add.sprite(400, 400, 'ship');
    game.physics.arcade.enable(ship);
    ship.body.gravity.y = 120;
    ship.body.collideWorldBounds = true;

    ship.animations.add('left', [3, 2, 1, 0], 8, true);
    ship.animations.add('right', [0, 1, 2, 3], 8, true);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    starfield.tilePosition.y += 0.6;

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

}
