document.addEventListener("DOMContentLoaded", () => {
  // === Slideshow Logic ===
  let slideIndex = 1;
  showSlides(slideIndex);

  window.plusSlides = function(n) {
    showSlides(slideIndex += n);
  };

  window.currentSlide = function(n) {
    showSlides(slideIndex = n);
  };

  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  }

  // === D3 CSV Loading ===
  d3.csv("category-brands.csv", d3.autoType).then(data => {
    console.log("CSV Data:", data);
    // You can do more with the data here
  });
});
