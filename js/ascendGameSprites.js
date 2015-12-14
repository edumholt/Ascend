function createGameSprites() {

    // Create bullets group
    bullets = game.add.group();
    setupGroupDefaults(bullets);
    bullets.createMultiple(300, 'bullet');

    // Create asteroids group
    asteroids = game.add.group();
    setupGroupDefaults(asteroids);

    // Create beacons group
    beacons = game.add.group();
    setupGroupDefaults(beacons);

    // Create platforms group
    platforms = game.add.group();
    setupGroupDefaults(platforms);
    platforms.createMultiple(300, 'platform');

    // Create three aliens groups
    aliensGroupOne = game.add.group();
    setupGroupDefaults(aliensGroupOne);
    aliensGroupOne.createMultiple(50, 'alien1');
    setAnchorPointsToCenter(aliensGroupOne);

    aliensGroupTwo = game.add.group();
    setupGroupDefaults(aliensGroupTwo);
    aliensGroupTwo.createMultiple(50, 'alien2');
    setAnchorPointsToCenter(aliensGroupTwo);

    aliensGroupThree = game.add.group();
    setupGroupDefaults(aliensGroupThree);
    aliensGroupThree.createMultiple(50, 'alien3');
    setAnchorPointsToCenter(aliensGroupThree);

    dangerZone = game.add.sprite(0, game.height - 30, 'DoNotEnter');

}

function setupGroupDefaults (groupName) {

    groupName.enableBody = true;
    groupName.physicsBodyType = Phaser.Physics.ARCADE;
    groupName.setAll('outOfBoundsKill', true);
    groupName.setAll('checkWorldBounds', true);

}

function setAnchorPointsToCenter(groupName) {

    groupName.setAll('anchor.x', 0.5);
    groupName.setAll('anchor.y', 0.5);

}
