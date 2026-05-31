import { query } from "../db/db.js";
import { buildPagination } from "../utils/paginationHelper.js";

export const getAllUsers = async ({
  page,
  limit,
  search,
  role_type,
  sortBy = "id",
  order = "ASC",
}) => {
  const whereParams = [];
  const conditions = [];
  console.log("sortBy", sortBy);
  if (search) {
    whereParams.push(`%${search}%`);

    conditions.push(`
      (
        CONCAT(first_name, ' ', last_name) ILIKE $${whereParams.length}
        OR first_name ILIKE $${whereParams.length}
        OR last_name ILIKE $${whereParams.length}
        OR email ILIKE $${whereParams.length}
      )
    `);
  }

  if (role_type) {
    whereParams.push(role_type);
    conditions.push(`role_type = $${whereParams.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // const sortableColumns = {
  //   id: "id",
  //   first_name: "first_name",
  //   last_name: "last_name",
  //   email: "email",
  //   role_type: "role_type",
  //   created_at: "created_at",
  // };

  // const orderBy = sortableColumns[sort] || "id";
  const sortOrder = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM users
    ${where}
  `;

  const { clause, params } = buildPagination({
    page,
    limit,
    startIndex: whereParams.length + 1,
    paginate: true,
  });

  const baseQuery = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      address,
      role_type,
      COUNT(*) OVER()::int AS total_records
    FROM users
    ${where}
    ORDER BY ${sortBy} ${sortOrder}
    ${clause}
  `;
  const result = await query(baseQuery, [...whereParams, ...params]);
  const totalRecords = result.rows.length ? result.rows[0].total_records : 0;

  return {
    data: result.rows,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
  };
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
    role_type,
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
    role_type,
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
