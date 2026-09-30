package com.partha.daos.implementations;

import java.util.List;

import com.partha.mappers.implementations.FriendMapper;
import com.partha.models.Friend;

public class FriendDao extends GenericDao<Friend> {

	public void saveFriend(boolean isAccept, Friend friend) {
		String sender = friend.getSender();
		String receiver = friend.getReceiver();
		String owner = friend.getOwner();
		Boolean status = friend.isStatus();
		StringBuilder sql1 = new StringBuilder();
		StringBuilder sql2 = new StringBuilder();
		if (isAccept) {
			sql1.append("update friends set status=? where sender = ? and receiver = ?");
			sql2.append("update friends set status=? where sender = ? and receiver = ?");
			save(sql1.toString(), status, sender, receiver);
			save(sql2.toString(), status, receiver, sender);
		} else {
			StringBuilder sqlCheckExist = new StringBuilder();
			sqlCheckExist.append("select * from friends");
			sqlCheckExist.append(" where sender = ? and receiver = ?");
			List<Friend> friends = query(sqlCheckExist.toString(), new FriendMapper(), sender, receiver);
			if (friends.isEmpty()) {
				sql1.append("insert into friends values(?,?,?,?)");
				sql2.append("insert into friends values(?,?,?,?)");

				Integer stat = status ? 1 : 0;
				
				save(sql1.toString(), sender, receiver, owner, stat);
				save(sql2.toString(), receiver, sender, owner, stat);
			}
		}
	}

	public Friend findFriend(String sender, String receiver) {

		StringBuilder sql = new StringBuilder(
				"select sender,receiver, owner, status from friends where sender=? and receiver=?");

		List<Friend> friends = query(sql.toString(), new FriendMapper(), sender, receiver);
		return friends.isEmpty() ? null : friends.get(0);
	}
}
