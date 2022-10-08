const toggleMenu = document.getElementById('toggle-menu')
const sidebar = document.getElementsByClassName('sidebar')[0]
const navbar = document.getElementsByClassName('navbar-brand')[0]
const content = document.getElementById('content')

toggleMenu.addEventListener('click', function() {
    sidebar.classList.toggle('hide')
    navbar.classList.toggle('hide')
    toggleMenu.classList.toggle('left')
    content.classList.toggle('close')
})