const testConnection = async () => {
    try {
        const result = await pool.query('SELECT current_schema()');
        console.log(result.rows);
    } catch (err) {
        console.error('Erro ao conectar:', err);
    }
};

testConnection();