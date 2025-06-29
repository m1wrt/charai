import { useState, useEffect } from 'react';
import { 
  Modal, ModalDialog, Typography, FormControl, 
  FormLabel, Input, Textarea, Button, Stack, 
  Option, Select, Slider, Chip
} from '@mui/joy';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

const emojiOptions = ['🤖', '🧙', '👽', '🐉', '🧝', '🦸', '🧚', '👻', '👾', '🐲'];
const aiModels = [
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'claude-2', label: 'Claude 2' },
  { value: 'llama-2-70b', label: 'Llama 2 (70B)' }
];

export default function CreateBotDialog({ open, onClose, onBotCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    emoji: '🤖',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    creator: '',
    creatorId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener nickname del usuario desde userdata
  useEffect(() => {
    const fetchUserNickname = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'userdata', auth.currentUser.uid));
          if (userDoc.exists()) {
            setFormData(prev => ({
              ...prev,
              creator: userDoc.data().nickname || auth.currentUser.email,
              creatorId: auth.currentUser.uid
            }));
          } else {
            // Si no existe userdata, usar email como fallback
            setFormData(prev => ({
              ...prev,
              creator: auth.currentUser.email,
              creatorId: auth.currentUser.uid
            }));
          }
        } catch (err) {
          console.error("Error obteniendo nickname:", err);
          setFormData(prev => ({
            ...prev,
            creator: auth.currentUser.email,
            creatorId: auth.currentUser.uid
          }));
        }
      }
    };

    fetchUserNickname();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('¡El nombre del bot es requerido!');
      return;
    }

    if (formData.temperature < 0 || formData.temperature > 1) {
      setError('La temperatura debe estar entre 0 y 1');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const botData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        emoji: formData.emoji,
        model: formData.model,
        temperature: Number(formData.temperature.toFixed(2)),
        creator: formData.creator,
        creatorId: formData.creatorId,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        isActive: true
      };

      const docRef = await addDoc(collection(db, 'characters'), botData);
      
      if (typeof onBotCreated === 'function') {
        onBotCreated(docRef.id);
      }
      
      onClose();
      setFormData({
        name: '',
        description: '',
        emoji: '🤖',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        creator: formData.creator, // Mantener el mismo creator para próximos bots
        creatorId: formData.creatorId
      });
    } catch (err) {
      setError(`Error al crear bot: ${err.message}`);
      console.error("Error creando bot:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ maxWidth: 500, width: '100%', overflowY: 'auto', maxHeight: '90vh' }}>
        <Typography level="h4" sx={{ mb: 2 }}>
          <AddIcon sx={{ mr: 1 }} />
          Nuevo Bot de IA
        </Typography>

        {error && (
          <Typography color="danger" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <InfoOutlined sx={{ mr: 1 }} />
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Sección Básica */}
            <Typography level="title-sm" sx={{ mb: -1 }}>Información Básica</Typography>
            
            <FormControl required>
              <FormLabel>Nombre del Bot</FormLabel>
              <Input
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ej: Asistente Mágico"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                minRows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Personalidad y capacidades del bot..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Icono</FormLabel>
              <Select
                value={formData.emoji}
                onChange={(e, newValue) => setFormData({...formData, emoji: newValue})}
              >
                {emojiOptions.map((emoji) => (
                  <Option key={emoji} value={emoji}>
                    {emoji}
                  </Option>
                ))}
              </Select>
            </FormControl>

            {/* Sección Modelo de IA */}
            <Typography level="title-sm" sx={{ mb: -1 }}>Configuración de IA</Typography>
            
            <FormControl required>
              <FormLabel>Modelo de IA</FormLabel>
              <Select
                value={formData.model}
                onChange={(e, newValue) => setFormData({...formData, model: newValue})}
              >
                {aiModels.map((model) => (
                  <Option key={model.value} value={model.value}>
                    {model.label}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>
                Creatividad (Temperatura): 
                <Chip size="sm" sx={{ ml: 1 }}>{formData.temperature.toFixed(1)}</Chip>
              </FormLabel>
              <Slider
                value={formData.temperature}
                onChange={(e, newValue) => setFormData({...formData, temperature: newValue})}
                min={0}
                max={1}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{ py: 1 }}
                marks={[
                  { value: 0, label: 'Preciso' },
                  { value: 1, label: 'Creativo' }
                ]}
              />
            </FormControl>

            {/* Sección Creador */}
            {formData.creator && (
              <FormControl>
                <FormLabel>Creador</FormLabel>
                <Input
                  value={formData.creator}
                  readOnly
                  disabled
                  sx={{ bgcolor: 'background.level1' }}
                />
              </FormControl>
            )}

            <Button 
              type="submit" 
              loading={loading}
              fullWidth
              size="lg"
              sx={{ mt: 2 }}
            >
              Crear Bot de IA
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}