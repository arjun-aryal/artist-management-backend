import { pool, query } from "../db/db.js";
import { buildPagination } from "../utils/paginationHelper.js";
import { createuser } from "./auth.js";

export const createArtist = async (data) => {
  const client = await pool.connect();

  try {
    const [first_name, ...rest] = data.name.split(" ");
    const last_name = rest.join(" ");

    const userData = {
      first_name,
      last_name,
      email: data.email,
      hashedPassword: data.hashedPassword,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      address: data.address,
      role_type: "artist",
    };

    await client.query("begin");

    const user = await createuser(userData, client);

    const userId = user[0].id;

    const artistResult = await query(
      `
      insert into artists (
        user_id,
        name,
        dob,
        gender,
        address,
        first_release_year,
        no_of_albums_released,
        created_by
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning *
      `,
      [
        userId,
        data.name,
        data.dob,
        data.gender,
        data.dob,
        data.first_release_year,
        data.no_of_albums_released,
        data.created_by,
      ],
      client,
    );

    await client.query("COMMIT");

    return artistResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};

export const getAllArtists = async ({
  page,
  limit,
  search,
  sortBy = "id",
  order = "ASC",
}) => {
  const whereParams = [];
  const conditions = [];

  if (search) {
    whereParams.push(`%${search}%`);

    conditions.push(`
      (
        name ILIKE $${whereParams.length}
        OR CAST(first_release_year AS TEXT) ILIKE $${whereParams.length}
      )
    `);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const sortOrder = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const { clause, params } = buildPagination({
    page,
    limit,
    startIndex: whereParams.length + 1,
    paginate: true,
  });

  const baseQuery = `
  select
    a.id,
    a.user_id,
    a.name,
    a.dob,
    a.gender,
    a.address,
    a.first_release_year,
    a.no_of_albums_released,
    a.created_at,
    a.updated_at,

    json_build_object(
      'id', creator.id,
      'name', CONCAT(creator.first_name, ' ', creator.last_name)
    ) AS created_by,

    COUNT(*) OVER()::int AS total_records

  FROM artists a
  LEFT JOIN users creator
    ON a.created_by = creator.id

  ${where}
  ORDER BY a.${sortBy} ${sortOrder}
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
