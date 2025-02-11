-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Insert initial project
INSERT INTO "Project" (id, name, active, createdAt, updatedAt) 
VALUES (
    '8c6f4cee-e986-4146-b70f-016897a6e359',
    'JOSE RONALD DA SILVA',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
