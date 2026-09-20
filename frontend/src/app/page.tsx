'use client';
// INTERFAZ DE INICIO DE SESIÓN PARA LA APLICACIÓN DE CONTROL DE GASOLINERAS
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token); 
      window.location.href = '/dashboard'; 

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al iniciar sesión: ' + errorMessage);
    }
  };

  return (
    <main style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Columna Izquierda: Panel 3D e Ilustrativo de Gasolinera */}
      <div style={{ 
        flex: 0.8, // Un poco más ancha para destacar la ilustración
        background: 'linear-gradient(135deg, #ff7b00 0%, #e65100 100%)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'relative',
        padding: '40px',
        overflow: 'hidden'
      }}>
        
        {/* Círculos de brillo de fondo para dar profundidad 3D */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: '-50px',
          left: '-50px',
          zIndex: 1
        }}></div>

        {/* Logo superior izquierdo */}
        <div style={{ position: 'absolute', top: '30px', left: '40px', color: '#fff', fontWeight: 'bold', fontSize: '22px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⛽</span> GasControl
        </div>

        {/* Contenedor con efecto 3D y sombras flotantes */}
        <div style={{ 
          textAlign: 'center', 
          color: '#fff', 
          zIndex: 2,
          transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)', // Efecto 3D de inclinación
          transition: 'transform 0.5s ease'
        }}>
          {/* Surtidor 3D grande con sombras profundas */}
          <div style={{ 
            fontSize: '450px', 
            marginBottom: '15px',
            filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.3)) drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2))',
            transform: 'scale(1.1)'
          }}>
            ⛽
          </div>

        </div>
      </div>

      {/* Columna Derecha: Formulario de Acceso Limpio */}
      <div style={{ 
        flex: 1.5, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#ffffff',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111', margin: '0 0 8px 0' }}>Bienvenido</h1>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Ingresa tus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#e65100', marginBottom: '8px', textTransform: 'uppercase' }}>
                Usuario
              </label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Ej. admin_surtidor" 
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  fontSize: '15px', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#f9f9f9',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#e65100', marginBottom: '8px', textTransform: 'uppercase' }}>
                Contraseña
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  fontSize: '15px', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#f9f9f9',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button 
              type="submit" 
              style={{ 
                width: '100%', 
                padding: '14px', 
                backgroundColor: '#ff6b00', 
                color: '#fff', 
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
                transition: 'background 0.2s'
              }}
            >
              Iniciar Sesión
            </button>
          </form>

        </div>
      </div>

    </main>
  );
}