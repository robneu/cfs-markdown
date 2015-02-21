<?php
/**
 * CFS Markdown add-on main plugin class.
 *
 * @package     CFSMarkdown
 * @author      Robert Neu
 * @copyright   Copyright (c) 2015, Robert Neu
 * @license     GPL-2.0+
 * @since       0.0.1
 */

// Prevent direct access.
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
		// Return early if CFS isn't activated.
		if ( ! function_exists( 'CFS' ) ) {
			return;
		}
		self::load_textdomain();
		self::includes();
		self::wp_hooks();
	}

	/**
	* Hook into WordPress.
	*
	* @since  0.0.1
	* @access public
	* @return void
	*/
	public function wp_hooks() {
		add_filter( 'cfs_field_types', array( $this, 'cfs_field_types' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ) );
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
	 * Register admin scripts styles for Example Plugin.
	 *
	 * @since   0.0.1
	 * @access  public
	 * @return  void
	 */
	function admin_scripts() {
		$assets_dir = CFSMD_ADDON_URL . 'assets/';
		$prefix     = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
		wp_register_style(
			'cfs-markdown',
			$assets_dir . "css/cfs-markdown{$prefix}.css",
			array(),
			CFSMD_ADDON_VERSION
		);
		wp_register_script(
			'meltdown',
			$assets_dir . "js/vendor/jquery.meltdown{$prefix}.js",
			array( 'jquery' ),
			'0.2',
			true
		);
		wp_register_script(
			'meltdown-init',
			$assets_dir . "js/meltdown-init{$prefix}.js",
			array( 'meltdown' ),
			CFSMD_ADDON_VERSION,
			true
		);
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
		$field_types['markdown'] = CFSMD_ADDON_DIR . 'includes/class-cfs-markdown.php';
		return $field_types;
	}

}
