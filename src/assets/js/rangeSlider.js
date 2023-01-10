function rangeSlider() {
  console.log('--- rangeSlider() called ---');
  
  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;
  
  slider.oninput = function() {
    console.log('--- slider input ---');
    output.innerHTML = this.value;
  }
}