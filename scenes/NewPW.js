export default class NewPW extends Phaser.Scene {
    constructor() {
        super('NewPW');
    }

    preload() {
        this.load.image('NewPWback', 'assets/back.png');
    }

    create(data) {
        const emailFromPrev = data?.email || '';

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

                    .confirm-btn, .cancel-btn {
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

                    .confirm-btn:hover, .cancel-btn:hover {
                        transform: scale(1.08);
                        background-color: #9f7bc7;
                    }
                </style>
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="btn-group">
                    <button class="confirm-btn">확인</button>
                    <button class="cancel-btn">취소</button>
                </div>
            `;

            document.body.appendChild(popup);
            popup.querySelector('.confirm-btn').addEventListener('click', () => {
                popup.remove();
                if (onConfirm) onConfirm();
            });

            popup.querySelector('.cancel-btn').addEventListener('click', () => {
                popup.remove();
            })
        };

        const showAlertPopup_2 = (title, message, onConfirm = null) => {
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

        this.add.image(0, 0, 'NewPWback')
            .setOrigin(0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2).createFromHTML(`
            <style>
                #verify-code-btn {
                padding: 10px 15px;
                font-size: 14px;
                border: none;
                border-radius: 6px;
                background-color: rgba(255, 255, 255, 0.4);
                color: #444;
                backdrop-filter: blur(5px);
                cursor: pointer;
                transition: all 0.25s ease;
                }

                #verify-code-btn:hover {
                background-color: rgba(255, 255, 255, 0.7);
                transform: scale(1.05);
                }
            </style>
        
            <div style="display: flex; flex-direction: column; gap: 30px; align-items: flex-start;">

            <!-- 안내 문구 -->
            <div style="color: white; font-size: 20px; align-self: center;">
                새로운 비밀번호를 입력해주세요.
            </div>

            <!-- 이메일 입력 -->
            <div style="display: flex; align-items: center; gap: 20px;">
                <label for="email" style="width: 130px; font-size: 20px; font-weight: bold; color: white;">EMAIL</label>
                <input id="email" type="text" placeholder="EMAIL..." value="${emailFromPrev}"
                    style="width: 300px; padding: 10px; font-size: 18px; background-color: #ffe6f0;
                        border: 1px solid #ccc; border-radius: 6px; color: black;" />
            </div>

            <!-- 비밀번호 입력 -->
            <div style="display: flex; align-items: center; gap: 20px;">
                <label for="pw" style="width: 130px; font-size: 20px; font-weight: bold; color: white;">PASSWORD</label>
                <input id="pw" type="password" placeholder="PASSWORD..." maxlength="20" 
                    style="width: 300px; padding: 10px; font-size: 18px; background-color: #ffe6f0;
                        border: 1px solid #ccc; border-radius: 6px; color: black;" />
            </div>

            <!-- 비밀번호 확인 -->
            <div style="display: flex; align-items: center; gap: 20px;">
                <label for="confirm" style="width: 130px; font-size: 20px; font-weight: bold; color: white;">CONFIRM</label>
                <input id="confirm" type="password" placeholder="PASSWORD..." maxlength="20" 
                    style="width: 300px; padding: 10px; font-size: 18px; background-color: #ffe6f0;
                        border: 1px solid #ccc; border-radius: 6px; color: black;" />
                <button id="verify-code-btn">확인</button>
            </div>
        </div>
    `);

        // 버튼 동작 연결
        this.time.delayedCall(0, () => {
            const pwInput = document.getElementById('pw');
            const confirmInput = document.getElementById('confirm');
            const verifyBtn = document.getElementById('verify-code-btn');
            const cancelBtn = document.getElementById('cancel-btn');
            const emailInput = document.getElementById('email');



            if (verifyBtn) {
                verifyBtn.addEventListener('click', async () => {
                    const pw = pwInput.value.trim();
                    const confirm = confirmInput.value.trim();
                    const email = emailInput.value.trim();

                    if (!pw || !confirm || !email) {
                        showAlertPopup_2("CHECK", "새로운 비밀번호를 입력해주세요.");
                    } else if (pw !== confirm) {
                        showAlertPopup_2("ERROR", "새로운 비밀번호가 일치하지 않습니다.");
                    } else {
                        try {
                            const response = await fetch(
                                `http://34.169.165.241:8000/user/reset-password?user_email=${email}&new_password=${pw}`,
                                {
                                    method: 'POST'
                                }
                            );

                            if (response.ok) {
                                showAlertPopup_2("변경 완료", "비밀번호가 변경되었습니다.", () => {
                                    this.scene.start('LoginScreen');
                                });
                            } else {
                                showAlertPopup_2("ERROR", "비밀번호 변경에 실패했습니다.", () => {
                                    this.scene.start('LoginScreen');
                                });
                            }
                        } catch (err) {
                            console.error('비밀번호 변경 요청 실패:', err);
                            alert('서버와 연결할 수 없습니다.');
                        }
                    }
                });
            }

            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    const confirmed = showAlertPopup(" ", "비밀번호 변경을 취소하시겠습니까?", () => {
                        this.scene.start('LoginScreen')
                    });
                });
            }
        });

        this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2 + 200).createFromHTML(`
            <style>
                .fancy-button {
                    padding: 12px 30px;
                    font-size: 15px;
                    border-radius: 30px;
                    border: 1px solid #aaa;
                    background-color: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(5px);
                    color: #444;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .fancy-button:hover {
                    background-color: rgba(255, 255, 255, 0.5);
                    transform: scale(1.05);
                }
            </style>

            <div style="display: flex; gap: 20px; justify-content: center;">
               <!-- 취소하기 버튼 -->
                <button id="cancel-btn" class="fancy-button">취소하기</button>
            </div>
        `);

    }
}