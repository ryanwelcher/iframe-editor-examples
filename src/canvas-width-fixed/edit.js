/**
 * ✅ FIXED for the iframed editor.
 *
 * Instead of the global `window`, this block walks up from its own DOM
 * element: `element.ownerDocument` is the document the block actually
 * lives in (the canvas document when the editor is iframed) and
 * `ownerDocument.defaultView` is that document's window.
 *
 * `useRefEffect` from @wordpress/compose re-runs the callback whenever
 * the ref changes, so the listener always attaches to the right window —
 * even if the block moves between documents.
 *
 * Note: the fix only visibly differs from the Broken block once the
 * canvas is iframed. When the editor is NOT iframed, the canvas window
 * and the admin window are the same object, so both blocks read the same
 * number.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';
import { BlockHeader } from '../lib/iframe-status';

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

		// The canvas is iframed when this block's document is not the admin document.
		setIsIframed( ownerDocument !== document );

		const update = () => setWidth( defaultView.innerWidth );
		update();
		defaultView.addEventListener( 'resize', update );
		return () => defaultView.removeEventListener( 'resize', update );
	}, [] );

	return (
		<div { ...useBlockProps( { ref, style: wrapperStyle } ) }>
			<BlockHeader isIframed={ isIframed }>
				{ __( '✅ Canvas Width (Fixed)', 'iframed-editor-demos' ) }
			</BlockHeader>
			<p>
				{ sprintf(
					/* translators: %s: width in pixels. */
					__( 'ownerDocument.defaultView.innerWidth says: %spx', 'iframed-editor-demos' ),
					width ?? '…'
				) }
			</p>
			<p>
				{ isIframed
					? __(
							'This reads the canvas window, so Tablet/Mobile preview updates this number while the Broken block stays stuck.',
							'iframed-editor-demos'
					  )
					: __(
							'The canvas window and admin window are the same here, so this matches the Broken block. The fix shows its value once the canvas is iframed.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
