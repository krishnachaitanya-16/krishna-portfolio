import { useState, useCallback, useEffect } from "react";

// ── Pieces ──────────────────────────────────────────────────────
const PIECES = {
  wK:"♔", wQ:"♕", wR:"♖", wB:"♗", wN:"♘", wP:"♙",
  bK:"♚", bQ:"♛", bR:"♜", bB:"♝", bN:"♞", bP:"♟",
};

// Piece values for AI evaluation
const PIECE_VALUE = { K:20000, Q:900, R:500, B:330, N:320, P:100 };

// Position bonus tables (for AI — encourages good positioning)
const PAWN_TABLE = [
  [0,0,0,0,0,0,0,0],
  [50,50,50,50,50,50,50,50],
  [10,10,20,30,30,20,10,10],
  [5,5,10,25,25,10,5,5],
  [0,0,0,20,20,0,0,0],
  [5,-5,-10,0,0,-10,-5,5],
  [5,10,10,-20,-20,10,10,5],
  [0,0,0,0,0,0,0,0],
];
const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,0,0,0,0,-20,-40],
  [-30,0,10,15,15,10,0,-30],
  [-30,5,15,20,20,15,5,-30],
  [-30,0,15,20,20,15,0,-30],
  [-30,5,10,15,15,10,5,-30],
  [-40,-20,0,5,5,0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50],
];

const initBoard = () => {
  const b = Array(8).fill(null).map(() => Array(8).fill(null));
  const order = ["R","N","B","Q","K","B","N","R"];
  order.forEach((p,i) => { b[0][i]=`b${p}`; b[7][i]=`w${p}`; });
  for (let i=0;i<8;i++) { b[1][i]="bP"; b[6][i]="wP"; }
  return b;
};

const color  = p => p ? p[0] : null;
const opponent = c => c==="w" ? "b" : "w";
const inBounds = (r,c) => r>=0&&r<8&&c>=0&&c<8;

function pawnMoves(board,r,c,piece,enPassant) {
  const moves=[];
  const dir=piece[0]==="w"?-1:1;
  const startRow=piece[0]==="w"?6:1;
  if (inBounds(r+dir,c) && !board[r+dir][c]) {
    moves.push([r+dir,c]);
    if (r===startRow && !board[r+2*dir][c]) moves.push([r+2*dir,c]);
  }
  for (const dc of[-1,1]) {
    if (inBounds(r+dir,c+dc)) {
      if (board[r+dir][c+dc] && color(board[r+dir][c+dc])!==piece[0]) moves.push([r+dir,c+dc]);
      if (enPassant && enPassant[0]===r+dir && enPassant[1]===c+dc) moves.push([r+dir,c+dc]);
    }
  }
  return moves;
}

function slideMoves(board,r,c,dirs,piece) {
  const moves=[];
  for (const [dr,dc] of dirs) {
    let nr=r+dr, nc=c+dc;
    while(inBounds(nr,nc)) {
      if (board[nr][nc]) { if(color(board[nr][nc])!==piece[0]) moves.push([nr,nc]); break; }
      moves.push([nr,nc]); nr+=dr; nc+=dc;
    }
  }
  return moves;
}

function getMoves(board,r,c,enPassant,castling) {
  const piece=board[r][c];
  if (!piece) return [];
  const type=piece[1], col=piece[0];
  let moves=[];
  if (type==="P") moves=pawnMoves(board,r,c,piece,enPassant);
  else if (type==="N") { for(const[dr,dc] of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) { const nr=r+dr,nc=c+dc; if(inBounds(nr,nc)&&color(board[nr][nc])!==col) moves.push([nr,nc]); } }
  else if (type==="B") moves=slideMoves(board,r,c,[[-1,-1],[-1,1],[1,-1],[1,1]],piece);
  else if (type==="R") moves=slideMoves(board,r,c,[[-1,0],[1,0],[0,-1],[0,1]],piece);
  else if (type==="Q") moves=slideMoves(board,r,c,[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]],piece);
  else if (type==="K") {
    for(const[dr,dc] of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
      const nr=r+dr,nc=c+dc;
      if(inBounds(nr,nc)&&color(board[nr][nc])!==col) moves.push([nr,nc]);
    }
    const row=col==="w"?7:0;
    if(r===row&&c===4) {
      if(castling[col].kingSide&&!board[row][5]&&!board[row][6]) moves.push([row,6]);
      if(castling[col].queenSide&&!board[row][3]&&!board[row][2]&&!board[row][1]) moves.push([row,2]);
    }
  }
  return moves;
}

