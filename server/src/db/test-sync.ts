// src/db/test-sync.ts
import sequelize from './index';

async function testSync() {
  try {
    // Force sync drops existing tables and recreates them. Remove { force: true } in production.
    await sequelize.sync();
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing models:', error);
  } finally {
    await sequelize.close();
  }
}

testSync();
