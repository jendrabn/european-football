class CardLeague extends HTMLElement{


    connectedCallback(){
        this.href = this.getAttribute('href') || null;
        this.src = this.getAttribute('src') || null;
        this.name = this.getAttribute('name') || null;
        this.color = this.getAttribute('color') || null;
        this.render();
    }

    render(){
        this.innerHTML = `
            <div class="col s6 m3 l2">
                <a href="${this.href}">
                    <div class="card league_card" style="border-color:${this.color};">
                        <div class="card-image">
                            <img src="${this.src}">
                        </div>
                        <div class="card-content">
                            <p>${this.name}</p>
                        </div>
                    </div>
                </a>
            </div>`;
    }
}

customElements.define('card-league', CardLeague);