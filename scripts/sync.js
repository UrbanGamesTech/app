import cron from 'node-cron';
import { syncService } from '../src/services/syncService';

// Programar sincronización automática cada 5 minutos
cron.schedule('*/5 * * * *', () => {
  console.log('Iniciando sincronización programada...');
  syncService.startSync();
});

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('Deteniendo sincronización...');
  syncService.stopSync();
  process.exit(0);
});