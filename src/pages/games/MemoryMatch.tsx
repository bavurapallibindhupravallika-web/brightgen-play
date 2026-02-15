import { useState, useEffect, useCallback } from "react";
import { Brain, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DoubtButton from "@/components/DoubtButton";
import PageShell from "@/components/PageShell";

const pairSets = [
  [{ word: "HELLO", meaning: "Greeting" }, { word: "DOG", meaning: "Animal" }, { word: "WATER", meaning: "Drink" }, { word: "SUN", meaning: "Star" }],
  [{ word: "APPLE", meaning: "Fruit" }, { word: "CAR", meaning: "Vehicle" }, { word: "BOOK", meaning: "Reading" }, { word: "RAIN", meaning: "Weather" }],
  [{ word: "TIGER", meaning: "Wild Cat" }, { word: "OCEAN", meaning: "Water Body" }, { word: "PIANO", meaning: "Instrument" }, { word: "ROCKET", meaning: "Spacecraft" }],
  [{ word: "ATOM", meaning: "Tiny Particle" }, { word: "GALAXY", meaning: "Star System" }, { word: "ENZYME", meaning: "Catalyst" }, { word: "PRISM", meaning: "Light Splitter" }],
  [{ word: "PHOTON", meaning: "Light Unit" }, { word: "NEURON", meaning: "Brain Cell" }, { word: "QUASAR", meaning: "Bright Object" }, { word: "GENOME", meaning: "DNA Set" }],
];

interface Card { id: number; text: string; pairId: number; flipped: boolean; matched: boolean; }

const MemoryMatch = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);

  const setupLevel = useCallback(() => {
    const pairCount = Math.min(3 + level, 8);
    const allPairs = pairSets.flat();
    const shuffled = [...allPairs].sort(() => Math.random() - 0.5).slice(0, pairCount);
    const cardList: Card[] = [];
    shuffled.forEach((pair, i) => {
      cardList.push({ id: i * 2, text: pair.word, pairId: i, flipped: false, matched: false });
      cardList.push({ id: i * 2 + 1, text: pair.meaning, pairId: i, flipped: false, matched: false });
    });
    setCards(cardList.sort(() => Math.random() - 0.5));
    setSelected([]);
    setMatches(0);
    setTotalPairs(pairCount);
  }, [level]);

  useEffect(() => { setupLevel(); }, [level]);

  const handleCardClick = (id: number) => {
    if (selected.length >= 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map((c) => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newSel = [...selected, id];
    setSelected(newSel);

    if (newSel.length === 2) {
      const [a, b] = newSel.map((sid) => newCards.find((c) => c.id === sid)!);
      if (a.pairId === b.pairId) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => c.pairId === a.pairId ? { ...c, matched: true } : c));
          setMatches((m) => m + 1);
          setScore((s) => s + level * 20);
          setSelected([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => newSel.includes(c.id) ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (matches > 0 && matches === totalPairs) {
      setTimeout(() => setLevel((l) => l + 1), 1000);
    }
  }, [matches, totalPairs]);

  const cols = cards.length <= 8 ? "grid-cols-4" : "grid-cols-4";

  return (
    <PageShell title="Memory Match" subtitle={`Level ${level} • Score: ${score}`} icon={<Brain className="w-7 h-7 text-foreground" />} gradientClass="from-purple-500 to-indigo-500">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-2">
          <div className="flex justify-between px-3 py-2 text-xs text-muted-foreground">
            <span>Matches: {matches}/{totalPairs}</span>
            <span>Level {level}</span>
          </div>
        </div>
        <div className={`grid ${cols} gap-3`}>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold p-2 transition-all duration-300
                ${card.matched ? "bg-green-500/30 text-green-300 border border-green-500/50" :
                  card.flipped ? "bg-primary/30 text-foreground border border-primary/50" :
                  "glass hover:bg-muted/50 text-muted-foreground"}`}
            >
              {card.flipped || card.matched ? card.text : "?"}
            </motion.button>
          ))}
        </div>

        {matches === totalPairs && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 text-center">
            <p className="text-green-400 font-bold text-lg">🎉 Level {level} Complete!</p>
            <p className="text-muted-foreground text-sm mt-1">Loading next level...</p>
          </motion.div>
        )}

        <Button variant="outline" onClick={setupLevel} className="w-full border-border/50 text-muted-foreground">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset Level
        </Button>
      </div>
      <DoubtButton />
    </PageShell>
  );
};

export default MemoryMatch;
