export default class RankBoard extends Phaser.Scene {
    constructor() {
        super('RankBoard');
    }

    preload() {
        this.load.image('background', 'assets/back.png');
    }

    create() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // 배경
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(width, height);

        // 회색 박스 (전체 영역)
        const boardWidth = width * 0.9;
        const boardHeight = height * 0.8;
        const boardX = centerX;
        const boardY = centerY;

        this.add.rectangle(boardX, boardY, boardWidth, boardHeight, 0xdddddd).setOrigin(0.5);



         // 게임 오버 버튼 추가
        const gameOverButton = this.add.rectangle(centerX, height - 100, 200, 80, 0xd8b0f7, 0.8)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.add.text(centerX, height - 100, '게임 오버', {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        gameOverButton.on('pointerdown', () => {
            console.log('게임 오버 버튼 클릭 → GameOver 씬 이동');
            this.scene.start('GameOver');
        });

        // 뒤로가기 버튼
        this.add.image(60, height - 60, 'arrow')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('Home');
            });
    }
}
