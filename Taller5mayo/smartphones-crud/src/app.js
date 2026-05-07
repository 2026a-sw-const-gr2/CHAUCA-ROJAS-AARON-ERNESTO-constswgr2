const express = require('express');
const smartphoneRoutes = require('./routes/smartphoneRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'smartphones-crud funcionando',
    endpoints: {
      smartphones: '/api/smartphones',
    },
  });
});

app.use('/api/smartphones', smartphoneRoutes);

// Mantenimiento correctivo: este middleware centraliza errores no controlados
// para corregir fallos sin repetir respuestas en cada endpoint.
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`smartphones-crud escuchando en http://localhost:${PORT}`);
});
