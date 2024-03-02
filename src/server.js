import app from './app';
import PORT from './configPort';

app.listen(PORT, () => {
  console.log(`🚀 Server conectado na porta ${PORT} 📡`);
});
