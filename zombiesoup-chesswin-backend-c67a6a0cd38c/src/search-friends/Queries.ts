export const SEARCH_FRIENDS = "SELECT * FROM players p WHERE p.preferred_username LIKE CONCAT('%', ?, '%') OR p.email LIKE CONCAT('%', ?, '%');";