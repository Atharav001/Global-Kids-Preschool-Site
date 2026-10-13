<?php
/**
 * Front Page Template - Global Kids Preschool
 * Real School Layout inspired by premier institutions (DPS, Montfort, KLAY)
 */

get_header();

$school_name = gk_setting('school_name', 'Global Kids Preschool');
$area        = gk_setting('area', 'Annanagar West');
$city        = gk_setting('city', 'Chennai');
$phone       = gk_setting('phone_e164', '+91 98400 12345');
$wa_link     = gk_whatsapp_link();
$assets_uri  = get_template_directory_uri() . '/assets';
?>

<!-- School Hero Section with Quick Tour Booking Form -->
<section class="section" style="padding-top: 2rem; padding-bottom: 2.5rem;">
    <div class="container school-hero-container">
        <div class="reveal-item">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                <span class="eyebrow" style="margin-bottom: 0;"><?php printf(esc_html__('Preschool in %s, %s • Estd. 2014', 'gk-theme'), esc_html($area), esc_html($city)); ?></span>
                <span class="sticker-badge" style="transform:none; font-size: 0.75rem; background: var(--tint-sun); border-color: var(--sun);">
                    🏆 <?php esc_html_e('Ranked Top 50 in Chennai', 'gk-theme'); ?>
                </span>
                <span class="sticker-badge" style="transform:none; font-size: 0.75rem; background: var(--tint-sky); border-color: var(--blue);">
                    📜 <?php esc_html_e('ECA India Accredited', 'gk-theme'); ?>
                </span>
            </div>
            <h1 style="font-size: 2.5rem; line-height: 1.15; margin-bottom: 1rem;">
                <?php esc_html_e('Where Joyful Curiosity Meets', 'gk-theme'); ?> 
                <span class="highlight-squiggle"><?php esc_html_e('Lifelong Learning', 'gk-theme'); ?><svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="var(--sun)" stroke-width="4" stroke-linecap="round"/></svg></span>
            </h1>
            <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--ink);">
                <?php printf(esc_html__('A nurturing Montessori and play-based preschool in %s. With small 1:8 educator ratios, wholesome nutrition, certified early years mentors, and 100%% child-safe CCTV premises, we build confident, joyful foundations.', 'gk-theme'), esc_html($area)); ?>
            </p>

            <!-- Visual Hero Showcase Card -->
            <div class="hero-visual-card">
                <img class="hero-visual-img" src="<?php echo esc_url($assets_uri . '/images/hero-classroom.jpg'); ?>" alt="<?php esc_attr_e('Children engaged in Montessori learning activities in bright classroom at Global Kids', 'gk-theme'); ?>" fetchpriority="high">
                <div class="hero-visual-overlay">
                    <h3><?php esc_html_e('Montessori Sensorial Discovery', 'gk-theme'); ?></h3>
                    <p><?php esc_html_e('Natural daylight classrooms equipped with child-accessible wooden sensorial materials and gentle mentor guidance.', 'gk-theme'); ?></p>
                </div>
            </div>
        </div>

        <!-- Quick School Tour Booking Card (Hero Side Form) -->
        <div class="reveal-item">
            <div class="hero-tour-card">
                <span class="hero-tour-badge"><?php esc_html_e('Admissions 2025–26', 'gk-theme'); ?></span>
                <h3><?php esc_html_e('Schedule a Campus Tour', 'gk-theme'); ?></h3>
                <p><?php esc_html_e('Experience our classrooms, observe active sessions, and discuss your child\'s milestones with our educators.', 'gk-theme'); ?></p>

                <form action="<?php echo esc_url(home_url('/submit-enquiry/')); ?>" method="POST">
                    <!-- Honeypot -->
                    <input type="text" name="website_url" style="display:none;" tabindex="-1" autocomplete="off">
                    <?php wp_nonce_field('gk_enquiry_action', 'gk_enquiry_nonce'); ?>

                    <div class="form-group" style="margin-bottom: 0.9rem;">
                        <label for="tour-parent-name" class="form-label" style="font-size: 0.875rem;"><?php esc_html_e('Parent / Guardian Name', 'gk-theme'); ?> <span class="required">*</span></label>
                        <input type="text" id="tour-parent-name" name="parent_name" class="form-control" placeholder="<?php esc_attr_e('e.g. Anand Sharma', 'gk-theme'); ?>" required style="padding: 0.65rem 0.85rem;">
                    </div>

                    <div class="form-group" style="margin-bottom: 0.9rem;">
                        <label for="tour-mobile" class="form-label" style="font-size: 0.875rem;"><?php esc_html_e('Mobile Number', 'gk-theme'); ?> <span class="required">*</span></label>
                        <input type="tel" id="tour-mobile" name="mobile" class="form-control" placeholder="<?php esc_attr_e('e.g. 98400 12345', 'gk-theme'); ?>" required pattern="[0-9]{10}" style="padding: 0.65rem 0.85rem;">
                    </div>

                    <div class="form-group" style="margin-bottom: 0.9rem;">
                        <label for="tour-programme" class="form-label" style="font-size: 0.875rem;"><?php esc_html_e('Select Programme of Interest', 'gk-theme'); ?> <span class="required">*</span></label>
                        <select id="tour-programme" name="programme" class="form-control" required style="padding: 0.65rem 0.85rem;">
                            <option value="">-- <?php esc_html_e('Choose Programme', 'gk-theme'); ?> --</option>
                            <option value="Toddlers / Playgroup (1.5 - 2.5 yrs)"><?php esc_html_e('Toddlers / Playgroup (1.5 – 2.5 yrs)', 'gk-theme'); ?></option>
                            <option value="Nursery / Pre-KG (2.5 - 3.5 yrs)"><?php esc_html_e('Nursery / Pre-KG (2.5 – 3.5 yrs)', 'gk-theme'); ?></option>
                            <option value="Junior KG / LKG (3.5 - 4.5 yrs)"><?php esc_html_e('Junior KG / LKG (3.5 – 4.5 yrs)', 'gk-theme'); ?></option>
                            <option value="Senior KG / UKG (4.5 - 5.5 yrs)"><?php esc_html_e('Senior KG / UKG (4.5 – 5.5 yrs)', 'gk-theme'); ?></option>
                            <option value="Full-Day Care (6 mos - 6 yrs)"><?php esc_html_e('Full-Day Care & Extended Care', 'gk-theme'); ?></option>
                        </select>
                    </div>

                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="tour-date" class="form-label" style="font-size: 0.875rem;"><?php esc_html_e('Preferred Tour Date', 'gk-theme'); ?></label>
                        <input type="date" id="tour-date" name="preferred_date" class="form-control" style="padding: 0.65rem 0.85rem;">
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1rem; padding: 0.85rem;">
                        <?php esc_html_e('Book Campus Tour Slot →', 'gk-theme'); ?>
                    </button>
                </form>

                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--line); font-size: 0.8125rem;">
                    <span style="color: #F7B500; font-weight: 700;">★ <?php echo esc_html(gk_setting('google_rating', '4.9')); ?> on Google (<?php echo esc_html(gk_setting('google_review_count', '86')); ?> reviews)</span>
                    <a href="<?php echo esc_url($wa_link); ?>" target="_blank" rel="noopener noreferrer" style="color: #25D366; font-weight: 700; text-decoration: none;">💬 WhatsApp Direct</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Trust Strip Overlap -->
