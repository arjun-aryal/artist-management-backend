import { pool } from "./db.js";

export const createTables = async () => {
  try {
    //emums
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE gender_enum AS ENUM ('m', 'f', 'o');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      
      `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE role_enum AS ENUM (
          'super_admin',
          'artist_manager',
          'artist'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;      
      `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE genre_enum AS ENUM (
          'rnb',
          'country',
          'classic',
          'rock',
          'jazz'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;      
      `);

    // users table
    await pool.query(`
      create table if not exists users (
        id serial primary key,
        first_name varchar(255),
        last_name varchar(255),
        email varchar(255) unique,
        password varchar(500),
        phone varchar(20),
        dob date,
        gender gender_enum,
        address varchar(255),
        role_type role_enum Not null default 'artist',
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp

      );
    `);

    // artists table
    await pool.query(`
      create table if not exists artists (
        id serial primary key,
        user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name varchar(100),
        dob date,
        gender gender_enum,
        address varchar(255),
        first_release_year int check (first_release_year >= 1700),
        no_of_albums_released int,        
        created_by int references users(id) on delete set null,
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp
      );
    `);

    // songs table
    await pool.query(`
      create table if not exists musics (
        id serial primary key,
        artist_id int references artists(id) on delete cascade,
        title varchar(255),
        album_name varchar(255),
        genre genre_enum,
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp
      );
    `);

    console.log("all table created successfully");
  } catch (err) {
    console.error("Error = ", err);
    throw err;
  }
};
