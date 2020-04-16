// Initializing elements
let addBT = document.querySelector('#addBT');
let searchBT = document.querySelector('#searchBT');
let searchInput = document.querySelector('#search');
let addBox = document.querySelector('#addbox');
let editBox = document.querySelector('#editbox');
let addForm = addBox.querySelector('form');
let editForm = editBox.querySelector('form');
let addButton = document.querySelector('#addButton');
let cancelAddButton = document.querySelector('#cancelAddButton');
let editButton = document.querySelector('#editButton');
let cancelEditButton = document.querySelector('#cancelEditButton');
let msg = document.querySelector('#msg');
let list = document.querySelector('#bookmark-list');
let closeSearchBT = document.querySelector('#closeSearch');
let bookmarks = [];

// show error or success message
function showMsg(message, type) {
    msg.textContent = message;
    msg.classList.add(type, 'show');
    setTimeout(() => {
        msg.classList.remove(type, 'show');
    }, 2000);
}

function createListItem(i) {
    // creates item
    let li = document.createElement('li');
    // creates icon letter
    let b = document.createElement('b');
    b.setAttribute('title', bookmarks[i].name);
    b.innerText = bookmarks[i].name[0];
    // creates link
    let a = document.createElement('a');
    b.addEventListener('click', (e) => {
        e.target.parentNode.childNodes[1].click();
    });
    a.setAttribute('href', bookmarks[i].url);
    a.setAttribute('target', '_blank');
    a.innerText = bookmarks[i].name;
    // creates right buttons box
    let span = document.createElement('span');
    let b1 = document.createElement('button');
    b1.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.564l-7.126 1.436 1.438-7.125 5.688 5.689zm-4.274-7.104l5.688 5.689 15.46-15.46-5.689-5.689-15.459 15.46z"/></svg>';
    b1.addEventListener('click', () => {
        showEditBox(i);
    })
    b1.setAttribute('title', 'Edit Bookmark');
    let b2 = document.createElement('button');
    b2.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>';
    b2.addEventListener('click', removeBookmark);
    b2.setAttribute('title', 'Delete Bookmark');
    span.appendChild(b1);
    span.appendChild(b2);
    // adding all elements to list item
    li.appendChild(b);
    li.appendChild(a);
    li.appendChild(span);
    // adding list item to list
    list.appendChild(li);
}
// display bookmarks if exist any
function loadBookmarks() {
    list.innerHTML = '';
    document.querySelector('#nobookmarks').classList.remove('show');
    list.innerHTML = '';
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if (bookmarks != null && bookmarks.length) {
        for (i in bookmarks) {
            createListItem(i);
        }
    } else {
        document.querySelector('#nobookmarks').classList.add('show');
    }
}

// show and  hide addForm box
function showAddBox() {
    addBox.classList.add('addbox');
    addBT.classList.add('closebox');
    addForm.querySelector('#name').focus();
}

function hideAddBox(e) {
    addBox.classList.remove('addbox');
    addBT.classList.remove('closebox');
    addForm.reset();
    if (e) {
        e.preventDefault();
    }
}

function toggleAddBox(e) {
    if (!addBox.classList.length) {
        showAddBox();
    } else {
        hideAddBox(e);
    }
}

// show and  hide edit box
function showEditBox(i) {
    editBox.classList.add('editbox');
    editForm.querySelector('#index').value = i;
    editForm.querySelector('#editname').value = bookmarks[i].name;
    editForm.querySelector('#editurl').value = bookmarks[i].url;
    editForm.querySelector('#editname').focus();
}

function hideEditBox(e) {
    editBox.classList.remove('editbox');
    editForm.reset();
    if (e) {
        e.preventDefault();
    }
}

// add bookmark and check errors
function editBookmark(e) {
    e.preventDefault();
    let name = editForm.querySelector('#editname').value;
    let url = editForm.querySelector('#editurl').value;
    name = name.trim();
    url.trim();
    url.toLowerCase();
    if (name && url) {
        if (url.indexOf('http') < 0 || url.indexOf('https') < 0) {
            url = "http://" + url;
        }
        if (url.indexOf('.') < 0 || url.indexOf('\ ') >= 0) {
            showMsg('Invalid URL !!', 'error');
        } else {
            let i = editForm.querySelector('#index').value;
            bookmarks[i].name = name;
            bookmarks[i].url = url;
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            showMsg('Bookmark Updated Successfully!', 'success');
            loadBookmarks();
            hideEditBox();
        }
    } else if (name) {
        showMsg('Enter URL !!!', 'error');
    } else if (url) {
        showMsg('Enter Name of the Bookmark', 'error');
    } else {
        showMsg('Provide Name and URL', 'error');
    }
}


// add bookmark and check errors
function addBookmark(e) {
    e.preventDefault();
    let name = addForm.querySelector('#name').value;
    let url = addForm.querySelector('#url').value;
    name = name.trim();
    url.trim();
    url.toLowerCase();
    if (name && url) {
        if (url.indexOf('http') < 0 || url.indexOf('https') < 0) {
            url = "http://" + url;
        }
        if (url.indexOf('.') < 0 || url.indexOf('\ ') >= 0) {
            showMsg('Invalid URL !!', 'error');
        } else {
            let bookmark = {
                name: '',
                url: ''
            };
            bookmark.name = name;
            bookmark.url = url;
            if (localStorage.getItem('bookmarks') != null) {
                bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
            } else {
                bookmarks = [];
            }
            bookmarks.push(bookmark);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            showMsg('Bookmark Added Successfully!', 'success');
            loadBookmarks();
            hideAddBox();
        }
    } else if (name) {
        showMsg('Enter URL !!!', 'error');
    } else if (url) {
        showMsg('Enter Name of the Bookmark', 'error');
    } else {
        showMsg('Provide Name and URL', 'error');
    }
}

// remove bookmark
function removeBookmark(i) {
    if (!confirm('Are you sure that you want to delete this bookmark?'))
        return;
    bookmarks.splice(i, 1);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    loadBookmarks();
    showMsg('Bookmark Deleted.', 'success');
}



function sortList() {
    list.innerHTML = '';
    if (searchInput.parentNode.parentNode.classList.length != 0) {
        let searchQuery = searchInput.value.trim().toLowerCase();
        for (i in bookmarks) {
            if (bookmarks[i].name.toLowerCase().indexOf(searchQuery) != -1
                || bookmarks[i].url.indexOf(searchQuery) != -1) {
                createListItem(i);
            }
        }
    }
}

function closeSearchBar() {
    searchInput.parentNode.parentNode.classList.remove('show');
    searchInput.value = '';
    loadBookmarks();
}

function searchBarToggle() {
    if (searchInput.parentNode.parentNode.classList.length == 0) {
        searchInput.parentNode.parentNode.classList.add('show');
        searchInput.focus();
    } else {
        closeSearchBar();
    }
}

//display stored bookmarks
loadBookmarks();

// adding event listener to all buttons
addBT.addEventListener('click', toggleAddBox);
cancelAddButton.addEventListener('click', hideAddBox);
addButton.addEventListener('click', addBookmark);
searchBT.addEventListener('click', searchBarToggle);
searchInput.addEventListener('keyup', sortList);
closeSearchBT.addEventListener('click', closeSearchBar);
cancelEditButton.addEventListener('click', hideEditBox);
editButton.addEventListener('click', editBookmark);

document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        closeSearchBar();
        cancelEditButton.click();
        cancelAddButton.click();
    }
};