import knexPostgis from "knex-postgis";

export const geoLocationExtension = (connection) => knexPostgis(connection);