<div class="container trust-strip-wrapper" style="margin-top: 0; margin-bottom: 2rem;">
    <div class="trust-strip-card reveal-item">
        <div class="trust-item">
            <span class="trust-number"><?php echo esc_html(gk_setting('years_running', '12+')); ?></span>
            <span class="trust-label"><?php esc_html_e('Years of Early Learning Legacy', 'gk-theme'); ?></span>
        </div>
        <div class="trust-item">
            <span class="trust-number"><?php echo esc_html(gk_setting('children_taught', '1200+')); ?></span>
            <span class="trust-label"><?php esc_html_e('Happy Little Alumni', 'gk-theme'); ?></span>
        </div>
        <div class="trust-item">
            <span class="trust-number"><?php echo esc_html(gk_setting('ratio_text', '1:8')); ?></span>
            <span class="trust-label"><?php esc_html_e('Attentive Educator Ratio', 'gk-theme'); ?></span>
        </div>
        <div class="trust-item">
            <span class="trust-number"><?php echo esc_html(gk_setting('google_rating', '4.9')); ?> ★</span>
            <span class="trust-label"><?php printf(esc_html__('Google Rating (%s Reviews)', 'gk-theme'), esc_html(gk_setting('google_review_count', '86'))); ?></span>
        </div>
    </div>
