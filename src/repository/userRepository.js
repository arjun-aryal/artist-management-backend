import { date } from "zod";
import { query } from "../db/db.js";
import { buildPagination } from "../utils/paginationHelper.js";

export const getAll = async ({
  tableName,
  colunm = ["*"],
  where = "",
  whereParams = [],
  orderBy = "",
  page,
  limit,
  paginate = true,
}) => {
  let baseQuery = `select ${colunm.join(",")} from ${tableName}`;
  if (where) {
    baseQuery += ` ${where}`;
  }
  if (orderBy) {
    baseQuery += ` ORDER BY ${orderBy}`;
  }

  const { clause, params } = buildPagination({ page, limit, paginate });

  const finalQuery = `${baseQuery} ${clause}`;

  const result = await query(finalQuery, [...whereParams, ...params]);
  // console.log(result);
  const total = parseInt(result.rowCount);

  return { data: result.rows, total: Math.ceil(total / limit) };
};

export const updateUserTable = async (value) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    dob,
    gender,
    address,
    role,
    id,
  } = value;

  const baseQuery = `update users
    SET 
      first_name = $1,
      last_name = $2,
      email = $3,
      phone = $4,
      dob  = DATE($5),
      gender = $6,
      address = $7,
      role_type = $8,
      updated_at = NOW()
    WHERE id = $9
    RETURNING id, first_name, last_name, email, phone, dob, gender, address,role_type,created_at, updated_at;
  `;

  const values = [
    first_name,
    last_name,
    email,
    phone || null,
    dob || null,
    gender || null,
    address || null,
    role,
    id,
  ];

  const result = await query(baseQuery, values);
  return result.rows;
};

export const getUserById = async (userId) => {
  const result = await query(
    `SELECT id,first_name,last_name,email FROM users WHERE id = $1`,
    [userId],
  );
  return result.rows[0];
};

export const deleteFromTable = async (tableName, userId) => {
  const result = await query(
    `DELETE FROM ${tableName} WHERE id = $1 RETURNING id`,
    [userId],
  );
};
