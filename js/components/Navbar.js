class Navbar extends HTMLElement {

    connectedCallback() {
        this.render()
    }

    render() {
        this.innerHTML = `
        <div class="navbar-fixed">
            <nav class="grey darken-4">
                <div class="container">
                    <div class="nav-wrapper">
                        <a href="index.html" class="brand-logo">Foot Ball</a>
                        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                        <ul class="right hide-on-med-and-down">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="saved.html">Saved</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
        
        <ul class="sidenav" id="mobile-demo">
            <li><a href="index.html">Home</a></li>
            <li><a href="saved.html">Saved</a></li>
        </ul>
        `
    }

}

customElements.define('nav-bar', Navbar);