</div>

<!-- From the Principal's Desk Section -->
<section class="principals-desk-section">
    <div class="container">
        <div class="principals-grid reveal-item">
            <div class="principals-photo-frame">
                <img src="<?php echo esc_url($assets_uri . '/images/principal-welcome.jpg'); ?>" alt="<?php esc_attr_e('Dr. Priya Sundaram, Academic Director of Global Kids Preschool', 'gk-theme'); ?>">
                <span class="principals-badge"><?php esc_html_e('Academic Director & Founder', 'gk-theme'); ?></span>
            </div>
            <div class="principals-content">
                <div class="principals-quote-symbol">“</div>
                <span class="eyebrow" style="color: var(--blue);"><?php esc_html_e('From the Principal\'s Desk', 'gk-theme'); ?></span>
                <h2><?php esc_html_e('A Warm Welcome to Global Kids', 'gk-theme'); ?></h2>
                <div class="principals-subtitle"><?php esc_html_e('Nurturing Character, Kindness & Joyful Confidence Since 2014', 'gk-theme'); ?></div>
                <p>
                    <?php esc_html_e('At Global Kids, we believe early childhood is not a race to memorize facts or drill benchmarks. It is the sacred, magical window where a young child forms their fundamental relationship with the world—learning to trust their voice, express curiosity freely, and care for their friends.', 'gk-theme'); ?>
                </p>
                <p>
                    <?php esc_html_e('Every space on our campus is intentionally sculpted for little explorers: from child-height wooden Montessori shelves and gentle garden herb planters to our warm, patient educators who understand that learning blossoms through playful discovery.', 'gk-theme'); ?>
                </p>
                <p>
                    <?php esc_html_e('We welcome you to visit our campus, observe our classrooms in action, and partner with us in shaping your child\'s most formative early years.', 'gk-theme'); ?>
                </p>
                <div class="principals-signature-block">
                    <div class="principals-name-title">
                        <strong>Dr. Priya Sundaram, M.Ed.</strong>
                        <span><?php esc_html_e('Academic Director & Head of School · Global Kids Preschool', 'gk-theme'); ?></span><br>
                        <span style="font-size: 0.8rem; color: var(--blue); font-weight: 600;"><?php esc_html_e('Member, Early Childhood Association (ECA India & APER)', 'gk-theme'); ?></span>
                    </div>
                    <a href="<?php echo esc_url(home_url('/about/')); ?>" class="btn btn-secondary btn-sm"><?php esc_html_e('Read School Philosophy →', 'gk-theme'); ?></a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Programmes Section with Photography Cards -->
