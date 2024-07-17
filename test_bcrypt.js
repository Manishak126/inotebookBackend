const bcrypt = require('bcryptjs');

const password = '12345';

// Step 1: Hash the password
bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        console.log(`Password from request: ${password}`);
        // console.log(`Password from database: ${user.password}`);
        console.log(`Hashed password: ${hash}`);
        
        // Step 2: Compare the password with the hash
        bcrypt.compare(password, hash, (err, result) => {
            if (err) throw err;
            
            console.log(`Password valid: ${result}`); // Should log true
        });
    });
});
