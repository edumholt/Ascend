function createGameSprites() {

    // Create bullets group
    bullets = game.add.physicsGroup();
    bullets.createMultiple(300, 'bullet');
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // Create asteroids group
    asteroids = game.add.physicsGroup();

    // Create beacons group
    beacons = game.add.physicsGroup();

    platforms = game.add.physicsGroup();

    // Create a group to hold all aliens
    aliens = game.add.physicsGroup();

    dangerZone = game.add.sprite(0, game.height - 150, 'DoNotEnter');

}
