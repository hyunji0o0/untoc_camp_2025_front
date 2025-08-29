export default class LoginScreen extends Phaser.Scene {
    constructor() {
        super('LoginScreen');
    }

    preload() {
        this.load.image('loginback', 'assets/back.png');
        this.load.image('arrow', 'assets/arrow.png');
    }
    
    create() {
        this.add.image(0, 0, 'loginback')
            .setOrigin(0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        const backButton = this.add.image(50, this.cameras.main.height - 60, 'arrow') // 화면 밑 왼쪽에 배치
            .setOrigin(0.5)
            .setScale(0.5) 
            .setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => {
            console.log('Back Button Clicked');
            this.scene.start('Start');
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

        //LOGIN 타이틀
        this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2 - 180).createFromHTML(`
            <div style="font-size: 55px; font-weight: bold; color: white;">
                L O G I N
            </div>
        `);

        //ID + PW
        this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2).createFromHTML(`
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">

                <!--ID-->
                <div style="display: flex; align-items: center; gap: 40px;">
                    <label for="username" style="width: 100px; font-size: 20px; color: white; font-weight: bold;">ID</label>
                    <input type="text" id="username" placeholder="ID..."
                        style="font-size: 18px; padding: 10px; width: 300px;
                            border: 1px solid #ccc; border-radius: 6px;
                            background-color: #ffe6f0; color: black;" />
                </div>

                <!--PASSWORD-->
                <div style="display: flex; align-items: center; gap: 40px;">
                    <label for="password" style="width: 100px; font-size: 20px; color: white; font-weight: bold;">PASSWORD</label>
                    <input type="password" id="password" placeholder="PASSWORD..."
                        style="font-size: 18px; padding: 10px; width: 300px;
                            border: 1px solid #ccc; border-radius: 6px;
                            background-color: #ffe6f0; color: black;" />
                </div>
            </div>
        `);

        this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2 + 180).createFromHTML(`
            <style>
                .fancy-button {
                    width: 220px;
                    padding: 12px 20px;
                    font-size: 18px;
                    color: #857b98;
                    background-color: rgba(255, 255, 255, 0.3);
                    border: none;
                    border-radius: 30px;
                    backdrop-filter: blur(10px);
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                .fancy-button:hover {
                    background-color: rgba(255, 255, 255, 0.5);
                    transform: scale(1.05);
                }
            </style>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <button id="signup-btn" class="fancy-button">회원가입</button>
                <button id="changepw-btn" class="fancy-button">비밀번호 변경</button>
            </div>
        `);

        // 로그인 버튼 추가
        const loginButtonWrapper = this.add.dom(
                this.cameras.main.width / 2 + 280,
                this.cameras.main.height / 2 + 5
            ).createFromHTML(`
                <style>
                    .circle-login-btn {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: none;
                        background-color: rgba(255, 255, 255, 0.5);
                        color: white;
                        font-size: 24px;
                        font-weight: bold;
                        backdrop-filter: blur(5px);
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .circle-login-btn:hover {
                        background-color: rgba(255, 255, 255, 0.7);
                        transform: scale(1.1); 
                    }
                </style>
                <button id="login-btn" class="circle-login-btn">✔</button>
            `);


        this.time.delayedCall(0, () => {
            const signupButton = document.getElementById('signup-btn');
            if (signupButton) {
                signupButton.addEventListener('click', () => {
                    console.log('회원가입 버튼 클릭됨');
                    this.scene.start('SignUp');
                });
            }

            const changePwButton = document.getElementById('changepw-btn');
            if (changePwButton) {
                changePwButton.addEventListener('click', () => {
                    console.log('비밀번호 변경 버튼 클릭됨');
                    this.scene.start('ChangePW');
                });
            }
        });

        this.time.delayedCall(0, () => {
            const loginBtn = loginButtonWrapper.node.querySelector('#login-btn');
            if (loginBtn) {
                loginBtn.addEventListener('click', async () => {
                    console.log('✔ 로그인 버튼 클릭됨');

                    const id = document.getElementById('username').value.trim();
                    const pw = document.getElementById('password').value.trim();

                    if (!id || !pw) {
                        showAlertPopup("LOGIN", "ID와 비밀번호를 모두 입력해주세요.");
                        return;
                    }

                    try {
                        const response = await fetch('http://34.169.165.241:8000/user/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                user_name: id,
                                password: pw
                            })
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const token = data.access_token;

                            localStorage.setItem('token', token);
                            showAlertPopup("LOGIN", "로그인이 성공적으로 완료되었습니다.");
                            console.log('access_token 저장 완료:', token);

                            try {
                                const authRes = await fetch("http://34.169.165.241:8000/user/me", {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                });

                                if (authRes.ok) {
                                    const userData = await authRes.json();
                                    console.log("인증된 사용자 정보:", userData);
                                    localStorage.setItem('currentUser', userData.user_email);
                                    this.scene.start('Start'); 

                                } else if (authRes.status === 401) {
                                    //토큰 만료 or 유효하지 않음
                                    showAlertPopup("error", "세션이 만료되었습니다. 다시 로그인해주세요.");
                                    localStorage.removeItem('token'); // 만료된 토큰 제거
                                    this.scene.start('LoginScreen');  // 로그인 화면으로 이동
                                } else {
                                    console.error("인증 API 응답 실패", authRes.status);
                                    showAlertPopupt("error", "사용자 인증 정보 가져오기 실패");
                                }
                            } catch (authErr) {
                                console.error("인증 API 호출 중 오류:", authErr);
                                alert("인증 API 호출 실패");
                            }
                        } else if (response.status === 401) {
                            showAlertPopup("CHECK", "아이디나 비밀번호가 잘못되었습니다.");
                        } else {
                            alert('로그인 실패. 서버 오류');
                        }
                    } catch (err) {
                        alert('서버와 연결할 수 없습니다.');
                        console.error('로그인 오류:', err);
                    }
                });
            } else {
                console.warn('login-btn 찾기 실패');
            }
        });



    }
}