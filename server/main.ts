import App from '@/core/App';
import EnvManager from '@/core/EnvManager';
import MongoDBClient from '@/clients/MongoDB.client';
import Logger from '@/shared/utils/Logger.utils';

async function main() {
  try {
    await EnvManager.init();

    await MongoDBClient.init({ url: EnvManager.getVar('MONGODB_URI') });
    await MongoDBClient.connect();

    await App.init();
    await App.run();

  } catch (error) {
    console.error(error);
    Logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

const gracefulShutdown = async (signal: string) => {
  Logger.info(`Received ${signal}, shutting down gracefully`);
  try {
    await MongoDBClient.disconnect();
    await App.shutdown();
    Logger.info('All clients disconnected and server shut down gracefully');
    process.exit(0);
  } catch (error) {
    Logger.error('Error during server shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

main();