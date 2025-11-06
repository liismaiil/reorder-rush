import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLeaderboard } from '@/store/slices/leaderboardSlice';

const Leaderboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector(state => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-primary" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-destructive" />;
      default:
        return <span className="text-xl font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">Top players and champions</p>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {!loading && entries.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <Card className="p-6 bg-card border-border text-center mt-8">
              <div className="space-y-3">
                <Medal className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="text-4xl">{entries[1].avatar}</div>
                <h3 className="font-bold">{entries[1].playerName}</h3>
                <p className="text-2xl font-bold text-primary">{entries[1].score}</p>
                <Badge variant="secondary">#{entries[1].rank}</Badge>
              </div>
            </Card>

            {/* 1st Place */}
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary text-center">
              <div className="space-y-3">
                <Trophy className="h-16 w-16 text-primary mx-auto animate-pulse" />
                <div className="text-5xl">{entries[0].avatar}</div>
                <h3 className="font-bold text-xl">{entries[0].playerName}</h3>
                <p className="text-3xl font-bold text-primary">{entries[0].score}</p>
                <Badge className="bg-primary">Champion</Badge>
              </div>
            </Card>

            {/* 3rd Place */}
            <Card className="p-6 bg-card border-border text-center mt-8">
              <div className="space-y-3">
                <Award className="h-12 w-12 text-destructive mx-auto" />
                <div className="text-4xl">{entries[2].avatar}</div>
                <h3 className="font-bold">{entries[2].playerName}</h3>
                <p className="text-2xl font-bold text-primary">{entries[2].score}</p>
                <Badge variant="secondary">#{entries[2].rank}</Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Full Leaderboard */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className={`p-4 bg-card border-border hover:border-primary/50 transition-all ${
                  entry.rank <= 3 ? 'border-primary/30' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  <div className="text-3xl">{entry.avatar}</div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{entry.playerName}</h3>
                    <p className="text-sm text-muted-foreground">{entry.wins} wins</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{entry.score}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
