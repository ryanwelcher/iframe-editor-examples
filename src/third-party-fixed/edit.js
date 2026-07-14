/**
 * ✅ FIXED for the iframed editor.
 *
 * Two changes from the broken version:
 *
 * 1. The library is patched to accept a root element and resolve the
 *    document via `ownerDocument` (in real life: patch-package against
 *    the dependency — see src/lib/patched-lib.js for the diff).
 * 2. The block uses `useRefEffect` so it has an element to hand over,
 *    and so initialization re-runs if the block changes documents.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';
import { enhance } from '../lib/patched-lib';
import { BlockHeader } from '../lib/iframe-status';

const wrapperStyle = {
	border: '2px solid #00a32a',
	borderRadius: '4px',
	padding: '1rem',
};

export default function Edit() {
	const [ found, setFound ] = useState( null );
	const [ isIframed, setIsIframed ] = useState( false );

	const ref = useRefEffect( ( element ) => {
		// The canvas is iframed when this block's document is not the admin document.
		setIsIframed( element.ownerDocument !== document );

		// ✅ Hand the library an element it can resolve the document from.
		setFound( enhance( '.ied-third-party-fixed', element ) );
	}, [] );

	return (
		<div
			{ ...useBlockProps( {
				ref,
				className: 'ied-third-party-fixed',
				style: wrapperStyle,
			} ) }
		>
			<BlockHeader isIframed={ isIframed }>
				{ __( '✅ Third-Party Library (Fixed)', 'iframed-editor-demos' ) }
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
							'The patched library resolved the canvas document from the block element, found it, and added the green glow. That is the fix.',
							'iframed-editor-demos'
					  )
					: __(
							'The library found the block here too, because it resolves the document from the element instead of assuming the admin document.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
