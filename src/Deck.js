import React, { Component } from 'react';
import Card from './Card';
import './Deck.css';

const DECK_API_BASE_URL = "https://deckofcardsapi.com/api/deck/";

class Deck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deck: null,
            drawnCards: []
        }

        this.getCard = this.getCard.bind(this);
    }

    async componentDidMount() {
        try {
            const deck = await fetch(`${DECK_API_BASE_URL}new/shuffle/?deck_count=1`)
                .then(res => res.json())
                .catch(err => {throw new Error(err)});
        this.setState({deck: deck});
        } catch(e) {
            console.log(e);
        }
    }

    async getCard() {
        try {
            const deck_id = this.state.deck.deck_id;
            const deck = await fetch(`${DECK_API_BASE_URL}${deck_id}/draw/?count=1`)
                .then(res => res.json())
                .catch(err => {throw new Error(err)});
            // ensure there was no problems sending/receiving the request
            if (deck.success === false) return;
            this.setState(st => {
                return {
                    // set drawnCards to have all the current values in drawnCards
                    // and add in the newly drawn card object from the request above.
                    drawnCards: [...st.drawnCards, deck.cards[0]], 
                    deck: deck
                };
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const cards = this.state.drawnCards.map(card => {
            return <Card 
                name={`${card.value} of ${card.suit}`}
                image={card.image}
                key={card.code}
            />;
        });

        return (
            <div className="deck">
                <h1>Card Dealer</h1>
                <button onClick={this.getCard}>Get Gard!</button>
                <div className="deck-area">{cards}</div>
            </div>
        );
    }
}

export default Deck;