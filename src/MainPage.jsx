import { Typography, Card, CardContent, Grid, Box, Button } from '@mui/joy';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore'; 

export default function HomePage() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'characters'));
        const charactersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCharacters(charactersData);
      } catch (err) {
        setError('Error al cargar personajes');
        console.error('Error fetching characters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [db, user]); // Añadí db como dependencia

  const handleCharacterClick = (characterId) => {
    if (user) {
      navigate(`/chat/${characterId}`);
    } else {
      navigate('/login', { 
        state: { 
          from: `/chat/${characterId}`,
          message: 'Inicia sesión para chatear con este personaje' 
        } 
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <Typography>Cargando personajes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <Typography color="danger">{error}</Typography>
        <Button onClick={() => window.location.reload()} sx={{ ml: 2 }}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: '80px', px: 3, pb: 3 }}>
      <Navbar />
      
      <Typography level="h1" sx={{ textAlign: 'center', mb: 4 }}>
        Elige tu personaje
      </Typography>
      
      <Grid container spacing={3} sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {characters.map((character) => (
          <Grid item xs={12} sm={6} md={4} key={character.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 'md',
                  borderColor: 'neutral.outlinedHoverBorder'
                }
              }}
            >
              <CardContent sx={{ 
                textAlign: 'center', 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography level="h2" sx={{ mb: 2, fontSize: '2.5rem' }}>
                  {character.emoji || '👤'}
                </Typography>
                <Typography level="title-lg" sx={{ mb: 1 }}>
                  {character.name}
                </Typography>
                <Typography level="body-sm" sx={{ mb: 2 }}>
                  {character.description}
                </Typography>
                <Typography level="body-sm" sx={{ mb: 2 }}>
                  {character.creator}
                </Typography>
                
                
                <Button
                  onClick={() => handleCharacterClick(character.id)}
                  sx={{ mt: 'auto', width: '100%' }}
                  loading={loading}
                >
                  {user ? 'Chatear' : 'Iniciar sesión'}
                </Button>
                
                {!user && (
                  <Typography level="body-xs" color="neutral" sx={{ mt: 1 }}>
                    Necesitas iniciar sesión
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}