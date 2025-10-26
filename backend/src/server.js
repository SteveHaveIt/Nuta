const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Nuta Backend API running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Admin Dashboard: http://localhost:${PORT}/admin`);
});
