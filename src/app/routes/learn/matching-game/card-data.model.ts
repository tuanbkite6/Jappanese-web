export interface CardData {
    wordId : string;
    state: 'default' | 'flipped' | 'matched';
    type : 'word' | 'mean';
    content : string;
}
