function ascendLoad() {
    game.load.path = 'assets/';

    game.load.image('starfield');
    game.load.image('DoNotEnter');
    game.load.image('bullet');
    game.load.image('platform');
    game.load.image('andriodShip');
    game.load.image('alien3');
    game.load.image('spaceShip');
    game.load.image('splashScreen');
    game.load.spritesheet('asteroid', 'asteroid.png', 36, 36);
    game.load.spritesheet('beacon', 'beacon.png', 36, 21);
    game.load.spritesheet('ship', 'ship_sprites.png', 45, 52);
    game.load.spritesheet('shipExplosion', 'explosion.png', 100, 100);
    game.load.spritesheet('asteroidExplosion', 'asteroidExplosion.png', 64, 64);
    game.load.audio('bg', 'bg.mp3');
    game.load.audio('bulletSound', 'bulletSound.mp3');
    game.load.audio('platformHit', 'platformHit.mp3');
    game.load.audio('platformShot', 'platformShot.mp3');
    game.load.audio('expl', 'expl.mp3');
    game.load.audio('alert', 'intruderAlert.mp3');
    game.load.audio('asteroidCrash', 'asteroidCrash.mp3');
    game.load.audio('asteroidExplosion', 'asteroidExplosion.mp3');
    game.load.audio('alienExplosion', 'explosion_with_debris.mp3');
    game.load.audio('metroid', 'metroid.mp3');
    game.load.audio('lose', 'youLose.mp3');
}
