function addImageToDOM( source, alt ) {
  let image = document.createElement( 'img' )
  image.src = source
  image.alt = alt
  document.querySelector( 'section' ).appendChild( image )
}

function fetchCard( deck_id ) {
  fetch( `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1` )
    .then( res => res.json() )
    .then( json => {
      addImageToDOM( json.cards[ 0 ].image, json.cards[ 0 ].code )
    } )
}

function setupGame( deck ) {
  document.querySelector( '#deal' ).addEventListener( 'click', function () {
    fetchCard( deck.deck_id )
  } )
}


function fetchDeck() {
  fetch( 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1' )
    .then( res => res.json() )
    .then( json => {
      setupGame( json )
    } )
}

document.addEventListener( "DOMContentLoaded", function () {
  fetchDeck()
} )