import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Swords } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPlayers, selectOpponent } from '@/store/slices/playersSlice';
import { createParty } from '@/store/slices/partiesSlice';
import { toast } from 'sonner';

const Players = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { players, loading } = useAppSelector(state => state.players);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChallenge = async (player: any) => {
    dispatch(selectOpponent(player));
    await dispatch(createParty({
      name: `Challenge: You vs ${player.name}`,
      type: 'versus',
      opponent: player.name
    }));
    toast.success(`Challenge sent to ${player.name}!`);
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Players</h1>
            <p className="text-muted-foreground">Find an opponent to challenge</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Players Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map((player) => (
              <Card key={player.id} className="p-6 bg-card border-border hover:border-primary/50 transition-all">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{player.avatar}</div>
                      <div>
                        <h3 className="font-bold">{player.name}</h3>
                        <p className="text-sm text-muted-foreground">Level {player.level}</p>
                      </div>
                    </div>
                    <Badge variant={player.isOnline ? "default" : "secondary"}>
                      {player.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Wins</p>
                      <p className="font-bold text-accent">{player.wins}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Losses</p>
                      <p className="font-bold text-destructive">{player.losses}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-bold">
                        {Math.round((player.wins / (player.wins + player.losses)) * 100)}%
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleChallenge(player)}
                    disabled={!player.isOnline}
                    className="w-full"
                    variant="default"
                  >
                    <Swords className="mr-2 h-4 w-4" />
                    Challenge
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
