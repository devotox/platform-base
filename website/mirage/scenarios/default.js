export default function(server) {
	server.createList('videos', 8);
	server.loadFixtures();
}