import JoinGame from "./JoinGame";
import renderer from 'react-test-renderer';

describe('JoinGame Component', () => {
    test('should render', () => {
        const startGame = ()=>{}
        const component = renderer.create( 
            <JoinGame startGame={startGame} />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot(); 
    });
    
});