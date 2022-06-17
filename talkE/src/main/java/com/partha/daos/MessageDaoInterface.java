package com.partha.daos;

import java.util.List;

import com.partha.models.Message;

public interface MessageDaoInterface extends GenericDaoInterface<Message> {
	List<Message> findAllMessagesBySenderAndReceiver(String sender, String receiver);

	void saveMessage(Message message);
	
	List<Message> findAllMessagesByConvesationId(Long id);
}
