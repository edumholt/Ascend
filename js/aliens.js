function createRandomPlatformWithAliens() {

    if(game.time.now > platformReleaseTime) {
        var platform = platforms.create(Math.random() * 550 + 120, 0, 'platform');
        platform.anchor.setTo(0.5, 0.5);
        platform.body.velocity.setTo(0, 30);
        platform.body.immovable = true;
        platformReleaseTime = game.time.now + 10000;
        createAliensOnPlatform(platform);
    }

}

function createAliensOnPlatform(platform) {

    var leftAlien, rightAlien;

    var whichAlien = Math.floor(Math.random() * 3 + 1);

    // Create left alien
    switch(whichAlien) {
        case 1:
            leftAlien = game.add.sprite(platform.x - 90, platform.y - 40, 'alien1');
            break;
        case 2:
            leftAlien = game.add.sprite(platform.x - 90, platform.y - 40, 'alien2');
            break;
        case 3:
            leftAlien = game.add.sprite(platform.x - 90, platform.y - 40, 'alien3');
            break;
    }

    game.physics.enable(leftAlien);
    leftAlien.anchor.setTo(0.5, 0.5);
    leftAlien.body.velocity.setTo(0, 30);
    console.log("Left alien touching = " + leftAlien.body.touching.down);
    whichAlien = Math.floor(Math.random() * 3 + 1);

    // Create right alien
    switch(whichAlien) {
        case 1:
            rightAlien = game.add.sprite(platform.x + 90, platform.y - 40, 'alien1');
            break;
        case 2:
            rightAlien = game.add.sprite(platform.x + 90, platform.y - 40, 'alien2');
            break;
        case 3:
            rightAlien = game.add.sprite(platform.x + 90, platform.y - 40, 'alien3');
            break;
    }

    game.physics.enable(rightAlien);
    rightAlien.anchor.setTo(0.5, 0.5);
    rightAlien.body.velocity.setTo(0, 30);
}
