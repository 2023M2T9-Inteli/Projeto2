function acionarPopup() {
  const popup = document.querySelector('.popup');
  popup.classList.remove('hidden');
}

document.querySelector('.close-button').addEventListener('click', function () {
  const popup = document.querySelector('.popup');
  popup.classList.add('hidden');
});
