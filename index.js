document.addEventListener( "DOMContentLoaded", function () {
  fetchDeck()
} )

function fetchDeck() {
  fetch( 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1' )
    .then( res => res.json() )
    .then( json => {
      setupGame( json )
    } )
}

function setupGame( deck ) {
  document.querySelector( '#deal' ).addEventListener( 'click', function () {
    fetchCard( deck.deck_id )
  } )
}

function fetchCard( deck_id ) {
  fetch( `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1` )
    .then( res => res.json() )
    .then( json => {
      addCardToDOM( json.cards[ 0 ] )
    } )
}

function addCardToDOM( card ) {
  let image = document.createElement( 'img' )
  image.src = card.image
  document.querySelector( 'section' ).appendChild( image )
}