class Libro {

    constructor(titulo, autor, isbn) {
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }

}

class UI {

    static getBooks() {
        const libros = Datos.getBooks();
        libros.forEach((libro) => UI.addBookTable(libro));
    }

    static addBookTable(libro) {
        const lista = document.querySelector('#libro-list');

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        lista.appendChild(fila);
    }

    static deleteBookTable(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.getElementById('libroForm');
        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000)

    }

    static clearFields() {

        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';

    }

}

class Datos {

    static getBooks() {

        let libros;
        if (localStorage.getItem('libros') === null) {
            libros = [];
        } else {
            libros = JSON.parse(localStorage.getItem('libros'));
        }
        return libros;

    }

    static addBook(libro) {

        const libros = Datos.getBooks();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));

    }

    static deleteBook(isbn) {
        const libros = Datos.getBooks();
        libros.forEach((libro, index) => {
            if (libro.isbn === isbn) {
                libros.splice(index, 1);
            }
        })
        localStorage.setItem('libros', JSON.stringify(libros));
    }

}

//Carga de la página.
document.addEventListener('DOMContentLoaded', UI.getBooks());

//Controla el evento submit.
document.querySelector('#libroForm').addEventListener('submit', (e) => {

    e.preventDefault();

    //obtener valores.
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;

    if (titulo === '' || autor === '' || isbn === '') {
        UI.showAlert('Por favor, rellene todos los campos.', 'danger')
    } else {
        const libro = new Libro(titulo, autor, isbn);
        Datos.addBook(libro);
        UI.addBookTable(libro);
        UI.showAlert('Libro agregado con éxito.', 'success');
        UI.clearFields();
    }

})

//Captura el elemento al hacer click en la X.
document.querySelector('#libro-list').addEventListener('click', (e) => {
    UI.deleteBookTable(e.target);
    Datos.deleteBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Libro eliminado correctamente.', 'success');
})
