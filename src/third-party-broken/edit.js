/**
 * ❌ BROKEN in the iframed editor.
 *
 * This block hands a selector to a legacy third-party library, and the
 * library looks it up with the global `document.querySelectorAll()`.
 * When the canvas is iframed the block's markup lives in the canvas
 * document, so the library finds ZERO matches and silently no-ops.
 *
 * This is the failure mode for a huge class of older libraries:
 * masonry layouts, sliders, lightboxes, anything jQuery-plugin shaped.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';
import { enhance } from '../lib/legacy-lib';
import { BlockHeader } from '../lib/iframe-status';

const wrapperStyle = {
	border: '2px solid #cc1818',
	borderRadius: '4px',
	padding: '1rem',
};

export default function Edit() {
	const [ found, setFound ] = useState( null );
	const [ isIframed, setIsIframed ] = useState( false );

	// Detection only — the library below is deliberately called the broken way.
	const ref = useRefEffect( ( element ) => {
		setIsIframed( element.ownerDocument !== document );
	}, [] );

	useEffect( () => {
		// ❌ The library resolves this selector against the admin document.
		setFound( enhance( '.ied-third-party-broken' ) );
	}, [] );

	return (
		<div
			{ ...useBlockProps( {
				ref,
				className: 'ied-third-party-broken',
				style: wrapperStyle,
			} ) }
		>
			<BlockHeader isIframed={ isIframed }>
				{ __( '❌ Third-Party Library (Broken)', 'iframed-editor-demos' ) }
			</BlockHeader>
			<p>
				{ sprintf(
					/* translators: %s: number of elements the library found. */
					__( 'legacyLib found %s element(s) to enhance.', 'iframed-editor-demos' ),
					found ?? '…'
				) }
			</p>
			<p>
				{ isIframed
					? __(
							'The library searched the admin document and found nothing here, so there is no gold glow. That is the bug.',
							'iframed-editor-demos'
					  )
					: __(
							'The block shares the admin document, so the library found it and added the gold glow. It breaks once the canvas is iframed.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
