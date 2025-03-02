-- Create a function to add the salary column
CREATE OR REPLACE FUNCTION create_salary_column()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Add salary column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'salary') THEN
        ALTER TABLE users ADD COLUMN salary DOUBLE PRECISION;
    END IF;
END;
$$;
