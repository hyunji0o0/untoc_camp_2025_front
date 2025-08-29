// scenes/ProfileChange.js
export default class ProfileChange extends Phaser.Scene {
    constructor() {
        super('ProfileChange');
    }

    preload() {
        this.load.image('background', 'assets/back.png');
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('profile1', 'assets/character.png');
        this.load.image('profile2', 'items/skin1.png');
        this.load.image('profile3', 'items/skin2.png');
        this.load.image('profile4', 'items/skin3.png');
        this.load.image('profile5', 'items/skin4.png');
    }

    create() {

        const currentUser = localStorage.getItem('currentUser');
        const path = window.location.pathname;

        if (path.includes('mypage')) {
            const savedProfile = currentUser ? localStorage.getItem(`profile_${currentUser}`) : null;
            this.selectedProfileSrc = savedProfile || null;
        } else {
            this.selectedProfileSrc = null;
        }

        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

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

        const profileMap = {
        'assets/character.png': { profile_id: 1, profile_url: 'assets/character.png' },
        'items/skin1.png': { profile_id: 2, profile_url: 'items/skin1.png' },
        'items/skin2.png': { profile_id: 3, profile_url: 'items/skin2.png' },
        'items/skin3.png': { profile_id: 4, profile_url: 'items/skin3.png' },
        'items/skin4.png': { profile_id: 5, profile_url: 'items/skin4.png' }
        };
        
        // 배경
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(width, height).setDepth(0);

        this.add.dom(320, centerY - 110).createFromHTML(`
        <style>
            .profile-circle-large {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background-color:rgb(252, 227, 231);
            border: 4px solid white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            }

            .profile-circle-large img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            }
        </style>
        <div class="profile-circle-large" id="main-profile-display">${this.selectedProfileSrc ? `<img src="${this.selectedProfileSrc}" />` : ''}</div>
        `);


        this.add.dom(centerX + 300, centerY).createFromHTML(`
        <style>
            .scroll-wrapper {
            width: 550px;
            height: 580px;
            background-color: rgba(220, 206, 255, 0.4);
            border: 2px solid rgba(187, 166, 242, 0.3);
            overflow-y: auto;
            padding: 20px 10px;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            row-gap: 30px;
            column-gap: 20px;
            }

            .profile-circle {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background-color: #dccfff;
            border: 2px solid #bba6f2;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: transform 0.3s ease, border-color 0.3s ease;
            }

            .profile-circle:hover {
            transform: scale(1.07);
            border-color: white;
            }

            .profile-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            }
        </style>

        <div class="scroll-wrapper" id="profile-scroll-box">
            <div class="profile-circle" data-profile-id="1"><img src="assets/character.png" /></div>
            <div class="profile-circle" data-profile-id="2"><img src="items/skin1.png" /></div>
            <div class="profile-circle" data-profile-id="3"><img src="items/skin2.png" /></div>
            <div class="profile-circle" data-profile-id="4"><img src="items/skin3.png" /></div>
            <div class="profile-circle" data-profile-id="5"><img src="items/skin4.png"/></div>
            <div class="profile-circle"></div>
            <div class="profile-circle"></div>
            <div class="profile-circle"></div>
            <div class="profile-circle"></div>
            <div class="profile-circle"></div>
        </div>
        `);

        this.time.delayedCall(0, () => {
            const scrollCircles = document.querySelectorAll('.profile-circle img');
            const mainProfile = document.getElementById('main-profile-display');

            scrollCircles.forEach(img => {
                img.addEventListener('click', () => {
                    const selectedSrc = img.getAttribute('src');
                    mainProfile.innerHTML = `<img src="${selectedSrc}" />`;
                    this.selectedProfileSrc = selectedSrc; 
                });
            });
        });

        this.add.dom(320, height - 200).createFromHTML(`
        <style>
            .button-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            }

            .transparent-btn {
            width: 300px;
            padding: 15px 0;
            font-size: 24px;
            font-weight: bold;
            color: #fff;
            background-color: rgba(255, 192, 203, 0.4); /* 연한 분홍, 투명 */
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 25px;
            backdrop-filter: blur(5px);
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
            }

            .transparent-btn:hover {
            background-color: rgba(255, 192, 203, 0.7);
            border-color: white;
            transform: scale(1.05);
            }
        </style>

        <div class="button-container">
            <button id="apply-html-btn" class="transparent-btn">적용하기</button>
            <button id="default-html-btn" class="transparent-btn">뒤로가기</button>
        </div>
        `);


        const applyHtmlBtn = document.getElementById('apply-html-btn');
        if (applyHtmlBtn) {
            applyHtmlBtn.addEventListener('click', async () => {
                if (this.selectedProfileSrc) {
                    const selected = profileMap[this.selectedProfileSrc];
                    if (!selected) {
                        alert('선택된 프로필이 유효하지 않습니다.');
                        return;
                    }

                    const token = localStorage.getItem('token');
                    if (!token || !currentUser) {
                        showAlertPopup("로그인 필요", "로그인 후 이용해주세요.");
                        return;
                    }

                    try {
                        // 백엔드 저장
                        const profileRes = await fetch('http://34.169.165.241:8000/user/profile/select', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                profile_id: selected.profile_id,
                                profile_url: selected.profile_url
                            })
                        });

                        if (profileRes.ok) {
                            localStorage.setItem(`profile_${currentUser}`, selected.profile_url);

                            showAlertPopup("프로필 변경", "프로필 이미지가 변경되었습니다!", () => {
                                this.scene.start('MyInfo');
                            });
                        } else {
                            showAlertPopup("프로필 변경", "프로필 변경 실패!");
                        }

                    } catch (err) {
                        console.error('오류 발생:', err);
                        alert('서버 오류');
                    }
                }
            });
        }

        const defaultHtmlBtn = document.getElementById('default-html-btn');
        if (defaultHtmlBtn) {
            defaultHtmlBtn.addEventListener('click', () => {
                const mainProfile = document.getElementById('main-profile-display');
                if (mainProfile) {
                    mainProfile.innerHTML = ''; 
                }

                this.selectedProfileSrc = null;
                if (currentUser) {
                    localStorage.removeItem(`profile_${currentUser}`);
                }
            });
        }

        // 돌아가기 버튼
        this.add.image(60, height - 60, 'arrow')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                console.log('Back Button Clicked');
                this.scene.start('MyInfo');
            });

    }
}
