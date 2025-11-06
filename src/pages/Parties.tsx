import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Clock, PlayCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchParties, setActiveParty, createParty } from '@/store/slices/partiesSlice';
import { toast } from 'sonner';

const Parties = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { parties, loading } = useAppSelector(state => state.parties);

  useEffect(() => {
    dispatch(fetchParties());
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      dispatch(fetchParties());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleJoinParty = (party: any) => {
    dispatch(setActiveParty(party));
    navigate('/game');
  };

  const handleCreateSoloParty = async () => {
    await dispatch(createParty({
      name: 'Solo Challenge',
      type: 'solo'
    }));
    toast.success('Solo party created!');
    navigate('/game');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'playing':
        return 'bg-accent';
      case 'waiting':
        return 'bg-primary';
      case 'finished':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Active Parties</h1>
              <p className="text-muted-foreground">Join a game or create your own</p>
            </div>
          </div>
          <Button onClick={handleCreateSoloParty} variant="default">
            <PlayCircle className="mr-2 h-4 w-4" />
            Solo Play
          </Button>
        </div>

        {/* Parties List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {parties.map((party) => (
              <Card key={party.id} className="p-6 bg-card border-border hover:border-primary/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{party.name}</h3>
                      <Badge className={getStatusColor(party.status)}>
                        {party.status}
                      </Badge>
                      <Badge variant="outline">
                        {party.type === 'solo' ? '1 Player' : 'VS'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Players:</span>
                        <span className="font-medium">{party.players.join(' vs ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(party.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {party.status === 'playing' && (
                      <Button variant="default" onClick={() => handleJoinParty(party)}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Watch
                      </Button>
                    )}
                    {party.status === 'waiting' && (
                      <Button variant="default" onClick={() => handleJoinParty(party)}>
                        Join Party
                      </Button>
                    )}
                    {party.status === 'finished' && (
                      <Button variant="outline" disabled>
                        Finished
                      </Button>
                    )}
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

export default Parties;
