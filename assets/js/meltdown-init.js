/**
 * Global JavaScript for CFS Markdown
 *
 * Includes all JS which is required within all sections of the plugin.
 */

window.cfsMarkdown = window.cfsMarkdown || {};

(function( window, $, undefined ) {
	'use strict';

	var cfsMarkdown = window.cfsMarkdown;

	$.extend( cfsMarkdown, {

		// Initialize the meltdown script for all markdown fields.
		globalInit: function() {
			var meltDown = $('.cfs_markdown .markdown'),
			options = {
				controls: $.meltdown.controlsGroup('', '', [
					$.meltdown.controlsGroup('h', 'Headers', [
						'h1',
						'h2',
						'h3',
						'h4',
						'h5',
						'h6'
					]),
					'bold',
					'italics',
					'ul',
					'ol',
					'blockquote',
					'link',
					'img',
					'codeblock',
					'code',
					'table',
					'preview'
				]),
				sidebyside: true,
				previewHeight: 'auto',
				previewCollapses: false
			};
			$( meltDown ).meltdown( options );
		}

	});

	// Document ready.
	jQuery(function() {
		cfsMarkdown.globalInit();
		// Re-run the script when a new field is added. This is probably inefficient.
		jQuery(document).on( 'cfs/ready', '.cfs_add_field', function() {
			cfsMarkdown.globalInit();
		});
	});
})( this, jQuery );
