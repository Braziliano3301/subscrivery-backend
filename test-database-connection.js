import { query, healthCheck, close } from './src/config/database.js';

/**
 * Script para testar conexão com PostgreSQL
 * Uso: npm run db:test
 */

console.log('\n🔌 Testando conexão com PostgreSQL...\n');

try {
  // Testar conexão
  const health = await healthCheck();
  
  if (health.status === 'connected') {
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    console.log(`📅 Timestamp: ${health.timestamp}`);
    console.log(`📝 Mensagem: ${health.message}\n`);

    // Listar tabelas
    console.log('📋 Tabelas no banco:\n');
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  Nenhuma tabela encontrada!');
      console.log('Execute: npm run db:setup\n');
    } else {
      result.rows.forEach(row => {
        console.log(`  • ${row.table_name}`);
      });
      console.log(`\n✅ Total: ${result.rows.length} tabelas\n`);

      // Contar registros em cada tabela
      console.log('📊 Contagem de registros:\n');
      const tables = result.rows.map(r => r.table_name);
      
      for (const table of tables) {
        try {
          const countResult = await query(`SELECT COUNT(*) FROM ${table};`);
          const count = countResult.rows[0].count;
          console.log(`  • ${table}: ${count} registros`);
        } catch (err) {
          console.log(`  • ${table}: [erro ao contar]`);
        }
      }
      console.log('');
    }

  } else {
    console.log('❌ Erro ao conectar ao PostgreSQL');
    console.log(`Erro: ${health.error}`);
    console.log(`\nVerifique:`);
    console.log('  • PostgreSQL está rodando?');
    console.log('  • Variáveis de ambiente (.env):');
    console.log('    - DB_HOST');
    console.log('    - DB_PORT');
    console.log('    - DB_NAME');
    console.log('    - DB_USER');
    console.log('    - DB_PASSWORD\n');
  }

} catch (error) {
  console.error('❌ Erro:', error.message);
  console.error('\nDetalhes:', error);
  process.exit(1);
} finally {
  await close();
  process.exit(0);
}
