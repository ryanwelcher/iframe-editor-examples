/**
 * ❌ BROKEN in the iframed editor.
 *
 * This block hands a selector to a legacy third-party library, and the
 * library looks it up with the global `document.querySelectorAll()`.
 * In the iframed editor the block's markup lives in the iframe's
 * document, so the library finds ZERO matches and silently no-ops.
 *
 * This is the failure mode for a huge class of older libraries:
 * masonry layouts, sliders, lightboxes, anything jQuery-plugin shaped.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { enhance } from '../lib/legacy-lib';

const wrapperStyle = {
	border: '2px solid #cc1818',
	borderRadius: '4px',
	padding: '1rem',
};

export default function Edit() {
	const [ found, setFound ] = useState( null );

	useEffect( () => {
		// ❌ The library resolves this selector against the ADMIN document.
		setFound( enhance( '.ied-third-party-broken' ) );
	}, [] );

	return (
		<div
			{ ...useBlockProps( {
				className: 'ied-third-party-broken',
				style: wrapperStyle,
			} ) }
		>
			<strong>
				{ __( '❌ Third-Party Library (Broken)', 'iframed-editor-demos' ) }
			</strong>
			<p>
				{ sprintf(
					/* translators: %s: number of elements the library found. */
					__( 'legacyLib found %s element(s) to enhance.', 'iframed-editor-demos' ),
					found ?? '…'
				) }
			</p>
			<p>
				{ __(
					'If you can read this without a gold glow, the library came up empty — the canvas is iframed.',
					'iframed-editor-demos'
				) }
			</p>
		</div>
	);
}
