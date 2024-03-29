class ChatList {
  constructor(filePath, myId) {
    this.filePath = filePath;
    this.myId = myId;
    this.chatList = [];
    this.readChatListFromFile().then(() => {
      this.generateLatestChatDescriptions();
    });
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
        latestChats[id].counterPartId =
          chat.senderId === this.myId ? chat.receiverId : chat.senderId;
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

  generateForm() {
    const chatFrame = parent.document.getElementById("frame-chat");
    const chatFormContainer = chatFrame.contentDocument.getElementById(
      "chat-form__container"
    );

    chatFormContainer.innerHTML = "";

    const form = document.createElement("form");
    form.id = "chat-form";

    const input = document.createElement("textarea");
    input.id = "chat-input";
    input.className = "chat-input";
    input.placeholder = "メッセージを入力してください";

    const submit = document.createElement("i");
    submit.className = "fa-solid fa-paper-plane fa-lg";

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        if (input.value.trim() !== "") {
          submit.click();
        }
      }
    });

    submit.addEventListener("click", () => {
      const chatInput = chatFrame.contentDocument.getElementById("chat-input");
      const chatContainer =
        chatFrame.contentDocument.getElementById("chat-container");

      const chat = {
        senderId: this.myId,
        senderName: "",
        receiverId: null,
        receiverName: "",
        content: chatInput.value,
        createdAt: new Date(),
      };

      this.appendChat(chat);

      let chatDiv = document.createElement("div");
      chatDiv.className = "chat-element chat-element__mine";

      let chatContent = document.createElement("div");
      chatContent.classList.add("chat-element__content");

      let message = document.createElement("div");
      message.classList.add("chat-element__message");
      message.classList.add("chat-element__mine");

      message.textContent = chat.content;

      let createdAt = document.createElement("div");
      createdAt.classList.add("chat-element__created-at");

      createdAt.textContent = new Date(chat.createdAt).toLocaleString();

      chatDiv.appendChild(createdAt);
      chatContent.appendChild(message);
      chatDiv.appendChild(chatContent);

      chatContainer.appendChild(chatDiv);

      chatInput.value = "";
    });

    form.appendChild(input);
    form.appendChild(submit);

    chatFormContainer.appendChild(form);
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

      this.generateChatByCounterpartId(chat.counterPartId, chatDiv);

      const img = document.createElement("img");
      img.src = chat.senderImgSrc;

      const contentDiv = document.createElement("div");
      contentDiv.classList.add("chat-description__content");

      const nameDiv = document.createElement("div");
      nameDiv.classList.add("chat-description__name");
      nameDiv.textContent = chat.name;

      const messageDiv = document.createElement("div");
      messageDiv.classList.add("chat-description__message");
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

    return latestChats;
  }

  generateChatByCounterpartId(counterPartId, latestChatDiv) {
    let chatsFrame = parent.document.getElementById("frame-chat");
    let chatContainer =
      chatsFrame.contentDocument.getElementById("chat-container");

    latestChatDiv.addEventListener("click", () => {
      chatContainer.innerHTML = "";
      let chatsByUsers = this.getChatsByUsers();
      let chats = chatsByUsers[counterPartId];
      for (let chat of chats) {
        let chatDiv = document.createElement("div");
        chatDiv.className = "chat-element";

        let img = document.createElement("img");
        img.src = chat.senderImgSrc;
        img.className = "chat-element__img";

        let chatContent = document.createElement("div");
        chatContent.classList.add("chat-element__content");

        let message = document.createElement("div");
        message.classList.add("chat-element__message");
        message.textContent = chat.content;

        let createdAt = document.createElement("div");
        createdAt.classList.add("chat-element__created-at");
        createdAt.textContent = new Date(chat.createdAt).toLocaleString();

        let name = document.createElement("div");
        name.classList.add("chat-element__name");
        name.textContent = chat.senderName;

        if (chat.senderId === this.myId) {
          chatDiv.classList.add("chat-element__mine");
          message.classList.add("chat-element__mine");
          chatDiv.appendChild(createdAt);
          chatContent.appendChild(message);
          chatDiv.appendChild(chatContent);
        } else {
          chatDiv.appendChild(img);
          chatContent.appendChild(name);
          chatContent.appendChild(message);
          chatDiv.appendChild(chatContent);
          chatDiv.appendChild(createdAt);
        }

        chatContainer.appendChild(chatDiv);
      }

      this.generateForm();
    });
  }
}

let chatList = new ChatList("../../data/sidebars/sidebar-chat.json", 1);
