// Written on every Docker start (the db-init service) and by the /populat-collection-from-db command; it has no expiry and is rebuilt when the catalog changes.
export const CATEGORY_FILTER_KEY: string = "collection-filter"
