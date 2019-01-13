const get = id => document.getElementById(id);
const toast = message => {
  const container = get('toastContainer');
  container.textContent = message;
  setTimeout(() => (container.textContent = ''), 750);
};

const saveOptions = () => {
  const socketURL = get('socketURL').value;
  chrome.storage.sync.set({ socketURL }, () => toast('Options saved.'));
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    { socketURL: 'ws://localhost:4000/chromix' },
    ({ socketURL }) => (get('socketURL').value = socketURL),
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
get('form').addEventListener('submit', event => {
  event.preventDefault();
  saveOptions();
});
