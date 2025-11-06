import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, PlayCircle, Swords } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPlayers } from '@/store/slices/playersSlice';
import { fetchParties } from '@/store/slices/partiesSlice';

const Home = () => {
  const dispatch = useAppDispatch();
  const { players } = useAppSelector(state => state.players);
  const { parties } = useAppSelector(state => state.parties);

  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchParties());
  }, [dispatch]);

  const stats = [
    { 
      icon: Users, 
      label: 'Online Players', 
      value: players.filter(p => p.isOnline).length,
      color: 'text-primary'
    },
    { 
      icon: Swords, 
      label: 'Active Parties', 
      value: parties.filter(p => p.status === 'playing').length,
      color: 'text-secondary'
    },
    { 
      icon: Trophy, 
      label: 'Your Rank', 
      value: '#12',
      color: 'text-accent'
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
            Sentence Quest
          </h1>
          <p className="text-muted-foreground">Reorder. Compete. Conquer.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/players" className="block group">
            <Card className="p-8 bg-gradient-to-br from-card to-muted border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-primary/10 w-fit">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Find Players</h3>
                  <p className="text-muted-foreground">Browse players and challenge them to a match</p>
                </div>
                <Button variant="default" className="w-full group-hover:scale-105 transition-transform">
                  View Players
                </Button>
              </div>
            </Card>
          </Link>

          <Link to="/parties" className="block group">
            <Card className="p-8 bg-gradient-to-br from-card to-muted border-border hover:border-secondary transition-all duration-300 hover:shadow-glow">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-secondary/10 w-fit">
                  <PlayCircle className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Active Parties</h3>
                  <p className="text-muted-foreground">Join ongoing games or start a new party</p>
                </div>
                <Button variant="secondary" className="w-full group-hover:scale-105 transition-transform">
                  View Parties
                </Button>
              </div>
            </Card>
          </Link>

          <Link to="/game" className="block group">
            <Card className="p-8 bg-gradient-to-br from-card to-muted border-border hover:border-accent transition-all duration-300 hover:shadow-glow">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-accent/10 w-fit">
                  <Swords className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Quick Play</h3>
                  <p className="text-muted-foreground">Start a solo game and beat your high score</p>
                </div>
                <Button variant="default" className="w-full bg-accent hover:bg-accent/90 group-hover:scale-105 transition-transform">
                  Play Now
                </Button>
              </div>
            </Card>
          </Link>

          <Link to="/leaderboard" className="block group">
            <Card className="p-8 bg-gradient-to-br from-card to-muted border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-primary/10 w-fit">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Leaderboard</h3>
                  <p className="text-muted-foreground">Check rankings and top players</p>
                </div>
                <Button variant="outline" className="w-full group-hover:scale-105 transition-transform">
                  View Rankings
                </Button>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
