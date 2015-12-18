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
    var leftAlienTween, rightAlienTween;
    // TODO Create these tweens, then create collisions to trigger them

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
            leftAlien = game.add.sprite(platform.x - 90, platform.y - 50, 'alien3');
            break;
    }

    leftAlien.anchor.setTo(0.5, 0.5);
    aliens.add(leftAlien);
    leftAlien.body.velocity.setTo(0, 30);

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
            rightAlien = game.add.sprite(platform.x + 90, platform.y - 50, 'alien3');
            break;
    }

    rightAlien.anchor.setTo(0.5, 0.5);
    aliens.add(rightAlien);
    rightAlien.body.velocity.setTo(0, 30);
}
