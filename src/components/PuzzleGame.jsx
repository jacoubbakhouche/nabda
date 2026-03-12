import React, { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, Trophy, Sparkles } from 'lucide-react';

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

export default function PuzzleGame({ onBack }) {
    const [tiles, setTiles] = useState([]);
    const [isWon, setIsWon] = useState(false);
    const [moves, setMoves] = useState(0);
    const [selectedImage, setSelectedImage] = useState('/puzzle_baby.png');
    const [showSelection, setShowSelection] = useState(true);

    const images = [
        { id: 'baby', src: '/puzzle_baby.png', label: 'صورة طفل' },
        { id: 'nature', src: '/puzzle_nature.png', label: 'منظر طبيعي' },
        { id: 'toys', src: '/puzzle_toys.png', label: 'ألعاب أطفال' },
        { id: 'flora', src: '/puzzle_flora.png', label: 'حديقة زهور' }
    ];

    const initGame = (img) => {
        setSelectedImage(img);
        const initialTiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
        // Shuffle tiles while ensuring solvability
        let shuffled = shuffle(initialTiles);
        while (!isSolvable(shuffled) || isAlreadyWon(shuffled)) {
            shuffled = shuffle(initialTiles);
        }
        setTiles(shuffled);
        setMoves(0);
        setIsWon(false);
        setShowSelection(false);
    };

    const shuffle = (array) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const isSolvable = (shuffled) => {
        let inversions = 0;
        for (let i = 0; i < TILE_COUNT - 1; i++) {
            for (let j = i + 1; j < TILE_COUNT; j++) {
                if (shuffled[i] !== 8 && shuffled[j] !== 8 && shuffled[i] > shuffled[j]) {
                    inversions++;
                }
            }
        }
        return inversions % 2 === 0;
    };

    const isAlreadyWon = (shuffled) => {
        return shuffled.every((tile, i) => tile === i);
    };
    const handleTileClick = (index) => {
        if (isWon) return;
        const emptyIndex = tiles.indexOf(8);
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
        const emptyCol = emptyIndex % GRID_SIZE;

        const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow);

        if (isAdjacent) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(moves + 1);
            if (isAlreadyWon(newTiles)) {
                setIsWon(true);
            }
        }
    };

    if (showSelection) {
        return (
            <div className="puzzle-selection flex-col align-center">
                <div className="flex-row align-center full-width" style={{ gap: '12px', marginBottom: '24px' }}>
                    <button onClick={onBack} className="back-btn">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="section-title" style={{ margin: 0 }}>اختر صورة للعبة</h2>
                </div>
                <div className="image-grid">
                    {images.map(img => (
                        <div key={img.id} className="image-card-puzzle" onClick={() => initGame(img.src)}>
                            <img src={img.src} alt={img.label} />
                            <span>{img.label}</span>
                        </div>
                    ))}
                </div>
                <style>{`
                    .puzzle-selection { padding: 20px; }
                    .full-width { width: 100%; }
                    .image-grid { display: grid; grid-template-columns: 1fr; gap: 20px; width: 100%; }
                    .image-card-puzzle {
                        background: #FFF; border-radius: 20px; padding: 12px;
                        border: 1px solid var(--border-light); cursor: pointer;
                        display: flex; flex-direction: column; align-items: center; gap: 10px;
                        transition: transform 0.2s;
                    }
                    .image-card-puzzle:active { transform: scale(0.98); }
                    .image-card-puzzle img { width: 100%; border-radius: 12px; aspect-ratio: 1; object-fit: cover; }
                    .image-card-puzzle span { font-weight: 700; color: var(--text-main); }
                `}</style>
            </div>
        );
    }

    return (
        <div className="puzzle-game-container flex-col align-center">
            <div className="flex-row justify-between align-center full-width" style={{ marginBottom: '24px' }}>
                <button onClick={() => setShowSelection(true)} className="back-btn">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-col align-center">
                    <span className="game-status">{isWon ? 'مبروك! لقد نجحتِ' : 'بقي القليل...'}</span>
                    <span className="moves-count">عدد الحركات: {moves}</span>
                </div>
                <button onClick={() => initGame(selectedImage)} className="back-btn">
                    <RotateCcw size={20} />
                </button>
            </div>

            <div className={`puzzle-grid ${isWon ? 'won' : ''}`}>
                {tiles.map((tile, index) => {
                    const isRow = Math.floor(tile / GRID_SIZE);
                    const isCol = tile % GRID_SIZE;
                    return (
                        <div
                            key={index}
                            className={`puzzle-tile ${tile === 8 ? 'empty' : ''}`}
                            onPointerDown={() => handleTileClick(index)}
                            style={{
                                backgroundImage: tile === 8 ? 'none' : `url(${selectedImage})`,
                                backgroundPosition: `${(isCol * 100) / (GRID_SIZE - 1)}% ${(isRow * 100) / (GRID_SIZE - 1)}%`,
                                backgroundSize: `${GRID_SIZE * 100}%`
                            }}
                        >
                        </div>
                    );
                })}
            </div>

            {isWon && (
                <div className="victory-overlay fade-in">
                    <Trophy size={64} color="#FFD700" className="victory-icon" />
                    <h2>أحسنتِ صنعاً!</h2>
                    <p>تركيب هذه الصور يساعد على الاسترخاء وصفاء الذهن.</p>
                    <button className="play-again-btn" onClick={() => setShowSelection(true)}>لعبة أخرى</button>
                </div>
            )}

            <style>{`
                .puzzle-game-container { 
                    padding: 20px; 
                    padding-bottom: 120px; 
                    width: 100%;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .game-status { font-weight: 700; color: var(--token-purple-pill); font-size: 16px; }
                .moves-count { font-size: 12px; color: var(--text-muted); }
                .puzzle-grid {
                    display: grid;
                    grid-template-columns: repeat(${GRID_SIZE}, 1fr);
                    gap: 8px;
                    width: 100%;
                    max-width: 340px;
                    aspect-ratio: 1;
                    background: #E5E7EB;
                    padding: 8px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    margin: 0 auto;
                    touch-action: none;
                }
                .puzzle-grid.won { pointer-events: none; }
                .puzzle-tile {
                    width: 100%;
                    height: 100%;
                    background-color: #FFF;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: transform 0.1s;
                    touch-action: none;
                }
                .puzzle-tile:active { transform: scale(0.95); }
                .puzzle-tile.empty { background: transparent; cursor: default; }

                .victory-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(255,255,255,0.95);
                    z-index: 1000; display: flex; flex-direction: column;
                    justify-content: center; align-items: center; text-align: center;
                    padding: 40px;
                }
                .victory-icon { margin-bottom: 20px; animation: bounce 1s infinite; }
                .play-again-btn {
                    margin-top: 30px; padding: 14px 40px; border-radius: 30px;
                    background: var(--token-purple-pill); color: #FFF; border: none;
                    font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
