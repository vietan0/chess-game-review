interface Opening {
  eco: string;
  epd: string;
  name: string;
  pgn: string;
  uci: string;
}

const openings: Opening[];
declare module '*.tsv' {
  export default openings;
}
