<?php
/**
 * Template Name: Admissions
 */

get_header();
?>
<section class="section" style="padding-top: 2rem;">
    <div class="container">
        <?php gk_breadcrumbs(); ?>
        <header class="section-header reveal-item">
            <span class="eyebrow"><?php esc_html_e('Enrollment Guide', 'gk-theme'); ?></span>
            <h1><?php esc_html_e('Admissions Open for Academic Year 2026–2027', 'gk-theme'); ?></h1>
            <p><?php esc_html_e('We welcome you to visit our campus, observe active classrooms, and discuss your child\'s milestones with our educators.', 'gk-theme'); ?></p>
        </header>

        <div class="hero-grid" style="align-items: flex-start; margin-top: 3rem;">
            <!-- Left Column: Details -->
            <div class="reveal-item" style="display: flex; flex-direction: column; gap: 2rem;">
                <div class="gk-form-card">
                    <h3><?php esc_html_e('Age Eligibility & Cut-Off Criteria', 'gk-theme'); ?></h3>
                    <p style="margin-top: 0.5rem; font-size: var(--fs-sm);"><?php echo esc_html(gk_setting('admission_cutoff_text')); ?></p>
                    <ul style="margin-top: 1rem; list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: var(--fs-sm);">
                        <li><strong><?php esc_html_e('Toddlers:', 'gk-theme'); ?></strong> 1.5 Years & above</li>
                        <li><strong><?php esc_html_e('Playgroup:', 'gk-theme'); ?></strong> 2.0 to 3.0 Years</li>
                        <li><strong><?php esc_html_e('Nursery:', 'gk-theme'); ?></strong> 3.0 to 4.0 Years</li>
                        <li><strong><?php esc_html_e('Kindergarten (KG1/KG2):', 'gk-theme'); ?></strong> 4.0 to 6.0 Years</li>
                    </ul>
                </div>

                <div class="gk-form-card">
                    <h3><?php esc_html_e('Required Documents Checklist', 'gk-theme'); ?></h3>
                    <ul style="margin-top: 1rem; list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: var(--fs-sm);">
                        <li>✔ <?php esc_html_e('Copy of Child\'s Municipal Birth Certificate', 'gk-theme'); ?></li>
                        <li>✔ <?php esc_html_e('Updated Immunization / Pediatric Health Record', 'gk-theme'); ?></li>
                        <li>✔ <?php esc_html_e('Proof of Residence (Aadhar / Utility Bill / Passport)', 'gk-theme'); ?></li>
                        <li>✔ <?php esc_html_e('4 Passport-size photographs of the child', 'gk-theme'); ?></li>
                        <li>✔ <?php esc_html_e('2 Passport-size photographs of parents / authorized guardians', 'gk-theme'); ?></li>
                    </ul>
                </div>
            </div>

            <!-- Right Column: Enquiry Form -->
            <div id="visit" class="gk-form-card reveal-item">
                <header style="margin-bottom: 1.5rem;">
                    <h2><?php esc_html_e('Book a School Visit & Tour', 'gk-theme'); ?></h2>
                    <p style="font-size: var(--fs-sm);"><?php esc_html_e('Please fill in your details below. We will call you within one working day to confirm your preferred visit slot.', 'gk-theme'); ?></p>
                </header>

                <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="POST" class="gk-form" data-gk-validate="true">
                    <input type="hidden" name="action" value="gk_submit_enquiry">
                    <?php wp_nonce_field('gk_enquiry_form_submit', 'gk_enquiry_nonce'); ?>
                    
                    <!-- Honeypot & Time-trap -->
                    <input type="text" name="website_url" style="display: none;" tabindex="-1" autocomplete="off">
                    <input type="hidden" name="form_timestamp" value="<?php echo esc_attr(time()); ?>">

                    <div class="form-group">
                        <label class="form-label" for="parent_name"><?php esc_html_e('Parent / Guardian Full Name', 'gk-theme'); ?> <span class="required">*</span></label>
                        <input type="text" id="parent_name" name="parent_name" class="form-control" required placeholder="e.g. Anand Sharma">
                        <span class="form-error-msg"><?php esc_html_e('Please enter your name.', 'gk-theme'); ?></span>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label" for="phone"><?php esc_html_e('10-Digit Mobile Number', 'gk-theme'); ?> <span class="required">*</span></label>
                            <input type="tel" id="phone" name="phone" class="form-control" required placeholder="e.g. 9876543210" pattern="[0-9]{10}">
                            <span class="form-error-msg"><?php esc_html_e('Please enter a 10-digit mobile number.', 'gk-theme'); ?></span>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="email"><?php esc_html_e('Email Address (Optional)', 'gk-theme'); ?></label>
                            <input type="email" id="email" name="email" class="form-control" placeholder="parent@example.com">
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label" for="programme"><?php esc_html_e('Programme of Interest', 'gk-theme'); ?> <span class="required">*</span></label>
                            <select id="programme" name="programme" class="form-control" required>
                                <option value=""><?php esc_html_e('Select Programme', 'gk-theme'); ?></option>
                                <option value="Toddler Explorers (1.5 - 2.5 yrs)"><?php esc_html_e('Toddler Explorers (1.5 – 2.5 yrs)', 'gk-theme'); ?></option>
                                <option value="Playgroup Pioneers (2 - 3 yrs)"><?php esc_html_e('Playgroup Pioneers (2 – 3 yrs)', 'gk-theme'); ?></option>
                                <option value="Nursery Discoverers (3 - 4 yrs)"><?php esc_html_e('Nursery Discoverers (3 – 4 yrs)', 'gk-theme'); ?></option>
                                <option value="Kindergarten Leaders (4 - 6 yrs)"><?php esc_html_e('Kindergarten (4 – 6 yrs)', 'gk-theme'); ?></option>
                                <option value="Daycare & Extended Care"><?php esc_html_e('Daycare & Extended Care', 'gk-theme'); ?></option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="age_band"><?php esc_html_e('Child Age Band', 'gk-theme'); ?> <span class="required">*</span></label>
                            <select id="age_band" name="age_band" class="form-control" required>
                                <option value=""><?php esc_html_e('Select Age Band', 'gk-theme'); ?></option>
                                <option value="1.5 to 2.5 Years">1.5 to 2.5 Years</option>
                                <option value="2.5 to 3.5 Years">2.5 to 3.5 Years</option>
                                <option value="3.5 to 4.5 Years">3.5 to 4.5 Years</option>
                                <option value="4.5 to 6 Years">4.5 to 6 Years</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label" for="visit_date"><?php esc_html_e('Preferred Visit Date', 'gk-theme'); ?></label>
                            <input type="date" id="visit_date" name="visit_date" class="form-control">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="visit_time"><?php esc_html_e('Preferred Time Slot', 'gk-theme'); ?></label>
                            <select id="visit_time" name="visit_time" class="form-control">
                                <option value="Morning (09:30 AM – 11:30 AM)"><?php esc_html_e('Morning (09:30 AM – 11:30 AM)', 'gk-theme'); ?></option>
                                <option value="Afternoon (02:30 PM – 04:30 PM)"><?php esc_html_e('Afternoon (02:30 PM – 04:30 PM)', 'gk-theme'); ?></option>
                                <option value="Saturday Morning (10:00 AM – 12:30 PM)"><?php esc_html_e('Saturday Morning (10:00 AM – 12:30 PM)', 'gk-theme'); ?></option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="message"><?php esc_html_e('Questions or Notes (Optional)', 'gk-theme'); ?></label>
                        <textarea id="message" name="message" class="form-control" placeholder="<?php esc_attr_e('Any queries regarding timings, settling routines...', 'gk-theme'); ?>"></textarea>
                    </div>

                    <label class="consent-checkbox-row">
                        <input type="checkbox" name="consent" required value="1">
                        <span class="consent-text">
                            <?php esc_html_e('I agree to the Privacy Policy and authorize the school to contact me regarding my visit enquiry.', 'gk-theme'); ?> <span class="required">*</span>
                        </span>
                    </label>

                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                        <?php esc_html_e('Confirm & Book Campus Visit', 'gk-theme'); ?>
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>
<?php
get_footer();
