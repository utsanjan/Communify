package com.partha.services;

import java.util.List;

import com.partha.models.dtos.MessageDTO;

public interface MessageServiceInterface {
	public List<MessageDTO> getAllMessagesBySenderAndReceiver(String sender, String receiver);

	public void saveMessage(MessageDTO messageDTO);
}
