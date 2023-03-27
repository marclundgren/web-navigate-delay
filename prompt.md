# GPT-4 Prompt

You are GPT-4, answer my questions as if you were an expert in the field."
prompt = """
Three user inputs: a URL, and number of minutes and number of seconds. Write a Google Chrome extension that will open a URL, only after the provided time (minutes and seconds) has passed. The extension should be able to be used on any website

for the manifest.json file, use version 3.

If a url domain name was provided, the extension should open the url in a new tab. Automatically append https:// to the url if it is not already there.

Once the url is opened, the extension should close the tab.

Provide a start button and a cancel button.

When the countdown timer is active, Provide a countdown timer that counts down from the number of minutes and seconds provided by the user.

Once the Start button is clicked, disable the start button and all inputs.

Once the Cancel button is clicked, enable the start button and all inputs and disable the cancel button.

The start button is only enabled if a valid url and there is a valid time delay (minutes and seconds) Note minutes and seconds are both optional, but at least one of them must have a valid value for the delay to be considered valid. The domain name should be validated using a regex.

If the cancel is button is clicked, the timer should stop.

Once the timer is done, the extension should open the provided url in a new tab.

## Output

To create the Google Chrome extension you described, follow these steps:

1. Create a new folder for your extension and create three files: `manifest.json`, `popup.html`, and `main.js`.

2. Fill the `manifest.json` file with the following content (Make sure to use manifest version 3):

```json
{
  "manifest_version": 3,
  "name": "Delayed URL Opener",
  "version": "1.0",
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "permissions": ["tabs", "alarms"],
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  }
}
```

3. Create the UI for your extension in `popup.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Delayed URL Opener</title>
    <style>
      /* Add your custom styles here */
    </style>
  </head>
  <body>
    <h1>Delayed URL Opener</h1>
    <input type="text" id="url" placeholder="Enter URL" />
    <input type="number" id="minutes" min="0" placeholder="Minutes" />
    <input type="number" id="seconds" min="0" placeholder="Seconds" />
    <button id="start">Start</button>
    <button id="cancel" disabled>Cancel</button>
    <p id="countdown"></p>
    <script src="main.js"></script>
  </body>
</html>
```

4. Implement the extension's functionality in `main.js`:

```javascript
const urlInput = document.getElementById("url");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startButton = document.getElementById("start");
const cancelButton = document.getElementById("cancel");
const countdownElem = document.getElementById("countdown");

let timer;

function isValidURL(url) {
  const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
  return regex.test(url);
}

function validateInputs() {
  const url = urlInput.value.trim();
  const minutes = parseInt(minutesInput.value);
  const seconds = parseInt(secondsInput.value);
  const hasValidDelay = !isNaN(minutes) || !isNaN(seconds);
  return isValidURL(url) && hasValidDelay;
}

function createCountdown(minutes, seconds) {
  let totalTime = minutes * 60 + seconds;
  return setInterval(() => {
    if (totalTime <= 0) {
      clearInterval(timer);
      openURL(urlInput.value);
    } else {
      countdownElem.textContent = `${Math.floor(totalTime / 60)}:${
        totalTime % 60
      }`;
      totalTime--;
    }
  }, 1000);
}

function openURL(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  chrome.tabs.create({ url });
}

startButton.addEventListener("click", () => {
  if (validateInputs()) {
    startButton.disabled = true;
    cancelButton.disabled = false;
    urlInput.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    const minutes = parseInt(minutesInput.value || "0");
    const seconds = parseInt(secondsInput.value || "0");
    timer = createCountdown(minutes, seconds);
  }
});

cancelButton.addEventListener("click", () => {
  clearInterval(timer);
  startButton.disabled = false;
  cancelButton.disabled = true;
  urlInput.disabled = false;
  minutesInput.disabled = false;
  secondsInput.disabled = false;
  countdownElem.textContent = "";
});
```

5. Zip the folder and upload it to the Chrome Web Store following [the official instructions](https://developer.chrome.com/webstore/publish).

With this implementation, the extension will provide the functionality you described, with a start and cancel button, countdown timer, and URL validation. It will open the URL in a new tab after the time has passed and close the extension popup.
➜ gpt4 git:(main) ✗ python3.11 app.py
To create a Google Chrome extension as described, you need to follow these steps:

1. Create a manifest.json file for v3 configuration:

```json
{
  "manifest_version": 3,
  "name": "Delayed URL Opener",
  "version": "1.0",
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  },
  "permissions": ["tabs"],
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

2. Create a popup.html for extension UI:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Add your custom styles here */
    </style>
  </head>
  <body>
    <form id="url-opener-form">
      <input type="text" id="url" placeholder="Enter URL" />
      <input type="number" id="minutes" placeholder="Enter minutes" />
      <input type="number" id="seconds" placeholder="Enter seconds" />
      <button id="start" type="submit">Start</button>
      <button id="cancel" type="button" disabled>Cancel</button>
    </form>
    <div>
      <p>Time left: <span id="countdown">--:--</span></p>
    </div>
    <script src="popup.js"></script>
  </body>
</html>
```

3. Create a popup.js for extension logic:

```javascript
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
```

Now, package your extension, and you can load it in your Chrome browser as an unpacked extension to test its functionality. To learn more about developing Chrome extensions, visit the [official documentation](https://developer.chrome.com/docs/extensions/mv3/getstarted/).
