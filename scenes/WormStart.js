// scenes/wormstart.js

import PlayerSnake from './entities/PlayerSnake.js';
import BotSnake    from './entities/BotSnake.js';
import Food        from './entities/Food.js';
import Util        from './Util.js';

export default class WormStart extends Phaser.Scene {
  constructor() {
    super('WormStart');
  }

  preload() {

    this.load.image('tiniwormbody1', 'assets/tiniwormbody1.png');
    this.load.image('tiniwormbody2', 'assets/tiniwormbody2.png');
    this.load.image('tiniwormbody3', 'assets/tiniwormbody3.png');
    this.load.image('tiniwormbody4', 'assets/tiniwormbody4.png');


    this.load.image('skin1', 'items/skin1.png');
    this.load.image('skin2', 'items/skin2.png');
    this.load.image('skin3', 'items/skin3.png');
    this.load.image('skin4', 'items/skin4.png');
    // 섹션, 머리, 그림자, 먹이, 타일 이미지 로드
    this.load.image('circle', 'assets/tiniwormbody.png');  
    this.load.image('face',   'assets/character.png');
    for (let i = 1; i <= 7; i++) {
      this.load.image(`food${i}`, `assets/food${i}.png`);
    }
    this.load.image('tile', 'assets/tile.png');
    this.load.image('gamebackground', 'assets/gamebackground.png')
  }

  create() {
    this.logsSent = false;
    this.scoreSent = false
    this.logs = []; // AI 학습용 로그
    this.snakes = []; 
    this.startTime = performance.now();
    this.lastLogTime = 0;  //마지막 로그 저장 시각
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('로그인 토큰이 없습니다.');
      return;
    }

