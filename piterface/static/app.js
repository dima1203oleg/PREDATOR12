const elements = {
  channel: document.querySelector("#channel"),
  volume: document.querySelector("#volume"),
  volumeFill: document.querySelector("#volume-fill"),
  powerState: document.querySelector("#power-state"),
  powerButton: document.querySelector("[data-action='power']"),
  muteButton: document.querySelector("#mute-button"),
  muteLabel: document.querySelector("#mute-label"),
  form: document.querySelector("#channel-form"),
  channelInput: document.querySelector("#channel-input"),
  toast: document.querySelector("#toast"),
};

let currentState = null;

function render(state) {
  currentState = state;
  document.body.classList.toggle("device-on", state.is_on);
  elements.channel.textContent = String(state.current_channel).padStart(3, "0");
  elements.volume.textContent = state.volume;
  elements.volumeFill.style.width = `${state.volume}%`;
  elements.powerState.textContent = state.is_on ? "Увімкнено" : "Вимкнено";
  elements.powerButton.setAttribute("aria-label", state.is_on ? "Вимкнути телевізор" : "Увімкнути телевізор");
  elements.muteButton.dataset.action = state.muted ? "unmute" : "mute";
  elements.muteLabel.textContent = state.muted ? "Увімкнути звук" : "Вимкнути звук";
  document.querySelectorAll("[data-action]:not([data-action='power'])").forEach((button) => {
    button.disabled = !state.is_on;
  });
  elements.channelInput.disabled = !state.is_on;
  elements.form.querySelector("button").disabled = !state.is_on;
}

function showMessage(message, isError = false) {
  elements.toast.textContent = message;
  elements.toast.classList.toggle("error", isError);
  elements.toast.hidden = false;
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => { elements.toast.hidden = true; }, 3200);
}

async function requestAction(action, payload) {
  try {
    const response = await fetch(`/api/actions/${action}`, {
      method: "POST",
      headers: payload ? { "Content-Type": "application/json" } : {},
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не вдалося виконати дію.");
    render(result);
  } catch (error) {
    showMessage(error.message || "Немає зв’язку із сервером.", true);
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (button && !button.disabled) requestAction(button.dataset.action);
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!elements.form.reportValidity()) return;
  requestAction("set-channel", { channel: Number(elements.channelInput.value) });
  elements.channelInput.value = "";
});

fetch("/api/state")
  .then((response) => {
    if (!response.ok) throw new Error();
    return response.json();
  })
  .then(render)
  .catch(() => showMessage("Не вдалося завантажити стан пристрою.", true));
