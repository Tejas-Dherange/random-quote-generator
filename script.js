const quote = document.getElementById("quote");
const author = document.getElementById("author");
const tags = document.getElementById("tags");
const copyButton = document.getElementById("copy-button");
const generateButton = document.getElementById("generate-button");
const shareButton = document.getElementById("share-button");
const exportButton = document.getElementById("export-button");

let images = [
  "https://images.pexels.com/photos/31158323/pexels-photo-31158323/free-photo-of-minimalist-daisy-on-sandy-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2856028/pexels-photo-2856028.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3217672/pexels-photo-3217672.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/5598297/pexels-photo-5598297.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2228582/pexels-photo-2228582.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/5425629/pexels-photo-5425629.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/11141843/pexels-photo-11141843.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/4116639/pexels-photo-4116639.jpeg?auto=compress&cs=tinysrgb&w=600",
];

//get random number function number in range images array length 7
function setRandomBackground() {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  document.querySelector(
    ".quote-container"
  ).style.backgroundImage = `url(${randomImage})`;
}
setRandomBackground();

async function getQuote() {
  const url = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
  const options = { method: "GET", headers: { accept: "application/json" } };

  //to fetch code from api endpoint
  const fetchQuote = async () => {
    copyButton.innerText = "Copy";
    copyButton.disabled = true;

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  //hereis our fetched data from api
  const data = await fetchQuote();

  //adding data in Dom
  let tagData = "";
  quote.innerText = data.data.content;
  author.innerText = data.data.author;
  data.data.tags.map((tag) => {
    console.log(tag);
    tagData += tag + ", ";
  });

  tags.innerText = tagData.split(",").slice(0, -1).join(", ");

  //Generate button functionality

  //Copy button functionality
  copyButton.addEventListener("click", function () {
    const quoteText = data.data.content;
    navigator.clipboard.writeText(quoteText);
    copyButton.innerText = "Copied";
    copyButton.disabled = true;
  });

  //share button functionality
  shareButton.addEventListener("click", function () {
    const quoteText = quote.innerText;
    const url =
      "https://twitter.com/intent/tweet?text=" +
      quoteText +
      " - " +
      author.innerText;
    window.open(url);
  });
}


//getting quote and bg image with the help of throttle
const throtled1 = throtle(getQuote, 700);
const throtled2 = throtle(setRandomBackground, 700);

generateButton.addEventListener("click", () => {
  throtled1();
  throtled2();
});
getQuote();


//throttling function
function throtle(fn, delay) {
  let isRunning;
  return function (...args) {
    if (!isRunning) {
      fn.apply(this, args);
      isRunning = true;
      setTimeout(() => {
        isRunning = false;
      }, delay);
    }
  };
}

//dowloading image
exportButton.addEventListener("click", async function () {
  const container = document.querySelector(".quote-container");
  let bgImage = container.style.backgroundImage;

  // Extract clean URL
  if (bgImage.startsWith('url("') || bgImage.startsWith("url('")) {
    bgImage = bgImage.slice(5, -2);
  }

  if (!bgImage) {
    alert("No background image found!");
    return;
  }

  try {
    // Fetch the image as a blob
    const response = await fetch(bgImage);
    const blob = await response.blob();
    const blobURL = URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = "quote-background.jpg"; // File name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release memory
    URL.revokeObjectURL(blobURL);
  } catch (error) {
    console.error("Image download failed:", error);
    alert("Failed to download image. Check CORS permissions.");
  }
});
