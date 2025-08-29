export default class CoinShop extends Phaser.Scene {
    constructor() {
        super('CoinShop');
    }

    preload() {
        this.load.image('shop_bg', 'assets/back.png');
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('coin2', 'assets/coin2.png');
        this.load.image('shop_coin', 'assets/coin2.png');
        this.load.image('skin1', 'items/skin1.png');
        this.load.image('skin2', 'items/skin2.png');
        this.load.image('skin3', 'items/skin3.png');
        this.load.image('skin4', 'items/skin4.png');

    }

    create() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const token = localStorage.getItem('token');
        let purchasedItems = [];

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

        const fetchPurchasedItems = async () => {
            if (!token) return;

            try {
                const res = await fetch('http://34.169.165.241:8000/user_character/user_character?domain=user_character', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    purchasedItems = data.map(item => item.character_id);

                    // 버튼 스타일 업데이트
                    purchasedItems.forEach(index => {
                        const btn = document.getElementById(`shop-item-${index}`);
                        if (btn) {
                            btn.style.backgroundColor = '#ccc';
                            btn.style.border = '3px solid #ffffff';
                            btn.style.filter = 'grayscale(50%) brightness(0.9)';
                        }
                    });

                } else {
                    console.warn('구매 목록 불러오기 실패:', res.status);
                }
            } catch (err) {
                console.error('구매 목록 요청 실패:', err);
            }
        };

        // 이 위치에서 호출
        fetchPurchasedItems();

        // 배경
        this.add.image(0, 0, 'shop_bg').setOrigin(0).setDisplaySize(width, height);

        //타이틀 부분
        this.add.dom(centerX + 300, 100).createFromHTML(`
        <style>
        .coin-title-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 60px;
            transform: translateX(-50%);
            animation: floatUpDown 2.5s ease-in-out infinite;
        }

        .coin-title-text {
            font-size: 70px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            color: white;
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

        <div class="coin-title-container">
        <div class="coin-title-text">TINIWORM SHOP</div>
        </div>
        `);

        //코인 금액 보이는 칸
        this.add.dom(centerX+550, 190).createFromHTML(`
            <style>
                .coin-box {
                    width: 250px;
                    height: 60px;
                    background-color: rgba(216, 176, 247, 0.6);
                    border-radius: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    font-family: Arial, sans-serif;
                    color: white;
                    transform: translateX(-50%);
                }
            </style>
            <div class="coin-box">MY COIN: 50000</div>
        `);

        // item 정보 배열
        const itemList = [
            { amount: 9999999, img: 'items/rosejun.png' },
            { amount: 1000, img: 'items/skin1.png' },
            { amount: 1500, img: 'items/skin2.png' },
            { amount: 2000, img: 'items/skin3.png' },
            { amount: 2500, img: 'items/skin4.png' },
            // 원하는 만큼 추가 가능
        ];

        const itemHTML = itemList.map((item, index) => `
            <button class="shop-button" id="shop-item-${index}" data-amount="${item.amount}">
                <img src="${item.img}" />
                <div class="label">${item.amount} COIN</div>
            </button>
        `).join('');

        // 팝업 DOM 요소 생성 함수
        const showPurchasePopup = (amount) => {
            const popup = document.createElement('div');
            popup.id = 'purchase-popup';
            popup.innerHTML = `
                <style>
                    #purchase-popup {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: #e8d6ff;
                        padding: 30px 50px;
                        border-radius: 25px;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        z-index: 1000;
                        box-shadow: 0 0 20px rgba(0,0,0,0.4);
                    }

                    #purchase-popup h2 {
                        font-size: 40px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                    }

                    #purchase-popup p {
                        font-size: 24px;
                        margin: 20px 0;
                        color: #444;
                    }

                    .btn-group {
                        display: flex;
                        justify-content: center;
                        gap: 30px;
                        margin-top: 20px;
                    }

                    .confirm-btn, .cancel-btn {
                        font-size: 22px;
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
                <h2>BUY</h2>
                <p>스킨을 구매하시겠습니까?</p>
                <div class="btn-group">
                    <button class="confirm-btn">확인</button>
                    <button class="cancel-btn">취소</button>
                </div>
            `;

            document.body.appendChild(popup);

            // 확인 버튼 이벤트
            popup.querySelector('.confirm-btn').addEventListener('click', () => {
                popup.remove();
                const imgPath = itemList[characterId]?.img;
                if (imgPath) {
                    const key = `skin${characterId}`;  // key로 저장!
                    localStorage.setItem('selectedHeadSkin', imgPath);  // ✅ 저장
                    alert(`스킨 ${characterId}로 변경되었습니다!`);
                }
            });



            // 취소 버튼 이벤트
            popup.querySelector('.cancel-btn').addEventListener('click', () => {
                popup.remove();
            });
        };

        //나만의 준표
        const showBlockedPopup = () => {
            const popup = document.createElement('div');
            popup.id = 'blocked-popup';
            popup.innerHTML = `
                <style>
                    #blocked-popup {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: #e8d6ff;
                        padding: 30px 50px;
                        border-radius: 25px;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        z-index: 1000;
                        box-shadow: 0 0 20px rgba(0,0,0,0.4);
                    }

                    #blocked-popup h2 {
                        font-size: 40px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                    }

                    #blocked-popup p {
                        font-size: 24px;
                        margin: 20px 0;
                        color: #444;
                    }

                    .btn-group {
                        display: flex;
                        justify-content: center;
                        margin-top: 20px;
                    }

                    .confirm-btn {
                        font-size: 22px;
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
                <h2>F4<h2>
                <p>'그'는 구매할 수 없습니다.</p>
                <div class="btn-group">
                    <button class="confirm-btn">확인</button>
                </div>
            `;
            document.body.appendChild(popup);

            popup.querySelector('.confirm-btn').addEventListener('click', () => {
                popup.remove();
            });
        };


        const showSkinChangePopup = (characterId) => {
            const popup = document.createElement('div');
            popup.id = 'change-popup';
            popup.innerHTML = `
                <style>
                    #change-popup {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: #e8d6ff;
                        padding: 30px 50px;
                        border-radius: 25px;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        z-index: 1000;
                        box-shadow: 0 0 20px rgba(0,0,0,0.4);
                    }

                    #change-popup h2 {
                        font-size: 40px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                    }

                    #change-popup p {
                        font-size: 24px;
                        margin: 20px 0;
                        color: #444;
                    }

                    .btn-group {
                        display: flex;
                        justify-content: center;
                        gap: 30px;
                        margin-top: 20px;
                    }

                    .confirm-btn, .cancel-btn {
                        font-size: 22px;
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
                <h2>CHANGE</h2>
                <p>해당 스킨으로 변경하겠습니까?</p>
                <div class="btn-group">
                    <button class="confirm-btn">확인</button>
                    <button class="cancel-btn">취소</button>
                </div>
            `;

            document.body.appendChild(popup);

            popup.querySelector('.confirm-btn').addEventListener('click', () => {
                popup.remove();
                const key = `skin${characterId}`;  // ← 실제 텍스처 키
                const currentUser = localStorage.getItem('currentUser');
                if (currentUser) {
                    localStorage.setItem(`selectedHeadSkin_${currentUser}`, key);
                }
                alert(`스킨 ${characterId}로 변경되었습니다!`);
            });


            popup.querySelector('.cancel-btn').addEventListener('click', () => {
                popup.remove();
            });
        };

        //item 보이는 부분
        this.add.dom(centerX+550, 450).createFromHTML(`
        <style>
            .scroll-wrapper {
            width: 1100px;
            height: 400px;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            padding-bottom: 20px;
            transform: translateX(-50%);
            }

            .scroll-wrapper::-webkit-scrollbar {
            height: 14px;
            }

            .scroll-wrapper::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.96);
            border-radius: 4px;
            }

            .item-row {
            display: flex;
            gap: 30px;
            padding: 10px;
            }

            .shop-button {
            min-width: 250px;
            height: 350px;
            background-color: rgba(216, 176, 247, 0.6);
            box-shadow: 0 0 11px rgba(0,0,0,0.2);
            border-radius: 30px;
            border: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: white;
            cursor: pointer;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            flex-shrink: 0;
            }

            .shop-button:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
            }

            .shop-button img {
            width: 180px;
            height: 200px;
            margin-bottom: 15px;
            }

            .shop-button .label {
            font-size: 28px;
            font-weight: bold;
            }
        </style>

        <div class="scroll-wrapper">
            <div class="item-row">
            ${itemHTML}
            </div>
        </div>
        `);

        let selectedCharacterId = null;

        this.time.delayedCall(0, () => {
            document.querySelectorAll('.shop-button').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const amount = btn.dataset.amount;
                    selectedCharacterId = index;

                    if (!token) {
                        showAlertPopup("로그인 필요", "로그인 후 이용해주세요.");
                        return;
                    }
                    if (index === 0) {
                        showBlockedPopup();
                        return;
                    }
                    if (purchasedItems.includes(index)) {
                        showSkinChangePopup(index);
                    } else {
                        showPurchasePopup(amount);
                    }
                });


                if (purchasedItems.includes(index)) {
                    btn.style.backgroundColor = '#ccc';
                    btn.style.border = '3px solid #ffffff';
                    btn.style.filter = 'grayscale(50%) brightness(0.9)';
                }
            });
        });

        // 뒤로가기 버튼
        this.add.image(60, height - 60, 'arrow')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MyInfo');
            });

        const sendCharacterToBackend = async (characterId) => {
            const token = localStorage.getItem('token'); // 로그인 시 저장한 토큰 꺼내기

            if (!token) {
                alert("로그인이 필요합니다.");
                console.error("토큰 없음: 인증 실패");
                return;
            }

            try {
                const response = await fetch('http://34.169.165.241:8000/user_character/user_character?domain=user_character', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`  // ← 여기에 토큰 삽입!
                    },
                    body: JSON.stringify({ character_id: characterId })  // 가격은 안 보냄
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.");
                        localStorage.removeItem('token');
                        this.scene.start('LoginScreen'); // 또는 적절한 경로로 리다이렉트
                    } else {
                        throw new Error(`서버 응답 오류: ${response.status}`);
                    }
                }

                const data = await response.json();
                console.log('서버 응답:', data);
                alert("구매가 완료되었습니다!");
                purchasedItems.push(characterId);

                // 버튼 스타일 다시 적용
                document.getElementById(`shop-item-${characterId}`).style.backgroundColor = '#ccc';
                document.getElementById(`shop-item-${characterId}`).style.border = '3px solid #ffffff';
                document.getElementById(`shop-item-${characterId}`).style.filter = 'grayscale(50%) brightness(0.9)';


            } catch (error) {
                console.error('전송 실패:', error);
                alert("구매 요청 실패: 서버 문제 또는 네트워크 오류");
            }
        };

        // 기본 이미지로 변경하는 버튼
        this.add.dom(centerX - 420, 190).createFromHTML(`
        <style>
            .default-skin-btn {
            background-color:rgba(216, 176, 247, 0.6);
            color: white;
            font-size: 22px;
            font-weight: bold;
            padding: 12px 24px;
            border-radius: 16px;
            border: none;
            cursor: pointer;
            transition: transform 0.2s ease, background-color 0.2s ease;
            }
            .default-skin-btn:hover {
            transform: scale(1.05);
            background-color: #9f7bc7;
            }
        </style>
        <button class="default-skin-btn">기본 이미지로 변경</button>
        `).addListener('click').on('click', function (event) {
        if (event.target.classList.contains('default-skin-btn')) {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
            localStorage.setItem(`selectedHeadSkin_${currentUser}`, 'face');
            showAlertPopup("SKIN SHOP", "기본 이미지로 변경되었습니다!");
            } else {
            showAlertPopup("SKIN SHOP", "로그인 이후 이용해주세요.");
            }
        }
        });



    }
}
