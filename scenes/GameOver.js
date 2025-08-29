// scenes/GameOver.js
export default class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
        this.load.image('background', 'assets/back.png');
        this.load.image('trophy', 'assets/trophy.png');
    }

    create(data) {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const score = data?.score ?? 0;  // 전달받은 점수

        // 배경
        this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(width, height)
            .setDepth(0);

        this.add.dom(centerX+350, 130).createFromHTML(`
        <style>
            .score-title-container {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 60px;
            transform: translateX(-50%);
            animation: floatUpDown 2.5s ease-in-out infinite;
            }

            .score-title-text {
            font-size: 80px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            color: white;
            }

            .trophy-img {
            width: 150px;
            height: 150px;
            }

            @keyframes floatUpDown {
                0%, 100% {
                transform: translateX(-50%) translateY(0px);
                }
                50% {
                transform: translateX(-50%) translateY(-10px);
                }
            }
        </style>

        <div class="score-title-container">
            <img class="trophy-img" src="assets/trophy.png" />
            <div class="score-title-text">SCORE</div>
            <img class="trophy-img" src="assets/trophy.png" />
        </div>
        `);
        
        //랭킹보이게하는부분
        this.add.dom(centerX, height * 0.35-20).createFromHTML(`
            <style>
                .rank-box {
                    width: 800px;
                    height: 80px;
                    background-color: rgba(216, 176, 247, 0.6);
                    border-radius: 30px;
                    font-size: 35px;
                    font-weight: bold
                    font-family: Arial, sans-serif;
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 4px 12px rgb(255, 255, 255);
                }
            </style>
            <div class="rank-box" id="rank-text">당신의 점수는?...</div>
        `);

        this.time.delayedCall(1000, () => {
            const rankElement = document.getElementById('rank-text');
            if (rankElement) {
            rankElement.textContent = `SCORE : ${score}`;
            }
        });

        this.add.dom(centerX, height * 0.65+30).createFromHTML(`
            <style>
                .button-container {
                    display: flex;
                    justify-content: center;
                    gap: 100px;
                }

                .game-button {
                    width: 350px;
                    height: 390px;
                    background-color: rgba(216, 176, 247, 0.6);
                    border-radius: 30px;
                    font-size: 50px;
                    font-family: Arial, sans-serif;
                    font-weight: bold;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .game-button:hover {
                    transform: translateY(5px);
                    box-shadow: 0 8px 20px rgba(255,255,255,0.3);
                }
            </style>

            <div class="button-container">
                <div id="exit-btn" class="game-button">나가기</div>
                <div id="restart-btn" class="game-button">재시작</div>
            </div>
        `);

        this.time.delayedCall(0, () => {
            const exitBtn = document.getElementById('exit-btn');
            const restartBtn = document.getElementById('restart-btn');

            if (exitBtn) {
                exitBtn.addEventListener('click', () => {
                    this.scene.start('Start');
                });
            }

            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    this.scene.start('Home'); 
                });
            }
        });


    }
}
