import loadEasterEggs from './eastereggs.js';
import { createViewPage } from './utils.js';
import PolarisError from './error.js';
import Settings from './settings.js';
import Search from './search.js';
import Cheats from './cheats.js';
import Games from './games.js';
import Apps from './apps.js';

loadEasterEggs();

onbeforeunload = (e) => {
    if (localStorage.getItem('prevent_close') === 'true') {
        e.preventDefault();
        return e;
    }
}

/*await navigator.serviceWorker.register('/assets/js/offline.js', {
    scope: '/'
});*/

window.onhashchange = () => {
    if (location.hash === '#settings') document.querySelector('.sidebar').classList.add('active');
    else document.querySelector('.sidebar').classList.remove('active');
};

if (window.self === window.top && location.pathname !== '/view') setTimeout(async () => {
    Settings.load();

    if (location.pathname === '/games') Games.load();
    if (location.pathname === '/apps') Apps.load();
    if (location.pathname === '/search') Search.load();
    if (location.pathname === '/cheats') Cheats.load();
}, 500);

if (location.pathname === '/') {
    fetch('/assets/JSON/games.json')
        .then(res => res.json())
        .then(games => {
            const gameName = 'Tiny Fishing';
            const game = games.filter(g => g.name === gameName)[0];

            document.querySelector('.featured').addEventListener('click', () => {
                if (URL.canParse(game.target)) createViewPage({
                    target: game.target,
                    title: game.name,
                    proxied: true
                });
                else createViewPage({
                    target: game.target,
                    title: game.name
                });
            });

            document.querySelector('.featured').src = '/assets/img/wide/tinyfishing.png';
        }).catch(e => new PolarisError('Failed to load featured game.'));

    fetch('/assets/JSON/changelog.json')
        .then(res => res.json())
        .then(changelog => changelog.forEach(change => {
            const date = document.createElement('p');
            date.textContent = change.date;
            date.classList = 'small';
            document.querySelector('#changelog').appendChild(date);

            const descwrap = document.createElement('p');
            const description = document.createElement('i');
            description.textContent = change.simpleDescription;
            description.classList = 'small';
            document.querySelector('#changelog').appendChild(description);
        }));
}

if (window.self === window.top && location.pathname !== '/view') {
    if (window.scrollY !== 0) document.querySelector('.navbar').classList.add('scrolling');
    else document.querySelector('.navbar').classList.remove('scrolling');
}

if (window.self === window.top && location.pathname !== '/view') window.onscroll = () => {
    if (window.scrollY !== 0) document.querySelector('.navbar').classList.add('scrolling');
    else document.querySelector('.navbar').classList.remove('scrolling');
}

if (window.self !== window.top && document.querySelector('.navbar')) document.querySelector('.navbar').remove()

//export default { Settings, Games, Apps, Frame, PolarisError };