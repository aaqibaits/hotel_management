const connection = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
    // Create admin user (for initialization)
    static createAdmin(email, password, callback) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return callback(err);
            
            const query = 'INSERT INTO user (name, username, email, password) VALUES (?, ?, ?, ?)';
            connection.query(query, ['Admin', 'admin', email, hashedPassword], callback);
        });
    }

    // Login user
    static login(username, password, callback) {
        const query = 'SELECT * FROM user WHERE username = ? OR email = ?';
        connection.query(query, [username, username], (err, results) => {
            if (err) return callback(err);
            
            if (results.length === 0) {
                return callback(null, null, 'Invalid credentials');
            }
            
            const user = results[0];
            
            // Compare password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return callback(err);
                
                if (!isMatch) {
                    return callback(null, null, 'Invalid credentials');
                }
                
                // Create JWT payload
                const payload = {
                    user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                };
                
                // Sign token
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' },
                    (err, token) => {
                        if (err) throw err;
                        callback(null, token);
                    }
                );
            });
        });
    }
}

module.exports = User;