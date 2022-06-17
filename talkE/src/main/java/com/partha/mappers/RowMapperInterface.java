package com.partha.mappers;

import java.sql.ResultSet;

public interface RowMapperInterface<T> {
	T mapRow(ResultSet rs);
}
