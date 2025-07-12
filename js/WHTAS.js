class WhatsAppButton {
    constructor() {
        this.setupWhatsAppButton();
    }

    setupWhatsAppButton() {
        const whatsappButton = document.createElement('button');
        whatsappButton.className = 'whatsapp-button';

        // Using FontAwesome WhatsApp Icon
        whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';

        whatsappButton.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 20px;
    z-index: 1000;
    background: #25D366;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.3s;
        `;

        document.body.appendChild(whatsappButton);
        whatsappButton.addEventListener('click', () => this.openWhatsApp());
    }

    openWhatsApp() {
        window.open('https://wa.me/971582901255', '_blank');
    }
}

// Create an instance of the WhatsAppButton class
new WhatsAppButton();
