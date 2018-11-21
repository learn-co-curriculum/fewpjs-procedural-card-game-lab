const chai = require( 'chai' );
const spies = require( 'chai-spies' );
const path = require( 'path' )
const fs = require( 'file-system' )
const sinon = require( 'sinon' )
var nock = require( 'nock' );

chai.use( spies );

var simulateClick = function ( elem ) {
  // Create our event (with options)
  var evt = new MouseEvent( 'click', {
    bubbles: true,
    cancelable: true,
    view: window
  } );
  // If cancelled, don't dispatch our event
  var canceled = !elem.dispatchEvent( evt );
};

describe( 'index.js', () => {
  describe( 'fetchDeck()', () => {
    it( 'sends a fetch request to get a new deck of cards', async () => {
      window.fetch = require( 'node-fetch' );
      nock( 'https://deckofcardsapi.com' )
        .get( '/api/deck/new/shuffle/?deck_count=1' )
        .reply( 200, {
          "success": true,
          "deck_id": "testDeckID",
          "shuffled": true,
          "remaining": 52
        } );
      chai.spy.on( window, 'fetch' );
      window.onerror = undefined;

      await fetchDeck()

      expect( window.fetch, "A fetch to the API was not found" ).to.have.been.called.with( 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1' )
    } )
  } )

  describe( 'fetchCard(deck_id)', () => {
    it( 'sends a fetch request to get a single card, using the deckID passed in', async () => {
      window.fetch = require( 'node-fetch' );

      nock( 'https://deckofcardsapi.com' )
        .get( /.*/ )
        .reply( 200, {
          "success": true,
          "cards": [ {
            "image": "https://deckofcardsapi.com/static/img/8C.png",
            "value": "8",
            "suit": "CLUBS",
            "code": "8C"
          } ],
          "deck_id": "testDeckID",
          "remaining": 51
        } );
      chai.spy.on( window, 'fetch' );
      window.onerror = undefined;

      await fetchCard( "testDeckID" )
      expect( window.fetch, "A fetch to the API was not found" ).to.have.been.called.with( 'https://deckofcardsapi.com/api/deck/testDeckID/draw/?count=1' )
    } )
  } )

  it( 'displays a new card when the "Deal Card" button is clicked', () => {
    card = {
      image: "astronaut.png"
    }
    expect( document.getElementsByTagName( 'img' ).length, "No images should be present in the initial HTML content" ).to.equal( 0 )
    addCardToDOM( card )
    expect( document.getElementsByTagName( 'img' ).length ).to.equal( 1 )

  } )


} )