function isInCheck(board,col) {
  let kr=-1,kc=-1;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]===`${col}K`) { kr=r;kc=c; }
  const opp=opponent(col);
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
    if(color(board[r][c])===opp) {
      const moves=getMoves(board,r,c,null,{w:{kingSide:false,queenSide:false},b:{kingSide:false,queenSide:false}});
      if(moves.some(([mr,mc])=>mr===kr&&mc===kc)) return true;
    }
  }
  return false;
}

function applyMove(board,from,to,enPassant) {
  const nb=board.map(r=>[...r]);
  const piece=nb[from[0]][from[1]];
  nb[to[0]][to[1]]=piece;
  nb[from[0]][from[1]]=null;
  if(piece[1]==="P"&&enPassant&&to[0]===enPassant[0]&&to[1]===enPassant[1]) nb[from[0]][to[1]]=null;
  if(piece==="wP"&&to[0]===0) nb[to[0]][to[1]]="wQ";
  if(piece==="bP"&&to[0]===7) nb[to[0]][to[1]]="bQ";
  if(piece[1]==="K"&&Math.abs(to[1]-from[1])===2) {
    if(to[1]===6) { nb[from[0]][5]=nb[from[0]][7]; nb[from[0]][7]=null; }
    if(to[1]===2) { nb[from[0]][3]=nb[from[0]][0]; nb[from[0]][0]=null; }
  }
  return nb;
}

function legalMoves(board,r,c,enPassant,castling) {
  const piece=board[r][c];
  if(!piece) return [];
  const col=piece[0];
  return getMoves(board,r,c,enPassant,castling).filter(([tr,tc]) => {
    const nb=applyMove(board,[r,c],[tr,tc],enPassant);
    return !isInCheck(nb,col);
  });
}

// ── Minimax AI ──────────────────────────────────────────────────
function evaluateBoard(board) {
  let score = 0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
    const p=board[r][c];
    if(!p) continue;
    const val = PIECE_VALUE[p[1]] || 0;
    let posBonus = 0;
    if(p[1]==="P") posBonus = p[0]==="w" ? PAWN_TABLE[r][c] : PAWN_TABLE[7-r][c];
    if(p[1]==="N") posBonus = p[0]==="w" ? KNIGHT_TABLE[r][c] : KNIGHT_TABLE[7-r][c];
    score += p[0]==="b" ? (val + posBonus) : -(val + posBonus);
  }
  return score;
}

function getAllMoves(board, col, enPassant, castling) {
  const moves = [];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
    if(color(board[r][c])===col) {
      const ms = legalMoves(board,r,c,enPassant,castling);
      ms.forEach(m => moves.push({ from:[r,c], to:m }));
    }
  }
  return moves;
}

