<?php
/**
 * Privacy Consent Banner Template Part (No tracking before consent)
 */
?>
<aside class="consent-banner hidden" role="dialog" aria-label="<?php esc_attr_e('Cookie & Analytics Consent', 'gk-theme'); ?>">
    <p>
        <?php esc_html_e('We use privacy-friendly analytics solely to understand how prospective parents discover our school and improve campus visit information. We never track children or share personal data.', 'gk-theme'); ?>
        <a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Read our Privacy Policy', 'gk-theme'); ?></a>.
    </p>
    <div class="consent-banner-actions">
        <button type="button" class="btn btn-primary btn-sm" data-consent-action="accept">
            <?php esc_html_e('Accept Analytics', 'gk-theme'); ?>
        </button>
        <button type="button" class="btn btn-secondary btn-sm" data-consent-action="decline">
            <?php esc_html_e('Decline', 'gk-theme'); ?>
        </button>
    </div>
</aside>
