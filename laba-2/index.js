// 1
const thirdColumn = document.querySelector(".box:nth-child(3)");
const fourthColumn = document.querySelector(".box:nth-child(4)");
const copy = fourthColumn.textContent;

fourthColumn.textContent = thirdColumn.textContent;
thirdColumn.textContent = copy;

// 2
const areaTriangle = (base, height) => (base * height) / 2;
const thirdBlock = document.querySelector(".box.box-3");
thirdBlock.innerHTML += areaTriangle(20, 40);

// 3
const maxCountValues = (...values) => {
  // if (values.length !== 10) throw new Error("Invalid parameters");
  const sorted = values.sort((a, b) => b - a);
  return sorted.slice(
    0,
    sorted.findIndex((curr) => curr !== sorted[0])
  ).length;
};

const form = thirdBlock.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const res = maxCountValues(
    ...Array.from(e.target.elements).map(({ value }) => value)
  );
  alert(res);
  document.cookie = `result=${res}`;
});

const cookie = document.cookie?.split("=")[1];

if (!cookie) {
  form.style = "display: block;";
} else {
  // form.style = "display: none;";
  alert(cookie);
  document.cookie = "result=;max-age=0";
  alert("Cookies were deleted!");
  location.reload();
}

// 4
const sixthEl = document.querySelector(".box.stretch-2");

sixthEl.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  window.dispatchEvent(new CustomEvent("scroll"));
});

const storageValue = localStorage.getItem("fontWeight");
if (storageValue) {
  sixthEl.style = `font-weight: ${storageValue}`;
}

window.addEventListener("scroll", (e) => {
  const fontWeight = sixthEl.querySelector(
    "form input[name='weight']:checked"
  ).value;

  sixthEl.style = `font-weight: ${fontWeight}`;
  localStorage.setItem("fontWeight", fontWeight);
});

// 5
