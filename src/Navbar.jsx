import { useState } from 'react';
import { Avatar, Button, Dropdown, Menu, MenuItem, Typography, Box, MenuButton, IconButton } from '@mui/joy';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AddIcon from '@mui/icons-material/Add';
import CreateBotDialog from './CreateBotDialog';

export default function Navbar({ onBotCreated }) {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) return null;

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          bgcolor: 'background.surface',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 1100,
        }}
      >
        <Typography level="h4" fontWeight="lg" sx={{ ml: 2 }}>
          CharAI
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            variant="soft"
            color="neutral"
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              borderRadius: '50%',
              transition: '0.2s',
              '&:hover': { 
                bgcolor: 'background.level2',
                transform: 'scale(1.1)'
              }
            }}
            aria-label="Create new bot"
          >
            <AddIcon />
          </IconButton>

          <Dropdown>
            <MenuButton
              slots={{ root: Avatar }}
              slotProps={{
                root: {
                  variant: 'outlined',
                  sx: {
                    '--Avatar-size': '40px',
                    cursor: 'pointer',
                    bgcolor: 'background.level1',
                    '&:hover': { bgcolor: 'background.level2' }
                  }
                }
              }}
            >
              {user.email.charAt(0).toUpperCase()}
            </MenuButton>
            <Menu placement="bottom-end" sx={{ minWidth: 200 }}>
              <MenuItem disabled>
                <EmailRoundedIcon sx={{ mr: 1, color: 'text.tertiary' }} />
                <Typography level="body-sm">{user.email}</Typography>
              </MenuItem>
              <MenuItem 
                onClick={handleLogout} 
                sx={{ color: 'danger.plainColor' }}
              >
                <LogoutRoundedIcon sx={{ mr: 1 }} />
                Sign out
              </MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      </Box>

      <CreateBotDialog 
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onBotCreated={onBotCreated}
      />
    </>
  );
}