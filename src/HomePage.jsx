// src/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para navegar entre páginas
import { Button, Card, Typography } from '@mui/joy'; // Reutilizamos Joy UI para consistencia
import { useAuth } from './AuthContext'; // Importamos el hook que te da el estado de autenticación
import { auth } from './firebase'; // Importa tu instancia de auth
import { signOut } from 'firebase/auth'; // Para cerrar sesión

function HomePage() {
  const { user, loading } = useAuth(); // Obtenemos el usuario y el estado de carga del contexto

  // Función para manejar el cierre de sesión
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('Sesión cerrada correctamente desde la página de inicio.');
    } catch (error) {
      console.error('Error al cerrar sesión desde la página de inicio:', error.message);
      alert('Error al cerrar sesión: ' + error.message);
    }
  };

  if (loading) {
    // Muestra un indicador de carga mientras se verifica el estado de autenticación inicial
    return (
      <Card variant='plain' sx={{ p: 4, textAlign: 'center' }}>
        <Typography level="h3">Cargando aplicación...</Typography>
        <Typography>Verificando el estado de autenticación.</Typography>
      </Card>
    );
  }

  return (
    <Card variant='plain' sx={{
      mx: {
        xs: '1%',
        sm: '10%',
        md: '15%',
      },
      p: 4,
      textAlign: 'center'
    }} className="home-page-container">
      <center><h1>Bienvenido a CharAI</h1></center>

      {user ? (
        // Si el usuario está logueado
        <Card className="user-info-card">
          <Typography level="h3" sx={{ mb: 2 }}>¡Hola, {user.displayName || user.email}!</Typography>
          <Typography level="body-md" sx={{ mb: 1 }}>Estás logueado con el UID: {user.uid}</Typography>
          {user.emailVerified ? (
            <Typography level="body-md" color="success" sx={{ mb: 2 }}>Tu correo electrónico está verificado. 🎉</Typography>
          ) : (
            <Typography level="body-md" color="warning" sx={{ mb: 2 }}>Tu correo electrónico NO está verificado. Por favor, verifica tu bandeja de entrada.</Typography>
          )}

          <Button component={Link} to="/dashboard" sx={{ mb: 1, width: '100%' }}>
            Ir al Dashboard (Página Protegida)
          </Button>
          <Button component={Link} to="/profile" sx={{ mb: 1, width: '100%' }}>
            Ver mi Perfil (Página Protegida)
          </Button>
          <Button onClick={handleSignOut} color="danger" sx={{ mt: 2, width: '100%' }}>
            Cerrar Sesión
          </Button>
        </Card>
      ) : (
        // Si no hay usuario logueado
        <Card className="guest-info-card">
          <Typography level="h3" sx={{ mb: 2 }}>¡Parece que no has iniciado sesión!</Typography>
          <Typography level="body-md" sx={{ mb: 3 }}>
            Para acceder a todas las funciones de CharAI, por favor, inicia sesión o regístrate.
          </Typography>
          <Button component={Link} to="/login" sx={{ width: '100%' }}>
            Iniciar Sesión / Registrarse
          </Button>
        </Card>
      )}
    </Card>
  );
}

export default HomePage;
