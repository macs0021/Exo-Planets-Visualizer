import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Ajusta esto según tus necesidades
    width: '100%', // Hace que el contenedor ocupe todo el ancho disponible
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <div style={containerStyle}>
        <App />
    </div>
)
