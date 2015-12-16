function createGameSprites() {

    // Create bullets group
    bullets = game.add.physicsGroup();
    setupGroupDefaults(bullets);
    bullets.createMultiple(300, 'bullet');
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // Create asteroids group
    asteroids = game.add.physicsGroup();

    // Create beacons group
    beacons = game.add.physicsGroup();

    platforms = game.add.physicsGroup();

    // Create a group to hold all aliens
    aliensGroup = game.add.physicsGroup();

    dangerZone = game.add.sprite(0, game.height - 30, 'DoNotEnter');

}

function setupGroupDefaults (groupName) {

    groupName.enableBody = true;
    groupName.physicsBodyType = Phaser.Physics.ARCADE;


}
