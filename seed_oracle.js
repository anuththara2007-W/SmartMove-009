require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { oracledb, initializeOracle } = require('./config/oracle');

async function seedOracle() {
    let connection;
    try {
        console.log('Initializing Oracle Database connection...');
        await initializeOracle();
        connection = await oracledb.getConnection();
        console.log('Successfully connected to Oracle Database!');

        const sqlFilePath = path.join(__dirname, 'client', 'docs', 'seed_oracle.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        // Strip block comments first
        const strippedSql = sqlContent.replace(/\/\*[\s\S]*?\*\//g, '');

        // Split SQL statements by ';'
        const rawStatements = strippedSql.split(';');
        const statements = [];

        for (const raw of rawStatements) {
            // Strip line comments and trim
            const cleaned = raw.replace(/--.*$/gm, '').trim();
            if (cleaned.toUpperCase().startsWith('INSERT')) {
                statements.push(cleaned);
            }
        }

        console.log(`Clearing existing test data in foreign-key safe order...`);
        const cleanupTables = ['PAYMENTS', 'TICKETS', 'TRIPS', 'MAINTENANCE', 'VEHICLES', 'DRIVERS', 'ROUTES', 'PASSENGERS'];
        for (const tbl of cleanupTables) {
            try {
                await connection.execute(`DELETE FROM ${tbl}`);
                console.log(`Cleared ${tbl}`);
            } catch (err) {
                console.warn(`Warning clearing ${tbl}:`, err.message);
            }
        }
        await connection.commit();

        console.log(`Executing ${statements.length} seed INSERT statements...`);
        let successCount = 0;
        for (const stmt of statements) {
            if (stmt.toUpperCase().startsWith('INSERT')) {
                try {
                    await connection.execute(stmt);
                    successCount++;
                } catch (err) {
                    console.error('Error executing statement:', stmt.substring(0, 60), '...', err.message);
                }
            }
        }

        await connection.commit();
        console.log(`\nSuccessfully executed and committed ${successCount} statements!`);
        console.log('>>> ORACLE SEEDING COMPLETED SUCCESSFULLY! <<<');
    } catch (err) {
        console.error('Fatal Oracle Seeding Error:', err);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Oracle connection closed.');
            } catch (closeErr) {
                console.error('Error closing Oracle connection:', closeErr);
            }
        }
    }
}

seedOracle();
