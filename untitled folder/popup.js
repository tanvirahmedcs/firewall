document.getElementById("connectButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "toggleBlocking", enabled: true }, (response) => {
    alert(response.status);
  });
});