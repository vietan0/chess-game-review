import { useEffect } from 'react';

import { useBoardStore } from './stores/useBoardStore';
import { useEvalStore } from './stores/useEvalStore';
import { useSelectGameStore } from './stores/useSelectGameStore';
import { useStageStore } from './stores/useStageStore';
import { useStockfishOutputStore } from './stores/useStockfishOutputStore';

import type { StockfishOutputStore } from './stores/useStockfishOutputStore';

const pgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.09.30"]
[Round "?"]
[White "vietan0"]
[Black "Lars3608"]
[Result "1-0"]
[TimeControl "900+10"]
[WhiteElo "1285"]
[BlackElo "1427"]
[Termination "vietan0 won by resignation"]
[ECO "B22"]
[EndTime "15:55:52 GMT+0000"]
[Link "https://www.chess.com/game/live/121450302277"]

1. e4 {[%clk 0:15:09.4][%timestamp 6]} 1... c5 {[%clk 0:15:08.4][%timestamp 16]}
2. Nf3 {[%clk 0:15:09.4][%timestamp 100]} 2... Nc6 {[%clk 0:15:14.8][%timestamp
36]} 3. c3 {[%clk 0:15:17.4][%timestamp 20]} 3... e6 {[%clk
0:15:13.9][%timestamp 109]} 4. d4 {[%clk 0:15:24.2][%timestamp 32]} 4... cxd4
{[%clk 0:15:18.6][%timestamp 53]} 5. cxd4 {[%clk 0:15:32.4][%timestamp 18]} 5...
d5 {[%clk 0:15:09.2][%timestamp 194]} 6. exd5 {[%clk 0:15:08.3][%timestamp 341]}
6... Qxd5 {[%clk 0:15:04.8][%timestamp 144]} 7. Nc3 {[%clk 0:15:08.5][%timestamp
98]} 7... Bb4 {[%clk 0:14:47.2][%timestamp 276]} 8. Bd2 {[%clk
0:15:06.1][%timestamp 124]} 8... Nxd4 {[%clk 0:14:35.8][%timestamp 214]} 9. Nxd5
{[%clk 0:15:11.7][%timestamp 44]} 1-0`;

const stockfishOutputStates: Partial<StockfishOutputStore> = {
  reviewState: 'finished',
  isListening: false,
  fenIndex: 17,
  best3Moves: [
    [
      {
        nodes: 148919,
        pv: 'e2e4',
        multiPv: 1,
        cp: 42,
      },
      {
        nodes: 148919,
        pv: 'd2d4',
        multiPv: 2,
        cp: 33,
      },
      {
        nodes: 148919,
        pv: 'c2c4',
        multiPv: 3,
        cp: 26,
      },
    ],
    [
      {
        nodes: 88070,
        pv: 'c7c5',
        multiPv: 1,
        cp: -20,
      },
      {
        nodes: 88070,
        pv: 'e7e5',
        multiPv: 2,
        cp: -36,
      },
      {
        nodes: 88070,
        pv: 'e7e6',
        multiPv: 3,
        cp: -37,
      },
    ],
    [
      {
        nodes: 134634,
        pv: 'g1f3',
        multiPv: 1,
        cp: 33,
      },
      {
        nodes: 134634,
        pv: 'c2c3',
        multiPv: 2,
        cp: 33,
      },
      {
        nodes: 134634,
        pv: 'b1c3',
        multiPv: 3,
        cp: 26,
      },
    ],
    [
      {
        nodes: 110651,
        pv: 'd7d6',
        multiPv: 1,
        cp: -29,
      },
      {
        nodes: 110651,
        pv: 'e7e6',
        multiPv: 2,
        cp: -32,
      },
      {
        nodes: 110651,
        pv: 'b8c6',
        multiPv: 3,
        cp: -56,
      },
    ],
    [
      {
        nodes: 72592,
        pv: 'f1b5',
        multiPv: 1,
        cp: 74,
      },
      {
        nodes: 72592,
        pv: 'c2c3',
        multiPv: 2,
        cp: 27,
      },
      {
        nodes: 72592,
        pv: 'b1c3',
        multiPv: 3,
        cp: 25,
      },
    ],
    [
      {
        nodes: 69184,
        pv: 'e7e5',
        multiPv: 1,
        cp: -15,
      },
      {
        nodes: 69184,
        pv: 'g8f6',
        multiPv: 2,
        cp: -17,
      },
      {
        nodes: 69184,
        pv: 'd7d5',
        multiPv: 3,
        cp: -35,
      },
    ],
    [
      {
        nodes: 81516,
        pv: 'f1b5',
        multiPv: 1,
        cp: 38,
      },
      {
        nodes: 81516,
        pv: 'd2d4',
        multiPv: 2,
        cp: 27,
      },
      {
        nodes: 81516,
        pv: 'f1e2',
        multiPv: 3,
        cp: 8,
      },
    ],
    [
      {
        nodes: 79036,
        pv: 'c5d4',
        multiPv: 1,
        cp: -46,
      },
      {
        nodes: 79036,
        pv: 'd7d5',
        multiPv: 2,
        cp: -50,
      },
      {
        nodes: 79036,
        pv: 'd7d6',
        multiPv: 3,
        cp: -104,
      },
    ],
    [
      {
        nodes: 73386,
        pv: 'f3d4',
        multiPv: 1,
        cp: 58,
      },
      {
        nodes: 73386,
        pv: 'c3d4',
        multiPv: 2,
        cp: 44,
      },
      {
        nodes: 73386,
        pv: 'f1c4',
        multiPv: 3,
        cp: -37,
      },
    ],
    [
      {
        nodes: 77284,
        pv: 'd7d5',
        multiPv: 1,
        cp: -49,
      },
      {
        nodes: 77284,
        pv: 'f8b4',
        multiPv: 2,
        cp: -90,
      },
      {
        nodes: 77284,
        pv: 'g8f6',
        multiPv: 3,
        cp: -104,
      },
    ],
    [
      {
        nodes: 59901,
        pv: 'e4e5',
        multiPv: 1,
        cp: 66,
      },
      {
        nodes: 59901,
        pv: 'e4d5',
        multiPv: 2,
        cp: 47,
      },
      {
        nodes: 59901,
        pv: 'b1c3',
        multiPv: 3,
        cp: 37,
      },
    ],
    [
      {
        nodes: 88748,
        pv: 'e6d5',
        multiPv: 1,
        cp: -35,
      },
      {
        nodes: 88748,
        pv: 'f8b4',
        multiPv: 2,
        cp: -53,
      },
      {
        nodes: 88748,
        pv: 'd8d5',
        multiPv: 3,
        cp: -72,
      },
    ],
    [
      {
        nodes: 84418,
        pv: 'b1c3',
        multiPv: 1,
        cp: 91,
      },
      {
        nodes: 84418,
        pv: 'f1d3',
        multiPv: 2,
        cp: 40,
      },
      {
        nodes: 84418,
        pv: 'a2a3',
        multiPv: 3,
        cp: 39,
      },
    ],
    [
      {
        nodes: 126093,
        pv: 'd5a5',
        multiPv: 1,
        cp: -58,
      },
      {
        nodes: 126093,
        pv: 'd5d8',
        multiPv: 2,
        cp: -59,
      },
      {
        nodes: 126093,
        pv: 'f8b4',
        multiPv: 3,
        cp: -88,
      },
    ],
    [
      {
        nodes: 106378,
        pv: 'f1d3',
        multiPv: 1,
        cp: 93,
      },
      {
        nodes: 106378,
        pv: 'a2a3',
        multiPv: 2,
        cp: 85,
      },
      {
        nodes: 106378,
        pv: 'f1e2',
        multiPv: 3,
        cp: 42,
      },
    ],
    [
      {
        nodes: 76752,
        pv: 'd5d8',
        multiPv: 1,
        cp: -26,
      },
      {
        nodes: 76752,
        pv: 'b4c3',
        multiPv: 2,
        cp: -67,
      },
      {
        nodes: 76752,
        pv: 'd5a5',
        multiPv: 3,
        cp: -75,
      },
    ],
    [
      {
        nodes: 153253,
        pv: 'c3d5',
        multiPv: 1,
        cp: 1092,
      },
      {
        nodes: 153253,
        pv: 'f1b5',
        multiPv: 2,
        cp: 822,
      },
      {
        nodes: 153253,
        pv: 'd1a4',
        multiPv: 3,
        cp: 95,
      },
    ],
    [
      {
        nodes: 343018,
        pv: 'b4d2',
        multiPv: 1,
        cp: -1038,
      },
      {
        nodes: 343018,
        pv: 'd4f3',
        multiPv: 2,
        cp: -1082,
      },
      {
        nodes: 343018,
        pv: 'e6d5',
        multiPv: 3,
        cp: -1159,
      },
    ],
  ],
  outputs: [
    'info depth 12 seldepth 17 multipv 1 score cp 42 nodes 148919 nps 461049 tbhits 0 time 323 pv e2e4 e7e6 d2d4 d7d5 e4d5 e6d5 f1d3 f8d6 g1f3 g8f6 e1g1 e8g8 c1g5',
    'info depth 12 seldepth 15 multipv 2 score cp 33 nodes 148919 nps 461049 tbhits 0 time 323 pv d2d4 g8f6 c2c4 e7e6 g1f3 d7d5 b1c3 c7c5 c4d5 f6d5 e2e4 d5c3 b2c3',
    'info depth 12 seldepth 17 multipv 3 score cp 26 nodes 148919 nps 461049 tbhits 0 time 323 pv c2c4 g8f6 d2d4 e7e6 g1f3 d7d5 b1c3 f8e7 c1f4 e8g8 e2e3 c7c5',
    'info depth 12 seldepth 15 multipv 1 score cp -20 nodes 88070 nps 356558 tbhits 0 time 247 pv c7c5 g1f3 e7e6 d2d4 c5d4 f3d4 b8c6 d4c6 b7c6 b1d2 d7d5 f1d3',
    'info depth 12 seldepth 17 multipv 2 score cp -36 nodes 88070 nps 356558 tbhits 0 time 247 pv e7e5 g1f3 g8f6 d2d4 d7d5 d4e5 f6e4 b1d2 e4d2 d1d2 f8e7 f1d3 e8g8',
    'info depth 12 seldepth 19 multipv 3 score cp -37 nodes 88070 nps 356558 tbhits 0 time 247 pv e7e6 g1f3 d7d5 e4d5 e6d5 d2d4 g8f6 f1d3 c7c5 e1g1 c5c4 f1e1 f8e7',
    'info depth 12 seldepth 18 multipv 1 score cp 33 nodes 134634 nps 375025 tbhits 0 time 359 pv g1f3 e7e6 c2c3 b8c6 d2d4 d7d5 e4d5 e6d5 f1b5 c5c4 d1e2 f8e7 e1g1',
    'info depth 12 seldepth 16 multipv 2 score cp 33 nodes 134634 nps 375025 tbhits 0 time 359 pv c2c3 e7e6 g1f3 b8c6 d2d4 d7d5 e4d5 e6d5 f1b5',
    'info depth 12 seldepth 17 multipv 3 score cp 26 nodes 134634 nps 375025 tbhits 0 time 359 pv b1c3 e7e6 g1f3 b8c6 d2d4 c5d4 f3d4 g8f6 a2a3 d8c7 d4b3 f8e7',
    'info depth 12 seldepth 16 multipv 1 score cp -29 nodes 110651 nps 362790 tbhits 0 time 305 pv d7d6 f1b5 c8d7 b5d7 d8d7 e1g1 b8c6 c2c3 e7e6 d2d4 d6d5 d4c5 d5e4 d1d7 e8d7',
    'info depth 12 seldepth 14 multipv 2 score cp -32 nodes 110651 nps 362790 tbhits 0 time 305 pv e7e6 c2c3 b8c6 d2d4 d7d5 e4d5 e6d5 f1b5 f8d6 d4c5 d6c5 e1g1 g8e7 f1e1',
    'info depth 12 seldepth 18 multipv 3 score cp -56 nodes 110651 nps 362790 tbhits 0 time 305 pv b8c6 f1b5 d8c7 e1g1 a7a6 b5c6 d7c6 d2d3 e7e5 a2a4 g8e7 f3d2 e7g6 d2c4 c8e6',
    'info depth 12 seldepth 15 multipv 1 score cp 74 nodes 72592 nps 342415 tbhits 0 time 212 pv f1b5 d8c7 e1g1 a7a6 b5c6 d7c6 d2d3 e7e5 a2a4 g8e7 f3d2 c8e6 a4a5 e7g6 d2c4',
    'info depth 12 seldepth 17 multipv 2 score cp 27 nodes 72592 nps 342415 tbhits 0 time 212 pv c2c3 d7d5 e4d5 d8d5 d2d4 c5d4 c3d4 e7e5 b1c3 f8b4 c1d2 b4c3 d2c3',
    'info depth 12 seldepth 15 multipv 3 score cp 25 nodes 72592 nps 342415 tbhits 0 time 212 pv b1c3 e7e6 d2d4 c5d4 f3d4 g8f6 f1e2 f8b4 d4c6 b7c6 e2d3 e6e5 e1g1',
    'info depth 12 seldepth 16 multipv 1 score cp -15 nodes 69184 nps 340807 tbhits 0 time 203 pv e7e5 f1b5 a7a6 b5a4 b7b5 a4c2 d7d5 e4d5 d8d5 e1g1 c8g4 h2h3',
    'info depth 12 seldepth 18 multipv 2 score cp -17 nodes 69184 nps 340807 tbhits 0 time 203 pv g8f6 d2d4 c5d4 e4e5 f6d5 c3d4 d7d6 f1c4 e7e6 e1g1 f8e7 c4d5',
    'info depth 12 seldepth 18 multipv 3 score cp -35 nodes 69184 nps 340807 tbhits 0 time 203 pv d7d5 e4d5 d8d5 d2d4 g8f6 f1e2 c5d4 c3d4 d5d8 c1e3 e7e6 b1c3 f8e7 h2h3 e8g8 e1g1 h7h6',
    'info depth 12 seldepth 17 multipv 1 score cp 38 nodes 81516 nps 335456 tbhits 0 time 243 pv f1b5 d7d5 e4d5 e6d5 d2d4 f8d6 d4c5 d6c5 e1g1 g8e7 b2b4 c5b6 f1e1 e8g8',
    'info depth 12 seldepth 18 multipv 2 score cp 27 nodes 81516 nps 335456 tbhits 0 time 243 pv d2d4 d7d5 e4d5 d8d5 b1a3 d5d8 a3c2 a7a6 f1e2 g8f6 d4c5 d8d1 e2d1',
    'info depth 12 seldepth 15 multipv 3 score cp 8 nodes 81516 nps 335456 tbhits 0 time 243 pv f1e2 g8f6 e4e5 f6d5 e1g1 d7d6 d2d4 c5d4 c3d4 d6e5 f3e5 f8d6 b1c3 e8g8 e5c6',
    'info depth 12 seldepth 19 multipv 1 score cp -46 nodes 79036 nps 298249 tbhits 0 time 265 pv c5d4 c3d4 d7d5 e4e5 g8e7 f1e2 c8d7 b1c3 e7f5 e1g1 f8e7 c3b5 e8g8 g2g4',
    'info depth 12 seldepth 17 multipv 2 score cp -50 nodes 79036 nps 298249 tbhits 0 time 265 pv d7d5 e4d5 e6d5 f1b5 g8f6 e1g1 f8e7 d4c5 e7c5 b1d2 e8g8 d2b3 c5d6 f1e1',
    'info depth 12 seldepth 14 multipv 3 score cp -104 nodes 79036 nps 298249 tbhits 0 time 265 pv d7d6 f1d3 g8f6 e1g1 f8e7 f1e1 e8g8 d4c5 d6c5 e4e5',
    'info depth 12 seldepth 16 multipv 1 score cp 58 nodes 73386 nps 292374 tbhits 0 time 251 pv f3d4 g8f6 d4c6 d7c6 d1d8 e8d8 b1d2 e6e5 d2f3 f6e4',
    'info depth 12 seldepth 16 multipv 2 score cp 44 nodes 73386 nps 292374 tbhits 0 time 251 pv c3d4 d7d5 e4e5 g8e7 b1c3 e7f5 f1e2 f8e7 e1g1 e8g8 g1h1 g8h8',
    'info depth 12 seldepth 15 multipv 3 score cp -37 nodes 73386 nps 292374 tbhits 0 time 251 pv f1c4 g8f6 e4e5 f6e4 c3d4 f8b4 c1d2 e4d2 b1d2 e8g8 e1g1',
    'info depth 12 seldepth 16 multipv 1 score cp -49 nodes 77284 nps 282058 tbhits 0 time 274 pv d7d5 e4e5 g8e7 b1c3 e7f5 f1e2 c8d7 e1g1 a8c8 g1h1 f8e7 g2g4 f5h4 f3h4 e7h4',
    'info depth 12 seldepth 14 multipv 2 score cp -90 nodes 77284 nps 282058 tbhits 0 time 274 pv f8b4 b1c3 g8f6 f1d3 d7d5 e4e5 f6e4 d1c2 d8a5 e1g1 e4c3 b2c3 b4c3 a1b1 c3d4',
    'info depth 12 seldepth 16 multipv 3 score cp -104 nodes 77284 nps 282058 tbhits 0 time 274 pv g8f6 f1d3 c6b4 b1c3 d7d5 e4e5 b4d3 d1d3 f6d7 e1g1 f8e7',
    'info depth 12 seldepth 18 multipv 1 score cp 66 nodes 59901 nps 167789 tbhits 0 time 357 pv e4e5 g8e7 f1d3 e7f5 d3f5 e6f5 b1c3 f8e7 c3e2 g7g5 c1d2 g5g4 f3g1 f7f6 e5f6 e7f6',
    'info depth 12 seldepth 12 multipv 2 score cp 47 nodes 59901 nps 167789 tbhits 0 time 357 pv e4d5 e6d5 b1c3 g8f6 f1b5 f8d6 e1g1 e8g8 h2h3 d6c7 f1e1',
    'info depth 12 seldepth 15 multipv 3 score cp 37 nodes 59901 nps 167789 tbhits 0 time 357 pv b1c3 d5e4 c3e4 f8b4 e4c3 g8f6 f1d3 e8g8 e1g1 f6d5',
    'info depth 12 seldepth 16 multipv 1 score cp -35 nodes 88748 nps 221316 tbhits 0 time 401 pv e6d5 b1c3 f8b4 f1d3 g8e7 e1g1 e8g8 h2h3 c8f5 f1e1 h7h6 d3f5 e7f5 a2a3',
    'info depth 12 seldepth 14 multipv 2 score cp -53 nodes 88748 nps 221316 tbhits 0 time 401 pv f8b4 c1d2 b4d2 d1d2 e6d5 f1b5 g8e7 e1g1 e8g8 b1c3 c8e6 f1e1',
    'info depth 12 seldepth 13 multipv 3 score cp -72 nodes 88748 nps 221316 tbhits 0 time 401 pv d8d5 f1d3 d5d8 e1g1 g8f6 f1e1 f8e7 b1c3 e8g8 d3b1 d8d6 a2a3',
    'info depth 12 seldepth 16 multipv 1 score cp 91 nodes 84418 nps 252748 tbhits 0 time 334 pv b1c3 d5d8 f1d3 g8f6 e1g1 f8e7 a2a3 e8g8 f1e1',
    'info depth 12 seldepth 15 multipv 2 score cp 40 nodes 84418 nps 252748 tbhits 0 time 334 pv f1d3 g8f6 a2a3 d5d6 b1c3 f8e7 h2h3 e8g8 c1e3 f8d8 e1g1 f6d5 c3e4',
    'info depth 12 seldepth 16 multipv 3 score cp 39 nodes 84418 nps 252748 tbhits 0 time 334 pv a2a3 g8f6 b1c3 d5d8 f1d3 a7a6 e1g1 f8e7 f1e1 b7b5 c3e4 e8g8 e4f6 e7f6',
    'info depth 12 seldepth 15 multipv 1 score cp -58 nodes 126093 nps 223569 tbhits 0 time 564 pv d5a5 a2a3 g8f6 f1d3 f8e7 c1f4 e8g8 b2b4 a5d8 e1g1 b7b6 a1c1',
    'info depth 12 seldepth 16 multipv 2 score cp -59 nodes 126093 nps 223569 tbhits 0 time 564 pv d5d8 f1b5 g8f6 e1g1 f8e7 f1e1 e8g8 a2a3 d8c7 f3e5 f8d8 b5c6 b7c6',
    'info depth 12 seldepth 15 multipv 3 score cp -88 nodes 126093 nps 223569 tbhits 0 time 564 pv f8b4 f1d3 d5a5 e1g1 g8e7 f1e1 e8g8 a2a3 b4c3 b2c3',
    'info depth 12 seldepth 16 multipv 1 score cp 93 nodes 106378 nps 169661 tbhits 0 time 627 pv f1d3 d5a5 d1c2 g8f6 e1g1 e8g8 a2a3 b4e7 f1d1 h7h6 c1f4 f8d8',
    'info depth 12 seldepth 15 multipv 2 score cp 85 nodes 106378 nps 169661 tbhits 0 time 627 pv a2a3 b4c3 b2c3 d5a5 d1c2 b7b6 c1d2 c8b7 c3c4 a5h5 f1e2 g8f6 e1g1',
    'info depth 12 seldepth 14 multipv 3 score cp 42 nodes 106378 nps 169661 tbhits 0 time 627 pv f1e2 g8f6 e1g1 d5d8 a2a3 b4e7 c1f4 e8g8 e2b5 e7d6 f4d6 d8d6 b5c6 d6c6',
    'info depth 12 seldepth 16 multipv 1 score cp -26 nodes 76752 nps 148744 tbhits 0 time 516 pv d5d8 a2a3 b4c3 b2c3 b7b6 f1d3 g8e7 e1g1 c8b7 d2g5 h7h6 g5e7 c6e7',
    'info depth 12 seldepth 16 multipv 2 score cp -67 nodes 76752 nps 148744 tbhits 0 time 516 pv b4c3 b2c3 b7b6 f1d3 g8f6 e1g1 e8g8 d2g5 c8b7 g5f6 g7f6 c3c4 d5d6',
    'info depth 12 seldepth 17 multipv 3 score cp -75 nodes 76752 nps 148744 tbhits 0 time 516 pv d5a5 a2a3 b4c3 b2c3 g8f6 f1d3 e8g8 e1g1 a5d8 d2g5 h7h6 g5h4 b7b6 f1e1 c8b7 f3e5 c6e5',
    'info depth 12 seldepth 19 multipv 1 score cp 1092 nodes 153253 nps 244813 tbhits 0 time 626 pv c3d5 d4f3 g2f3 b4d6 f1b5 e8f8 d5e3 d6e7 e1g1 a7a6 b5d3 g8f6 g1h1',
    'info depth 12 seldepth 20 multipv 2 score cp 822 nodes 153253 nps 244813 tbhits 0 time 626 pv f1b5 d4b5 c3d5 b4d2 d1d2 e6d5 d2e2 g8e7 e2b5 c8d7 b5e2 d5d4 e1g1 a7a6 e2e5 d7e6',
    'info depth 12 seldepth 13 multipv 3 score cp 95 nodes 153253 nps 244813 tbhits 0 time 626 pv d1a4 c8d7 c3d5 b4d2 e1d2 d7a4 d5c7 e8d7 c7a8 d4f3 g2f3 g8e7 f1c4',
    'info depth 12 seldepth 20 multipv 1 score cp -1038 nodes 343018 nps 419337 tbhits 0 time 818 pv b4d2 e1d2 d4f3 d1f3 e6d5 a1e1 g8e7 f1b5 c8d7 b5d7 e8d7 f3f7 d5d4 e1e7 d7d6 f7g7',
    'info depth 12 seldepth 21 multipv 2 score cp -1082 nodes 343018 nps 419337 tbhits 0 time 818 pv d4f3 d1f3 b4d2 e1d2 e6d5 a1e1 g8e7 e1e7 e8e7 f3a3 e7f6',
    'info depth 12 seldepth 16 multipv 3 score cp -1159 nodes 343018 nps 419337 tbhits 0 time 818 pv e6d5 d2b4 d4c6 f1b5 g8e7 e1g1 a7a6 b5c6 e7c6 d1a4 c8d7 f1e1 d7e6',
  ],
};

export default function useMockState() {
  // preload states for development
  const loadGame = useBoardStore(state => state.loadGame);
  const submitGame = useSelectGameStore(state => state.submitGame);
  const mock = useStockfishOutputStore(state => state.mock);
  const populate = useEvalStore(state => state.populate);
  const setStage = useStageStore(state => state.setStage);

  useEffect(() => {
    loadGame(pgn);
    submitGame();
    setStage('loaded');
    mock(stockfishOutputStates);
    populate();
  }, []);
}
