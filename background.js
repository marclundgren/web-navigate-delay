// let timeoutId = null;

// const isValidURL = (str) => {
//   const urlRegexp =
//     /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9](?:[a-za-z-\_]\d){0,62})?[a-z]?\.)+(?:[a-z]{2,})\z$/i;
//   return urlRegexp.test(str);
// };

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "startTimer") {
//     const { url, minutes } = message;

//     if (timeoutId !== null) {
//       clearTimeout(timeoutId);
//       timeoutId = null;
//     }

//     timeoutId = setTimeout(() => {
//       let validUrl = url;

//       if (!isValidURL(url)) {
//         validUrl = `https://${url}`;
//       }

//       chrome.tabs.create({ url: validUrl }, (tab) => {
//         setTimeout(() => {
//           chrome.tabs.remove(tab.id);
//         }, 10000); // Close the tab after 10 seconds, you can change this value
//       });

//       timeoutId = null;
//     }, minutes * 60 * 1000); // Convert minutes to milliseconds
//   } else if (message.type === "cancelTimer") {
//     if (timeoutId !== null) {
//       clearTimeout(timeoutId);
//       timeoutId = null;
//     }
//   }
// });
