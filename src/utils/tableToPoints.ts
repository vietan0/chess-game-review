export default function tableToPoints(table: number[][]) {
  let result = '';

  for (let i = 0; i < table.length; i++) {
    const [x, y] = table[i];
    const stringified = `${x},${y}`;
    result += `${stringified} `;
  }

  return result;
}
