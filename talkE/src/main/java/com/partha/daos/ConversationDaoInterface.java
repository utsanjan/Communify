package com.partha.daos;

import java.util.List;

import com.partha.models.Conversation;
import com.partha.models.User;

public interface ConversationDaoInterface {
	void saveConversation(Conversation conversation, List<User> users);

	List<Conversation> findAllConversationsByUsername(String username);

	Conversation findConversationById(Long id);
	
	List<Conversation> findConversationsOfUserByKeyword(String username, String keyword);

	void deleteConversationById(Long id);

	void deleteUserFromConversation(Long conversationId, String username);
}
