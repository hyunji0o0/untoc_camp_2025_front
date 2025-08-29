// Start.js
export default class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('back', 'assets/back.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('heart', 'assets/heart.png');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // 배경
        this.add.image(0, 0, 'back')
            .setOrigin(0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Title 이미지
        const titleImage = this.add.image(centerX, centerY - 130, 'title').setOrigin(0.5).setScale(1.0);
        this.tweens.add({
            targets: titleImage,
            y: titleImage.y + 30,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 두근두근 이미지
        const heartImage = this.add.image(centerX, titleImage.y - 180, 'heart').setOrigin(0.5).setScale(0.65);
        this.tweens.add({
            targets: heartImage,
            y: heartImage.y + 30,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

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
                        gap: 20px;
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

        // 버튼 DOM 생성
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
                <button id="startBtn" class="menu-button">START</button>
                <button id="loginBtn" class="menu-button">LOGIN</button>
                <button id="mypageBtn" class="menu-button">MYPAGE</button>
            </div>
        `);

        this.time.delayedCall(0, async () => {
            const loginBtn = document.getElementById('loginBtn');
            const token = localStorage.getItem('token');

            // 로그인 상태 확인
            if (token) {
                try {
                    const res = await fetch("http://34.169.165.241:8000/user/me", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        loginBtn.textContent = 'LOGOUT';
                        loginBtn.onclick = () => {
                            localStorage.removeItem('token');
                            showAlertPopup("LOGOUT", "로그아웃 되었습니다.");
                            this.scene.restart();
                        };

                        // user_name 가져와서 좌측 하단에 출력
                        const userData = await res.json();
                        const userName = userData.user_name || '';

                        const userText = this.add.dom(20, this.cameras.main.height - 50).createFromHTML(`
                            <div style="
                                color: white;
                                font-size: 20px;
                                font-weight: bold;
                                background-color: rgba(252, 168, 255, 0.3);
                                padding: 8px 16px;
                                border-radius: 16px;
                                font-family: Arial, sans-serif;
                                pointer-events: none;">
                                ${userName}
                            </div>
                        `);
                        userText.setOrigin(0);
                    } else {
                        localStorage.removeItem('token');
                        loginBtn.textContent = 'LOGIN';
                        loginBtn.onclick = () => {
                            this.scene.start('LoginScreen');
                        };
                    }
                } catch (err) {
                    console.error('인증 실패:', err);
                    loginBtn.textContent = 'LOGIN';
                    loginBtn.onclick = () => {
                        this.scene.start('LoginScreen');
                    };
                }
            } else {
                loginBtn.textContent = 'LOGIN';
                loginBtn.onclick = () => {
                    this.scene.start('LoginScreen');
                };
            }

            // START & MYPAGE 버튼
            document.getElementById('startBtn').addEventListener('click', () => {
                this.scene.start('Home');
            });

            document.getElementById('mypageBtn').addEventListener('click', () => {
                this.scene.start('MyInfo');
            });
        });
    }
}
