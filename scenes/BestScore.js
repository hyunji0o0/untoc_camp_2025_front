export default class BestScore extends Phaser.Scene {
    constructor() {
        super('BestScore');
    }
    preload() {
        this.load.image('info_bg', 'assets/back.png');
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('trophy', 'assets/trophy.png');
    }
    create() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;

        // 배경이다
        this.add.image(0, 0, 'info_bg').setOrigin(0).setDisplaySize(width, height);

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
            <div class="score-title-text">TOP 3</div>
            <img class="trophy-img" src="assets/trophy.png" />
        </div>
        `);

        this.add.dom(centerX+500, 250).createFromHTML(`
        <style>
            .top-score-bar {
            width: 1000px;
            height: 50px;
            background-color: rgba(220, 206, 255, 0.8);
            border: 2px solid rgba(187, 166, 242, 0.3);
            display: flex;
            align-items: center;
            justify-content: left;
            padding-left: 40px;
            font-family: Arial, sans-serif;
            font-size: 28px;
            color: white;
            border-radius: 6px;
            box-sizing: border-box;
            transform: translateX(-50%);
            }
        </style>
        <div class="top-score-bar" id="best-score-bar">나의 최고 기록 : 계산 중...</div>
        `);

        this.add.dom(centerX + 500, 450).createFromHTML(`
        <style>
            .scroll-container {
            width: 1000px;
            height: 320px;
            background-color: rgba(220, 206, 255, 0.8);
            border: 2px solid rgba(187, 166, 242, 0.3);
            overflow-y: auto;
            border-radius: 10px;
            padding: 20px 10px;
            box-sizing: border-box;
            position: relative;
            transform: translateX(-50%);
            }

            .scroll-container::-webkit-scrollbar {
            display: none;
            }

            .score-item {
            width: 95%;
            height: 60px;
            background-color: white;
            margin: 10px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-family: Arial, sans-serif;
            border: 1px solid #999;
            border-radius: 8px;
            }
        </style>

        <div class="scroll-container"></div>
        `);

        this.add.dom(centerX + 500, height - 120).createFromHTML(`
        <style>
            .honor-button {
            width: 1000px;
            height: 60px;
            background-color: rgba(187, 166, 242, 0.6);
            border-radius: 30px;
            font-size: 30px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            transform: translateX(-50%);
            }

            .honor-button:hover {
            transform: translate(-50%, 5px);
            box-shadow: 0 4px 10px rgba(255, 255, 255, 0.3);
            }
        </style>

        <div class="honor-button" id="honor-html-button">REVENGE?</div>
        `);


        //점수 백엔드에서 불러오기 : top3
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch('http://34.169.165.241:8000/leader_board/top');
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);

                const data = await response.json(); // ← 유저 정보 배열
                const scrollContainer = document.querySelector('.scroll-container');
                scrollContainer.innerHTML = ''; // 기존 가짜 데이터 제거

                data.forEach((entry, index) => {
                    const item = document.createElement('div');
                    item.className = 'score-item';
                    item.textContent = `${index + 1}위 - ${entry.user_name} : ${entry.user_score}점`;
                    scrollContainer.appendChild(item);
                });

                const bestScoreBar = document.getElementById('best-score-bar');
                if (bestScoreBar && data.length > 0) {
                    bestScoreBar.innerText = `최고의 지주(지렁이 주인) : ${data[0].user_name} (${data[0].user_score}점)`;
                }

            } catch (error) {
                console.error('리더보드 가져오기 실패:', error);
                alert("서버에서 점수 정보를 불러오지 못했습니다.");
            }
        };

        fetchLeaderboard();

        //revenge 버튼 부분
        this.time.delayedCall(0, () => {
            const honorBtn = document.getElementById('honor-html-button');
            if (honorBtn) {
                honorBtn.addEventListener('click', () => {
                    this.scene.start('Home');
                });
            }
        });

        // 뒤로가기 버튼
        this.add.image(60, height - 60, 'arrow')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MyInfo');
            });
    
    }
}


