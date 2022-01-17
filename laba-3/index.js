const form = document.querySelector(".box.box-3 form");
const nextForm = document.querySelector("footer form");
const displayList = document.querySelector(".box.box-2");

const apiUrl =
  "https://web-laba-3-default-rtdb.europe-west1.firebasedatabase.app/settings";

// {
//     place: number,
//     content: string,
//     type: "edit" | "delete",
//     imported: true | undefined
// }
const settings = [];

const getValueFromInputs = (inputs) =>
  Array.from(inputs).reduce(
    (
      res,
      {
        value,
        attributes: {
          type: { value: typeValue },
        },
        dataset: { field },
      }
    ) => {
      res[field] = typeValue === "number" ? +value : value;
      return res;
    },
    {}
  );

const validateInputs = (inputs, indexToSkip) => {
  // if place is took, no new element there
  if (
    settings
      .filter((_, i) => i !== indexToSkip)
      .find(({ place }) => place === inputs.place)
  )
    return alert("There is already setting for that place!");

  return true;
};

const rerenderList = () => {
  if (settings.length === 0) return (displayList.innerHTML = "");

  displayList.innerHTML = `
  <ul>${settings
    .filter((setting) => (setting.type ? setting.type !== "delete" : true))
    .map(
      (setting) =>
        `<li data-place="${setting.place}" data-content="${setting.content}">Place: ${setting.place}<br>Content: ${setting.content}</li>`
    )
    .join("")}</ul>`;

  displayList.querySelector("ul").addEventListener("click", (listE) => {
    if (listE.target.localName !== "li") return;

    const { place, content } = listE.target.dataset;
    const index = settings.findIndex((setting) => setting.place === +place);
    listE.target.innerHTML = `
    <form data-index="${index}">
        <label>Place:</label>
        <input name="data" data-field="place" type="number" min="1" max="7" value="${place}" required />
        <br>
        <label>Content:</label>
        <input name="data" data-field="content" type="text" minlength="1" maxlength="255" value="${content}" required />
        <br>
        <label>Delete:</label>
        <input name="type" type="radio" value="delete" />
        <label>Edit:</label>
        <input name="type" type="radio" value="edit" />
        <label>Cancel:</label>
        <input name="type" type="radio" value="cancel" checked />
        <br>
        <input type="submit" value="proceed" />
    </form>`;

    listE.target.querySelector("form").addEventListener("submit", (elE) => {
      elE.preventDefault();
      const type = elE.target.querySelector(
        "form input[name='type']:checked"
      ).value;

      switch (type) {
        case "cancel":
          listE.target.innerHTML = `<li data-place="${place}" data-content="${content}">Place: ${place}<br>Content: ${content}</li>`;
          break;
        case "edit":
        case "delete":
          const index = +elE.target.dataset.index;
          const value = getValueFromInputs(
            elE.target.querySelectorAll("input[name='data']")
          );

          if (type === "edit" && validateInputs(value, index)) {
            settings[index] = {
              ...settings[index],
              ...value,
            };
          }

          if (type === "delete") {
            settings.splice(index, 1);
            if (settings.length === 0) nextForm.style = "display:none;";
          }

          rerenderList();

          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    });

    // if (settings[index].imported) settings[index].type = "";
  });
};

// try to get a cookie
let cookieVal = document.cookie?.split("=")[1];

const tryLoadSettings = async () => {
  try {
    if (cookieVal) {
      // get settings for user
      const data = await (await fetch(`${apiUrl}/${cookieVal}.json`)).json();

      // add all settings
      settings.push(...data);

      // render list
      rerenderList();
    }
  } catch (err) {
    console.log(err);
  } finally {
    // reveal/hide form
    if (settings.length > 0) nextForm.style = "display: block";

    if (settings.length === 7) {
      form.style = "display: none";
    } else form.style = "display: block";
  }
};

tryLoadSettings();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // values for API
  const value = getValueFromInputs(
    e.target.querySelectorAll("input[name='data']")
  );

  if (!validateInputs(value, -1)) return;

  settings.push(value);

  rerenderList();

  if (settings.length === 7) e.target.style = "display:none;";

  nextForm.style = "display: block;";
});

// const sendDataToAPI = async () =>
//   fetch(apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(settings),
//   });

nextForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cookieVal) {
    await fetch(`${apiUrl}/${cookieVal}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        settings.map((setting) => ({
          place: setting.place,
          content: setting.content,
        }))
      ),
    });

    // if ()
    // document.cookie = `setting=;max-age=0`;
  } else {
    const { name } = await (
      await fetch(`${apiUrl}.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })
    ).json();

    cookieVal = name;
    document.cookie = `setting=${name}`;
  }

  //   if (!res.ok) return console.log(res);

  //   document.cookie = `setting=${(await res.json()).name}`;

  location.assign("result.html");
});