<section class="section tint-sky">
    <div class="container">
        <header class="section-header text-center reveal-item">
            <span class="eyebrow"><?php esc_html_e('Academic Programmes', 'gk-theme'); ?></span>
            <h2><?php esc_html_e('Thoughtfully Designed Early Learning Stages', 'gk-theme'); ?></h2>
            <p><?php esc_html_e('From gentle first toddler steps to confident primary school readiness, each programme nurtures holistic growth.', 'gk-theme'); ?></p>
        </header>

        <div class="cards-grid">
            <!-- Programme 1 -->
            <div class="programme-card reveal-item">
                <div style="position: relative; overflow: hidden; height: 180px;">
                    <img src="<?php echo esc_url($assets_uri . '/images/library-story.jpg'); ?>" alt="<?php esc_attr_e('Toddlers exploring stories and sensory play', 'gk-theme'); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                    <span class="programme-chip" style="position: absolute; top: 12px; left: 12px; margin: 0;"><?php esc_html_e('Ages 1.5 – 2.5 Years', 'gk-theme'); ?></span>
                </div>
                <div class="programme-body">
                    <h3 class="programme-title"><?php esc_html_e('Playgroup & Toddlers', 'gk-theme'); ?></h3>
                    <p class="programme-summary"><?php esc_html_e('Sensory exploration, gentle speech expansion, social co-play, and fine motor coordination in a cozy setting.', 'gk-theme'); ?></p>
                    <div style="font-size: 0.8125rem; color: var(--ink-soft); margin-bottom: 0.75rem;">
                        <strong>Ratio:</strong> 1:4 • <strong>Timings:</strong> 9:00 AM – 11:30 AM
                    </div>
                    <a href="<?php echo esc_url(home_url('/programmes/#toddler')); ?>" class="programme-cta"><?php esc_html_e('Explore curriculum & schedule →', 'gk-theme'); ?></a>
                </div>
            </div>

            <!-- Programme 2 -->
            <div class="programme-card reveal-item">
                <div style="position: relative; overflow: hidden; height: 180px;">
                    <img src="<?php echo esc_url($assets_uri . '/images/hero-classroom.jpg'); ?>" alt="<?php esc_attr_e('Pre-KG Nursery children engaged in phonics and numbers', 'gk-theme'); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                    <span class="programme-chip" style="position: absolute; top: 12px; left: 12px; margin: 0;"><?php esc_html_e('Ages 2.5 – 3.5 Years', 'gk-theme'); ?></span>
                </div>
                <div class="programme-body">
                    <h3 class="programme-title"><?php esc_html_e('Pre-KG / Nursery', 'gk-theme'); ?></h3>
                    <p class="programme-summary"><?php esc_html_e('Tactile phonics, number discovery, dramatic expression, and social confidence with hands-on Montessori manipulatives.', 'gk-theme'); ?></p>
                    <div style="font-size: 0.8125rem; color: var(--ink-soft); margin-bottom: 0.75rem;">
                        <strong>Ratio:</strong> 1:6 • <strong>Timings:</strong> 9:00 AM – 12:00 PM
                    </div>
                    <a href="<?php echo esc_url(home_url('/programmes/#nursery')); ?>" class="programme-cta"><?php esc_html_e('Explore curriculum & schedule →', 'gk-theme'); ?></a>
                </div>
            </div>

            <!-- Programme 3 -->
            <div class="programme-card reveal-item">
                <div style="position: relative; overflow: hidden; height: 180px;">
                    <img src="<?php echo esc_url($assets_uri . '/images/outdoor-play.jpg'); ?>" alt="<?php esc_attr_e('Kindergarten children doing outdoor active play', 'gk-theme'); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                    <span class="programme-chip" style="position: absolute; top: 12px; left: 12px; margin: 0;"><?php esc_html_e('Ages 3.5 – 5.5 Years', 'gk-theme'); ?></span>
                </div>
                <div class="programme-body">
                    <h3 class="programme-title"><?php esc_html_e('Kindergarten (LKG & UKG)', 'gk-theme'); ?></h3>
                    <p class="programme-summary"><?php esc_html_e('Foundational literacy, early STEM inquiry, logical math concepts, and holistic readiness for primary school boards.', 'gk-theme'); ?></p>
                    <div style="font-size: 0.8125rem; color: var(--ink-soft); margin-bottom: 0.75rem;">
                        <strong>Ratio:</strong> 1:8 • <strong>Timings:</strong> 9:00 AM – 1:00 PM
                    </div>
                    <a href="<?php echo esc_url(home_url('/programmes/#kindergarten')); ?>" class="programme-cta"><?php esc_html_e('Explore curriculum & schedule →', 'gk-theme'); ?></a>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 2.5rem;">
            <a href="<?php echo esc_url(home_url('/programmes/')); ?>" class="btn btn-secondary"><?php esc_html_e('View All Programmes, Comparison Table & Daycare →', 'gk-theme'); ?></a>
        </div>
    </div>
