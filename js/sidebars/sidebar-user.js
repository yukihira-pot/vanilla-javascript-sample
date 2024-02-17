function generateUserDescriptions(jsonUrl, containerSelector, fetchCondition) {
  fetch(jsonUrl)
    .then((response) => response.json())
    .then((users) => {
      const container = document.querySelector(containerSelector);

      users.forEach((user) => {
        if (fetchCondition(user)) {
          const userDiv = document.createElement("div");
          userDiv.id = `user-${user.id}`;
          userDiv.className = "user-description";

          const img = document.createElement("img");
          img.src = user.imgSrc;

          const nameDiv = document.createElement("div");
          nameDiv.textContent = user.userName;

          userDiv.appendChild(img);
          userDiv.appendChild(nameDiv);

          container.appendChild(userDiv);
        }
      });
    });
}

generateUserDescriptions(
  "../../data/sidebars/sidebar-user.json",
  ".account-owner-description__container",
  (user) => user.isMyself
);

generateUserDescriptions(
  "../../data/sidebars/sidebar-user.json",
  ".friends-description__container",
  (user) => !user.isMyself
);
