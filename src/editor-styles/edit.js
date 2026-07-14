/**
 * Editor styles demo.
 *
 * Two stylesheets target this block:
 *
 * 1. ✅ `editor.css`, registered via the `editorStyle` property in
 *    block.json. WordPress injects block styles INTO the canvas document,
 *    so this one always applies. It adds the green "styled via
 *    editorStyle" banner.
 *
 * 2. ❌ `assets/broken-editor-style.css`, enqueued from PHP with
 *    `enqueue_block_editor_assets`. That hook loads assets in the admin
 *    document — outside the iframe — so its red "styled via
 *    enqueue_block_editor_assets" banner disappears the moment the
 *    canvas is iframed.
 *
 * When the canvas is NOT iframed you see BOTH banners. When it IS iframed
 * only the green one survives.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { BlockHeader } from '../lib/iframe-status';

export default function Edit() {
	const [ isIframed, setIsIframed ] = useState( false );

	// The canvas is iframed when this block's document is not the admin document.
	const ref = useRefEffect( ( element ) => {
		setIsIframed( element.ownerDocument !== document );
	}, [] );

	return (
		<div { ...useBlockProps( { ref, className: 'ied-editor-styles-demo' } ) }>
			<BlockHeader isIframed={ isIframed }>
				{ __( 'Editor Styles Demo', 'iframed-editor-demos' ) }
			</BlockHeader>
			<p>
				{ isIframed
					? __(
							'Only the green editorStyle banner survives. The red enqueue_block_editor_assets banner loads in the admin document, outside the iframe.',
							'iframed-editor-demos'
					  )
					: __(
							'Both banners show, because the block and both stylesheets share the admin document.',
							'iframed-editor-demos'
					  ) }
			</p>
			<p>
				{ __(
					'Quick check: two banners (green + red) means NOT iframed; one banner (green only) means iframed.',
					'iframed-editor-demos'
				) }
			</p>
		</div>
	);
}
