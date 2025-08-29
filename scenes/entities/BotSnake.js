// src/entities/BotSnake.js
import Snake from './Snake.js';
import Util from '../Util.js';

export default class BotSnake extends Snake {
  /**
   * @param {Phaser.Scene} scene  
   * @param {string} spriteKey   
   * @param {number} x           
   * @param {number} y           
   */
  constructor(scene, spriteKey, x, y) {
    super(scene, spriteKey, x, y);
    this.trend = 1;
  }

  /**
   * Bot 전용 update: 랜덤으로 방향 전환한 뒤 기본 Snake 업데이트 호출
   * @param {number} time  
   * @param {number} delta 
   */
  update(time, delta) {
    // 한 방향으로 일정 시간 회전하다가 가끔 반대 방향으로 바뀜
    if (Util.randomInt(1, 20) === 1) {
      this.trend *= -1;
    }
    // Phaser 3 Arcade: rotation 속성 직접 조절
    this.head.rotation += this.trend * this.rotationSpeed;
    super.update(time, delta);
    // 기본 Snake 업데이트 (이동 및 섹션/눈/그림자 갱신);
  }

  destroy() {
    // 1) 공통 destroy: head/sec/edge 파괴 + this.deathScore 계산
    super.destroy();

    // 2) Bot 전용: deathScore 만큼 spawnRatio 로 계산
    const path       = this.headPath;
    let spawnCount   = Math.floor(this.deathScore+30 /10);

    // 최소 0, 최대 deathScore
    spawnCount = Phaser.Math.Clamp(spawnCount, 0, this.deathScore);

    if (spawnCount <= 0) return;

    // 3) 경로 전체를 spawnCount 등분한 간격으로 인덱스 뽑기
    const step        = Math.max(1, Math.floor(path.length / spawnCount));
    const offsetRange = 60;   // ±60px 랜덤 오프셋
    const minDist     = 100;  // 스폰 간 최소 거리
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

    // 4) 최종 선택된 위치에만 먹이 생성
    spawns.forEach(pt => {
      this.scene.initFood(pt.x, pt.y);
    });
  }





}
