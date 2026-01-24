
const navigationItems = [...Navigation_Main.children];
for (const item of navigationItems) {
    item.onclick = function() {
        Article_Parts.scrollLeft = window["Parts_" + item.dataset.part].offsetLeft;
    }
}

Article_Parts.onscroll = function() {
    window.requestAnimationFrame(function() {
        for (const item of navigationItems.toReversed()) {
            const partItem = window["Parts_" + item.dataset.part];
            if (Article_Parts.scrollLeft >= partItem.offsetLeft - partItem.offsetWidth / 2) {
                item.classList.add("active");
                for (const _item of navigationItems.filter(o => o != item))
                    _item.classList.remove("active");
                break;
            }
        }
    });
}

Button_Refresh.onclick = function() {
    for (const item of selectedItems)
        item[1].quantity = 0;
}

let selectedItems = new Map();

appendListItem(dataMakananBerat, List_MakananBerat, "makananBerat");
appendListItem(dataMakananRingan, List_MakananRingan, "makananRingan");
appendListItem(dataMinuman, List_Minuman, "minuman");

function appendListItem(list, container, category) {
    for (const item of list) {
        item.category = category;
        const renderedItem = renderItem(item);
        container.append(renderedItem);
    }
}

function renderItem(data) {
    const thumbnailElement = document.createElement("img");
    thumbnailElement.classList.add("thumbnail");
    thumbnailElement.src = "";

    const nameElement = document.createElement("span");
    nameElement.classList.add("name");
    nameElement.innerText = data.name;

    const calorieElement = document.createElement("span");
    calorieElement.classList.add("calorie");
    calorieElement.innerText = data.calorie + " kal";

    const descriptionElement = document.createElement("div");
    descriptionElement.classList.add("description");
    descriptionElement.append(nameElement);
    descriptionElement.append(calorieElement);

    const addButtonElement = document.createElement("button");
    addButtonElement.classList.add("add");
    addButtonElement.classList.add("material-symbols-outlined");
    addButtonElement.innerText = "add_2";
    addButtonElement.onclick = function(event) {
        data.quantity++;
        event.stopPropagation();
    };

    const removeButtonElement = document.createElement("button");
    removeButtonElement.classList.add("remove");
    removeButtonElement.classList.add("material-symbols-outlined");
    removeButtonElement.innerText = "remove";
    removeButtonElement.onclick = function(event) {
        data.quantity--;
        event.stopPropagation();
    };
    
    const quantityElement = document.createElement("span");
    quantityElement.classList.add("quantity");
    
    let quantity = 0;
    Object.defineProperty(data, "quantity", {
        get: o => quantity || 0,
        set: function(value) {
            if (value < 0)
                value = 0;
            quantity = value;
            updateQuantity();
        }
    });

    const quantityGroupElement = document.createElement("div");
    quantityGroupElement.classList.add("quantity-group")
    quantityGroupElement.append(removeButtonElement);
    quantityGroupElement.append(quantityElement);
    quantityGroupElement.append(addButtonElement);

    const checkElement = document.createElement("input");
    checkElement.type = "checkbox";
    checkElement.oninput = function() {
        if (checkElement.checked == false) {
            data.quantity = 0;
        }
        else {
            if (data.quantity == 0)
                data.quantity++;
        }
    }
    
    function updateQuantity() {
        if (data.quantity == 0) {
            checkElement.checked = false;
            quantityGroupElement.classList.add("hidden");
            selectedItems.delete(data.id);
        }
        else {
            checkElement.checked = true;
            quantityGroupElement.classList.remove("hidden");
            selectedItems.set(data.id, data);
        }
        quantityElement.innerText = data.quantity;
        updateSummary();
    }

    updateQuantity();

    const containerElement = document.createElement("div");
    containerElement.classList.add("item");
    containerElement.append(checkElement);
    containerElement.append(thumbnailElement);
    containerElement.append(descriptionElement);
    containerElement.append(quantityGroupElement);
    containerElement.data = data;
    containerElement.onclick = function() {
        if (data.quantity == 0) {
            data.quantity++;
        }
    }

    return containerElement;
}

function updateSummary() {
    if (selectedItems.size == 0) {
        Grid_Summary.classList.add("collapsed");
        Text_TotalCalories.innerText = "0 kal";
    }
    else {
        Grid_Summary.classList.remove("collapsed");

        let totalCalories = 0;

        for (const item of selectedItems)
            totalCalories += item[1].calorie * item[1].quantity;

        Text_TotalCalories.innerText = totalCalories + " kal";
    }
}