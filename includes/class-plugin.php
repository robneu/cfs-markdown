<?php
/**
 * CFS Markdown add-on main plugin class.
 *
 * @package     ExamplePlugin
 * @author      Robert Neu
 * @copyright   Copyright (c) 2015, Robert Neu
 * @license     GPL-2.0+
 * @since       0.0.1
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) or exit;

/**
 * Main plugin class.
 */
class CFS_Markdown_Addon {

	/**
	 * Method to initialize the plugin.
	 *
	 * @since  0.0.1
	 * @return void
	 */
	public function run() {
		$this->load_textdomain();
		$this->includes();
		add_filter( 'cfs_field_types', array( $this, 'cfs_field_types' ) );
	}

	/**
	 * Load the plugin language files.
	 *
	 * @since  0.0.1
	 * @access public
	 * @return void
	 */
	public function load_textdomain() {
		$lang_dir = CFSMD_ADDON_DIR . 'languages/';
		// Set a filter for plugin's languages directory.
		$lang_dir = apply_filters( 'cfs_markdown_lang_directory', $lang_dir );
		// Load the default language files
		load_plugin_textdomain( 'cfs-markdown', false, $lang_dir );
	}

	/**
	 * Require all plugin files.
	 *
	 * @since  0.0.1
	 * @access private
	 * @return void
	 */
	private function includes() {
		if ( class_exists( 'Parsedown' ) ) {
			return;
		}
		require_once CFSMD_ADDON_DIR . 'includes/vendor/Parsedown.php';
	}

	/**
	 * Filter the existing CFS field types.
	 *
	 * @since  0.0.1
	 * @access public
	 * @param  array $field_types the current CFS field types.
	 * @return array $field_types the modified CFS field types.
	 */
	public function cfs_field_types( $field_types ) {
		$field_types['markdown'] = CFSMD_ADDON_DIR . 'includes/class-markdown.php';
		return $field_types;
	}

}