    fetch('http://34.169.165.241:8000/game_session/start?domain=game_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) return res.text().then(t => { throw new Error(t); });
      return res.json();
    })
    .then(data => {
      this.sessionId = data.session_id;
      console.log('받은 session_id:', this.sessionId);
      this.setupGame();
    })
    .catch(err => {
      console.error('세션 시작 실패:', err);
    });
  }

  setupGame() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.worldW = w;
    this.worldH = h;

    // 디버그 그래픽 (원하면 켜두세요)
    //this.physics.world.createDebugGraphic();

    // 카메라 & 배경
    this.cameras.main.setBounds(-w, -h, w * 2, h * 2);
    this.cameras.main.setBackgroundColor('#444');
    this.add.tileSprite(-w, -h, w * 2, h * 2,'gamebackground').setOrigin(0).setDepth(-1);

    // 물리 경계
    this.physics.world.setBounds(-w, -h, w * 2, h * 2);

    // 먹이 그룹 
    this.foodGroup = this.physics.add.group();

    // 뱀들 저장할 배열
    this.snakes = [];

    // 초기 먹이 100개 생성
    for (let i = 0; i < 100; i++) {this.initFood(Util.randomInt(-w, w), Util.randomInt(-h, h));
    }

    const currentUser = localStorage.getItem('currentUser');
    const savedSkin = currentUser ? localStorage.getItem(`selectedHeadSkin_${currentUser}`) || 'face' : 'face';

    let bodyTextureKey = 'circle';
    if (savedSkin === 'skin1') bodyTextureKey = 'tiniwormbody1';
    else if (savedSkin === 'skin2') bodyTextureKey = 'tiniwormbody2';
    else if (savedSkin === 'skin3') bodyTextureKey = 'tiniwormbody3';
    else if (savedSkin === 'skin4') bodyTextureKey = 'tiniwormbody4';


    const player = new PlayerSnake(this, bodyTextureKey, savedSkin, 0, 0);
    player.botNumber = -1;
    player.head.setScale(0.4);

    this.snakes.push(player);
    this.cameras.main.startFollow(player.head);

    const botSkins = [
      { head: 'skin1', body: 'tiniwormbody1' },
      { head: 'skin2', body: 'tiniwormbody2' },
      { head: 'skin3', body: 'tiniwormbody3' },
      { head: 'skin4', body: 'tiniwormbody4' },
      { head: 'face',  body: 'circle' } // 기본 스킨
    ];

    // 랜덤하게 두 개 뽑기 (겹치지 않게 하려면 Shuffle)
    const [botSkin1, botSkin2] = Phaser.Utils.Array.Shuffle(botSkins).slice(0, 2);
    
    // 봇 스네이크 2마리
    const bot1 = new BotSnake(this, botSkin1.body, botSkin1.head, -200, 0);
    bot1.botNumber = 0; 
    bot1.head.setScale(0.4);

    const bot2 = new BotSnake(this, botSkin2.body, botSkin2.head,  200, 0);
    bot2.botNumber = 1;
    bot2.head.setScale(0.4);

    this.snakes.push(bot1, bot2);

    // 뱀 파괴(죽음) 콜백 등록
    this.snakes.forEach(snake => {
      snake.addDestroyedCallback(this.snakeDestroyed, this);
    });

    this.score = 0;
    this.scoreText = this.add.text(this.scale.width - 220, 40, 'SCORE: 0', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setScrollFactor(0); 
    this.createAiBots(this.sessionId);
  }

  update(time, delta) {
    if (!this.snakes || this.snakes.length === 0) {
      console.warn('this.snakes가 비어있음');
      return;
    }

    if (!this.snakes) return;
    // 1) 각 뱀 기본 로직
    this.snakes.forEach(s => s.update(time, delta));

    // 2) 수동 충돌 검사: 머리(head) ↔ 먹이
    this.snakes.forEach(snake => {
      const head       = snake.head;
      const headRadius = head.displayWidth * 0.3;

      this.foodGroup.getChildren().forEach(foodSprite => {
        const food       = foodSprite.food;
        const foodRadius = foodSprite.displayWidth * 0.3;

        if (food.attached) return;

        const dist = Phaser.Math.Distance.Between(
          head.x, head.y,
          foodSprite.x, foodSprite.y
        );

        if (dist <= headRadius + foodRadius) {
          // ① 기존 붙이는 로직
          food.onHit(head);

        if (snake instanceof PlayerSnake) {
          this.score += 50;
          this.scoreText.setText('SCORE: ' + this.score);
        }

          // ② 새 먹이 랜덤 생성 (world bounds: -w..w, -h..h)
          //    create()에서 this.worldW = w, this.worldH = h 로 저장했다고 가정
          const x = Util.randomInt(-this.worldW, this.worldW);
          const y = Util.randomInt(-this.worldH, this.worldH);
          this.initFood(x, y);
        }
      });
    });

      // 3) **머리 ↔ 다른 뱀 몸통 충돌 (수동)**
        this.snakes.forEach(snake => {
        const head       = snake.head;
        const headRadius = head.displayWidth * 0.3;

        this.snakes.forEach(other => {
          if (other === snake) return;              // 자기 자신 제외
          other.sections.forEach(sec => {
            const secRadius = sec.displayWidth * 0.3;  
            const dist = Phaser.Math.Distance.Between(
              head.x, head.y,
              sec.x,  sec.y
            );
            if (dist <= headRadius + secRadius) {
              // 충돌하면 해당 뱀 파괴
              snake.destroy();
            }
          });
        });
      });

      // 4) 먹이들 업데이트
      this.foodGroup.getChildren().forEach(sprite => sprite.food.update());

      // update 함수의 마지막 부분
      const now = performance.now();
      if (now - this.lastLogTime >= 3000) {
        this.snakes.forEach(snake => {
          const { x, y } = snake.head;

          const normX = Phaser.Math.Clamp((x + this.worldW) / (this.worldW * 2), 0, 1);
          const normY = Phaser.Math.Clamp((y + this.worldH) / (this.worldH * 2), 0, 1);

          // 항상 현재 플레이어의 위치 가져오기
          const player = this.snakes.find(s => s instanceof PlayerSnake);
          const playerX = player?.head?.x ?? 0;
          const playerY = player?.head?.y ?? 0;

          const log = {
            step: this.logs.length,
            state_x: normX,
            state_y: normY,
            player_x: Number(playerX),
            player_y: Number(playerY),
            action: this.getActionFromPlayer(snake),
            boost: snake.isBoosting || false,
            reward: snake.food.length * 0.1,
            event: 'move',
            bot_number : snake.botNumber ?? -1,
          };
          this.logs.push(log);
          console.log(`로그 추가됨 [bot_number=${log.bot_number}]:`, log);
        });
        this.lastLogTime = now;
      }
    }

    getActionFromPlayer(snake) {
      const angle = Phaser.Math.Angle.Normalize(snake.head.rotation);
      // 방향을 8방향 중 하나로 정리
      if (angle >= -0.785 && angle < 0.785) return 0;         // 오른쪽
      else if (angle >= 0.785 && angle < 2.356) return 1;     // 아래
      else if (angle >= 2.356 || angle < -2.356) return 2;    // 왼쪽
      else return 3;                                          // 위
    }


  initFood(x, y) {
    const n   = Phaser.Math.Between(1, 7);
    const key = `food${n}`;
    const f   = new Food(this, x, y, key);
    this.foodGroup.add(f.sprite);
    return f;
  }

  createAiBots(sessionId) {
    const token = localStorage.getItem('token');
    const botsToCreate = [0, 1];


    botsToCreate.forEach(botNumber => {
      fetch('http://34.169.165.241:8000/AI_bot/ai/create_ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          session_id: sessionId,
          bot_number: botNumber
        })
      })
      .then(res => {
        if (!res.ok) return res.text().then(text => { throw new Error(text); });
        return res.json();
      })
      .then(data => {
        console.log(`Bot ${botNumber} 생성 완료:`, data);
      })
      .catch(err => {
        console.error(`Bot ${botNumber} 생성 실패:`, err);
      });
    });
  }

  sendLogsToBackend() {
    console.log('📤 sendLogsToBackend() 진입');

    if (!this.logs || this.logs.length === 0) {
      console.warn('📭 로그가 없습니다. 전송 중단');
      return;
    }
    if (this.logsSent) {
      console.warn('🚫 이미 로그를 전송함. 중복 전송 방지');
      return;
    }
    if (!this.sessionId) {
      console.warn('❗ sessionId 없음. 로그 전송 중단');
      return;
    }

    this.logsSent = true;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ 토큰 없음. 로그 전송 불가');
      return;
    }

    const payloadArray = this.logs.map((log, i) => {
      const fullLog = {
        step: log.step,
        state_x: log.state_x,
        state_y: log.state_y,
        player_x: log.player_x,
        player_y: log.player_y,
        action: log.action,
        boost: log.boost,
        reward: log.reward,
        event: log.event,
        bot_number: log.bot_number ?? -1,
      };

      console.log(`🧾 로그[${i}]:`, fullLog);
      return fullLog;
    });

    console.log('📦 최종 payloadArray 준비됨:', payloadArray);

    // 🔁 실제 fetch 전송
    fetch('http://34.169.165.241:8000/bot_log/log?domain=bot_log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payloadArray),
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(`🚨 전체 로그 전송 실패: ${text}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log(`✅ 전체 로그 전송 성공 응답:`, data);
      console.log(`🎉 전체 로그 전송 완료! 총 ${this.logs.length}개의 로그가 서버에 전송되었습니다.`);
    })
    .catch(err => {
      console.error(`❌ 전체 로그 전송 중 에러 발생:`, err);
    });
  }


  snakeDestroyed(snake) {
  const path = snake.headPath;
  const len  = snake.snakeLength;

  // 1) 뱀 길이 비율로 생성 개수 결정 (예: 길이의 0.5%)
  const spawnRatio = 0.1;          // 0.5% 로 설정
  let spawnCount   = Math.floor(len * spawnRatio);

  // spawnCount가 0이면 그냥 종료
  if (spawnCount === 0) {
    return;
  }

  // 2) 경로 전체를 spawnCount 등분한 간격으로 인덱스 뽑기
  const step        = Math.max(1, Math.floor(path.length / spawnCount));
  const offsetRange = 60;   // 좌표 ±60px 랜덤 오프셋
  const minDist     = 100;   // 스폰 간 최소 거리
  const spawns      = [];

  for (let i = 0; i < path.length && spawns.length < spawnCount; i += step) {
    const base = path[i];
    const x    = base.x + Util.randomInt(-offsetRange, offsetRange);
    const y    = base.y + Util.randomInt(-offsetRange, offsetRange);

    // 이미 선택된 위치들과 최소 거리(minDist) 체크
    const tooClose = spawns.some(p =>
      Phaser.Math.Distance.Between(p.x, p.y, x, y) < minDist
    );
    if (tooClose) continue;

    spawns.push({ x, y });
  }

  // 3) 최종 선택된 위치에만 먹이 생성
  spawns.forEach(pt => {
    this.initFood(pt.x, pt.y);
  });

  //점수 전송 & 씬 전환 로직
  const sendScoreAndGoToGameOver = () => {
    if (this.scoreSent) return;
    this.scoreSent = true;  

    const token = localStorage.getItem('token');  //누락된 부분 추가
    const score = this.score;

    this.sendLogsToBackend();

    fetch('http://34.169.165.241:8000/game_session/?domain=game_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })  
        },
      
      body: JSON.stringify({
        user_score: this.score,
      })
    })
    .then(res => res.json())
    .catch(err => {
      console.error('점수 전송 실패:', err);
    })
    .finally(() => {
      fetch('http://34.169.165.241:8000/game_session/end?domain=game_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log('세션 종료 완료:', data);
      })
      .catch(err => {
        console.error('세션 종료 실패:', err);
      });

      this.time.delayedCall(1000, () => {
        this.scene.start('GameOver', { score: score });
      });
    });
  };

  if (snake instanceof PlayerSnake) {
    sendScoreAndGoToGameOver();
  } else {
    const anyBotLeft = this.snakes.some(s => s instanceof BotSnake && !s.destroyed);
    if (!anyBotLeft) {
      sendScoreAndGoToGameOver();
    }
  }
}
}