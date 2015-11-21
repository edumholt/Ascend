var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var starfield;

function preload() {

    game.load.image('starfield', 'assets/starfield.png');


}

function create() {

    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

}

function update() {

    starfield.tilePosition.y += 0.6;

}
