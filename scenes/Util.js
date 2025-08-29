// src/util.js
const Util = {
  /**
   * Generate a random integer within a closed range [min, max]
   * @param {number} min - Minimum of range (inclusive)
   * @param {number} max - Maximum of range (inclusive)
   * @returns {number} Random integer
   */
  randomInt(min, max) {
    const mn = Math.ceil(min);
    const mx = Math.floor(max);
    return Math.floor(Math.random() * (mx - mn + 1)) + mn;
  },

  /**
   * Calculate Euclidean distance between two points
   * @param {number} x1 - X coordinate of first point
   * @param {number} y1 - Y coordinate of first point
   * @param {number} x2 - X coordinate of second point
   * @param {number} y2 - Y coordinate of second point
   * @returns {number} Distance
   */
  distanceFormula(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
  }
};

export default Util;
