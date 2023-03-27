const form = document.getElementById("url-opener-form");
const urlInput = document.getElementById("url");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startButton = document.getElementById("start");
const cancelButton = document.getElementById("cancel");
const countdownSpan = document.getElementById("countdown");

let countdownTimer;

function isValidURL(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
}

function disableForm() {
  urlInput.disabled = true;
  minutesInput.disabled = true;
  secondsInput.disabled = true;
  startButton.disabled = true;
  cancelButton.disabled = false;
}

function enableForm() {
  urlInput.disabled = false;
  minutesInput.disabled = false;
  secondsInput.disabled = false;
  startButton.disabled = false;
  cancelButton.disabled = true;
}

function openURL(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  chrome.tabs.create({ url }, (tab) => {
    setTimeout(() => {
      chrome.tabs.remove(tab.id);
    }, 2000);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const url = urlInput.value.trim();
  const minutes = parseInt(minutesInput.value || "0", 10);
  const seconds = parseInt(secondsInput.value || "0", 10);

  if (!isValidURL(url)) {
    alert("Invalid URL entered!");
    return;
  }

  if (minutes === 0 && seconds === 0) {
    alert("Please enter a valid time delay (minutes and/or seconds).");
    return;
  }

  disableForm();
  const delayInMilliseconds = (minutes * 60 + seconds) * 1000;

  countdownTimer = setTimeout(() => {
    openURL(url);
    countdownSpan.textContent = "--:--";
    enableForm();
  }, delayInMilliseconds);

  let timeLeft = delayInMilliseconds / 1000;

  const intervalId = setInterval(() => {
    timeLeft--;
    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = timeLeft % 60;
    countdownSpan.textContent = `${String(minutesLeft).padStart(
      2,
      "0"
    )}:${String(secondsLeft).padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
    }
  }, 1000);
});

cancelButton.addEventListener("click", () => {
  clearTimeout(countdownTimer);
  enableForm();
  countdownSpan.textContent = "--:--";
});
