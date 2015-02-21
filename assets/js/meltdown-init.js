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

		// Global scripts init.
		globalInit: function() {
			var meltDown = $('.cfs_markdown .markdown'),
			options = {
				controls: $.meltdown.controlsGroup('', '', [
					'preview',
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
					$.meltdown.controlsGroup('h', 'Headers', [
						'h1',
						'h2',
						'h3',
						'h4',
						'h5',
						'h6'
					])
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
		jQuery(document).on( 'cfs/ready', '.cfs_add_field', function() {
			cfsMarkdown.globalInit();
		});
	});
})( this, jQuery );
