<?php
/**
 * CFS Markdown add-on field type class.
 *
 * @package     CFSMarkdown
 * @author      Robert Neu
 * @copyright   Copyright (c) 2015, Robert Neu
 * @license     GPL-2.0+
 * @since       0.0.1
 */

// Prevent direct access.
defined( 'ABSPATH' ) or exit;

class CFS_Markdown extends cfs_field {

	function __construct() {
		$this->name  = 'markdown';
		$this->label = __( 'Markdown', 'cfs-markdown' );
	}

	/**
	 * Format the user-generated value for display.
	 *
	 * @since  0.0.1
	 * @access public
	 * @param  string $value the unformatted value
	 * @param  string $field the field name to pull from the options database.
	 * @return string the formatted value which has been parsed for Markdown
	 */
	function html( $field ) {
		wp_enqueue_style( 'cfs-markdown' );
		wp_enqueue_script( 'meltdown-init' );
		?>
		<textarea name="<?php echo $field->input_name; ?>" class="<?php echo $field->input_class; ?>" rows="12"><?php echo $field->value; ?></textarea>
		<?php
	}

	/**
	 * Output the HTML for the field type options within the CFS admin.
	 *
	 * @since  0.0.1
	 * @access public
	 * @param  string $key the key for the CFS field.
	 * @param  string $field the field name to pull from the options database.
	 * @return void
	 */
	public function options_html( $key, $field ) {
		?>
		<tr class="field_option field_option_<?php echo $this->name; ?>">
			<td class="label">
				<label><?php _e( 'Default Value', 'cfs-markdown' ); ?></label>
			</td>
			<td>
				<?php
				CFS()->create_field(
					array(
						'type'       => 'textarea',
						'input_name' => "cfs[fields][$key][options][default_value]",
						'value'      => $this->get_option( $field, 'default_value' ),
					)
				);
				?>
			</td>
		</tr>
		<tr class="field_option field_option_<?php echo $this->name; ?>">
			<td class="label">
				<label><?php _e( 'Validation', 'cfs-markdown' ); ?></label>
			</td>
			<td>
				<?php
				CFS()->create_field(
					array(
						'type'        => 'true_false',
						'input_name'  => "cfs[fields][$key][options][required]",
						'input_class' => 'true_false',
						'value'       => $this->get_option( $field, 'required' ),
						'options'     => array(
							'message' => __( 'This is a required field', 'cfs-markdown' ),
						),
					)
				);
				?>
			</td>
		</tr>
		<?php
	}

	/**
	 * Format the user-generated value for display.
	 *
	 * @since  0.0.1
	 * @access public
	 * @param  string $value the unformatted value
	 * @param  string $field the field name to pull from the options database.
	 * @return string the formatted value which has been parsed for Markdown
	 */
	public function format_value_for_input( $value, $field = null ) {
		return wp_strip_all_tags( $value );
	}

	/**
	 * Format the user-generated value for display.
	 *
	 * @since  0.0.1
	 * @access public
	 * @param  string $value the unformatted value
	 * @param  string $field the field name to pull from the options database.
	 * @return string the formatted value which has been parsed for Markdown
	 */
	public function format_value_for_api( $value, $field = null ) {
		$parsedown = new Parsedown;
		return $parsedown->text( $value );
	}

}
