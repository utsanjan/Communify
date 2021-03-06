package com.partha.mappers.implementations;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.partha.mappers.RowMapperInterface;
import com.partha.models.Conversation;

public class ConversationMapper implements RowMapperInterface<Conversation> {

	@Override
	public Conversation mapRow(ResultSet rs) {
		Conversation conversation = new Conversation();
		try {
			conversation.setId(rs.getLong("id"));
			conversation.setName(rs.getString("name"));
			conversation.setAvatar(rs.getString("avatar"));
		} catch (SQLException e) {
			return null;
		}
		return conversation;
	}

}
