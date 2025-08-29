// scenes/MyInfo.js
export default class MyInfo extends Phaser.Scene {
    constructor() {
        super('MyInfo');
    }

    preload() {
        this.load.image('info_bg', 'assets/back.png');
        this.load.image('trophy', 'assets/trophy.png');
        this.load.image('coin2', 'assets/coin2.png');
        this.load.image('character', 'assets/character.png');
        this.load.image('arrow', 'assets/arrow.png');
    }

    create(data) {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        const token = localStorage.getItem('token');
        const currentUser = localStorage.getItem('currentUser');
        let profileSrc = currentUser ? localStorage.getItem(`profile_${currentUser}`) : null;

        // 로그인 안 했으면 프로필 이미지 제거
        if (!token) {
            profileSrc = '';
        }

        const showAlertPopup = (title, message, onConfirm = null) => {
            const popup = document.createElement('div');
            popup.id = 'alert-popup';
            popup.innerHTML = `
                <style>
                    #alert-popup {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: #fbefff;
                        padding: 30px 50px;
                        border-radius: 25px;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        z-index: 1000;
                        box-shadow: 0 0 20px rgba(0,0,0,0.4);
                    }

                    #alert-popup h2 {
                        font-size: 36px;
                        font-weight: bold;
                        color: #6b4c9a;
                        margin-bottom: 10px;
                    }

                    #alert-popup p {
                        font-size: 22px;
                        margin: 20px 0;
                        color: #444;
                    }

                    .btn-group {
                        display: flex;
                        justify-content: center;
                        margin-top: 20px;
                    }

                    .confirm-btn {
                        font-size: 20px;
                        padding: 10px 24px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: bold;
                        background-color: #b493d6;
                        color: white;
                        border: none;
                        transition: transform 0.2s ease, background-color 0.2s ease;
                    }

                    .confirm-btn:hover {
                        transform: scale(1.08);
                        background-color: #9f7bc7;
                    }
                </style>
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="btn-group">
                    <button class="confirm-btn">확인</button>
                </div>
            `;

            document.body.appendChild(popup);
            popup.querySelector('.confirm-btn').addEventListener('click', () => {
                popup.remove();
                if (onConfirm) onConfirm();
            });
        };



        // 배경
        this.add.image(0, 0, 'info_bg')
            .setOrigin(0)
            .setDisplaySize(width, height);

        // 프로필 영역
        const profileY = 130;
        this.add.dom(centerX, profileY).createFromHTML(`
        <style>
            .profile-circle {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background-color:rgb(255, 229, 233);
            border: 4px solid #caa8f5;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
            transition: transform 0.3s ease, border-color 0.3s ease;
            }

            .profile-circle:hover {
            transform: scale(1.08);
            border-color: white;
            }

            .profile-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            }
        </style>

        <div class="profile-circle">${profileSrc ? `<img src="${profileSrc}" />` : ''}</div>
        `);


        this.add.dom(centerX + 80, profileY + 50).createFromHTML(`
            <style>
                .emoji-btn {
                    width: 60px;
                    height: 60px;
                    background-color: #f6cce6;
                    border: 3px solid #caa8f5;
                    border-radius: 40%;
                    font-size: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .emoji-btn:hover {
                    transform: scale(1.1);
                    border-color: white;
                }
            </style>

            <button class="emoji-btn">😊</button>
        `);

        this.time.delayedCall(0, () => {
            const emojiBtn = document.querySelector('.emoji-btn');
            if (emojiBtn) {
                emojiBtn.addEventListener('click', () => {
                    const token = localStorage.getItem('token');
                    if (token) {
                        this.scene.start('ProfileChange');
                    } else {
                        showAlertPopup("로그인 필요", "로그인 후 이용해주세요.");
                    }
                });
            }
        });


        // HTML로 카드 UI 생성
        this.add.dom(centerX, centerY + 50).createFromHTML(`
        <style>
            .card-container {
            display: flex;
            justify-content: center;
            gap: 80px;
            }

            .card-button {
            width: 300px;
            height: 350px;
            border-radius: 40px;
            background-color: rgba(220, 206, 255, 0.6);
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .card-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px white;
            }

            .card-button img {
            width: 150px;
            height: 150px;
            object-fit: contain;
            margin-bottom: 20px;
            }

            .card-button span {
            font-size: 28px;
            font-weight: bold;
            color: white;
            }
        </style>

        <div class="card-container">
            <div class="card-button" id="score-btn">
            <img src="assets/trophy.png" />
            <span>내 전적</span>
            </div>
            <div class="card-button" id="coin-btn">
            <img src="assets/coin2.png" />
            <span>지렁이 스킨 샵</span>
            </div>
            <div class="card-button" id="pw-btn">
            <img src="assets/character.png" />
            <span>비밀번호 변경</span>
            </div>
        </div>
        `);

        this.time.delayedCall(0, () => {
        const scoreBtn = document.getElementById('score-btn');
        const coinBtn = document.getElementById('coin-btn');
        const pwBtn = document.getElementById('pw-btn');

        if (scoreBtn) {
            scoreBtn.addEventListener('click', () => {
                const token = localStorage.getItem('token');
                if (token) {
                    this.scene.start('MyScore');
                } else {
                    showAlertPopup("로그인 필요", "로그인 후 이용해주세요.");
                }
            });
        }

        if (coinBtn) {
            coinBtn.addEventListener('click', () => {
            console.log('[DEBUG] 내 코인 클릭됨');
            this.scene.start('CoinShop');
            });
        }

        if (pwBtn) {
            pwBtn.addEventListener('click', () => {
            this.scene.start('ChangePW');
            });
        }
        });


        // 돌아가기 버튼
        this.add.image(60, height - 60, 'arrow')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                console.log('Back Button Clicked');
                this.scene.start('Start');
            });
    }
}
