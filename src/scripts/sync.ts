import { useTournamentStore } from '../store/tournamentStore';

async function sync() {
  try {
    await useTournamentStore.getState().syncWithSheet();
    console.log('Sincronización completada');
  } catch (error) {
    console.error('Error en la sincronización:', error);
    process.exit(1);
  }
}

// Ejecutar sincronización cada 5 minutos
setInterval(sync, 5 * 60 * 1000);

// Sincronización inicial
sync();