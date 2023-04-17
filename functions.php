<?php
/**
 * Theme functions and definitions
 *
 * @package HelloElementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_VERSION', '2.7.1' );

if ( ! isset( $content_width ) ) {
	$content_width = 800; // Pixels.
}

if ( ! function_exists( 'hello_elementor_setup' ) ) {
	/**
	 * Set up theme support.
	 *
	 * @return void
	 */
	function hello_elementor_setup() {
		if ( is_admin() ) {
			hello_maybe_update_theme_version_in_db();
		}

		if ( apply_filters( 'hello_elementor_register_menus', true ) ) {
			register_nav_menus( [ 'menu-1' => esc_html__( 'Header', 'hello-elementor' ) ] );
			register_nav_menus( [ 'menu-2' => esc_html__( 'Footer', 'hello-elementor' ) ] );
		}

		if ( apply_filters( 'hello_elementor_post_type_support', true ) ) {
			add_post_type_support( 'page', 'excerpt' );
		}

		if ( apply_filters( 'hello_elementor_add_theme_support', true ) ) {
			add_theme_support( 'post-thumbnails' );
			add_theme_support( 'automatic-feed-links' );
			add_theme_support( 'title-tag' );
			add_theme_support(
				'html5',
				[
					'search-form',
					'comment-form',
					'comment-list',
					'gallery',
					'caption',
					'script',
					'style',
				]
			);
			add_theme_support(
				'custom-logo',
				[
					'height'      => 100,
					'width'       => 350,
					'flex-height' => true,
					'flex-width'  => true,
				]
			);

			/*
			 * Editor Style.
			 */
			add_editor_style( 'classic-editor.css' );

			/*
			 * Gutenberg wide images.
			 */
			add_theme_support( 'align-wide' );

			/*
			 * WooCommerce.
			 */
			if ( apply_filters( 'hello_elementor_add_woocommerce_support', true ) ) {
				// WooCommerce in general.
				add_theme_support( 'woocommerce' );
				// Enabling WooCommerce product gallery features (are off by default since WC 3.0.0).
				// zoom.
				add_theme_support( 'wc-product-gallery-zoom' );
				// lightbox.
				add_theme_support( 'wc-product-gallery-lightbox' );
				// swipe.
				add_theme_support( 'wc-product-gallery-slider' );
			}
		}
	}
}
add_action( 'after_setup_theme', 'hello_elementor_setup' );

function hello_maybe_update_theme_version_in_db() {
	$theme_version_option_name = 'hello_theme_version';
	// The theme version saved in the database.
	$hello_theme_db_version = get_option( $theme_version_option_name );

	// If the 'hello_theme_version' option does not exist in the DB, or the version needs to be updated, do the update.
	if ( ! $hello_theme_db_version || version_compare( $hello_theme_db_version, HELLO_ELEMENTOR_VERSION, '<' ) ) {
		update_option( $theme_version_option_name, HELLO_ELEMENTOR_VERSION );
	}
}

