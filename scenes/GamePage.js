export default class GamePage extends Phaser.Scene {
    constructor() {
        super('GamePage');
    }

    preload() {
        this.load.image('back', 'assets/back.png');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
    
        // 배경
        this.add.image(0, 0, 'back')
            .setOrigin(0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

                // HTML 버튼 DOM
        this.add.dom(centerX, centerY + 100).createFromHTML(`
            <style>
                .menu-button {
                    width: 300px;
                    padding: 15px;
                    margin: 15px auto;
                    font-size: 24px;
                    font-family: Arial, sans-serif;
                    color: white;
                    background-color: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: center;
                    backdrop-filter: blur(5px);
                }

                .menu-button:hover {
                    background-color: rgba(255, 255, 255, 0.4);
                    color: #b35481;
                    transform: scale(1.05);
                    border-color: #b35481;
                }
            </style>

            <div style="display: flex; flex-direction: column; align-items: center;">
                <button id="testBtn" class="menu-button">test</button>
            </div>
        `);

        this.time.delayedCall(0, () => {
            document.getElementById('testBtn').addEventListener('click', () => {
                this.scene.start('GameOver');
            });
        });
    }
}