// src/RedCirclePage.tsx
import React from 'react';

function RedCirclePage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', // Ocupa al menos el 100% de la altura de la ventana
      backgroundColor: '#f0f0f0', // Un fondo suave para que el círculo destaque
    }}>
      <div style={{
        width: '150px',       // Ancho del círculo
        height: '150px',      // Altura del círculo (igual al ancho para que sea un círculo)
        backgroundColor: 'red', // Color rojo
        borderRadius: '50%',  // Esto lo convierte en un círculo
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',       // Color del texto
        fontSize: '1.5em',    // Tamaño del texto
        fontWeight: 'bold',   // Texto en negrita
      }}>
        Círculo
      </div>
    </div>
  );
}

export default RedCirclePage;