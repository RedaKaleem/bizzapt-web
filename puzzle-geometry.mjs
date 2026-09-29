// One symmetric, narrow-necked tab profile is shared by both adjoining pieces.
export function puzzlePath(width, height, row, column, rows, columns) {
  const scale = Math.min(1, width / 230, height / 180);
  const number = value => Number(value.toFixed(3));
  let path = 'M0 0';
  function edge(x, y, dx, dy, nx, ny, length, tab) {
    const point = (along, depth) => `${number(x + dx * along + nx * depth)},${number(y + dy * along + ny * depth)}`;
    if (tab) {
      const mid = length / 2;
      const p = (a, d) => point(mid + a * scale, d * scale);
      path += ` L${p(-8, 0)}`;
      path += ` C${p(-8, 6)} ${p(-16, 8)} ${p(-16, 18)}`;
      path += ` C${p(-16, 28)} ${p(-8, 34)} ${p(0, 34)}`;
      path += ` C${p(8, 34)} ${p(16, 28)} ${p(16, 18)}`;
      path += ` C${p(16, 8)} ${p(8, 6)} ${p(8, 0)}`;
    }
    path += ` L${point(length, 0)}`;
  }
  edge(0, 0, 1, 0, 0, 1, width, row > 0);
  edge(width, 0, 0, 1, 1, 0, height, column < columns - 1);
  edge(width, height, -1, 0, 0, 1, width, row < rows - 1);
  edge(0, height, 0, -1, 1, 0, height, column > 0);
  return path + ' Z';
}
if (typeof document !== 'undefined') {
  const grid = document.querySelector('.puzzle-grid');
  if (grid) {
    const pieces = [...grid.querySelectorAll('.puzzle-piece')];
    const draw = () => {
      pieces.forEach((piece, index) => {
        const width = piece.clientWidth, height = piece.clientHeight;
        if (!width || !height) return;
        for (const [selector, columns] of [['.piece-wide', 4], ['.piece-narrow', 2]]) {
          const svg = piece.querySelector(selector);
          svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
          svg.querySelector('path').setAttribute('d', puzzlePath(width, height, Math.floor(index / columns), index % columns, pieces.length / columns, columns));
        }
      });
    };
    new ResizeObserver(draw).observe(grid);
    draw();
  }
}
