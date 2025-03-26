// Pricing page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active class on the clicked item
            item.classList.toggle('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // Live Chat Button functionality
    const chatButton = document.querySelector('.chat-button');
    
    chatButton.addEventListener('click', () => {
        // In a real implementation, this would open a chat widget
        alert('Live chat support is coming soon! Please email support@mcpconfig.com for assistance.');
    });
    
    // Initialize the first FAQ item as open
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
});
