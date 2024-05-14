

document.getElementById("input-textarea").addEventListener("input", function() {
    var submitBtn = document.getElementById("submit-btn");
    if (this.value.trim() !== "") {
        submitBtn.style.backgroundColor = "#C24914";
    } else {
        submitBtn.style.backgroundColor = "#D9D9D9";
    }
});

