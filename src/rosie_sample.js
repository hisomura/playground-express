// import Factory from 'rosie'
const Factory = require('rosie').Factory

Factory.define('game')
  .sequence('id')
  .attr('is_over', false)
  .attr('created_at', () => new Date())
  .attr('random_seed', () => Math.random())

  // Default to two players. If players were given, fill in
  // whatever attributes might be missing.
  .attr('players', ['players'], (players) => {
    if (!players) {
      players = [{}, {}];
    }
    return players.map((data) => Factory.attributes('player', data));
  });

Factory.define('player')
  .sequence('id')
  .sequence('name', (i) => {
    return 'player' + i;
  })

  // Define `position` to depend on `id`.
  .attr('position', ['id'], (id) => {
    const positions = ['pitcher', '1st base', '2nd base', '3rd base'];
    return positions[id % positions.length];
  });

Factory.define('disabled-player').extend('player').attr('state', 'disabled');


const game = Factory.build('game', { is_over: true });
console.log(game)
const game2 = Factory.build('game', { is_over: true });
console.log(game2)
