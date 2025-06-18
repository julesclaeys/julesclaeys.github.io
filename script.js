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

  // === D3 CSV Loading (1): category-brands.csv ===
  d3.csv("category-brands.csv", d3.autoType).then(data => {
    console.log("CSV Data (category-brands):", data);
    // You can use the data here
  });

  // === D3 CSV Loading (2): Bar_race.csv ===
  d3.csv("Bar_race.csv", d3.autoType).then(data => {
    const body = d3.select("body");

    body.append("pre")
        .text(JSON.stringify(data.slice(0, 5), null, 2)); // Show first 5 rows
  });
});
