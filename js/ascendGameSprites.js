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
    aliensGroupOne.setAll('anchor.x', 0.5);
    aliensGroupOne.setAll('anchor.y', 0.5);

    aliensGroupTwo = game.add.group();
    setupGroupDefaults(aliensGroupTwo);
    aliensGroupTwo.createMultiple(50, 'alien2');
    aliensGroupTwo.setAll('anchor.x', 0.5);
    aliensGroupTwo.setAll('anchor.y', 0.5);

    aliensGroupThree = game.add.group();
    setupGroupDefaults(aliensGroupThree);
    aliensGroupThree.createMultiple(50, 'alien3');
    aliensGroupThree.setAll('anchor.x', 0.5);
    aliensGroupThree.setAll('anchor.y', 0.5);

    dangerZone = game.add.sprite(0, game.height - 30, 'DoNotEnter');

}