</section>

<!-- Campus Life Photographic Showcase -->
<section class="campus-gallery-section">
    <div class="container">
        <header class="section-header text-center reveal-item">
            <span class="eyebrow"><?php esc_html_e('Campus Life & Facilities', 'gk-theme'); ?></span>
            <h2><?php esc_html_e('A Glimpse into Our Joyful Learning Campus', 'gk-theme'); ?></h2>
            <p><?php esc_html_e('Purpose-built spaces designed for safety, creative discovery, and early sensory exploration.', 'gk-theme'); ?></p>
        </header>

        <div class="campus-gallery-grid reveal-item">
            <div class="campus-gallery-card">
                <img src="<?php echo esc_url($assets_uri . '/images/hero-classroom.jpg'); ?>" alt="<?php esc_attr_e('Montessori sensory lab with wooden materials', 'gk-theme'); ?>">
                <div class="campus-gallery-body">
                    <span class="campus-gallery-tag"><?php esc_html_e('Montessori Learning', 'gk-theme'); ?></span>
                    <h4><?php esc_html_e('Tactile Sensory Discovery Lab', 'gk-theme'); ?></h4>
                    <p><?php esc_html_e('Child-height wooden open shelving with sandpaper letters, bead stairs, and math puzzles.', 'gk-theme'); ?></p>
                </div>
            </div>

            <div class="campus-gallery-card">
                <img src="<?php echo esc_url($assets_uri . '/images/outdoor-play.jpg'); ?>" alt="<?php esc_attr_e('Outdoor grass play lawn with shade sails', 'gk-theme'); ?>">
                <div class="campus-gallery-body">
                    <span class="campus-gallery-tag"><?php esc_html_e('Outdoor Recreation', 'gk-theme'); ?></span>
                    <h4><?php esc_html_e('Lush Green Play Arena & Sandpit', 'gk-theme'); ?></h4>
                    <p><?php esc_html_e('UV-shielded outdoor area with soft safety lawn, river sand pit, and gross-motor climbing frames.', 'gk-theme'); ?></p>
                </div>
            </div>

            <div class="campus-gallery-card">
                <img src="<?php echo esc_url($assets_uri . '/images/library-story.jpg'); ?>" alt="<?php esc_attr_e('Cozy reading nook with teacher reading picture books', 'gk-theme'); ?>">
                <div class="campus-gallery-body">
                    <span class="campus-gallery-tag"><?php esc_html_e('Early Literacy', 'gk-theme'); ?></span>
                    <h4><?php esc_html_e('Little Sprouts Story & Phonics Nook', 'gk-theme'); ?></h4>
                    <p><?php esc_html_e('Cushioned reading circle where children enjoy daily bilingual puppet stories and picture books.', 'gk-theme'); ?></p>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 2rem;">
            <a href="<?php echo esc_url(home_url('/gallery/')); ?>" class="btn btn-secondary"><?php esc_html_e('Explore Complete Campus Photo Gallery →', 'gk-theme'); ?></a>
        </div>
    </div>
</section>