if ( ! function_exists( 'hello_elementor_scripts_styles' ) ) {
	/**
	 * Theme Scripts & Styles.
	 *
	 * @return void
	 */
	function hello_elementor_scripts_styles() {
		$min_suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		if ( apply_filters( 'hello_elementor_enqueue_style', true ) ) {
			wp_enqueue_style(
				'hello-elementor',
				get_template_directory_uri() . '/style' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}

		if ( apply_filters( 'hello_elementor_enqueue_theme_style', true ) ) {
			wp_enqueue_style(
				'hello-elementor-theme-style',
				get_template_directory_uri() . '/theme' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}
	}
}
add_action( 'wp_enqueue_scripts', 'hello_elementor_scripts_styles' );

if ( ! function_exists( 'hello_elementor_register_elementor_locations' ) ) {
	/**
	 * Register Elementor Locations.
	 *
	 * @param ElementorPro\Modules\ThemeBuilder\Classes\Locations_Manager $elementor_theme_manager theme manager.
	 *
	 * @return void
	 */
	function hello_elementor_register_elementor_locations( $elementor_theme_manager ) {
		if ( apply_filters( 'hello_elementor_register_elementor_locations', true ) ) {
			$elementor_theme_manager->register_all_core_location();
		}
	}
}
add_action( 'elementor/theme/register_locations', 'hello_elementor_register_elementor_locations' );

if ( ! function_exists( 'hello_elementor_content_width' ) ) {
	/**
	 * Set default content width.
	 *
	 * @return void
	 */
	function hello_elementor_content_width() {
		$GLOBALS['content_width'] = apply_filters( 'hello_elementor_content_width', 800 );
	}
}
add_action( 'after_setup_theme', 'hello_elementor_content_width', 0 );

if ( is_admin() ) {
	require get_template_directory() . '/includes/admin-functions.php';
}

/**
 * If Elementor is installed and active, we can load the Elementor-specific Settings & Features
*/

// Allow active/inactive via the Experiments
require get_template_directory() . '/includes/elementor-functions.php';

/**
 * Include customizer registration functions
*/
function hello_register_customizer_functions() {
	if ( is_customize_preview() ) {
		require get_template_directory() . '/includes/customizer-functions.php';
	}
}
add_action( 'init', 'hello_register_customizer_functions' );

if ( ! function_exists( 'hello_elementor_check_hide_title' ) ) {
	/**
	 * Check hide title.
	 *
	 * @param bool $val default value.
	 *
	 * @return bool
	 */
	function hello_elementor_check_hide_title( $val ) {
		if ( defined( 'ELEMENTOR_VERSION' ) ) {
			$current_doc = Elementor\Plugin::instance()->documents->get( get_the_ID() );
			if ( $current_doc && 'yes' === $current_doc->get_settings( 'hide_title' ) ) {
				$val = false;
			}
		}
		return $val;
	}
}
add_filter( 'hello_elementor_page_title', 'hello_elementor_check_hide_title' );

/**
 * BC:
 * In v2.7.0 the theme removed the `hello_elementor_body_open()` from `header.php` replacing it with `wp_body_open()`.
 * The following code prevents fatal errors in child themes that still use this function.
 */
if ( ! function_exists( 'hello_elementor_body_open' ) ) {
	function hello_elementor_body_open() {
		wp_body_open();
	}
}


// Create Send Push Notification Function
function send_onesignal_notification($title, $message, $user_id) {
    $onesignal_auth_key = 'NWM3MjAxNGQtOWYwNC00YjE0LWE2ZDItZTQ3MjIwNDlkZDVi';
    $onesignal_app_id = '847956ba-62d4-4db8-a246-30a544620a07';

    $fields = [
        'app_id' => $onesignal_app_id,
        'include_player_ids' => [get_user_meta($user_id, 'onesignal_push_id', true)],
        'data' => [
            'foo' => 'bar',
        ],
        'contents' => [
            'en' => $message,
        ],
        'headings' => [
            'en' => $title,
        ],
    ];

    $fields = json_encode($fields);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json; charset=utf-8',
        'Authorization: Basic ' . $onesignal_auth_key,
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}




// Send Push Notification to all Users with role "job-manager" - On new "Pending" job by Super Forms
function on_form_submitted($atts) {
    // List of form IDs that should trigger the notification
    $valid_form_ids = array(17116, 14339, 14338, 14334, 14331, 14329, 14273, 14271, 14269, 14267, 14264, 14262, 14260, 14257, 14250, 14247);

    // Check if the form ID is in the list of valid form IDs
    if (in_array($atts['form_id'], $valid_form_ids)) {

        // Retrieve the post title and job_status from the form data
        $post_title = '';
        $job_status = '';
        $job_title = '';
        $suburb_name = '';
        $date = '';
        $time = '';
        foreach ($atts['data'] as $key => $field) {
            if ($field['name'] === 'post_title') {
                $post_title = $field['value'];
            } elseif ($field['name'] === 'job_status') {
                $job_status = $field['value'];
            } elseif ($field['name'] === 'job_title') {
                $job_title = $field['value'];
            } elseif ($field['name'] === 'suburb_name') {
                $suburb_name = $field['value'];
            } elseif ($field['name'] === 'date') {
                $date = $field['value'];
            } elseif ($field['name'] === 'time') {
                $time = $field['value'];
            }
        }

        // Check if job_status is 'Pending'
        if ($job_status === 'Pending') {
            // Send notification to all job-managers
            $job_managers = get_users(array('role' => 'job-manager'));
            foreach ($job_managers as $job_manager) {
                $push_id = get_user_meta($job_manager->ID, 'onesignal_push_id', true);
                if (!empty($push_id)) {
                    $title = 'New Job Alert';
                    $message = 'A new job has been posted: ' . $job_title . ' in ' . $suburb_name . ' on ' . $date . ' - ' . $time;
                    try {
                        send_onesignal_notification($title, $message, $job_manager->ID);
                    } catch (Exception $e) {
                        error_log('Error in on_form_submitted: ' . $e->getMessage());
                    }
                }
            }
        }
    }
}
add_action('super_before_email_success_msg_action', 'on_form_submitted', 20, 1);


// Send notification to Assigned Tradie - After job gets updated by WP backend
function on_job_assigned($post_id) {
    // Check if the post type is 'tp-job'
    $post = get_post($post_id);
    if ($post->post_type == 'tp-job') {

        // Check if the job_status field is 'Pending Tradie Approval'
        if (get_field('job_status', $post_id) == 'Pending Tradie Approval') {

            // Get the job metadata fields
            $job_title = $post->post_title;
            $suburb_name = get_post_meta($post_id, 'suburb_name', true);
            $date = get_post_meta($post_id, 'date', true);
            $time = get_post_meta($post_id, 'time', true);
            $job_id = get_post_meta($post_id, 'job_id', true);

            // Send notification to the author (tradie)
            $push_id = get_user_meta($post->post_author, 'onesignal_push_id', true);
            if (!empty($push_id)) {
                $title = 'New Job Assigned - Job ID #' . $job_id;
                $message = "You've been assigned to a new job: $job_title in $suburb_name on $date - $time";
                try {
                    send_onesignal_notification($title, $message, $post->post_author);
                } catch (Exception $e) {
                    error_log('Error in on_job_assigned: ' . $e->getMessage());
                }
            }
        }
    }
}
add_action('acf/save_post', 'on_job_assigned', 20);


// Send notification to Assigned Tradie - After job gets updated - Super Form ID 16678
function on_job_assigned_super_forms($form_entry) {
    // Check if the form ID is 16678
    if ($form_entry['form_id'] == 16678) {

        // Get the tradie_id and job_id field values
        $tradie_id = '';
        $job_id = '';
        foreach ($form_entry['data'] as $key => $field) {
            if ($field['name'] === 'tradie_id') {
                $tradie_id = $field['value'];
            }
            if ($field['name'] === 'job_id') {
                $job_id = $field['value'];
            }
            if ($field['name'] === 'current_post_identity') {
                $post_id = $field['value'];
            }
        }

        // If the tradie_id and job_id are set, update the job and send the notification
        if (!empty($tradie_id) && !empty($job_id) && !empty($post_id)) {
            $tradie = get_user_by('ID', $tradie_id);
            $job_post = get_post($post_id);

            if ($tradie && $job_post) {
                // Update the job's author and job status
                $job_post_args = array(
                    'ID' => $post_id,
                    'post_author' => $tradie_id,
                );
                wp_update_post($job_post_args);
                update_field('job_status', 'Pending Tradie Approval', $post_id);

                // Refresh the job post object after updating
                $job_post = get_post($post_id);

                // Get suburb name, date and time using job post ID
                $suburb_name = get_post_meta($post_id, 'suburb_name', true);
                $date = get_post_meta($post_id, 'date', true);
                $time = get_post_meta($post_id, 'time', true);

                // Send the notification to the tradie
                $push_id = get_user_meta($tradie_id, 'onesignal_push_id', true);
                if (!empty($push_id)) {
                    $title = 'New Job Assigned - Job ID #' . $job_id;
                    $message = "You've been assigned to a new job: " . $job_post->post_title . ' in ' . $suburb_name . ' on ' . $date . ' - ' . $time;
                    try {
                        send_onesignal_notification($title, $message, $tradie_id);
                    } catch (Exception $e) {
                        error_log('Error in on_job_assigned_super_forms: ' . $e->getMessage());
                    }
                }
            }
        }
    }
}
add_action('super_before_email_success_msg_action', 'on_job_assigned_super_forms', 30, 1);



// Push Notification for all Job Managers After Tradie Decision - Super Form ID 17249
function on_job_decision_form_submitted($form_entry) {
    // Check if the form ID is 17249
    if ($form_entry['form_id'] == 17249) {

        // Get the job decision field value
        $job_decision = '';
        $job_id = '';
        $proposed_date = '';
        $business_name = '';
        $custom_job_id = '';

        foreach ($form_entry['data'] as $key => $field) {
            if ($field['name'] === 'job_decision') {
                $job_decision = $field['value'];
            } elseif ($field['name'] === 'current_post_identity') {
                $job_id = intval($field['value']);
                $custom_job_id = get_post_meta($job_id, 'job_id', true);
            } elseif ($field['name'] === 'proposed_date') {
                $proposed_date = $field['value'];
            } elseif ($field['name'] === 'hidden_business') {
                $business_name = $field['value'];
            } elseif ($field['name'] === 'job_id') {
                $custom_job_id = $field['value'];
            }
        }

        // If the job decision is set, update the job and send the notification
        if (!empty($job_decision)) {

            // Get the job post data
            $job_post = get_post($job_id);
            $post_title = $job_post->post_title;
            $suburb_name = get_field('suburb_name', $job_id);
            $date = get_field('date', $job_id);
            $job_status = get_field('job_status', $job_id);

            // Set the title and message depending on the job decision
            switch ($job_decision) {
                case 'Accept job':
                    $title = 'Job Accepted - Job ID #' . $custom_job_id;
                    $message = $business_name . ' has accepted the job: ' . $post_title . ' in ' . $suburb_name . ' on ' . $date;
                    update_field('job_status', 'In progress', $job_id);
                    break;
                case 'Reject job':
                    $title = 'Job Rejected - Job ID #' . $custom_job_id;
                    $message = $business_name . ' has rejected the job: ' . $post_title . ' in ' . $suburb_name . ' on ' . $date;
                    update_field('job_status', 'Pending', $job_id);
                    wp_update_post(array('ID' => $job_id, 'post_author' => 991));
                    break;
                case 'Propose another date':
                    $title = 'New Date Proposed - Job ID #' . $custom_job_id;
                    $message = $business_name . ' has proposed a new date for the job: ' . $post_title . ' - Proposed date: ' . $proposed_date;
                    update_field('job_status', 'Pending Admin Approval', $job_id);
                    update_field('tradie_proposed_date', $proposed_date, $job_id);
                    break;
            }

                        // Send notification to all job-managers
                        $job_managers = get_users(array('role' => 'job-manager'));
                        foreach ($job_managers as $job_manager) {
                            $push_id = get_user_meta($job_manager->ID, 'onesignal_push_id', true);
                            if (!empty($push_id)) {
                                try {
                                    send_onesignal_notification($title, $message, $job_manager->ID);
                                } catch (Exception $e) {
                                    error_log('Error in on_job_decision_form_submitted: ' . $e->getMessage());
                                }
                            }
                        }
                    }
                }
            }
            add_action('super_before_email_success_msg_action', 'on_job_decision_form_submitted', 40, 1);


// Push notification to Tradie after Job Manager Decision of Proposed Date - Super Form ID 17303
function on_proposed_date_decision($form_entry) {
    // Check if the form ID is 17303
    if ($form_entry['form_id'] == 17303) {

        // Get the job_decision, tradie_id, and job_id field values
        $job_decision = '';
        $tradie_id = '';
        $job_id = '';
        foreach ($form_entry['data'] as $key => $field) {
            if ($field['name'] === 'job_decision') {
                $job_decision = $field['value'];
            } elseif ($field['name'] === 'tradie_id') {
                $tradie_id = $field['value'];
            } elseif ($field['name'] === 'current_post_identity') {
                $job_post_id = $field['value'];
            } elseif ($field['name'] === 'job_id') {
                $job_id = $field['value'];
            }
        }

        // Update the job status depending on the job_decision
        if ($job_decision === 'Accept new date') {
            update_field('job_status', 'In progress', $job_post_id);
        } elseif ($job_decision === 'Reject new date') {
            update_field('job_status', 'Pending', $job_post_id);
            wp_update_post(array(
                'ID' => $job_post_id,
                'post_author' => 991
            ));
        }

        // If the tradie_id is set, send the notification
        if (!empty($tradie_id)) {
            $tradie = get_user_by('ID', $tradie_id);
            if ($tradie) {

                $push_id = get_user_meta($tradie_id, 'onesignal_push_id', true);
                if (!empty($push_id)) {
                    $job_post = get_post($job_post_id);
                    $job_title = $job_post->post_title;
                    $job_suburb = get_field('suburb_name', $job_post_id);
                    $job_date = get_field('tradie_proposed_date', $job_post_id);
                    $job_time = get_field('time', $job_post_id);

                    $title = '';
                    $message = '';
                    if ($job_decision === 'Accept new date') {
                        $title = "New Date Accepted - Job ID #{$job_id}";
                        $message = "Your proposed date for job '{$job_title}' has been accepted. New job date: {$job_date} - {$job_time}";
                    } elseif ($job_decision === 'Reject new date') {
                        $title = "New Date Rejected - Job ID #{$job_id}";
                        $message = "Your proposed date for job '{$job_title}' has been rejected. We will notify you with new jobs.";
                    }

                    try {
                        send_onesignal_notification($title, $message, $tradie_id);
                    } catch (Exception $e) {
                        error_log('Error in on_proposed_date_decision: ' . $e->getMessage());
                    }
                }
            }
        }
    }
}
add_action('super_before_email_success_msg_action', 'on_proposed_date_decision', 50, 1);


// Send notification to all Users with role "job-manager" - After job gets completed by Tradie
function on_job_completed($form_entry) {
    // Check if the form ID is 17492
    if ($form_entry['form_id'] == 17492) {

        // Retrieve the post ID from the form data
        $post_id = url_to_postid(wp_get_referer());

        // Retrieve the post title and tradie name
        $post = get_post($post_id);
        $tradie_id = $post->post_author;
        $tradie = get_user_by('ID', $tradie_id);
        $tradie_name = get_field('business_name', 'user_'.$tradie_id);
        $job_id = get_post_meta($post_id, 'job_id', true);

        // Retrieve the job cost from the form data
        $job_cost = '';
        foreach ($form_entry['data'] as $key => $field) {
            if ($field['name'] === 'job_cost') {
                $job_cost = $field['value'];
                break;
            }
        }

        // Update the job status and tradie cost
        $job_status = 'Completed by Tradie';
        $tradie_cost = $job_cost;
        update_field('job_status', $job_status, $post_id);
        update_field('tradie_cost', $tradie_cost, $post_id);

        // Send notification to all job-managers
        $job_managers = get_users(array('role' => 'job-manager'));
        foreach ($job_managers as $job_manager) {
            $push_id = get_user_meta($job_manager->ID, 'onesignal_push_id', true);
            if (!empty($push_id)) {
                $title = 'Job Completed - ID #' . $job_id;
                $message = $tradie_name . ' has completed the job "' . $post->post_title . '" for $' . $job_cost;
                try {
                    send_onesignal_notification($title, $message, $job_manager->ID);
                } catch (Exception $e) {
                    error_log('Error in on_job_completed: ' . $e->getMessage());
                }
            }
        }
    }
}
add_action('super_before_email_success_msg_action', 'on_job_completed', 30, 1);

// Push notification to Tradie after Job Manager Completes the Job - Super Form ID 17569
function on_job_completed_by_admin($form_entry) {
    // Check if the form ID is 17569
    if ($form_entry['form_id'] == 17569) {
        // Retrieve the tradie ID and saved cost from the form data
        $tradie_id = '';
        $tradie_saved_cost = '';
        foreach ($form_entry['data'] as $key => $field) {
            if ($field['name'] === 'tradie_id') {
                $tradie_id = $field['value'];
            } elseif ($field['name'] === 'tradie_saved_cost') {
                $tradie_saved_cost = $field['value'];
            }
        }

        // Retrieve the post ID from the form data
        $post_id = url_to_postid(wp_get_referer());

        // Retrieve the post title
        $post = get_post($post_id);

        // Retrieve the tradie name
        $tradie = get_user_by('ID', $tradie_id);
        $tradie_name = get_field('business_name', 'user_'.$tradie_id);

        // Update the job status and total cost ACF field
        $job = get_post($post_id);
        if ($job) {
            // Update job status to "Completed"
            update_post_meta($post_id, 'job_status', 'Completed');

            // Update job total cost ACF field
            foreach ($form_entry['data'] as $key => $field) {
                if ($field['name'] === 'total_job_admin') {
                    $total_cost = $field['value'];
                    update_field('total_cost', $total_cost, $post_id);
                    break;
                }
            }
        }

        // Send notification to the tradie who completed the job
        $push_id = get_user_meta($tradie_id, 'onesignal_push_id', true);
        if (!empty($push_id)) {
            $title = 'Its done! - Earnings: $' . $tradie_saved_cost;
            $message = 'Your job "' . $post->post_title . '" has been completed by the job manager, thank you!';
            try {
                send_onesignal_notification($title, $message, $tradie_id);
            } catch (Exception $e) {
                error_log('Error in on_job_completed_by_admin: ' . $e->getMessage());
            }
        }
    }
}
add_action('super_before_email_success_msg_action', 'on_job_completed_by_admin', 30, 1);


// Show number of jobs for Tradies - By Status Parameter 
function custom_user_job_count_status_shortcode( $atts ) {
    $current_user = wp_get_current_user();

    if ( $current_user->ID == 0 ) {
        return 'Please log in to see the job count.';
    }

    $status = isset( $atts['status'] ) ? $atts['status'] : '';

    $args = array(
        'post_type'      => 'tp-job',
        'author'         => $current_user->ID,
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'fields'         => 'ids',
        'meta_query'     => array(
            array(
                'key'     => 'job_status',
                'value'   => $status,
                'compare' => '=',
            ),
        ),
    );

    $query = new WP_Query( $args );

    return $query->post_count;
}
add_shortcode( 'user_job_count_status', 'custom_user_job_count_status_shortcode' );


// Show number of jobs for Managers - By Status Parameter
function custom_job_count_shortcode( $atts ) {
    $status = isset($atts['status']) ? $atts['status'] : '';

    // Define the allowed job status values
    $allowed_job_status = array( 'Pending Admin Approval', 'Pending Tradie Approval', 'Pending', 'In progress', 'Completed' );

    // Check if a user ID is provided
    if (isset($atts['user_id'])) {
        $user_id = $atts['user_id'];
    } else {
        $user_id = 0; // Set to 0 to get all jobs
    }

    // Set the query arguments
    $args = array(
        'post_type'      => 'tp-job',
        'author'         => $user_id,
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'fields'         => 'ids',
        'meta_query'     => array(
            array(
                'key'     => 'job_status',
                'value'   => $allowed_job_status,
                'compare' => 'IN',
            ),
        ),
    );

    // Check if a job status is provided
    if (!empty($status)) {
        $args['meta_query'][] = array(
            'key'     => 'job_status',
            'value'   => $status,
            'compare' => '=',
        );
    }

    // Run the WP_Query
    $query = new WP_Query( $args );

    // Return the post count
    return $query->post_count;
}
add_shortcode( 'job_count', 'custom_job_count_shortcode' );


// Update One Signal Push ID for Users



// Remove WP Bar from all users
function remove_admin_bar_for_non_admins() {
    if ( ! current_user_can( 'manage_options' ) ) {
        add_filter( 'show_admin_bar', '__return_false' );
    }
}
add_action( 'after_setup_theme', 'remove_admin_bar_for_non_admins' );

// Bypass Logging out WP confirmation
function custom_logout_url() {
    return wp_logout_url( home_url( '/login/' ) );
}
add_shortcode( 'custom_logout_url', 'custom_logout_url' );

// Get One Signal ID From URL 
function update_user_onesignal_push_id($user_login, $user) {
    $user_id = $user->ID;
    $url = $_SERVER['REQUEST_URI'];
    if (strpos($url, 'onesignal_push_id=') !== false) {
        $push_id = $_GET['onesignal_push_id'];
        update_user_meta($user_id, 'onesignal_push_id', $push_id);
    }
}
add_action('wp_login', 'update_user_onesignal_push_id', 10, 2);

// Redirect Logged in user to My Jobs
function redirect_users() {
    if ( is_page( 'login' ) ) {
        if ( is_user_logged_in() ) {
            wp_redirect( 'https://tradie.pro/my-jobs/' ); // replace with your dashboard URL
            exit;
        }
    }
}
// add_action('template_redirect', 'redirect_users');

// Redirect Logged out user to Login
function redirect_logged_out_users() {
    $restricted_page_ids = array(20907, 16813, 20060, 20907, 20197, 20152, 20107);

    if ( ! is_user_logged_in() && is_page( $restricted_page_ids ) ) {
        wp_redirect( 'https://tradie.pro/login/' );
        exit;
    }
}
add_action('template_redirect', 'redirect_logged_out_users');

// Shortcode for Tradies Earnings
function tp_job_earnings() {
    $user_id = get_current_user_id();
    if ($user_id == 0) {
        return 'You must be logged in to view your earnings.';
    }

    $args = array(
        'post_type' => 'tp-job',
        'posts_per_page' => -1,
        'author' => $user_id,
        'post_status' => 'publish',
    );

    $total = 0;
    $user_posts = get_posts($args);

    foreach ($user_posts as $user_post) {
        $tradie_cost = get_post_meta($user_post->ID, 'tradie_cost', true);
        if (!empty($tradie_cost)) {
            $total += (float)$tradie_cost;
        }
    }

    return 'Your total earnings: $' . number_format($total, 2);
}

add_shortcode('tp_job_earnings', 'tp_job_earnings');

// Shortcode for All Earnings - Job Managers
function tp_all_jobs_earnings() {
    $user_id = get_current_user_id();
    $user = wp_get_current_user();

    if (!in_array('job-manager', $user->roles)) {
        return 'You must be a job manager to view total earnings for all jobs.';
    }

    $args = array(
        'post_type' => 'tp-job',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    );

    $total_earnings = 0;
    $jobs = new WP_Query($args);
    if ($jobs->have_posts()) {
        while ($jobs->have_posts()) {
            $jobs->the_post();
            $total_cost = (float)get_post_meta(get_the_ID(), 'total_cost', true);
            $total_earnings += $total_cost;
        }
        wp_reset_postdata();
    }

    return 'Total earnings for all jobs: $' . number_format($total_earnings, 2);
}
add_shortcode('tp_all_jobs_earnings', 'tp_all_jobs_earnings');

// Shortcode for Logged in User Role Name
function get_role_display_name($role_slug) {
    $wp_roles = wp_roles();
    if (isset($wp_roles->roles[$role_slug])) {
        return $wp_roles->roles[$role_slug]['name'];
    }
    return '';
}

function display_user_role_name() {
    $user = wp_get_current_user();
    if ($user->ID) {
        $user_roles = $user->roles;
        $primary_role = $user_roles[0];
        return get_role_display_name($primary_role);
    }
    return '';
}
add_shortcode('user_role_name', 'display_user_role_name');


// Send Custom Notification
function send_notification_to_user($atts) {
    // Check if the form ID is 22219
    if ($atts['form_id'] == '22219') {

        // Get the form data
        $form_data = $atts['data'];

        // Get the user's email from the form data
        $user_email = '';
        foreach ($form_data as $field) {
            if ($field['name'] === 'user_email') {
                $user_email = $field['value'];
                break;
            }
        }

        // Get the user's onesignal_push_id
        $user = get_user_by('email', $user_email);
        $push_id = get_user_meta($user->ID, 'onesignal_push_id', true);

        // Get the push notification message and title
        $notification_title = '';
        $notification_message = '';
        foreach ($form_data as $field) {
            if ($field['name'] === 'notification_title') {
                $notification_title = stripslashes($field['value']);
            } elseif ($field['name'] === 'notification_message') {
                $notification_message = stripslashes($field['value']);
            }
        }

        // Send the push notification to the user
        try {
            send_onesignal_notification($notification_title, $notification_message, $user->ID, $push_id);
        } catch (Exception $e) {
            error_log('Error in send_notification_to_user: ' . $e->getMessage());
        }
    }
}
add_action('super_before_email_success_msg_action', 'send_notification_to_user', 10, 1);


// Create Custom Post Type: Quotations
function create_quotations_post_type() {
  // Set UI labels for Custom Post Type
  $labels = array(
    'name'                => 'Quotations',
    'singular_name'       => 'Quotation',
    'menu_name'           => 'Quotations',
    'parent_item_colon'   => 'Parent Quotation',
    'all_items'           => 'All Quotations',
    'view_item'           => 'View Quotation',
    'add_new_item'        => 'Add New Quotation',
    'add_new'             => 'Add New',
    'edit_item'           => 'Edit Quotation',
    'update_item'         => 'Update Quotation',
    'search_items'        => 'Search Quotation',
    'not_found'           => 'Not Found',
    'not_found_in_trash'  => 'Not found in Trash',
  );

  // Set other options for Custom Post Type
  $args = array(
    'label'               => 'quotations',
    'description'         => 'Quotations for TradiePro',
    'labels'              => $labels,
    'supports'            => array( 'title', 'revisions' ),
    'taxonomies'          => array(),
    'hierarchical'        => false,
    'public'              => true,
    'show_ui'             => true,
    'show_in_menu'        => true,
    'show_in_nav_menus'   => true,
    'show_in_admin_bar'   => true,
    'menu_position'       => 5,
    'menu_icon'           => 'dashicons-media-document',
    'can_export'          => true,
    'has_archive'         => true,
    'exclude_from_search' => false,
    'publicly_queryable'  => true,
    'capability_type'     => 'post',
    'rewrite'             => array( 'slug' => 'tp-quotation' ),
  );

  // Registering your Custom Post Type
  register_post_type( 'tp-quotation', $args );
}

add_action( 'init', 'create_quotations_post_type', 0 );

// Replace Tax with GST on checkout
add_filter( 'gettext', 'change_tax_to_gst', 20, 3 );
function change_tax_to_gst( $translated_text, $text, $domain ) {
    if ( $text === 'Tax' && $domain === 'woocommerce' ) {
        $translated_text = 'GST';
    }
    return $translated_text;
}
// Add heading above Payment
add_action( 'woocommerce_review_order_before_payment', 'add_pay_securely_heading', 10 );
function add_pay_securely_heading() {
    echo '<h6 class="custom-head-checkout">Pay Securely</h6>';
}
// Change Checkout button depending on payment
add_filter( 'woocommerce_order_button_text', 'change_checkout_button_text' );
function change_checkout_button_text( $button_text ) {
    $cart_items = WC()->cart->get_cart();
    $product_id_1 = 22511; 
    $product_id_2 = 22510; 
    foreach ( $cart_items as $item ) {
        if ( $item['product_id'] == $product_id_1 ) {
            $button_text = __( 'Confirm Booking', 'woocommerce' );
            break;
        } else if ( $item['product_id'] == $product_id_2 ) {
            $button_text = __( 'Complete Payment', 'woocommerce' );
            break;
        }
    }
    return $button_text;
}

// Update Quotation Status after Payment
function update_quotation_status( $order_id ) {
    // Get the order object
    $order = wc_get_order( $order_id );

    // Get the product ID
    $product_id = reset( $order->get_items() )['product_id'];

    // Check if the product ID matches
    if ( $product_id == 22511 ) {
        // Get the billing job ID from the order meta
        $job_id = $order->get_meta( 'billing_job_id' );

        // Find the quotation post with matching job ID
        $quotation_query = new WP_Query(
            array(
                'post_type' => 'tp-quotation',
                'meta_key' => 'job_id',
                'meta_value' => $job_id,
                'meta_compare' => '=',
                'posts_per_page' => 1,
            )
        );

        // Update the quotation status to "Deposit paid"
        if ( $quotation_query->have_posts() ) {
            $quotation_post = $quotation_query->posts[0];
            update_post_meta( $quotation_post->ID, 'quotation_status', 'Deposit paid' );
        }
    } elseif ( $product_id == 22510 ) {
        // Get the billing job ID from the order meta
        $job_id = $order->get_meta( 'billing_job_id' );

        // Find the quotation post with matching job ID
        $quotation_query = new WP_Query(
            array(
                'post_type' => 'tp-quotation',
                'meta_key' => 'job_id',
                'meta_value' => $job_id,
                'meta_compare' => '=',
                'posts_per_page' => 1,
            )
        );

        // Update the quotation status to "Payment completed"
        if ( $quotation_query->have_posts() ) {
            $quotation_post = $quotation_query->posts[0];
            update_post_meta( $quotation_post->ID, 'quotation_status', 'Payment completed' );
        }
    }
}
add_action( 'woocommerce_order_status_completed', 'update_quotation_status', 10, 1 );

// Hide Deposit due & Remaining on Complete Payment checkout
add_filter( 'woocommerce_checkout_fields', 'show_hide_checkout_fields' );
function show_hide_checkout_fields( $fields ) {
    // Get cart items
    $cart_items = WC()->cart->get_cart();

    // Check if cart has product with id = 22511
    $has_deposit_product = false;
    foreach ( $cart_items as $item ) {
        if ( $item['product_id'] == 22511 ) {
            $has_deposit_product = true;
            break;
        }
    }

    // Show/hide fields based on cart content
    if ( $has_deposit_product ) {
        $fields['billing']['billing_due']['required'] = true;
        $fields['billing']['billing_remaining']['required'] = true;
    } else {
        unset( $fields['billing']['billing_due'] );
        unset( $fields['billing']['billing_remaining'] );
    }

    return $fields;
}