function minimax(board, depth, alpha, beta, maximizing, enPassant, castling) {
  if(depth === 0) return { score: evaluateBoard(board) };

  const col = maximizing ? "b" : "w";
  const moves = getAllMoves(board, col, enPassant, castling);

  if(moves.length === 0) {
    if(isInCheck(board, col)) return { score: maximizing ? -99999 : 99999 };
    return { score: 0 }; // stalemate
  }

  // Move ordering: captures first for better pruning
  moves.sort((a,b) => {
    const capA = board[a.to[0]][a.to[1]] ? (PIECE_VALUE[board[a.to[0]][a.to[1]][1]] || 0) : 0;
    const capB = board[b.to[0]][b.to[1]] ? (PIECE_VALUE[board[b.to[0]][b.to[1]][1]] || 0) : 0;
    return capB - capA;
  });

  let bestMove = null;

  if(maximizing) {
    let maxScore = -Infinity;
    for(const move of moves) {
      const nb = applyMove(board, move.from, move.to, enPassant);
      let ep2 = null;
      if(board[move.from[0]][move.from[1]]==="bP" && move.to[0]-move.from[0]===2) ep2=[move.to[0]-1,move.to[1]];
      const result = minimax(nb, depth-1, alpha, beta, false, ep2, castling);
      if(result.score > maxScore) { maxScore=result.score; bestMove=move; }
      alpha = Math.max(alpha, maxScore);
      if(beta <= alpha) break; // prune
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    for(const move of moves) {
      const nb = applyMove(board, move.from, move.to, enPassant);
      let ep2 = null;
      if(board[move.from[0]][move.from[1]]==="wP" && move.from[0]-move.to[0]===2) ep2=[move.to[0]+1,move.to[1]];
      const result = minimax(nb, depth-1, alpha, beta, true, ep2, castling);
      if(result.score < minScore) { minScore=result.score; bestMove=move; }
      beta = Math.min(beta, minScore);
      if(beta <= alpha) break; // prune
    }
    return { score: minScore, move: bestMove };
  }
}

function aiMove(board, enPassant, castling) {
  // Depth 4 = strong play, takes ~1-2 seconds
  const result = minimax(board, 4, -Infinity, Infinity, true, enPassant, castling);
  return result.move || null;
}

// ── Component ────────────────────────────────────────────────────
export default function Chess() {
  const [board,      setBoard]      = useState(initBoard());
  const [selected,   setSelected]   = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [turn,       setTurn]       = useState("w");
  const [enPassant,  setEnPassant]  = useState(null);
  const [castling,   setCastling]   = useState({ w:{kingSide:true,queenSide:true}, b:{kingSide:true,queenSide:true} });
  const [status,     setStatus]     = useState("Your turn (White)");
  const [gameOver,   setGameOver]   = useState(false);
  const [captured,   setCaptured]   = useState({ w:[], b:[] });
  const [lastMove,   setLastMove]   = useState(null);
  const [thinking,   setThinking]   = useState(false);

  const checkGameOver = useCallback((b,col,ep,ca) => {
    const hasMoves = Array.from({length:8},(_,r)=>r).some(r =>
      Array.from({length:8},(_,c)=>c).some(c =>
        color(b[r][c])===col && legalMoves(b,r,c,ep,ca).length>0
      )
    );
    if (!hasMoves) {
      if(isInCheck(b,col)) setStatus(`Checkmate! ${opponent(col)==="w"?"White":"Black"} wins! 🏆`);
      else setStatus("Stalemate! Draw 🤝");
      setGameOver(true);
      return true;
    }
    if(isInCheck(b,col)) setStatus(`${col==="w"?"White":"Black"} is in check! ⚠️`);
    return false;
  },[]);

  const handleClick = useCallback((r,c) => {
    if (gameOver || turn!=="w" || thinking) return;
    const piece=board[r][c];

    if (selected) {
      const [sr,sc]=selected;
      if (highlights.some(([hr,hc])=>hr===r&&hc===c)) {
        const newBoard=applyMove(board,[sr,sc],[r,c],enPassant);
        const cap=board[r][c];
        if(cap) setCaptured(prev=>({...prev,b:[...prev.b,cap]}));

        const newCastling={w:{...castling.w},b:{...castling.b}};
        if(board[sr][sc]==="wK") { newCastling.w.kingSide=false; newCastling.w.queenSide=false; }
        if(board[sr][sc]==="wR"&&sc===7) newCastling.w.kingSide=false;
        if(board[sr][sc]==="wR"&&sc===0) newCastling.w.queenSide=false;

        let newEP=null;
        if(board[sr][sc]==="wP"&&sr-r===2) newEP=[r+1,c];

        setBoard(newBoard); setEnPassant(newEP); setCastling(newCastling);
        setLastMove([[sr,sc],[r,c]]); setSelected(null); setHighlights([]);

        if(!checkGameOver(newBoard,"b",newEP,newCastling)) {
          setTurn("b"); setThinking(true); setStatus("AI thinking... 🤔");
          setTimeout(() => {
            const move = aiMove(newBoard, newEP, newCastling);
            if(move) {
              const nb2=applyMove(newBoard,move.from,move.to,newEP);
              const cap2=newBoard[move.to[0]][move.to[1]];
              if(cap2) setCaptured(prev=>({...prev,w:[...prev.w,cap2]}));

              const nc2={w:{...newCastling.w},b:{...newCastling.b}};
              if(newBoard[move.from[0]][move.from[1]]==="bK") { nc2.b.kingSide=false; nc2.b.queenSide=false; }
              let ep2=null;
              if(newBoard[move.from[0]][move.from[1]]==="bP"&&move.to[0]-move.from[0]===2) ep2=[move.to[0]-1,move.to[1]];

              setBoard(nb2); setEnPassant(ep2); setCastling(nc2);
              setLastMove([move.from,move.to]);
              setThinking(false);
              if(!checkGameOver(nb2,"w",ep2,nc2)) { setTurn("w"); setStatus("Your turn (White)"); }
            } else {
              setThinking(false);
            }
          }, 50); // small delay so UI updates before heavy computation
        }
        return;
      }
      if(piece && color(piece)==="w") {
        setSelected([r,c]);
        setHighlights(legalMoves(board,r,c,enPassant,castling));
        return;
      }
      setSelected(null); setHighlights([]); return;
    }

    if (piece && color(piece)==="w") {
      setSelected([r,c]);
      setHighlights(legalMoves(board,r,c,enPassant,castling));
    }
  },[board,selected,highlights,turn,gameOver,enPassant,castling,checkGameOver,thinking]);

  const resetGame = () => {
    setBoard(initBoard()); setSelected(null); setHighlights([]);
    setTurn("w"); setEnPassant(null); setLastMove(null); setGameOver(false);
    setThinking(false); setCaptured({w:[],b:[]});
    setCastling({w:{kingSide:true,queenSide:true},b:{kingSide:true,queenSide:true}});
    setStatus("Your turn (White)");
  };

  const isHighlight = (r,c) => highlights.some(([hr,hc])=>hr===r&&hc===c);
  const isSelected  = (r,c) => selected&&selected[0]===r&&selected[1]===c;
  const isLastMove  = (r,c) => lastMove&&(lastMove[0][0]===r&&lastMove[0][1]===c||lastMove[1][0]===r&&lastMove[1][1]===c);

  const sqSize = typeof window!=="undefined" && window.innerWidth<600
    ? Math.floor((window.innerWidth-40)/8) : 72;

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px", fontFamily:"monospace" }}>
      <style>{`
        .chess-sq { transition: background 0.15s; cursor: pointer; }
        .chess-sq:hover { filter: brightness(1.25); }
        @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.15);opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"20px" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:"#7B2FBE", fontSize:"11px", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none", marginBottom:"12px", opacity:0.7 }}>
          ← Back to portfolio
        </a>
        <h1 style={{ fontSize:"clamp(24px,5vw,44px)", fontWeight:"900", color:"#fff", margin:0, letterSpacing:"-0.02em" }}>
          KC <span style={{ color:"#7B2FBE" }}>Chess</span> ♟️
        </h1>
        <p style={{ color:"#6b7280", fontSize:"11px", marginTop:"6px", letterSpacing:"0.15em" }}>YOU (WHITE) vs AI (BLACK) • MINIMAX DEPTH 4</p>
      </div>

      {/* Status */}
      <div style={{ marginBottom:"12px", padding:"8px 24px", borderRadius:"999px", background: gameOver?"rgba(123,47,190,0.2)":isInCheck(board,turn)?"rgba(239,68,68,0.15)":"rgba(123,47,190,0.1)", border:`1px solid ${gameOver?"rgba(123,47,190,0.5)":isInCheck(board,turn)?"rgba(239,68,68,0.4)":"rgba(123,47,190,0.3)"}`, display:"flex", alignItems:"center", gap:"8px" }}>
        {thinking && <div style={{ width:"12px", height:"12px", border:"2px solid #C084FC", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>}
        <p style={{ color: gameOver?"#C084FC":isInCheck(board,turn)?"#f87171":"#C084FC", fontSize:"13px", fontWeight:"600", margin:0 }}>{status}</p>
      </div>

      {/* Captured by black (black captured white pieces) */}
      <div style={{ height:"22px", marginBottom:"6px", fontSize:"14px", opacity:0.8 }}>
        {captured.b.map((p,i)=>(
          <span key={i} style={{ filter:"drop-shadow(0 0 3px rgba(255,255,255,0.5))", color:"#ffffff" }}>{PIECES[p]}</span>
        ))}
      </div>

      {/* Board */}
      <div style={{ border:"2px solid rgba(123,47,190,0.4)", borderRadius:"8px", overflow:"hidden", boxShadow:"0 0 60px rgba(123,47,190,0.25)" }}>
        {board.map((row,r)=>(
          <div key={r} style={{ display:"flex" }}>
            {row.map((piece,c)=>{
              const light=(r+c)%2===0;
              let bg = light ? "#c8b89a" : "#8b6340"; // ✅ Classic chess board colors
              if(isLastMove(r,c)) bg = light ? "#f6f669" : "#baca2b"; // yellow highlight
              if(isHighlight(r,c)) bg = piece ? "rgba(239,68,68,0.75)" : (light?"rgba(123,47,190,0.55)":"rgba(123,47,190,0.7)");
              if(isSelected(r,c)) bg = "#7B2FBE";

              const isWhitePiece = piece && piece[0]==="w";
              const isBlackPiece = piece && piece[0]==="b";

              return (
                <div key={c} className="chess-sq"
                  onClick={()=>handleClick(r,c)}
                  style={{ width:`${sqSize}px`, height:`${sqSize}px`, background:bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", userSelect:"none" }}
                >
                  {/* Move dot */}
                  {isHighlight(r,c) && !piece && (
                    <div style={{ width:"28%", height:"28%", borderRadius:"50%", background:"rgba(123,47,190,0.8)", animation:"pulse-ring 1s infinite" }}/>
                  )}

                  {/* Piece — ✅ White pieces: white with dark outline, Black pieces: dark with light outline */}
                  {piece && (
                    <span style={{
                      fontSize:`${sqSize*0.72}px`,
                      lineHeight:1,
                      zIndex:1,
                      // ✅ KEY FIX: clear visual difference between white and black
                      color: isWhitePiece ? "#ffffff" : "#1a0a2e",
                      textShadow: isWhitePiece
                        ? "0 0 3px #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 8px rgba(255,255,255,0.4)"
                        : "0 0 3px #fff, 1px 1px 0 rgba(255,255,255,0.3), -1px -1px 0 rgba(255,255,255,0.3), 0 0 6px rgba(0,0,0,0.4)",
                      filter: isWhitePiece
                        ? "drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                        : "drop-shadow(0 2px 4px rgba(255,255,255,0.3))",
                    }}>
                      {PIECES[piece]}
                    </span>
                  )}

                  {/* Coordinates */}
                  {c===0 && <span style={{ position:"absolute", top:"2px", left:"3px", fontSize:"9px", color: light?"#8b6340":"#c8b89a", fontWeight:"700" }}>{8-r}</span>}
                  {r===7 && <span style={{ position:"absolute", bottom:"1px", right:"3px", fontSize:"9px", color: light?"#8b6340":"#c8b89a", fontWeight:"700" }}>{String.fromCharCode(97+c)}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Captured by white (white captured black pieces) */}
      <div style={{ height:"22px", marginTop:"6px", fontSize:"14px", opacity:0.8 }}>
        {captured.w.map((p,i)=>(
          <span key={i} style={{ filter:"drop-shadow(0 0 3px rgba(0,0,0,0.8))", color:"#1a0a2e" }}>{PIECES[p]}</span>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:"12px", marginTop:"16px", alignItems:"center" }}>
        <button onClick={resetGame} style={{ padding:"10px 28px", background:"linear-gradient(135deg,#7B2FBE,#C084FC)", border:"none", borderRadius:"8px", color:"#fff", fontSize:"12px", fontWeight:"700", letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer", transition:"opacity 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >
          New Game
        </button>
      </div>

      <p style={{ color:"#4b5563", fontSize:"11px", marginTop:"12px", letterSpacing:"0.1em", textAlign:"center" }}>
        Click a piece to select • Click highlighted square to move • AI uses Minimax + Alpha-Beta pruning
      </p>
    </div>
  );
}