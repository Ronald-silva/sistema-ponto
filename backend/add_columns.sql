-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS salary DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS admission_date DATE;
