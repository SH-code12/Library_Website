
// Eng:Shahd Elnassag ^_^

let books = []; 


window.addEventListener('DOMContentLoaded', function() {
    let storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks); // Populate the books array with data from local storage
        displayBooks(); // Call the displayBooks function to display the books
    }
});

window.addEventListener('DOMContentLoaded', function() {
    let storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks); // Populate the books array with data from local storage
        displayBooksForDelete();
    }
});

window.addEventListener('DOMContentLoaded', function() {
    let storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks); // Populate the books array with data from local storage
        displayBorrowedBooks();
    }
});

window.addEventListener('DOMContentLoaded', function() {
    let storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks); // Populate the books array with data from local storage
        displayBooksForBorrow();
    }
});

//Display All Array Books 

function displayBooks() {
    let booksContainer = document.getElementById('container');
    booksContainer.innerHTML = ''; // Clear previous content

    books.forEach(function(book) {
        let bookDiv = document.createElement('div');
        bookDiv.className = 'book';

        let nameParagraph = document.createElement('p');
        nameParagraph.textContent = book.title.toUpperCase();
        bookDiv.appendChild(nameParagraph);

        let img = document.createElement('img');
        img.src = book.image;
        img.alt = book.title;
        img.className = 'book-image';

        // Event listener to display details on hover
        img.addEventListener('mouseover', function() {
            showBookDetails(book);
        });

        // Event listener to hide details when mouse leaves
        img.addEventListener('mouseout', function() {
            hideBookDetails();
        });

        bookDiv.appendChild(img);

        booksContainer.appendChild(bookDiv);
    });
}

// Hover and show tetails User Page

function showBookDetails(book) {
    let detailsDiv = document.getElementById('bookDetails');
    detailsDiv.innerHTML = ''; 

    let detailsParagraph = document.createElement('p');
    detailsParagraph.textContent = `Title: ${book.title}\nAuthor: ${book.author}\nCategory: ${book.category}\nDescription: ${book.description}\nStatus: ${book.status}`;
    detailsDiv.appendChild(detailsParagraph);
    detailsDiv.style.display = 'block';
}

function hideBookDetails() {
    let detailsDiv = document.getElementById('bookDetails');
    detailsDiv.innerHTML = ''; 
    detailsDiv.style.display = 'none';
}

//Select & Edit

function selectBook(bookId) {
    const selectedBook = books.find(book => book.id === bookId);
    if (selectedBook) {
        document.getElementById('editId').value = selectedBook.id;
        document.getElementById('editName').value = selectedBook.title;
        document.getElementById('editAuthor').value = selectedBook.author;
        document.getElementById('editCategory').value = selectedBook.category;
        document.getElementById('editDescription').value = selectedBook.description;
        document.getElementById('editImage').value = selectedBook.image;
        document.getElementById('editStatus').value = selectedBook.status;
    } else {
        alert('Book Not Found!');

    }
}

function selectBookById() {
    const bookId = document.getElementById('editIdInput').value.trim(); 
    selectBook(bookId); 
}

function viewBookDetails(bookId) {
    const selectedBook = books.find(book => book.id === bookId);
    if (selectedBook) {
        localStorage.setItem('selectedBook', JSON.stringify(selectedBook));
        window.location.href = 'book-details.html';
    } else {
        alert('Book not found!');
    }
}

function editBook() {
    let id = document.getElementById('editId').value;
    let name = document.getElementById('editName').value;
    let author = document.getElementById('editAuthor').value;
    let category = document.getElementById('editCategory').value;
    let description = document.getElementById('editDescription').value;
    let image = document.getElementById('editImage').value;
    let status = document.getElementById('editStatus').value;

    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        books[index] = {
            id: id,
            title: name,
            author: author,
            category: category,
            description: description,
            image: image,
            status: status
        };
        localStorage.setItem('books', JSON.stringify(books)); // Update local storage

        alert('Book changed successfully!');
        clearEditForm();
    }
    else {
        alert('Book Not Found!'); 
        clearEditForm();
    }
}

