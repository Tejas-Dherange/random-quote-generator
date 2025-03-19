const quote = document.getElementById("quote");
const author = document.getElementById("author");
const tags = document.getElementById("tags");
const copyButton = document.getElementById("copy-button");
const generateButton = document.getElementById("generate-button");
const shareButton = document.getElementById("share-button");

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
  generateButton.addEventListener("click", getQuote);


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

getQuote();
