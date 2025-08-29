// src/entities/Food.js
export default class Food {
  /**
   * @param {Phaser.Scene} scene      - Phaser 3 scene
   * @param {number} x                - 초기 x 좌표
   * @param {number} y                - 초기 y 좌표
   * @param {string} spriteKey        - 사용할 스프라이트 키 (예: 'food1', 'food2', …)
   */
  constructor(scene, x, y, spriteKey) {
    this.scene    = scene;
    this.attached = false;
    this.head     = null;

    // spriteKey로 어떤 이미지를 쓸지 결정
    this.sprite = scene.physics.add.sprite(x, y, spriteKey)
      .setOrigin(0.5)
      .setScale(0.3);           // 필요시 크기 조정

    // 물리 바디 반지름도 displayWidth 기준으로 재설정
    this.sprite.body.setCircle(this.sprite.displayWidth * 0.5);
    this.sprite.food = this;     // 역참조
  }

  onHit(headSprite) {
    if (this.attached) return;
    this.attached = true;
    this.head     = headSprite;
    this.scene.physics.world.disable(this.sprite);
    this.head.snake.food.push(this);
  }

  update() {
    if (!this.attached) return;
    this.sprite.x = this.head.x;
    this.sprite.y = this.head.y;
    this.head.snake.onFoodEaten();
    this.destroy();
  }

  destroy() {
    this.sprite.destroy();
    const arr = this.head?.snake.food;
    if (arr) {
      const i = arr.indexOf(this);
      if (i !== -1) arr.splice(i, 1);
    }
    this.head = null;
  }
}
