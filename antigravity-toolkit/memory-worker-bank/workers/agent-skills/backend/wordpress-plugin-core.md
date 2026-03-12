# wordpress-plugin-core
Source: https://antigravity.codes/agent-skills/backend/wordpress-plugin-core

## AI Worker Instructions
When the user requests functionality related to wordpress-plugin-core, follow these guidelines and utilize this context.

## Scraped Content

# wordpress-plugin-core
```
<?php/** * Plugin Name: My Plugin * Version: 1.0.0 * Requires at least: 5.9 * Requires PHP: 7.4 * Text Domain: my-plugin */if ( ! defined( 'ABSPATH' ) ) exit;
```
```
<?php/** * Plugin Name: My Plugin * Version: 1.0.0 * Requires at least: 5.9 * Requires PHP: 7.4 * Text Domain: my-plugin */if ( ! defined( 'ABSPATH' ) ) exit;
```
```
// 1. Unique Prefixdefine( 'MYPL_VERSION', '1.0.0' );function mypl_init() { /* code */ }add_action( 'init', 'mypl_init' );// 2. ABSPATH Check (every PHP file)if ( ! defined( 'ABSPATH' ) ) exit;// 3. Nonceswp_nonce_field( 'mypl_action', 'mypl_nonce' );wp_verify_nonce( $_POST['mypl_nonce'], 'mypl_action' );// 4. Sanitize Input, Escape Output$clean = sanitize_text_field( $_POST['input'] );echo esc_html( $output );// 5. Prepared Statementsglobal $wpdb;$wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}table WHERE id = %d", $id ) );
```
```
// 1. Unique Prefixdefine( 'MYPL_VERSION', '1.0.0' );function mypl_init() { /* code */ }add_action( 'init', 'mypl_init' );// 2. ABSPATH Check (every PHP file)if ( ! defined( 'ABSPATH' ) ) exit;// 3. Nonceswp_nonce_field( 'mypl_action', 'mypl_nonce' );wp_verify_nonce( $_POST['mypl_nonce'], 'mypl_action' );// 4. Sanitize Input, Escape Output$clean = sanitize_text_field( $_POST['input'] );echo esc_html( $output );// 5. Prepared Statementsglobal $wpdb;$wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}table WHERE id = %d", $id ) );
```
```
wp_
```
```
__
```
```
_
```
```
function mypl_function() {}  // ✅class MyPL_Class {}          // ✅function init() {}           // ❌ Will conflict
```
```
function mypl_function() {}  // ✅class MyPL_Class {}          // ✅function init() {}           // ❌ Will conflict
```
```
// ❌ WRONG - Security holeif ( is_admin() ) { /* delete data */ }// ✅ CORRECTif ( current_user_can( 'manage_options' ) ) { /* delete data */ }
```
```
// ❌ WRONG - Security holeif ( is_admin() ) { /* delete data */ }// ✅ CORRECTif ( current_user_can( 'manage_options' ) ) { /* delete data */ }
```
```
manage_options
```
```
edit_posts
```
```
read
```
```
// Sanitize INPUT$name = sanitize_text_field( $_POST['name'] );$email = sanitize_email( $_POST['email'] );$html = wp_kses_post( $_POST['content'] );  // Allow safe HTML$ids = array_map( 'absint', $_POST['ids'] );// Validate LOGICif ( ! is_email( $email ) ) wp_die( 'Invalid' );// Escape OUTPUTecho esc_html( $name );echo '<a href="' . esc_url( $url ) . '">';echo '<div class="' . esc_attr( $class ) . '">';
```
```
// Sanitize INPUT$name = sanitize_text_field( $_POST['name'] );$email = sanitize_email( $_POST['email'] );$html = wp_kses_post( $_POST['content'] );  // Allow safe HTML$ids = array_map( 'absint', $_POST['ids'] );// Validate LOGICif ( ! is_email( $email ) ) wp_die( 'Invalid' );// Escape OUTPUTecho esc_html( $name );echo '<a href="' . esc_url( $url ) . '">';echo '<div class="' . esc_attr( $class ) . '">';
```
```
// Form<?php wp_nonce_field( 'mypl_action', 'mypl_nonce' ); ?>if ( ! wp_verify_nonce( $_POST['mypl_nonce'], 'mypl_action' ) ) wp_die( 'Failed' );// AJAXcheck_ajax_referer( 'mypl-ajax-nonce', 'nonce' );wp_localize_script( 'mypl-script', 'mypl_ajax_object', array(    'ajaxurl' => admin_url( 'admin-ajax.php' ),    'nonce'   => wp_create_nonce( 'mypl-ajax-nonce' ),) );
```
```
// Form<?php wp_nonce_field( 'mypl_action', 'mypl_nonce' ); ?>if ( ! wp_verify_nonce( $_POST['mypl_nonce'], 'mypl_action' ) ) wp_die( 'Failed' );// AJAXcheck_ajax_referer( 'mypl-ajax-nonce', 'nonce' );wp_localize_script( 'mypl-script', 'mypl_ajax_object', array(    'ajaxurl' => admin_url( 'admin-ajax.php' ),    'nonce'   => wp_create_nonce( 'mypl-ajax-nonce' ),) );
```
```
// ❌ SQL Injection$wpdb->get_results( "SELECT * FROM table WHERE id = {$_GET['id']}" );// ✅ Prepared (%s=String, %d=Integer, %f=Float)$wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}table WHERE id = %d", $_GET['id'] ) );// LIKE Queries$search = '%' . $wpdb->esc_like( $term ) . '%';$wpdb->get_results( $wpdb->prepare( "... WHERE title LIKE %s", $search ) );
```
```
// ❌ SQL Injection$wpdb->get_results( "SELECT * FROM table WHERE id = {$_GET['id']}" );// ✅ Prepared (%s=String, %d=Integer, %f=Float)$wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}table WHERE id = %d", $_GET['id'] ) );// LIKE Queries$search = '%' . $wpdb->esc_like( $term ) . '%';$wpdb->get_results( $wpdb->prepare( "... WHERE title LIKE %s", $search ) );
```
```
if ( ! defined( 'ABSPATH' ) ) exit;
```
```
current_user_can()
```
```
is_admin()
```
```
sanitize_*()
```
```
esc_*()
```
```
is_admin()
```
```
<?
```
```
<?=
```
```
<?php
```
```
register_uninstall_hook()
```
```
$wpdb->prepare()
```
```
// VULNERABLE$wpdb->query( "DELETE FROM {$wpdb->prefix}table WHERE id = {$_GET['id']}" );// SECURE$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->prefix}table WHERE id = %d", $_GET['id'] ) );
```
```
// VULNERABLE$wpdb->query( "DELETE FROM {$wpdb->prefix}table WHERE id = {$_GET['id']}" );// SECURE$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->prefix}table WHERE id = %d", $_GET['id'] ) );
```
```
// VULNERABLEecho $_POST['name'];echo '<div class="' . $_POST['class'] . '">';// SECUREecho esc_html( $_POST['name'] );echo '<div class="' . esc_attr( $_POST['class'] ) . '">';
```
```
// VULNERABLEecho $_POST['name'];echo '<div class="' . $_POST['class'] . '">';// SECUREecho esc_html( $_POST['name'] );echo '<div class="' . esc_attr( $_POST['class'] ) . '">';
```
```
wp_nonce_field()
```
```
wp_verify_nonce()
```
```
// VULNERABLEif ( $_POST['action'] == 'delete' ) {    delete_user( $_POST['user_id'] );}// SECUREif ( ! wp_verify_nonce( $_POST['nonce'], 'mypl_delete_user' ) ) {    wp_die( 'Security check failed' );}delete_user( absint( $_POST['user_id'] ) );
```
```
// VULNERABLEif ( $_POST['action'] == 'delete' ) {    delete_user( $_POST['user_id'] );}// SECUREif ( ! wp_verify_nonce( $_POST['nonce'], 'mypl_delete_user' ) ) {    wp_die( 'Security check failed' );}delete_user( absint( $_POST['user_id'] ) );
```
```
is_admin()
```
```
current_user_can()
```
```
// VULNERABLEif ( is_admin() ) {    // Any logged-in user can trigger this}// SECUREif ( current_user_can( 'manage_options' ) ) {    // Only administrators can trigger this}
```
```
// VULNERABLEif ( is_admin() ) {    // Any logged-in user can trigger this}// SECUREif ( current_user_can( 'manage_options' ) ) {    // Only administrators can trigger this}
```
```
// Add to top of EVERY PHP fileif ( ! defined( 'ABSPATH' ) ) {    exit;}
```
```
// Add to top of EVERY PHP fileif ( ! defined( 'ABSPATH' ) ) {    exit;}
```
```
// CAUSES CONFLICTSfunction init() {}class Settings {}add_option( 'api_key', $value );// SAFEfunction mypl_init() {}class MyPL_Settings {}add_option( 'mypl_api_key', $value );
```
```
// CAUSES CONFLICTSfunction init() {}class Settings {}add_option( 'api_key', $value );// SAFEfunction mypl_init() {}class MyPL_Settings {}add_option( 'mypl_api_key', $value );
```
```
// ✅ CORRECT - Only flush on activationfunction mypl_activate() {    mypl_register_cpt();    flush_rewrite_rules();}register_activation_hook( __FILE__, 'mypl_activate' );function mypl_deactivate() {    flush_rewrite_rules();}register_deactivation_hook( __FILE__, 'mypl_deactivate' );// ❌ WRONG - Causes database overload on EVERY page loadadd_action( 'init', 'mypl_register_cpt' );add_action( 'init', 'flush_rewrite_rules' );  // BAD! Performance killer!// ❌ WRONG - In functions.phpfunction mypl_register_cpt() {    register_post_type( 'book', ... );    flush_rewrite_rules();  // BAD! Runs every time}
```
```
// ✅ CORRECT - Only flush on activationfunction mypl_activate() {    mypl_register_cpt();    flush_rewrite_rules();}register_activation_hook( __FILE__, 'mypl_activate' );function mypl_deactivate() {    flush_rewrite_rules();}register_deactivation_hook( __FILE__, 'mypl_deactivate' );// ❌ WRONG - Causes database overload on EVERY page loadadd_action( 'init', 'mypl_register_cpt' );add_action( 'init', 'flush_rewrite_rules' );  // BAD! Performance killer!// ❌ WRONG - In functions.phpfunction mypl_register_cpt() {    register_post_type( 'book', ... );    flush_rewrite_rules();  // BAD! Runs every time}
```
```
// uninstall.phpif ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {    exit;}global $wpdb;$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_mypl_%'" );$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_mypl_%'" );
```
```
// uninstall.phpif ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {    exit;}global $wpdb;$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_mypl_%'" );$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_mypl_%'" );
```
```
// BAD - Loads on every pageadd_action( 'wp_enqueue_scripts', function() {    wp_enqueue_script( 'mypl-script', $url );} );// GOOD - Only loads on specific pageadd_action( 'wp_enqueue_scripts', function() {    if ( is_page( 'my-page' ) ) {        wp_enqueue_script( 'mypl-script', $url, array( 'jquery' ), '1.0', true );    }} );
```
```
// BAD - Loads on every pageadd_action( 'wp_enqueue_scripts', function() {    wp_enqueue_script( 'mypl-script', $url );} );// GOOD - Only loads on specific pageadd_action( 'wp_enqueue_scripts', function() {    if ( is_page( 'my-page' ) ) {        wp_enqueue_script( 'mypl-script', $url, array( 'jquery' ), '1.0', true );    }} );
```
```
// VULNERABLEupdate_option( 'mypl_setting', $_POST['value'] );// SECUREupdate_option( 'mypl_setting', sanitize_text_field( $_POST['value'] ) );
```
```
// VULNERABLEupdate_option( 'mypl_setting', $_POST['value'] );// SECUREupdate_option( 'mypl_setting', sanitize_text_field( $_POST['value'] ) );
```
```
$wpdb->esc_like()
```
```
// WRONG$search = '%' . $term . '%';// CORRECT$search = '%' . $wpdb->esc_like( $term ) . '%';$results = $wpdb->get_results( $wpdb->prepare( "... WHERE title LIKE %s", $search ) );
```
```
// WRONG$search = '%' . $term . '%';// CORRECT$search = '%' . $wpdb->esc_like( $term ) . '%';$results = $wpdb->get_results( $wpdb->prepare( "... WHERE title LIKE %s", $search ) );
```
```
// DANGEROUSextract( $_POST );// Now $any_array_key becomes a variable// SAFE$name = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';
```
```
// DANGEROUSextract( $_POST );// Now $any_array_key becomes a variable// SAFE$name = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';
```
```
permission_callback
```
```
show_in_index => false
```
```
show_in_index => false
```
```
// ❌ VULNERABLE - Missing permission_callback (WordPress 5.5+ requires it!)register_rest_route( 'myplugin/v1', '/data', array(    'methods'  => 'GET',    'callback' => 'my_callback',) );// ✅ SECURE - Basic protectionregister_rest_route( 'myplugin/v1', '/data', array(    'methods'             => 'GET',    'callback'            => 'my_callback',    'permission_callback' => function() {        return current_user_can( 'edit_posts' );    },) );// ✅ SECURE - Hide sensitive endpoints from REST indexregister_rest_route( 'myplugin/v1', '/admin', array(    'methods'             => 'POST',    'callback'            => 'my_admin_callback',    'permission_callback' => function() {        return current_user_can( 'manage_options' );    },    'show_in_index'       => false,  // Don't expose in /wp-json/) );
```
```
// ❌ VULNERABLE - Missing permission_callback (WordPress 5.5+ requires it!)register_rest_route( 'myplugin/v1', '/data', array(    'methods'  => 'GET',    'callback' => 'my_callback',) );// ✅ SECURE - Basic protectionregister_rest_route( 'myplugin/v1', '/data', array(    'methods'             => 'GET',    'callback'            => 'my_callback',    'permission_callback' => function() {        return current_user_can( 'edit_posts' );    },) );// ✅ SECURE - Hide sensitive endpoints from REST indexregister_rest_route( 'myplugin/v1', '/admin', array(    'methods'             => 'POST',    'callback'            => 'my_admin_callback',    'permission_callback' => function() {        return current_user_can( 'manage_options' );    },    'show_in_index'       => false,  // Don't expose in /wp-json/) );
```
```
// BAD - Runs on every page loadregister_uninstall_hook( __FILE__, 'mypl_uninstall' );// GOOD - Use uninstall.php file (preferred method)// Create uninstall.php in plugin root
```
```
// BAD - Runs on every page loadregister_uninstall_hook( __FILE__, 'mypl_uninstall' );// GOOD - Use uninstall.php file (preferred method)// Create uninstall.php in plugin root
```
```
// WRONG - Deletes user data on deactivationregister_deactivation_hook( __FILE__, function() {    delete_option( 'mypl_user_settings' );} );// CORRECT - Only clear temporary data on deactivationregister_deactivation_hook( __FILE__, function() {    delete_transient( 'mypl_cache' );} );// CORRECT - Delete all data in uninstall.php
```
```
// WRONG - Deletes user data on deactivationregister_deactivation_hook( __FILE__, function() {    delete_option( 'mypl_user_settings' );} );// CORRECT - Only clear temporary data on deactivationregister_deactivation_hook( __FILE__, function() {    delete_transient( 'mypl_cache' );} );// CORRECT - Delete all data in uninstall.php
```
```
// In wp-config.php (development only)define( 'WP_DEBUG', true );define( 'WP_DEBUG_LOG', true );define( 'WP_DEBUG_DISPLAY', false );
```
```
// In wp-config.php (development only)define( 'WP_DEBUG', true );define( 'WP_DEBUG_LOG', true );define( 'WP_DEBUG_DISPLAY', false );
```
```
// Plugin header// Text Domain: my-plugin// In code - MUST MATCH EXACTLY__( 'Text', 'my-plugin' );_e( 'Text', 'my-plugin' );
```
```
// Plugin header// Text Domain: my-plugin// In code - MUST MATCH EXACTLY__( 'Text', 'my-plugin' );_e( 'Text', 'my-plugin' );
```
```
add_action( 'plugins_loaded', function() {    if ( ! class_exists( 'WooCommerce' ) ) {        add_action( 'admin_notices', function() {            echo '<div class="error"><p>My Plugin requires WooCommerce.</p></div>';        } );        return;    }    // Initialize plugin} );
```
```
add_action( 'plugins_loaded', function() {    if ( ! class_exists( 'WooCommerce' ) ) {        add_action( 'admin_notices', function() {            echo '<div class="error"><p>My Plugin requires WooCommerce.</p></div>';        } );        return;    }    // Initialize plugin} );
```
```
add_action( 'save_post', function( $post_id ) {    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {        return;    }    // Safe to save meta} );
```
```
add_action( 'save_post', function( $post_id ) {    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {        return;    }    // Safe to save meta} );
```
```
// OLD: admin-ajax.php (still works but slower)add_action( 'wp_ajax_mypl_action', 'mypl_ajax_handler' );// NEW: REST API (10x faster, recommended)add_action( 'rest_api_init', function() {    register_rest_route( 'myplugin/v1', '/endpoint', array(        'methods'             => 'POST',        'callback'            => 'mypl_rest_handler',        'permission_callback' => function() {            return current_user_can( 'edit_posts' );        },    ) );} );
```
```
// OLD: admin-ajax.php (still works but slower)add_action( 'wp_ajax_mypl_action', 'mypl_ajax_handler' );// NEW: REST API (10x faster, recommended)add_action( 'rest_api_init', function() {    register_rest_route( 'myplugin/v1', '/endpoint', array(        'methods'             => 'POST',        'callback'            => 'mypl_rest_handler',        'permission_callback' => function() {            return current_user_can( 'edit_posts' );        },    ) );} );
```
```
show_in_rest => true
```
```
// ❌ WRONG - Block editor won't workregister_post_type( 'book', array(    'public' => true,    'supports' => array('editor'),    // Missing show_in_rest!) );// ✅ CORRECTregister_post_type( 'book', array(    'public' => true,    'show_in_rest' => true,  // Required for block editor    'supports' => array('editor'),) );
```
```
// ❌ WRONG - Block editor won't workregister_post_type( 'book', array(    'public' => true,    'supports' => array('editor'),    // Missing show_in_rest!) );// ✅ CORRECTregister_post_type( 'book', array(    'public' => true,    'show_in_rest' => true,  // Required for block editor    'supports' => array('editor'),) );
```
```
'show_in_rest' => true
```
```
show_in_rest => false
```
```
// ❌ WRONG - Adds quotes around table name$table = $wpdb->prefix . 'my_table';$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM %s WHERE id = %d",    $table, $id) );// Result: SELECT * FROM 'wp_my_table' WHERE id = 1// FAILS - table name is quoted// ❌ WRONG - Hardcoded prefix$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM wp_my_table WHERE id = %d",    $id) );// FAILS if user changed table prefix// ✅ CORRECT - Table name NOT in prepare()$table = $wpdb->prefix . 'my_table';$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM {$table} WHERE id = %d",    $id) );// ✅ CORRECT - Using wpdb->prefix for built-in tables$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM {$wpdb->posts} WHERE ID = %d",    $id) );
```
```
// ❌ WRONG - Adds quotes around table name$table = $wpdb->prefix . 'my_table';$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM %s WHERE id = %d",    $table, $id) );// Result: SELECT * FROM 'wp_my_table' WHERE id = 1// FAILS - table name is quoted// ❌ WRONG - Hardcoded prefix$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM wp_my_table WHERE id = %d",    $id) );// FAILS if user changed table prefix// ✅ CORRECT - Table name NOT in prepare()$table = $wpdb->prefix . 'my_table';$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM {$table} WHERE id = %d",    $id) );// ✅ CORRECT - Using wpdb->prefix for built-in tables$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM {$wpdb->posts} WHERE ID = %d",    $id) );
```
```
$result = wp_verify_nonce( $nonce, 'action' );// Returns 1: Valid, generated 0-12 hours ago// Returns 2: Valid, generated 12-24 hours ago// Returns false: Invalid or expired
```
```
$result = wp_verify_nonce( $nonce, 'action' );// Returns 1: Valid, generated 0-12 hours ago// Returns 2: Valid, generated 12-24 hours ago// Returns false: Invalid or expired
```
```
// ❌ INSUFFICIENT - Only checks origin, not permissionif ( wp_verify_nonce( $_POST['nonce'], 'delete_user' ) ) {    delete_user( $_POST['user_id'] );}// ✅ CORRECT - Combine with capability checkif ( wp_verify_nonce( $_POST['nonce'], 'delete_user' ) &&     current_user_can( 'delete_users' ) ) {    delete_user( absint( $_POST['user_id'] ) );}
```
```
// ❌ INSUFFICIENT - Only checks origin, not permissionif ( wp_verify_nonce( $_POST['nonce'], 'delete_user' ) ) {    delete_user( $_POST['user_id'] );}// ✅ CORRECT - Combine with capability checkif ( wp_verify_nonce( $_POST['nonce'], 'delete_user' ) &&     current_user_can( 'delete_users' ) ) {    delete_user( absint( $_POST['user_id'] ) );}
```
```
// ❌ WRONG - Only receives $post_idadd_action( 'save_post', 'my_save_function' );function my_save_function( $post_id, $post, $update ) {    // $post and $update are NULL!}// ✅ CORRECT - Specify argument countadd_action( 'save_post', 'my_save_function', 10, 3 );function my_save_function( $post_id, $post, $update ) {    // Now all 3 arguments are available}// Priority matters (lower number = runs earlier)add_action( 'init', 'first_function', 5 );   // Runs firstadd_action( 'init', 'second_function', 10 );  // Default priorityadd_action( 'init', 'third_function', 15 );   // Runs last
```
```
// ❌ WRONG - Only receives $post_idadd_action( 'save_post', 'my_save_function' );function my_save_function( $post_id, $post, $update ) {    // $post and $update are NULL!}// ✅ CORRECT - Specify argument countadd_action( 'save_post', 'my_save_function', 10, 3 );function my_save_function( $post_id, $post, $update ) {    // Now all 3 arguments are available}// Priority matters (lower number = runs earlier)add_action( 'init', 'first_function', 5 );   // Runs firstadd_action( 'init', 'second_function', 10 );  // Default priorityadd_action( 'init', 'third_function', 15 );   // Runs last
```
```
do_action( 'mypl_data_processed' )
```
```
do_action( 'data_processed' )
```
```
// ❌ CONFLICT - Page and CPT use same slug// Page URL: example.com/portfolio/register_post_type( 'portfolio', array(    'rewrite' => array( 'slug' => 'portfolio' ),) );// Individual posts 404: example.com/portfolio/my-project/// ✅ SOLUTION 1 - Use different slug for CPTregister_post_type( 'portfolio', array(    'rewrite' => array( 'slug' => 'projects' ),) );// Posts: example.com/projects/my-project/// Page: example.com/portfolio/// ✅ SOLUTION 2 - Use hierarchical slugregister_post_type( 'portfolio', array(    'rewrite' => array( 'slug' => 'work/portfolio' ),) );// Posts: example.com/work/portfolio/my-project/// ✅ SOLUTION 3 - Rename the page slug// Change page from /portfolio/ to /our-portfolio/
```
```
// ❌ CONFLICT - Page and CPT use same slug// Page URL: example.com/portfolio/register_post_type( 'portfolio', array(    'rewrite' => array( 'slug' => 'portfolio' ),) );// Individual posts 404: example.com/portfolio/my-project/// ✅ SOLUTION 1 - Use different slug for CPTregister_post_type( 'portfolio', array(    'rewrite' => array( 'slug' => 'projects' ),) );// Posts: example.com/projects/my-project/// Page: example.com/portfolio/// ✅ SOLUTION 2 - Use hierarchical slugregister_post_type( 'portfolio', array(    'rewrite' => array( 'slug' => 'work/portfolio' ),) );// Posts: example.com/work/portfolio/my-project/// ✅ SOLUTION 3 - Rename the page slug// Change page from /portfolio/ to /our-portfolio/
```
```
$wp$2y$
```
```
// ✅ SAFE - These functions continue to work without changeswp_hash_password( $password );wp_check_password( $password, $hash );// ⚠️ NEEDS UPDATE - Direct phpass hash handlingif ( strpos( $hash, '$P$' ) === 0 ) {    // Custom phpass logic - needs update for bcrypt}// ✅ NEW - Detect hash typeif ( strpos( $hash, '$wp$2y$' ) === 0 ) {    // bcrypt hash (WordPress 6.8+)} elseif ( strpos( $hash, '$P$' ) === 0 ) {    // phpass hash (WordPress <6.8)}
```
```
// ✅ SAFE - These functions continue to work without changeswp_hash_password( $password );wp_check_password( $password, $hash );// ⚠️ NEEDS UPDATE - Direct phpass hash handlingif ( strpos( $hash, '$P$' ) === 0 ) {    // Custom phpass logic - needs update for bcrypt}// ✅ NEW - Detect hash typeif ( strpos( $hash, '$wp$2y$' ) === 0 ) {    // bcrypt hash (WordPress 6.8+)} elseif ( strpos( $hash, '$P$' ) === 0 ) {    // phpass hash (WordPress <6.8)}
```
```
// ❌ WRONG - Loading too earlyadd_action( 'init', 'load_plugin_textdomain' );// ✅ CORRECT - Load after 'init' priority 10add_action( 'init', 'load_plugin_textdomain', 11 );// Ensure text domain matches plugin slug EXACTLY// Plugin header: Text Domain: my-plugin__( 'Text', 'my-plugin' );  // Must match exactly
```
```
// ❌ WRONG - Loading too earlyadd_action( 'init', 'load_plugin_textdomain' );// ✅ CORRECT - Load after 'init' priority 10add_action( 'init', 'load_plugin_textdomain', 11 );// Ensure text domain matches plugin slug EXACTLY// Plugin header: Text Domain: my-plugin__( 'Text', 'my-plugin' );  // Must match exactly
```
```
// ❌ WRONG$wpdb->prepare( "SELECT * FROM {$wpdb->posts}" );// Error: The query argument of wpdb::prepare() must have a placeholder// ✅ CORRECT - Don't use prepare() if no dynamic data$wpdb->get_results( "SELECT * FROM {$wpdb->posts}" );// ✅ CORRECT - Use prepare() for dynamic data$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM {$wpdb->posts} WHERE ID = %d",    $post_id) );
```
```
// ❌ WRONG$wpdb->prepare( "SELECT * FROM {$wpdb->posts}" );// Error: The query argument of wpdb::prepare() must have a placeholder// ✅ CORRECT - Don't use prepare() if no dynamic data$wpdb->get_results( "SELECT * FROM {$wpdb->posts}" );// ✅ CORRECT - Use prepare() for dynamic data$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM {$wpdb->posts} WHERE ID = %d",    $post_id) );
```
```
// ❌ WRONG$wpdb->prepare( "SELECT * FROM {$wpdb->posts} WHERE post_title LIKE '%test%'" );// ✅ CORRECT$search = '%' . $wpdb->esc_like( $term ) . '%';$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM {$wpdb->posts} WHERE post_title LIKE %s",    $search) );
```
```
// ❌ WRONG$wpdb->prepare( "SELECT * FROM {$wpdb->posts} WHERE post_title LIKE '%test%'" );// ✅ CORRECT$search = '%' . $wpdb->esc_like( $term ) . '%';$wpdb->get_results( $wpdb->prepare(    "SELECT * FROM {$wpdb->posts} WHERE post_title LIKE %s",    $search) );
```
```
// ❌ WRONG - Can't mix individual args and array$wpdb->prepare( "... WHERE id = %d AND name = %s", $id, array( $name ) );// ✅ CORRECT - Pick one format$wpdb->prepare( "... WHERE id = %d AND name = %s", $id, $name );// OR$wpdb->prepare( "... WHERE id = %d AND name = %s", array( $id, $name ) );
```
```
// ❌ WRONG - Can't mix individual args and array$wpdb->prepare( "... WHERE id = %d AND name = %s", $id, array( $name ) );// ✅ CORRECT - Pick one format$wpdb->prepare( "... WHERE id = %d AND name = %s", $id, $name );// OR$wpdb->prepare( "... WHERE id = %d AND name = %s", array( $id, $name ) );
```
```
function mypl_init() { /* code */ }add_action( 'init', 'mypl_init' );
```
```
function mypl_init() { /* code */ }add_action( 'init', 'mypl_init' );
```
```
class MyPL_Plugin {    private static $instance = null;    public static function get_instance() {        if ( null === self::$instance ) self::$instance = new self();        return self::$instance;    }    private function __construct() {        add_action( 'init', array( $this, 'init' ) );    }}MyPL_Plugin::get_instance();
```
```
class MyPL_Plugin {    private static $instance = null;    public static function get_instance() {        if ( null === self::$instance ) self::$instance = new self();        return self::$instance;    }    private function __construct() {        add_action( 'init', array( $this, 'init' ) );    }}MyPL_Plugin::get_instance();
```
```
my-plugin/├── my-plugin.php├── composer.json → "psr-4": { "MyPlugin\\": "src/" }└── src/Admin.php// my-plugin.phprequire_once __DIR__ . '/vendor/autoload.php';use MyPlugin\Admin;new Admin();
```
```
my-plugin/├── my-plugin.php├── composer.json → "psr-4": { "MyPlugin\\": "src/" }└── src/Admin.php// my-plugin.phprequire_once __DIR__ . '/vendor/autoload.php';use MyPlugin\Admin;new Admin();
```
```
// show_in_rest => true REQUIRED for Gutenberg block editorregister_post_type( 'book', array(    'public' => true,    'show_in_rest' => true,  // Without this, block editor won't work!    'supports' => array( 'editor', 'title' ),) );register_activation_hook( __FILE__, function() {    mypl_register_cpt();    flush_rewrite_rules();  // NEVER call on every page load} );
```
```
// show_in_rest => true REQUIRED for Gutenberg block editorregister_post_type( 'book', array(    'public' => true,    'show_in_rest' => true,  // Without this, block editor won't work!    'supports' => array( 'editor', 'title' ),) );register_activation_hook( __FILE__, function() {    mypl_register_cpt();    flush_rewrite_rules();  // NEVER call on every page load} );
```
```
register_taxonomy( 'genre', 'book', array( 'hierarchical' => true, 'show_in_rest' => true ) );
```
```
register_taxonomy( 'genre', 'book', array( 'hierarchical' => true, 'show_in_rest' => true ) );
```
```
add_meta_box( 'book_details', 'Book Details', 'mypl_meta_box_html', 'book' );// Save: Check nonce, DOING_AUTOSAVE, current_user_can('edit_post')update_post_meta( $post_id, '_book_isbn', sanitize_text_field( $_POST['book_isbn'] ) );
```
```
add_meta_box( 'book_details', 'Book Details', 'mypl_meta_box_html', 'book' );// Save: Check nonce, DOING_AUTOSAVE, current_user_can('edit_post')update_post_meta( $post_id, '_book_isbn', sanitize_text_field( $_POST['book_isbn'] ) );
```
```
register_setting( 'mypl_options', 'mypl_api_key', array( 'sanitize_callback' => 'sanitize_text_field' ) );add_settings_section( 'mypl_section', 'API Settings', 'callback', 'my-plugin' );add_settings_field( 'mypl_api_key', 'API Key', 'field_callback', 'my-plugin', 'mypl_section' );
```
```
register_setting( 'mypl_options', 'mypl_api_key', array( 'sanitize_callback' => 'sanitize_text_field' ) );add_settings_section( 'mypl_section', 'API Settings', 'callback', 'my-plugin' );add_settings_field( 'mypl_api_key', 'API Key', 'field_callback', 'my-plugin', 'mypl_section' );
```
```
register_rest_route( 'myplugin/v1', '/data', array(    'methods'             => 'POST',    'callback'            => 'mypl_rest_callback',    'permission_callback' => fn() => current_user_can( 'edit_posts' ),) );
```
```
register_rest_route( 'myplugin/v1', '/data', array(    'methods'             => 'POST',    'callback'            => 'mypl_rest_callback',    'permission_callback' => fn() => current_user_can( 'edit_posts' ),) );
```
```
add_action( 'wp_ajax_mypl_action', 'mypl_ajax_handler' );check_ajax_referer( 'mypl-ajax-nonce', 'nonce' );wp_send_json_success( array( 'message' => 'Success' ) );
```
```
add_action( 'wp_ajax_mypl_action', 'mypl_ajax_handler' );check_ajax_referer( 'mypl-ajax-nonce', 'nonce' );wp_send_json_success( array( 'message' => 'Success' ) );
```
```
global $wpdb;$sql = "CREATE TABLE {$wpdb->prefix}mypl_data (id bigint AUTO_INCREMENT PRIMARY KEY, ...)";require_once ABSPATH . 'wp-admin/includes/upgrade.php';dbDelta( $sql );
```
```
global $wpdb;$sql = "CREATE TABLE {$wpdb->prefix}mypl_data (id bigint AUTO_INCREMENT PRIMARY KEY, ...)";require_once ABSPATH . 'wp-admin/includes/upgrade.php';dbDelta( $sql );
```
```
$data = get_transient( 'mypl_data' );if ( false === $data ) {    $data = expensive_operation();    set_transient( 'mypl_data', $data, 12 * HOUR_IN_SECONDS );}
```
```
$data = get_transient( 'mypl_data' );if ( false === $data ) {    $data = expensive_operation();    set_transient( 'mypl_data', $data, 12 * HOUR_IN_SECONDS );}
```
```
plugin-simple/
```
```
plugin-oop/
```
```
plugin-psr4/
```
```
examples/meta-box.php
```
```
examples/settings-page.php
```
```
examples/custom-post-type.php
```
```
examples/rest-endpoint.php
```
```
examples/ajax-handler.php
```
```
scaffold-plugin.sh
```
```
check-security.sh
```
```
validate-headers.sh
```
```
security-checklist.md
```
```
hooks-reference.md
```
```
sanitization-guide.md
```
```
wpdb-patterns.md
```
```
common-errors.md
```
```
load_plugin_textdomain( 'my-plugin', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );__( 'Text', 'my-plugin' );  // Return translated_e( 'Text', 'my-plugin' );  // Echo translatedesc_html__( 'Text', 'my-plugin' );  // Translate + escape
```
```
load_plugin_textdomain( 'my-plugin', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );__( 'Text', 'my-plugin' );  // Return translated_e( 'Text', 'my-plugin' );  // Echo translatedesc_html__( 'Text', 'my-plugin' );  // Translate + escape
```
```
if ( defined( 'WP_CLI' ) && WP_CLI ) {    WP_CLI::add_command( 'mypl', 'MyPL_CLI_Command' );}
```
```
if ( defined( 'WP_CLI' ) && WP_CLI ) {    WP_CLI::add_command( 'mypl', 'MyPL_CLI_Command' );}
```
```
register_activation_hook( __FILE__, fn() => wp_schedule_event( time(), 'daily', 'mypl_daily_task' ) );register_deactivation_hook( __FILE__, fn() => wp_clear_scheduled_hook( 'mypl_daily_task' ) );add_action( 'mypl_daily_task', 'mypl_do_daily_task' );
```
```
register_activation_hook( __FILE__, fn() => wp_schedule_event( time(), 'daily', 'mypl_daily_task' ) );register_deactivation_hook( __FILE__, fn() => wp_clear_scheduled_hook( 'mypl_daily_task' ) );add_action( 'mypl_daily_task', 'mypl_do_daily_task' );
```
```
if ( ! class_exists( 'WooCommerce' ) ) {    deactivate_plugins( plugin_basename( __FILE__ ) );    add_action( 'admin_notices', fn() => echo '<div class="error"><p>Requires WooCommerce</p></div>' );}
```
```
if ( ! class_exists( 'WooCommerce' ) ) {    deactivate_plugins( plugin_basename( __FILE__ ) );    add_action( 'admin_notices', fn() => echo '<div class="error"><p>Requires WooCommerce</p></div>' );}
```
```
// 1. Install: git submodule add https://github.com/YahnisElsts/plugin-update-checker.git// 2. Add to main plugin filerequire plugin_dir_path( __FILE__ ) . 'plugin-update-checker/plugin-update-checker.php';use YahnisElsts\PluginUpdateChecker\v5\PucFactory;$updateChecker = PucFactory::buildUpdateChecker(    'https://github.com/yourusername/your-plugin/',    __FILE__,    'your-plugin-slug');$updateChecker->getVcsApi()->enableReleaseAssets();  // Use GitHub Releases// Private repos: Define token in wp-config.phpif ( defined( 'YOUR_PLUGIN_GITHUB_TOKEN' ) ) {    $updateChecker->setAuthentication( YOUR_PLUGIN_GITHUB_TOKEN );}
```
```
// 1. Install: git submodule add https://github.com/YahnisElsts/plugin-update-checker.git// 2. Add to main plugin filerequire plugin_dir_path( __FILE__ ) . 'plugin-update-checker/plugin-update-checker.php';use YahnisElsts\PluginUpdateChecker\v5\PucFactory;$updateChecker = PucFactory::buildUpdateChecker(    'https://github.com/yourusername/your-plugin/',    __FILE__,    'your-plugin-slug');$updateChecker->getVcsApi()->enableReleaseAssets();  // Use GitHub Releases// Private repos: Define token in wp-config.phpif ( defined( 'YOUR_PLUGIN_GITHUB_TOKEN' ) ) {    $updateChecker->setAuthentication( YOUR_PLUGIN_GITHUB_TOKEN );}
```
```
git tag 1.0.1 && git push origin main && git push origin 1.0.1# Create GitHub Release with ZIP (exclude .git, tests)
```
```
git tag 1.0.1 && git push origin main && git push origin 1.0.1# Create GitHub Release with ZIP (exclude .git, tests)
```
```
plugin.zip/my-plugin/my-plugin.php
```
```
references/github-auto-updates.md
```
```
examples/github-updater.php
```
```
wp_ajax_{action}
```
```
wp_kses_post()
```
```
sanitize_text_field()
```
```
$wpdb->prepare()
```
```
$wpdb->prefix
```
```
references/common-errors.md
```
Unlock the power of WordPress plugin creation with this comprehensive agent skill designed for both novice and experienced developers. Dive into the essential principles of plugin architecture, from simple functions to modern PSR-4 standards, ensuring your projects are scalable and maintainable. Emphasizing robust security foundations, you'll learn to implement crucial measures like nonces, input sanitization, and output escaping, protecting your plugins from common vulnerabilities. This skill empowers you to build professional-grade WordPress extensions that adhere to best practices, setting a strong foundation for any customization.

# When to Use This Skill
- •Developing a new, secure custom WordPress plugin from scratch.
- •Implementing security best practices (nonces, sanitization) in an existing WordPress project.
- •Understanding different architectural patterns for scalable WordPress plugins.
- •Troubleshooting common security vulnerabilities in WordPress plugin code.

# Pro Tips
- 💡Always prioritize the 'Security Foundation' steps—unique prefixes, ABSPATH checks, nonces, sanitization, and prepared statements—before writing core plugin logic to prevent common vulnerabilities.
- 💡Choose your architecture pattern (Simple, OOP, PSR-4) based on plugin complexity and future scalability. For modern, larger projects, aim for PSR-4 for better maintainability.
- 💡Regularly check the `Requires at least` and `Requires PHP` versions in your plugin header to ensure compatibility and leverage modern PHP features.

