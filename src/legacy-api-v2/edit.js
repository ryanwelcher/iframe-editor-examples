/**
 * A block deliberately left on apiVersion 2.
 *
 * What to demo with it:
 *
 * - WordPress 6.9+: registering it logs a deprecation warning in the
 *   browser console when SCRIPT_DEBUG is enabled.
 * - WordPress 7.0: start a post with only v3 blocks (canvas is iframed),
 *   then insert this block — the editor reloads WITHOUT the iframe.
 *   Only blocks actually inserted in the post are checked.
 * - WordPress 7.1 (block themes) / Gutenberg 22.6+: the iframe is
 *   enforced anyway, so any v1/v2 incompatibilities surface for real.
 *
 * Note: apiVersion 2 fails block.json schema validation as of 6.9 —
 * that's why this block.json has no $schema property.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const wrapperStyle = {
	border: '2px dashed #996800',
	borderRadius: '4px',
	padding: '1rem',
};

export default function Edit() {
	return (
		<div { ...useBlockProps( { style: wrapperStyle } ) }>
			<strong>{ __( '🕰️ Legacy API v2 Block', 'iframed-editor-demos' ) }</strong>
			<p>
				{ __(
					'In WordPress 7.0, inserting me removes the iframe from the post editor. Watch the Editor Styles Demo block when I arrive — the red banner comes back.',
					'iframed-editor-demos'
				) }
			</p>
		</div>
	);
}
