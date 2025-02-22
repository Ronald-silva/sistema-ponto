-- Create a function to add the required columns
CREATE OR REPLACE FUNCTION create_employee_columns()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Add salary column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'salary') THEN
        ALTER TABLE users ADD COLUMN salary DOUBLE PRECISION;
    END IF;

    -- Add birth_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'birth_date') THEN
        ALTER TABLE users ADD COLUMN birth_date DATE;
    END IF;

    -- Add admission_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'admission_date') THEN
        ALTER TABLE users ADD COLUMN admission_date DATE;
    END IF;
END;
$$;
