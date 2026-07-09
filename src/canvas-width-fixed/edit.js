/**
 * ✅ FIXED for the iframed editor.
 *
 * Instead of the global `window`, this block walks up from its own DOM
 * element: `element.ownerDocument` is the document the block actually
 * lives in (the iframe's document when the editor is iframed) and
 * `ownerDocument.defaultView` is that document's window.
 *
 * `useRefEffect` from @wordpress/compose re-runs the callback whenever
 * the ref changes, so the listener always attaches to the right window —
 * even if the block moves between documents.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';

const wrapperStyle = {
	border: '2px solid #00a32a',
	borderRadius: '4px',
	padding: '1rem',
};

export default function Edit() {
	const [ width, setWidth ] = useState( null );
	const [ isIframed, setIsIframed ] = useState( false );

	const ref = useRefEffect( ( element ) => {
		const { ownerDocument } = element;
		const { defaultView } = ownerDocument;

		// If the block's document isn't the admin document, we're iframed.
		setIsIframed( ownerDocument !== document );

		const update = () => setWidth( defaultView.innerWidth );
		update();
		defaultView.addEventListener( 'resize', update );
		return () => defaultView.removeEventListener( 'resize', update );
	}, [] );

	return (
		<div { ...useBlockProps( { ref, style: wrapperStyle } ) }>
			<strong>{ __( '✅ Canvas Width (Fixed)', 'iframed-editor-demos' ) }</strong>
			<p>
				{ sprintf(
					/* translators: %s: width in pixels. */
					__( 'ownerDocument.defaultView.innerWidth says: %spx', 'iframed-editor-demos' ),
					width ?? '…'
				) }
			</p>
			<p>
				{ isIframed
					? __( 'The canvas IS iframed — and this block still measures correctly.', 'iframed-editor-demos' )
					: __( 'The canvas is NOT iframed right now.', 'iframed-editor-demos' ) }
			</p>
		</div>
	);
}
