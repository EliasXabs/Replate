import sequelize from './index';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful.');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
