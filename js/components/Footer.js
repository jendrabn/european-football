class Footer extends HTMLElement {

    connectedCallback() {
        this.render()
    }

    render() {
        this.innerHTML = `      
            <footer class="page-footer grey darken-4">
               Copyright © 2020 - JBN. All rights reserved.
            </footer>
        `
    }
}

customElements.define('foo-ter', Footer)