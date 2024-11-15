import { io } from 'socket.io-client';
import { useTournamentStore } from '../store/tournamentStore';
import { initializeGoogleSheets } from './googleSheets';

class SyncService {
  private socket: any;
  private syncInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000');
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de sincronización');
    });

    this.socket.on('data_updated', async () => {
      await this.syncData();
    });

    this.socket.on('error', (error: any) => {
      useTournamentStore.getState().setError(error.message);
    });
  }

  public async startSync(intervalMinutes: number = 5) {
    // Sincronización inicial
    await this.syncData();
    
    // Configurar sincronización periódica
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, intervalMinutes * 60 * 1000);
  }

  public stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async syncData() {
    try {
      const doc = await initializeGoogleSheets();
      await useTournamentStore.getState().syncWithSheet();
      
      // Emitir evento de sincronización exitosa
      this.socket.emit('sync_complete', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error en sincronización:', error);
      useTournamentStore.getState().setError('Error en sincronización');
    }
  }
}

export const syncService = new SyncService();