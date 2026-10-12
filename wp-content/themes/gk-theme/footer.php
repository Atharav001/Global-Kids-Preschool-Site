</main><!-- #main-content -->

<?php
get_template_part('template-parts/footer/site-footer');
get_template_part('template-parts/footer/sticky-action-bar');
get_template_part('template-parts/footer/consent-banner');
?>

<!-- Native Accessible Lightbox Dialog -->
<dialog class="gk-lightbox" aria-label="<?php esc_attr_e('Image Lightbox', 'gk-theme'); ?>">
    <div class="lightbox-content">
        <button class="lightbox-close-btn" type="button" aria-label="<?php esc_attr_e('Close lightbox', 'gk-theme'); ?>">&times;</button>
        <img class="lightbox-img" src="" alt="">
        <p class="lightbox-caption"></p>
    </div>
</dialog>

<!-- Floating WhatsApp Button for Desktop -->
<a href="<?php echo esc_url(gk_whatsapp_link()); ?>" class="floating-whatsapp-btn" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e('Chat with us on WhatsApp', 'gk-theme'); ?>">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.196 8.196 0 012.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.53c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32z"/>
    </svg>
</a>

<?php wp_footer(); ?>
</body>
</html>
