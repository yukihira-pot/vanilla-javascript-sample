class ChatList {
  constructor(filePath, myId) {
    this.filePath = filePath;
    this.myId = myId;
    this.chatList = [];
  }

  async readChatListFromFile() {
    const response = await fetch(this.filePath);
    this.chatList = await response.json();
  }

  appendChat(chat) {
    this.chatList.push(chat);
  }

  getLatestChatByUsers() {
    // 各ユーザごとに最新のチャットを取得
    let latestChats = {};
    for (let chat of this.chatList) {
      let id = chat.senderId === this.myId ? chat.receiverId : chat.senderId;
      let name =
        chat.senderId === this.myId ? chat.receiverName : chat.senderName;
      if (!latestChats[id] || chat.createdAt > latestChats[id].createdAt) {
        latestChats[id] = chat;
        latestChats[id].name = name;
      }
    }
    let latestChatByEachUserSorted = Object.values(latestChats);
    return latestChatByEachUserSorted;
  }

  getChatsByUsers() {
    // 各ユーザごとにチャットを取得
    let chatsByUsers = {};
    for (let chat of this.chatList) {
      let id = chat.senderId === this.myId ? chat.receiverId : chat.senderId;
      if (!chatsByUsers[id]) {
        chatsByUsers[id] = [];
      }
      chatsByUsers[id].push(chat);
    }
    // チャットを日付順にソート
    for (let key in chatsByUsers) {
      chatsByUsers[key].sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
    }
    return chatsByUsers;
  }

  generateLatestChatDescriptions() {
    const container = document.querySelector(
      ".latest-chat-description__container"
    );

    let latestChats = this.getLatestChatByUsers();

    latestChats.forEach((chat) => {
      const chatDiv = document.createElement("div");
      chatDiv.id = `chat-${chat.id}`;
      chatDiv.className = "chat-description";

      const img = document.createElement("img");
      img.src = chat.senderImgSrc;

      const contentDiv = document.createElement("div");
      contentDiv.classList.add("chat-description__content");

      const nameDiv = document.createElement("div");
      nameDiv.classList.add("chat-description__name");
      nameDiv.textContent = chat.name;

      const messageDiv = document.createElement("div");
      messageDiv.classList.add("chat-description__message");
      //   messageDiv.textContent = chat.content;
      messageDiv.textContent =
        chat.content.length > 10
          ? chat.content.slice(0, 10) + "..."
          : chat.content;

      contentDiv.appendChild(nameDiv);
      contentDiv.appendChild(messageDiv);

      const createdAtDiv = document.createElement("div");
      createdAtDiv.classList.add("chat-description__created-at");
      createdAtDiv.textContent = new Date(chat.createdAt).toLocaleString();

      chatDiv.appendChild(img);
      chatDiv.appendChild(contentDiv);
      chatDiv.appendChild(createdAtDiv);

      container.appendChild(chatDiv);
    });
  }
}

let chatList = new ChatList("../../data/sidebars/sidebar-chat.json", 1);
chatList.readChatListFromFile().then(() => {
  console.log(chatList.chatList);
  console.log("getlatestchat", chatList.getLatestChatByUsers());
  chatList.generateLatestChatDescriptions();
});
