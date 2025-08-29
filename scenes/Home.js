// Home.js
export default class Home extends Phaser.Scene {
    constructor() {
        super('Home');
    }

    preload() {
        this.load.image('homeback', 'assets/back.png');
        this.load.image('heart_start', 'assets/heart_start.png');
        this.load.image('arrow', 'assets/arrow.png');
    }

    create() {
        const { width, height, centerX } = this.cameras.main;

        const background = this.add.image(0, 0, 'homeback')
            .setOrigin(0)
            .setDisplaySize(width, height);

        this.add.dom(this.cameras.main.centerX, 100).createFromHTML(`
        <style>
            .stat-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 250px;
            }

            .stat-box {
            background-color: rgba(192, 160, 255, 0.5);
            border-radius: 40px;
            padding: 20px 40px;
            font-family: 'Arial', sans-serif;
            font-size: 30px;
            font-weight: bold;
            color: #555;
            display: flex;
            align-items: left;
            min-width: 500px;
            height: 50px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .coin-box {
            min-width: 250px;
            align-items: left;
            }
        </style>

        <div class="stat-container">
            <div class="stat-box">나의 최고 기록 : <span id="highscore-text" style="margin-left: 20px; margin-top: 8px">0</span></div>
            <div class="stat-box coin-box">내 코인: <span id="coin-text" style="margin-left: 20px; margin-top: 8px">0</span></div>
        </div>
        `);

    this.time.delayedCall(0, async () => {
        const token = localStorage.getItem('token');
        const highScoreSpan = document.getElementById('highscore-text');
        const coinSpan = document.getElementById('coin-text');

        try {
            const response = await fetch('http://34.169.165.241:8000/game_session/my?domain=game_session', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            });

            if (!response.ok) {
            throw new Error('네트워크 응답 실패');
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
            highScoreSpan.textContent = data[0].user_score; // ✅ 첫 번째 세션 점수
            } else {
            highScoreSpan.textContent = '0'; // 데이터가 없으면 기본값
            }

        } catch (err) {
            console.error('❌ 최고 기록 불러오기 실패:', err);
            highScoreSpan.textContent = '0';
        }

        // 코인값은 필요에 따라 아래 fetch로 따로 연결 가능
        coinSpan.textContent = '50000';  // 예시
    });



        //하트버튼
        this.add.dom(centerX - 250, 450).createFromHTML(`
            <style>
                .heart-button {
                    width: 500px;
                    height: 500px;
                    background-image: url('assets/heart_start.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    cursor: pointer;
                    animation: floatUpDown 2s ease-in-out infinite;
                    transition: transform 0.25s ease;
                }

                .heart-button:hover {
                    transform: scale(1.05);
                }

                @keyframes floatUpDown {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(10px);
                    }
                }
            </style>

            <div id="heart-btn" class="heart-button"></div>
        `);

        this.time.delayedCall(0, () => {
            const heartBtn = document.getElementById('heart-btn');
            if (heartBtn) {
                heartBtn.addEventListener('click', () => {
                    this.scene.start('WormStart');
                });
            }
        });


        // 뒤로가기 버튼
        const backButton = this.add.image(50, height - 60, 'arrow')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('Start');
            });
    }
}
