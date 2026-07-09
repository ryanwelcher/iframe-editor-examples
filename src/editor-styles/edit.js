/**
 * Editor styles demo.
 *
 * Two stylesheets target this block:
 *
 * 1. ✅ `editor.css`, registered via the `editorStyle` property in
 *    block.json. WordPress injects block styles INTO the canvas iframe,
 *    so this one always applies. It adds the green "styled via
 *    editorStyle" banner.
 *
 * 2. ❌ `assets/broken-editor-style.css`, enqueued from PHP with
 *    `enqueue_block_editor_assets`. That hook loads assets in the ADMIN
 *    page — outside the iframe — so its red "styled via
 *    enqueue_block_editor_assets" banner disappears the moment the
 *    editor is iframed.
 *
 * In the non-iframed editor you see BOTH banners. In the iframed editor
 * only the green one survives.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	return (
		<div { ...useBlockProps( { className: 'ied-editor-styles-demo' } ) }>
			<strong>{ __( 'Editor Styles Demo', 'iframed-editor-demos' ) }</strong>
			<p>
				{ __(
					'Count the banners: two means the editor is NOT iframed, one means it is.',
					'iframed-editor-demos'
				) }
			</p>
		</div>
	);
}
