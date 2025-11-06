import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Trophy, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startGame, endGame, updateWordOrder, checkAnswer, decrementTime } from '@/store/slices/gameSlice';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

const SortableWord = ({ id, word }: { id: string; word: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="px-4 py-3 bg-card border-2 border-primary rounded-lg cursor-move hover:border-secondary transition-all font-medium text-lg touch-none"
    >
      {word}
    </div>
  );
};

const Game = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentSentence, score, timeRemaining, isPlaying, completedSentences } = useAppSelector(state => state.game);
  const [words, setWords] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isPlaying) {
      dispatch(startGame());
    }
  }, []);

  useEffect(() => {
    if (currentSentence) {
      const orderedWords = currentSentence.currentOrder.map(i => currentSentence.words[i]);
      setWords(orderedWords);
    }
  }, [currentSentence]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      const timer = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleGameOver();
    }
  }, [isPlaying, timeRemaining]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWords((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCheckAnswer = () => {
    if (!currentSentence) return;

    const currentIndices = words.map(word => currentSentence.words.indexOf(word));
    dispatch(updateWordOrder(currentIndices));
    
    const isCorrect = JSON.stringify(currentIndices) === JSON.stringify(currentSentence.correctOrder);
    
    if (isCorrect) {
      toast.success('Correct! +100 points', {
        duration: 1000,
      });
      dispatch(checkAnswer());
    } else {
      toast.error('Not quite right. Try again!', {
        duration: 1500,
      });
    }
  };

  const handleGameOver = () => {
    dispatch(endGame());
    toast.success(`Game Over! Final Score: ${score}`, {
      duration: 3000,
    });
  };

  const handleRestart = () => {
    dispatch(startGame());
  };

  if (!isPlaying && timeRemaining === 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center space-y-6 bg-card border-border">
          <Trophy className="h-16 w-16 text-primary mx-auto" />
          <div>
            <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
            <p className="text-muted-foreground mb-4">Well played!</p>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary">Score: {score}</p>
              <p className="text-lg text-muted-foreground">Sentences Completed: {completedSentences}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleRestart} className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
              Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{timeRemaining}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              <span className="text-2xl font-bold">{score}</span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <Card className="p-8 bg-card border-border space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-medium text-muted-foreground">
              Arrange the words in the correct order
            </h2>
            <p className="text-sm text-muted-foreground">
              Drag and drop the words below
            </p>
          </div>

          {currentSentence && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={words}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-wrap gap-3 justify-center min-h-[80px]">
                  {words.map((word) => (
                    <SortableWord key={word} id={word} word={word} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div className="flex gap-3">
            <Button onClick={handleCheckAnswer} className="flex-1" size="lg">
              Check Answer
            </Button>
            <Button onClick={handleRestart} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Sentences Completed: <span className="font-bold text-foreground">{completedSentences}</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Game;
