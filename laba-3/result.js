const apiUrl =
  "https://web-laba-3-default-rtdb.europe-west1.firebasedatabase.app/settings";

const allElements = [
  document.querySelector(".header div"),
  ...document.querySelectorAll(".box"),
  document.querySelector(".footer div"),
];

const main = async () => {
  console.log(document.cookie.split("=")[1]);

  const settings = await (
    await fetch(`${apiUrl}/${document.cookie.split("=")[1]}.json`)
  ).json();

  settings.forEach((setting) => {
    const el = allElements.find((el) => +el.textContent === setting.place);

    el.innerHTML = `
        <button class="collapsible">Open ${setting.place}</button>
        <div class="content">
            <p>${setting.content}</p>
        </div>
    `;

    el.querySelector("button").addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
};

main();
