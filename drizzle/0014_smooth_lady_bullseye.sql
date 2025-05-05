-- Disable foreign key checks temporarily to allow table modifications
PRAGMA foreign_keys=off;

-- Begin transaction for atomicity
BEGIN TRANSACTION;

-- Migration for 'properties_with_construction' table (Change onDelete to CASCADE)

-- 1. Create a new table with the desired schema (including ON DELETE CASCADE)
CREATE TABLE properties_with_construction_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL UNIQUE REFERENCES property(id) ON DELETE CASCADE,
    num_bedrooms INTEGER DEFAULT 1 NOT NULL,
    num_bathrooms REAL DEFAULT 1 NOT NULL,
    construction_size REAL NOT NULL,
    year_built INTEGER NOT NULL,
    garage_space INTEGER DEFAULT 0 NOT NULL
);

-- 2. Copy data from the old table to the new table
INSERT INTO properties_with_construction_new (id, property_id, num_bedrooms, num_bathrooms, construction_size, year_built, garage_space)
SELECT id, property_id, num_bedrooms, num_bathrooms, construction_size, year_built, garage_space
FROM properties_with_construction;

-- 3. Drop the old table
DROP TABLE properties_with_construction;

-- 4. Rename the new table to the original name
ALTER TABLE properties_with_construction_new RENAME TO properties_with_construction;

-- Note: Indexes like PRIMARY KEY and UNIQUE constraints are typically recreated automatically
-- with the table definition. If you had other custom indexes on the old table,
-- you would recreate them here using CREATE INDEX statements.


-- Migration for 'property_features' table (Add onDelete CASCADE to property_id FK)

-- 1. Create a new table with the desired schema (including ON DELETE CASCADE for both FKs)
CREATE TABLE property_features_new (
    property_id INTEGER NOT NULL REFERENCES property(id) ON DELETE CASCADE,
    feature_id INTEGER NOT NULL REFERENCES features(id) ON DELETE CASCADE, -- This FK already had CASCADE
    PRIMARY KEY (property_id, feature_id)
);

-- 2. Copy data from the old table to the new table
INSERT INTO property_features_new (property_id, feature_id)
SELECT property_id, feature_id
FROM property_features;

-- 3. Drop the old table
DROP TABLE property_features;

-- 4. Rename the new table to the original name
ALTER TABLE property_features_new RENAME TO property_features;

-- 5. Recreate any indexes that were on the old table (besides PK)
CREATE INDEX idx_property_feature_property_id ON property_features (property_id);


-- Commit the transaction
COMMIT;

-- Re-enable foreign key checks
PRAGMA foreign_keys=on;