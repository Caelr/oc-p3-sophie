
export default class ModalGallery {

  constructor() {}

  /**
   * Creates the ModalGallery elements.
   */
  create() {
    this.gallery = document.createElement('div');
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;
    this.token = JSON.parse(authToken);
  }

  /**
   * Creates the gallery of works.
   */
  async createGallery(modal, addButton) {
    this.gallery.innerHTML = '';
    this.works = await window.home.getApiData();
    this.works.forEach((work) => {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      const deleteButton = document.createElement('button');
      this.gallery.classList.add('modal__gallery');
      figure.classList.add('modal__media');
      figure.dataset.id = `${work.id}`;
      image.classList.add('modal__media__image');
      image.src = work.imageUrl;
      image.alt = work.title;
      deleteButton.classList.add('modal__delete');
      deleteButton.dataset.id = `${work.id}`;

      figure.append(image, deleteButton);
      this.gallery.appendChild(figure);
    });
    modal.insertBefore(this.gallery, addButton);
  }

  /**
   * Deletes a work with the specified ID.
   */
  async delete(id, token) {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log('ok');
    }
  }

  /**
   * Handles the click event for deleting a work.
   */
  async handleDelete(event) {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const imageId = target.dataset.id;

    if (!imageId) return;

    this.delete(+imageId, this.token);
    const worksToRemove = Array.from(
      document.querySelectorAll(`[data-id='${imageId}']`)
    );
    worksToRemove.forEach((work) => {
      if (!work.dataset.id) return;
      work.remove();
    });
    this.works = await window.home.getApiData();
    localStorage.setItem('works', JSON.stringify(this.works));
  }

  /**
   * Adds event listeners for handling work deletion.
   */
  addListeners() {
    this.gallery.addEventListener('click', (event) => this.handleDelete(event));
  }

  /**
   * Removes event listeners for handling work deletion.
   */
  removeListener() {
    this.gallery.removeEventListener('click', (event) => this.handleDelete(event));
  }
}
