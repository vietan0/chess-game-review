import { Chess } from 'chess.js';

export default function lanToSan(lan: string, i: number, fens: string[]) {
  const possibleMoves = new Chess(fens[i]).moves({ verbose: true });
  const found = possibleMoves.find(move => move.lan === lan)!;

  if (!found) {
    console.error(`Cant find legal move ${lan} in fen [${i}]: ${fens[i]}`);

    return `lan-${lan}`;
  }

  return found!.san;
}
