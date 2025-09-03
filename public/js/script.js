

document.addEventListener("DOMContentLoaded", () => {
const hamburger = document.getElementById('hamburger');
const icon = document.getElementById('menu-icon');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        icon.classList.toggle('bx-menu');
         icon.classList.toggle('bx-x'); // Cross icon
    });


// const slides = document.querySelectorAll('.slide');
// const buttons = document.querySelectorAll('.slide button');
// let current = 0;
// let intervalId;

// function showSlide(index) {
//   slides.forEach((slide, i) => {
//     slide.classList.remove('active');
//     if (i === index) slide.classList.add('active');
//   });
// }

// function nextSlide() {
//   current = (current + 1) % slides.length;
//   showSlide(current);
// }

// function startSlider() {
//   intervalId = setInterval(nextSlide, 3500); // Start auto-sliding
// }

// function stopSlider() {
//   clearInterval(intervalId); // Stop auto-sliding
// }

// // Start the slider on page load
// startSlider();

// // Pause only when hovering over buttons
// buttons.forEach(button => {
//   button.addEventListener('mouseenter', stopSlider);   // Pause on hover
//   button.addEventListener('mouseleave', startSlider);  // Resume when mouse leaves
// });




// function prevSlide() {
//   current = (current - 1 + slides.length) % slides.length;
//   showSlide(current);
// }
// const leftArrow = document.querySelector('.arrow.left');
// const rightArrow = document.querySelector('.arrow.right');

// leftArrow.addEventListener('click', () => {
//   stopSlider();
//   prevSlide();
//   startSlider();
// });

// rightArrow.addEventListener('click', () => {
//   stopSlider();
//   nextSlide();
//   startSlider();
// });


document.getElementById("back-to-top").addEventListener("click", function () {
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
});
 const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    const firstSectionHeight = document.querySelector("#home").offsetHeight;

    if (window.scrollY > firstSectionHeight) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });



  //reviews
const container = document.querySelector('.reviews-container');
const cards = document.querySelectorAll('.review-card');
const leftArr = document.querySelector('.left-arrow');
const rightArr = document.querySelector('.right-arrow');

let currentIndex = 0;

function updateSlider() {
  const offset = -currentIndex * 100; // percentage shift
  cards.forEach(card => {
    card.style.transform = `translateX(${offset}%)`;
  });
}

leftArr.addEventListener('click', () => {
  currentIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
  updateSlider();
});

rightArr.addEventListener('click', () => {
  currentIndex = (currentIndex === cards.length - 1) ? 0 : currentIndex + 1;
  updateSlider();
});

// initialize
updateSlider();



//gallery

const galleryContainer = document.querySelector('.gallery-container');
const galleryCards = document.querySelectorAll('.gallery-card');
const galleryLeftArr = document.querySelector('.g-left-arrow');
const galleryRightArr = document.querySelector('.g-right-arrow');

let galleryCurrentIndex = 0;

function updateGallerySlider() {
  const offset = -galleryCurrentIndex * 100; // percentage shift
  galleryCards.forEach(card => {
    card.style.transform = `translateX(${offset}%)`;
  });
}
galleryLeftArr.addEventListener('click', () => {
  galleryCurrentIndex = (galleryCurrentIndex === 0) 
    ? galleryCards.length - 1 
    : galleryCurrentIndex - 1;
  updateGallerySlider();
});

galleryRightArr.addEventListener('click', () => {
  galleryCurrentIndex = (galleryCurrentIndex === galleryCards.length - 1) 
    ? 0 
    : galleryCurrentIndex + 1;
  updateGallerySlider();
});


// initialize
updateGallerySlider();






// training section arrow
const swipeArrow = document.getElementById('swipe-arrow');
const trainingSection = document.getElementById('training');

function showArrowTemporarily() {
  swipeArrow.classList.remove('hide'); 
  setTimeout(() => {
    swipeArrow.classList.add('hide'); 
  }, 6000);
}

// Intersection Observer to detect when #training is visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      showArrowTemporarily();
    }
  });
}, { threshold: 0.5 });

observer.observe(trainingSection);




document.getElementById("nav-join-btn").addEventListener("click", function () {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("hero-join-btn").addEventListener("click", function () {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});



const secObserver = new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('visible');

            // all headings inside it
      const headings = entry.target.querySelectorAll('.show-heading');
      headings.forEach(h => h.classList.add('show'));

        
        }
    });
}, {
  threshold: 0.05 
});
document.querySelectorAll('section').forEach(section=>{
    secObserver.observe(section);
});



const memCards = document.querySelectorAll('.memCard');

memCards.forEach((card, index) => {
  card.style.setProperty('--delay', `${index * 0.15}s`);

  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05
  });

  cardObserver.observe(card);
});




const aboutObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      
    }
  });
}, {
  threshold: 0.1
});

const aboutContent = document.querySelector('.about-container');
if (aboutContent) {
  aboutObserver.observe(aboutContent);
}



const revImgObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      
    }
  });
}, {
  threshold: 0.1
});

const revImg = document.querySelector('.why-img-1');
if (revImg) {
  revImgObserver.observe(revImg);
}




const footerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.1
});


const footerContents = document.querySelectorAll('.footer-show');

footerContents.forEach(footer => {
  footerObserver.observe(footer);
});

});