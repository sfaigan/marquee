let marqueeWindow = null;

const getNames = () => {
  const names = JSON.parse(localStorage.getItem("names"));
  return new Set(names);
}

const setNames = (names = {}) => {
  localStorage.setItem("names", JSON.stringify(Array.from(names)));
}

const appendNames = (newNames) => {
  console.log(newNames);
  let names = getNames();
  console.log(names);
  newNames.forEach(names.add, names);
  setNames(names);
  console.log(names);
}

const deleteName = (name) => {
  var names = getNames();
  names.delete(name);
  setNames(names);
}

const clearNamesList = () => {
    const namesList = document.getElementById("names-list-tbody");
    namesList.replaceChildren();
}

const appendToNamesList = (names) => {
    const namesList = document.getElementById("names-list-tbody")

    names.forEach(name => {
        const nameCell = document.createElement("td");
        nameCell.className = "name";
        nameCell.innerText = name;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-button";
        deleteBtn.innerHTML = "\&times"
        deleteBtn.onclick = () => handleDeleteName(name);
        const deleteCell = document.createElement("td");
        deleteCell.style.textAlign = "center";
        deleteCell.append(deleteBtn);

        const nameRow = document.createElement("tr");
        nameRow.className = "name-row";
        nameRow.append(nameCell);
        nameRow.append(deleteCell);

        namesList.append(nameRow);
    });
}

const removeFromNamesList = (name) => {
    const xpath = `//td[text()='${name}']/parent::tr`;
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    element.singleNodeValue.remove();
}

const handleMarqueeAnimation = () => {
    const marquee = marqueeWindow.document.getElementById("marquee");
    const marqueeGroup = marqueeWindow.document.getElementById("marquee-group");
    const marqueeGroupClone = marqueeWindow.document.getElementById("marquee-group-clone");

    if (marqueeGroup.clientHeight > marquee.clientHeight) {
        marquee.classList.add("fade");
        marqueeGroup.style.setProperty("animation", "");
        marqueeGroup.style.setProperty("animation-play-state", "running");
        marqueeGroupClone.style.setProperty("animation", "");
        marqueeGroupClone.style.setProperty("animation-play-state", "running");
        marqueeGroupClone.style.setProperty("display", "");
    } else {
        marquee.classList.remove("fade");
        marqueeGroup.style.setProperty("animation", "none");
        marqueeGroupClone.style.setProperty("animation", "none");
        marqueeGroupClone.style.setProperty("display", "none");
    }
}

const handleOpenMarquee = () => {
    const names = getNames();
    marqueeWindow = window.open("marquee.html");
    marqueeWindow.onload = () => {
        appendToMarquee(names);
    }
    marqueeWindow.onresize = handleMarqueeAnimation;
}

window.onload = () => {
    const names = getNames();
    appendToNamesList(names);
}

window.onunload = () => {
    if (marqueeWindow)
        marqueeWindow.close();
}

const handleAddNames = () => {
    var namesInput = document.getElementById("names-input");
    if (namesInput.value === "")
        return false;

    var names = namesInput.value.split("\n");
    appendNames(names);
    namesInput.value = "";
    appendToNamesList(names);
    if (marqueeWindow)
        appendToMarquee(names);
    return false;
}

const handleClearMarquee = () => {
    if (!confirm("Are you sure you want to clear the marquee?"))
        return;

    setNames();
    clearNamesList();
    if (marqueeWindow)
        clearMarquee();
}

const handleDeleteName = (name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`))
        return;

    deleteName(name);
    removeFromNamesList(name);
    if (marqueeWindow)
        removeFromMarquee(name);
}

const clearMarquee = () => {
    const marqueeGroup = marqueeWindow.document.getElementById("marquee-group");
    const marqueeGroupClone = marqueeWindow.document.getElementById("marquee-group-clone");

    marqueeGroup.replaceChildren();
    marqueeGroupClone.replaceChildren();
    handleMarqueeAnimation();
}

const appendToMarquee = (names) => {
    const marqueeGroup = marqueeWindow.document.getElementById("marquee-group");
    const marqueeGroupClone = marqueeWindow.document.getElementById("marquee-group-clone");

    names.forEach(name => {
        const nameElem = marqueeWindow.document.createElement("p");
        nameElem.className = "name";
        nameElem.innerText = name;
        marqueeGroup.append(nameElem);

        const nameElemClone = nameElem.cloneNode(true);
        marqueeGroupClone.append(nameElemClone);
    });
    handleMarqueeAnimation();
}

const removeFromMarquee = (name) => {
    const xpath = `//p[text()='${name}']`;
    const elements = marqueeWindow.document.evaluate(xpath, marqueeWindow.document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const nameElem = elements.iterateNext();
    const nameElemClone = elements.iterateNext();
    nameElem.remove();
    nameElemClone.remove();
    handleMarqueeAnimation();
}