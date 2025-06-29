import React, { useState, useEffect, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Button, Card, Input, Typography, Alert, CircularProgress } from '@mui/joy';
import { useNavigate, Navigate } from 'react-router-dom';

const RECAPTCHA_SITE_KEY = '6Le0LXErAAAAAKd45UhwVk9ys2oAgIh5fBI2d2JP';

function AuthPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: ''
  });
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      await setPersistence(auth, browserLocalPersistence);
      setAuthChecked(true);
      if (user?.emailVerified) navigate('/main');
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (mode === 'register' && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
      script.async = true;
      script.defer = true;
      script.onload = () => window.grecaptcha.ready(() => renderRecaptcha());
      document.body.appendChild(script);
    }
  }, [mode]);

  const renderRecaptcha = () => {
    if (recaptchaRef.current && window.grecaptcha && mode === 'register') {
      window.grecaptcha.render(recaptchaRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: 'light'
      });
    }
  };

  const handleAuth = async (provider = null) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (provider) {
        // Autenticación con Google
        const result = await signInWithPopup(auth, provider);
        await saveUserData(result.user);
      } else if (mode === 'login') {
        // Login normal
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Registro
        if (!formData.nickname.trim()) throw new Error('Nickname requerido');
        if (!window.grecaptcha?.getResponse()) throw new Error('Completa el reCAPTCHA');

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await saveUserData(userCredential.user);
        await sendEmailVerification(userCredential.user);
        setSuccess('¡Registro exitoso! Verifica tu correo.');
        resetForm();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = async (user) => {
    await setDoc(doc(db, 'userdata', user.uid), {
      userId: user.uid,
      nickname: user.displayName || formData.nickname.trim(),
      email: user.email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      ...(user.providerData[0].providerId === 'google.com' && { isGoogleAccount: true })
    });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      nickname: ''
    });
    setMode('login');
  };

  if (!authChecked) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  if (auth.currentUser?.emailVerified) return <Navigate to="/main" replace />;

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', my: 4, p: 3 }}>
      <Typography level="h2" sx={{ textAlign: 'center', mb: 3 }}>CharAI</Typography>
      
      {error && <Alert color="danger" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert color="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="h4" sx={{ textAlign: 'center', mb: 3 }}>
          {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </Typography>

        {mode === 'register' && (
          <Input
            placeholder="Nickname"
            value={formData.nickname}
            onChange={(e) => setFormData({...formData, nickname: e.target.value})}
            sx={{ mb: 2 }}
          />
        )}

        <Input
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          sx={{ mb: 2 }}
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          sx={{ mb: 2 }}
        />

        {mode === 'register' && (
          <div ref={recaptchaRef} style={{ marginBottom: '16px' }} />
        )}

        <Button
          loading={loading}
          onClick={() => handleAuth()}
          fullWidth
          sx={{ mb: 2 }}
        >
          {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </Button>

        <Button
          variant="outlined"
          onClick={() => handleAuth(new GoogleAuthProvider())}
          fullWidth
          sx={{ mb: 2 }}
        >
          Continuar con Google
        </Button>

        <Typography sx={{ textAlign: 'center' }}>
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <Button
            variant="plain"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setSuccess('');
            }}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </Button>
        </Typography>
      </Card>
    </Card>
  );
}

export default AuthPage;