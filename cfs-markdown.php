<?php
/**
 * Plugin Name:  CFS - Markdown Add-On
 * Plugin URI:   https://github.com/robneu/cfs-markdown
 * Description:  A markdown textarea field type add-on for Custom Field Suite.
 * Version:      0.1.0
 * Author:       Robert Neu
 * Author URI:   https://flagshipwp.com
 * License:      GPL-2.0+
 * License URI:  http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  cfs-markdown
 * Domain Path:  /languages
 *
 * Git URI:           https://github.com/robneu/cfs-markdown
 * GitHub Plugin URI: https://github.com/robneu/cfs-markdown
 * GitHub Branch:     master
 */

// Prevent direct access.
defined( 'ABSPATH' ) or exit;

// Define the plugin version.
if ( ! defined( 'CFSMD_ADDON_VERSION' ) ) {
	define( 'CFSMD_ADDON_VERSION', '0.1.0' );
}
// Define the plugin directory URL.
if ( ! defined( 'CFSMD_ADDON_URL' ) ) {
	define( 'CFSMD_ADDON_URL', plugin_dir_url( __FILE__ ) );
}
// Define the plugin directory path.
if ( ! defined( 'CFSMD_ADDON_DIR' ) ) {
	define( 'CFSMD_ADDON_DIR', plugin_dir_path( __FILE__ ) );
}

// Load the main plugin class.
require_once( CFSMD_ADDON_DIR . 'includes/class-plugin.php' );

add_action( 'plugins_loaded', array( cfs_markdown_addon(), 'run' ) );
/**
 * Allow themes and plugins to access CFS_Markdown_Addon methods and properties.
 *
 * Because we aren't using a singleton pattern for our main plugin class, we
 * need to make sure it's only instantiated once in our helper function.
 * If you need to access methods inside the plugin classes, use this function.
 *
 * Example:
 *
 * <?php cfs_markdown_addon()->run; ?>
 *
 * @since  0.0.1
 * @access public
 * @uses   CFS_Markdown_Addon
 * @return object CFS_Markdown_Addon A single instance of the main plugin class.
 */
function cfs_markdown_addon() {
	static $plugin;
	if ( null === $plugin ) {
		$plugin = new CFS_Markdown_Addon;
	}
	return $plugin;
}