<!-- School Notice Board & Events Calendar -->
<section class="school-notice-section">
    <div class="container">
        <header class="section-header text-center reveal-item">
            <span class="eyebrow"><?php esc_html_e('School Communications', 'gk-theme'); ?></span>
            <h2><?php esc_html_e('Notice Board & School Happenings', 'gk-theme'); ?></h2>
            <p><?php esc_html_e('Keep up with official announcements, academic circulars, and upcoming campus celebrations.', 'gk-theme'); ?></p>
        </header>

        <div class="notice-columns-grid reveal-item">
            <div class="notice-col-card">
                <div class="notice-col-header">
                    <h3>📢 <?php esc_html_e('Circulars & Announcements', 'gk-theme'); ?></h3>
                    <a href="<?php echo esc_url(home_url('/news/')); ?>" style="font-size: 0.8125rem; font-weight: 700; color: var(--blue); text-decoration: none;"><?php esc_html_e('View Archive →', 'gk-theme'); ?></a>
                </div>

                <div class="notice-item">
                    <div class="notice-date-badge">12 OCT<br><span style="font-size: 0.65rem;">2026</span></div>
                    <div class="notice-info">
                        <h4>
                            <a href="<?php echo esc_url(home_url('/admissions/')); ?>"><?php esc_html_e('Admissions 2025–26: Guidelines & Document Checklist', 'gk-theme'); ?></a>
                            <span class="notice-pill-new">NEW</span>
                        </h4>
                        <p><?php esc_html_e('Applications open for Toddlers, Nursery & KG batches. Limited seats per batch to preserve 1:8 ratio.', 'gk-theme'); ?></p>
                    </div>
                </div>

                <div class="notice-item">
                    <div class="notice-date-badge">05 OCT<br><span style="font-size: 0.65rem;">2026</span></div>
                    <div class="notice-info">
                        <h4><a href="<?php echo esc_url(home_url('/news/')); ?>"><?php esc_html_e('Parent Orientation & Phased Settling Schedule', 'gk-theme'); ?></a></h4>
                        <p><?php esc_html_e('Staggered 4-day orientation timetable for incoming parents to ensure tear-free settling transitions.', 'gk-theme'); ?></p>
                    </div>
                </div>
            </div>

            <div class="notice-col-card">
                <div class="notice-col-header">
                    <h3>📅 <?php esc_html_e('Upcoming School Events', 'gk-theme'); ?></h3>
                    <a href="<?php echo esc_url(home_url('/news/')); ?>" style="font-size: 0.8125rem; font-weight: 700; color: var(--blue); text-decoration: none;"><?php esc_html_e('Full Calendar →', 'gk-theme'); ?></a>
                </div>

                <div class="notice-item">
                    <div class="event-date-block">
                        <span class="event-day">25</span>
                        <span class="event-month">OCT</span>
                    </div>
                    <div class="notice-info">
                        <h4><?php esc_html_e('Grandparents\' Day & Story Circle', 'gk-theme'); ?></h4>
                        <p><?php esc_html_e('Time: 9:30 AM – 11:30 AM • An affectionate morning celebrating grandparents with puppet theater and clay art.', 'gk-theme'); ?></p>
                    </div>
                </div>

                <div class="notice-item">
                    <div class="event-date-block">
                        <span class="event-day">08</span>
                        <span class="event-month">NOV</span>
                    </div>
                    <div class="notice-info">
                        <h4><?php esc_html_e('Montessori Sensory Open Day & Workshop', 'gk-theme'); ?></h4>
                        <p><?php esc_html_e('Time: 10:00 AM – 1:00 PM • Prospective parents experience hands-on tactile materials alongside educators.', 'gk-theme'); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Direct School Tour Action Banner -->
<section class="section" style="padding-top: 0; padding-bottom: 2rem;">
    <div class="container">
        <div class="school-action-banner reveal-item">
            <h2><?php esc_html_e('Experience the Warmth of Our Campus in Person', 'gk-theme'); ?></h2>
            <p><?php esc_html_e('Walk through our naturally lit classrooms, open sensory gardens, and meet our passionate educators. Admissions are currently open for 2025–26.', 'gk-theme'); ?></p>
            <div class="school-action-buttons">
                <a href="<?php echo esc_url(home_url('/admissions/#visit')); ?>" class="btn btn-primary" style="background: var(--sun); color: var(--on-sun);"><?php esc_html_e('Book a Campus Tour', 'gk-theme'); ?></a>
                <a href="<?php echo esc_url($wa_link); ?>" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Chat on WhatsApp', 'gk-theme'); ?></a>
                <a href="tel:<?php echo esc_attr($phone); ?>" class="btn btn-secondary" style="color: #FFFFFF; border-color: rgba(255,255,255,0.4);"><?php printf(esc_html__('Call Admissions: %s', 'gk-theme'), esc_html(gk_setting('phone_display', '044 2615 1234'))); ?></a>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();
