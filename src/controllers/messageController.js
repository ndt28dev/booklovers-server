import messageService from "../services/messageService";

const getUsersChat = async (req, res) => {
  const data = await messageService.getChatUsers();
  res.json(data);
};

const getMessagesByUser = async (req, res) => {
  const { userId } = req.params;

  const data = await messageService.getMessagesByUser(userId);
  res.json(data);
};

export default { getUsersChat, getMessagesByUser };
