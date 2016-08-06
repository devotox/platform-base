CREATE FUNCTION count_non_nulls(variadic p_array anyarray)
RETURNS BIGINT AS
$$
	SELECT count(x) FROM unnest($1) AS x
$$ LANGUAGE SQL IMMUTABLE;
