package com.partha.daos.implementations;

import java.util.List;

import com.partha.daos.MessageDaoInterface;
import com.partha.mappers.implementations.MessageMapper;
import com.partha.models.Message;

public class MessageDao extends GenericDao<Message> implements MessageDaoInterface {

	private static MessageDao instance = null;

	private MessageDao() {

	}

	public synchronized static MessageDao getInstance() {
		if (instance == null) {
			instance = new MessageDao();
		}
		return instance;
	}

	@Override
	public List<Message> findAllMessagesBySenderAndReceiver(String sender, String receiver) {
		StringBuilder sql = new StringBuilder("select m1.sender, m1.message, m1.message_type, m1.receiver");
		sql.append(" from messages m1 inner join(");
		sql.append("select id from messages");
		sql.append(" where sender = ? or receiver = ? )");
		sql.append(" m2 on m1.id = m2.id");
		sql.append(" where m1.sender = ? ");
		sql.append(" or m1.receiver = ? ");
		sql.append(" order by created_at asc");
		List<Message> listMessages = query(sql.toString(), new MessageMapper(), receiver, receiver, sender, sender);
		return listMessages;
	}

	@Override
	public void saveMessage(Message message) {
		StringBuilder sql = new StringBuilder();
		String sender = message.getUsername();
		String receiver = message.getReceiver();
		String msg = message.getMessage();
		String type = message.getType();
		Long conversations_id = message.getGroupId();
		if (!type.equals("text")) {
			msg = msg.replaceAll(" ", "");
		}
		if (receiver != null) {
			sql.append("insert into messages(id,sender, receiver, message, message_type)");
			sql.append(" values(message_no.NEXTVAL, ?,?,?,?)");
			save(sql.toString(), sender, receiver, msg, type);
		} else {
			sql.append("insert into messages(conversation_id, sender, message, message_type,conversations_id)");
			sql.append(" values(conversation_no.NEXTVAL, ?,?,?,?)");
			save(sql.toString(), sender, msg, type, conversations_id);
		}
	}

	@Override
	public List<Message> findAllMessagesByConvesationId(Long id) {
		StringBuilder sql = new StringBuilder();
		sql.append("select m.sender, u.avatar, m.message, m.message_type, m.receiver");
		sql.append(" from messages m join conversations c");
		sql.append(" on m.conversations_id = c.id");
		sql.append(" join users u on u.username = m.sender");
		sql.append(" where c.id = ?");
		sql.append(" order by created_at asc");
		List<Message> listMessages = query(sql.toString(), new MessageMapper(), id);
		return listMessages;
	}

}
