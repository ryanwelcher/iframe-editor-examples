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

const wrapperStyle = {
	border: '2px solid #00a32a',
	borderRadius: '4px',
	padding: '1rem',
};

export default function Edit() {
	const [ found, setFound ] = useState( null );

	const ref = useRefEffect( ( element ) => {
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
			<strong>
				{ __( '✅ Third-Party Library (Fixed)', 'iframed-editor-demos' ) }
			</strong>
			<p>
				{ sprintf(
					/* translators: %s: number of elements the library found. */
					__( 'legacyLib found %s element(s) to enhance.', 'iframed-editor-demos' ),
					found ?? '…'
				) }
			</p>
		</div>
	);
}
