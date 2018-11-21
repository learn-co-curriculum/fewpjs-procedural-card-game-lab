const chai = require( 'chai' );
const spies = require( 'chai-spies' );
const path = require( 'path' )
const fs = require( 'file-system' )
var nock = require( 'nock' );
chai.use( spies );

describe( 'index.js', function () {
  it( 'includes an event listener for DOMContentLoaded', async function () {
    const js = await fs.readFileSync( path.resolve( __dirname, '..', 'index.js' ), 'utf-8' )

    expect( js ).to.match( /document.addEventListener\(( |)"DOMContentLoaded"/ )
  } )

  describe( 'addImageToDOM(source, alt)', function () {
    it( 'adds an `img` element to the DOM displaying the correct card', function () {
      let source = "playingcard.png"
      let alt = "playing card"
      expect( document.getElementsByTagName( 'img' ).length, "No images should be present in the initial HTML content" ).to.equal( 0 )
      addImageToDOM( source, alt )
      expect( document.getElementsByTagName( 'img' ).length ).to.equal( 1 )
      expect( document.querySelector( 'img' ).src ).to.equal( "playingcard.png" )
    } )
  } )

  describe( 'fetchDeck()', function () {
    it( 'sends a fetch request to get a new deck of cards', async function () {
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
      expect( window.fetch ).to.have.been.called.exactly( 1 )
    } )
  } )

  describe( 'fetchCard(deck_id)', function () {
    it( 'sends a fetch request to get a single card, using the deckID passed in', async function () {
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
      expect( window.fetch ).to.have.been.called.exactly( 1 )
    } )
  } )




} )