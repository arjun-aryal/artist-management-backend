import { query } from "../db/db.js";

export const getUserRole = async (userId, cl) => {
  const result = await query(`SELECT role_type FROM users WHERE id = $1`, [
    userId,
  ]);
  //   console.log("result = ", result.rows[0].role_type);
  return result.rows[0].role_type;
};

export const emailExist = async (email) => {
  const result = await query(`select id from users where email = $1 `, [email]);
  return result.rows;
};

export const createuser = async (data, client) => {
  // console.log(role_type);
  const result = await query(
    `INSERT INTO users 
     (first_name, last_name, email, password, phone, dob, gender, address, role_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, first_name, last_name, email, role_type`,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.hashedPassword,
      data.phone || null,
      data.dob || null,
      data.gender || null,
      data.address || null,
      data.role_type,
    ],
    client,
  );

  return result.rows;
};

export const getUserDataByEmail = async (email) => {
  const result = await query(
    `SELECT id, first_name, last_name, email, password, phone,dob,gender,address, role_type
   FROM users
   WHERE email = $1`,
    [email],
  );
  return result.rows[0];
};
