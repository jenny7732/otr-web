

document.getElementById("input-textarea").addEventListener("input", function() {
    var submitBtn = document.getElementById("submit-btn");
    if (this.value.trim() !== "") {
        submitBtn.style.backgroundColor = "#C24914";
    } else {
        submitBtn.style.backgroundColor = "#D9D9D9";
    }
});

const btn = document.getElementById("analysis-btn"); 
const modal = document.getElementById("modalWrap"); 
const closeBtn = document.getElementById("closeBtn"); 

btn.onclick = function () {
  modal.style.display = "block"; 
};

closeBtn.onclick = function () {
  modal.style.display = "none"; 
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none"; 
  }
};