//Clear Form After Edit a Book
function clearEditForm(){
    document.getElementById('editId').value = '';
    document.getElementById('editName').value = '';
    document.getElementById('editAuthor').value = '';
    document.getElementById('editCategory').value = '';
    document.getElementById('editDescription').value = '';
    document.getElementById('editImage').value = '';
    document.getElementById('editStatus').value = 'borrow';

    document.getElementById('editIdInput').value = '';


}

//Display Details of Books In Table

function displayBooksTable() {
    let booksTableBody = document.getElementById('booksTableBody');
    booksTableBody.innerHTML = ''; 

    books.forEach(function(book) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.image}</td>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.description}</td>
            <td>${book.status}</td>


        `;
        booksTableBody.appendChild(row);
        
    });
}

//Display Borrowed Books By User

function displayBorrowedBooks() {
    let booksContainer = document.getElementById('container_Borrowed');
    booksContainer.innerHTML = '';

    books.forEach(function(book) {
        if (book.status === 'borrowed') {
            let bookDiv = document.createElement('div');
            bookDiv.className = 'book';

            let img = document.createElement('img');
            img.src = book.image;
            img.alt = book.title;
            img.className = 'book-image';

            let ID = document.createElement('p');
            ID.textContent = 'ID: ' + book.id.toUpperCase();

            let returnButton = document.createElement('button');
            returnButton.textContent = 'Return';
            returnButton.addEventListener('click', function() {
                returnBook(book.id);
            });

            bookDiv.appendChild(img);
            bookDiv.appendChild(ID);
            bookDiv.appendChild(returnButton);

            booksContainer.appendChild(bookDiv);
        }
    });
}

function returnBook(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index].status = 'borrow'; // Change status to 'borrow'
        localStorage.setItem('books', JSON.stringify(books)); // Update local storage
        displayBorrowedBooks(); // Display borrowed books again
        alert('Book returned successfully!');
    } else {
        alert('Book not found!');
    }
}

// For Delete a Book

function deleteBook(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
        alert('Book deleted successfully!');
        displayBooksForDelete();                               
    } else {
        alert('Book not found!');
    }
}

function displayBooksForDelete() {
    let booksContainer = document.getElementById('container_delete');
    booksContainer.innerHTML = '';

    books.forEach(function(book) {

        let bookDiv = document.createElement('div');
        bookDiv.className = 'book';

        let img = document.createElement('img');
        img.src = book.image;
        img.alt = book.title;
        img.className = 'book-image';

        let ID = document.createElement('p');
        ID.textContent = 'ID: ' + book.id.toUpperCase();

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteBook(book.id);
        });

        bookDiv.appendChild(img);
        bookDiv.appendChild(ID);
        bookDiv.appendChild(deleteButton);
        booksContainer.appendChild(bookDiv);
    });
}

//Function Borrow

function borrowBook(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index].status = "borrowed";
        localStorage.setItem('books', JSON.stringify(books));
        alert('Book borrowed successfully!');
        displayBooksForBorrow();
    } else {
        alert('Book not found!');
    }
}

function displayBooksForBorrow() {
    let booksContainer = document.getElementById('container_Borrow');
    booksContainer.innerHTML = '';

    books.forEach(function(book) {
        if (book.status === "borrow") {
            let bookDiv = document.createElement('div');
            bookDiv.className = 'book';

            let img = document.createElement('img');
            img.src = book.image;
            img.alt = book.title;
            img.className = 'book-image';

            let ID = document.createElement('p');
            ID.textContent = 'ID: ' + book.id.toUpperCase();

            let BorrowButton = document.createElement('button');
            BorrowButton.textContent = 'Borrow';
            BorrowButton.addEventListener('click', function() {
                borrowBook(book.id);
            });

            bookDiv.appendChild(img);
            bookDiv.appendChild(ID);
            bookDiv.appendChild(BorrowButton);

            booksContainer.appendChild(bookDiv);
        }
    });
}

// Clear Form After Add a Book

function clearBookForm() {
    document.getElementById('id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('author').value = '';
    document.getElementById('category').value = '';
    document.getElementById('Description').value = '';
    document.getElementById('image').value = '';
    document.getElementById('status').value = 'borrow'; 
}

function addBook() {
    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let author = document.getElementById('author').value;
    let category = document.getElementById('category').value;
    let description = document.getElementById('Description').value;
    let image = document.getElementById('image').value;
    let status = document.getElementById('status').value;

    let newBook = {
        id: id,
        title: name,
        author: author,
        category: category,
        description: description,
        image: image,
        status: status
    };

    books.push(newBook);

    localStorage.setItem('books', JSON.stringify(books));

    clearBookForm(); 
    alert('Book Added successfully!');

}

document.addEventListener('submit', function(event) {
    event.preventDefault(); 
    addBook(); 
});

//Search For Books

function searchBooks() {
    const searchQuery = document.getElementById('searchQuery').value.trim().toLowerCase(); 

    if (!searchQuery) {
        alert('Please enter a search query.');
        return; 
    }

    const storedBooks = JSON.parse(localStorage.getItem('books')); 
    const searchResultContainer = document.getElementById('searchResultContainer');

    searchResultContainer.innerHTML = '';

    const searchResults = storedBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery) || 
        book.author.toLowerCase().includes(searchQuery) || 
        book.category.toLowerCase().includes(searchQuery)
    );

    if (searchResults.length > 0) {
        displaySearchResults(searchResults); 
    } else {
        alert('This Book Not Found! Please Search Another Book');
    }
}


function displaySearchResults(results) {
    let searchResultContainer = document.getElementById('searchResultContainer');
    searchResultContainer.innerHTML = '';

    results.forEach(book => {
        let coverDiv = document.createElement('div');
        coverDiv.className = 'cover';

        let img = document.createElement('img');
        img.src = book.image;
        img.alt = book.title;

        let statusText = document.createElement('p');
        statusText.textContent = 'Status: ' + book.status.toUpperCase();

        let AuthorText = document.createElement('p');
        AuthorText.textContent = 'Author: ' + book.author.toUpperCase();

        let Title = document.createElement('p');
        Title.textContent = 'Title: ' + book.title.toUpperCase();

        let ID = document.createElement('p');
        ID.textContent = 'ID: ' + book.id.toUpperCase();

        coverDiv.appendChild(img);
        coverDiv.appendChild(ID);
        coverDiv.appendChild(statusText);
        coverDiv.appendChild(AuthorText);
        coverDiv.appendChild(Title);

        searchResultContainer.appendChild(coverDiv);
    });
}

// Function For Sign & log in

function ShowPasswordsign() {
    const passwordInput = document.getElementById('password');
    const passwordconfirm = document.getElementById('confirmpassword');

    if (passwordInput.type === "password" ||passwordconfirm.type === "confirmpassword") {
        passwordInput.type = "text";
        passwordconfirm.type = "text";
    } else {
        passwordInput.type = "password";
        passwordconfirm.type = "password";
    }
}

function ShowPasswordlog() {
    const passwordInput = document.getElementById('password');

    if (passwordInput.type === "password" ) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

function signup(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpassword').value;
    const email = document.getElementById('email').value.trim();
    const userType = document.querySelector('input[name="userType"]:checked');

    if (username === '' || password === '' || confirmPassword === '' || email === '' || !userType) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (userType.value === 'admin') {
        window.location.href = "ViewBooks_Admin.html"; 
    } else {
        window.location.href = "ViewBook_User.html"; 
    }
}

function login(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const userType = document.querySelector('input[name="userType"]:checked');

    if (username === '' || password === '' || !userType) {
        alert('Please fill in all fields.');
        return;
    }

    if (userType.value === 'admin') {
        window.location.href = "ViewBooks_Admin.html"; 
    } else {
        window.location.href = "ViewBook_User.html"; 
    }
}
