import bcrypt from 'bcrypt';

const saltRounds = 5;

export async function registerUser(name, email, pwd, db){

    try{
        const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if(checkEmail.rows.length > 0){
            console.log("Email already exists")
            res.render("sign-up.ejs", {
                emailExists: "This email has already been taken"
            })
        }else{
            // Password Hashing
            bcrypt.hash(pwd, saltRounds, async (err, hash) => {
                if(err){
                    console.log("Error hashing password", err)
                }else{  
                    const result = await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [
                        name, email, hash
                    ]);
                    console.log(result);
                }
            })
        }
    }catch(err){
        console.error(err)
    }
}

export async function loginUser(email, userPassword, db) {
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const data = result.rows;

        if (data.length > 0) {
            const savedPassword = data[0].password;
            const passwordMatch = await new Promise((resolve, reject) => {
                bcrypt.compare(userPassword, savedPassword, (err, correct) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(correct);
                    }
                });
            });

            if (passwordMatch) {
                return data[0];
            } else {
                return "wrong password";
            }
        } else {
            return "Email not registered";
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}