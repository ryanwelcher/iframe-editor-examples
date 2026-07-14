/**
 * ✅ FIXED for the iframed editor.
 *
 * Same dropdown, but the outside-click listener is attached to the
 * document the block actually lives in (`element.ownerDocument`) via
 * `useRefEffect`. Works identically whether the canvas is iframed or not.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { BlockHeader } from '../lib/iframe-status';

const wrapperStyle = {
	border: '2px solid #00a32a',
	borderRadius: '4px',
	padding: '1rem',
};

const menuStyle = {
	border: '1px solid #757575',
	borderRadius: '4px',
	padding: '0.5rem 1rem',
	marginTop: '0.5rem',
	background: '#f0f0f0',
};

export default function Edit() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isIframed, setIsIframed ] = useState( false );

	const ref = useRefEffect(
		( element ) => {
			// The canvas is iframed when this block's document is not the admin document.
			setIsIframed( element.ownerDocument !== document );

			if ( ! isOpen ) {
				return;
			}

			const { ownerDocument } = element;

			const closeOnOutsideClick = ( event ) => {
				if ( ! element.contains( event.target ) ) {
					setIsOpen( false );
				}
			};

			// ✅ Listen on the document the block is rendered into.
			ownerDocument.addEventListener( 'click', closeOnOutsideClick );
			return () =>
				ownerDocument.removeEventListener( 'click', closeOnOutsideClick );
		},
		[ isOpen ]
	);

	return (
		<div { ...useBlockProps( { ref, style: wrapperStyle } ) }>
			<BlockHeader isIframed={ isIframed }>
				{ __( '✅ Click Outside (Fixed)', 'iframed-editor-demos' ) }
			</BlockHeader>
			<p>
				<button type="button" onClick={ () => setIsOpen( ! isOpen ) }>
					{ __( 'Toggle dropdown', 'iframed-editor-demos' ) }
				</button>
			</p>
			{ isOpen && (
				<div style={ menuStyle }>
					{ __(
						'Click anywhere outside — canvas or admin — and I close.',
						'iframed-editor-demos'
					) }
				</div>
			) }
			<p>
				{ isIframed
					? __(
							'The listener is on the canvas document, so outside-click still works. That is the fix.',
							'iframed-editor-demos'
					  )
					: __(
							'Outside-click works here too, because the listener follows the block instead of assuming the admin document.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
